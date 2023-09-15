import shopify from "./shopify.js";
import fetch from "node-fetch";

export async function addTag(session, data) {
    console.log("data=", data);

    const product = await shopify.api.rest.Product.find({
        session: session,
        id: data.product_id,
    });
    console.log("product tags before", product.tags);
    if (
        (data["Co2 Compensation"] && data["Co2 Compensation"] !== "") ||
        (data["Co2 Footprints"] && data["Co2 Footprints"] !== "")
    ) {
        if (!product.tags.includes("co2compensation")) {
            console.log("adding tag");
            const temptags = product.tags;
            const t = temptags.split(",");
            t.push("co2compensation");
            t.join(",");
            product.tags = t;
            await product.save({
                update: true,
            });
            console.log("tag updated");
        } else {
            return;
        }
    } else {
        if (product.tags.includes("co2compensation")) {
            console.log("checking product meta");
            if (await checkMeta(session, data.product_id)) {
                console.log("removing tag");
                const t = product.tags.split(",");
                const tempIndex = t.findIndex((item) => item.includes("co2compensation"));
                if (tempIndex !== -1) {
                    t.splice(tempIndex, 1);
                }
                t.join(",");
                product.tags = t;
                await product.save({
                    update: true,
                });
                console.log("tag removed");
            }
        }
    }
    console.log("final product tag=>", product.tags);
}

const checkMeta = async (session, pId) => {
    const query = `{
      product(id: "gid://shopify/Product/${pId}",) {
        variants(first: 20) {
        edges {
          node {
            metafield(key:"co2",namespace:"co2footprints") {
              key
              value
              namespace
            }
            metafields2:metafield(key:"co2compensation",namespace:"co2compensation") {
              key
              value
              namespace
            }
          }
        }
      }
      }
    }`;
    try {
        let requestOptions = {
            method: "POST",
            headers: {
                "X-Shopify-Access-Token": `${session.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
            redirect: "follow",
        };
        const request = await fetch(`https://${session.shop}/admin/api/2023-04/graphql.json`, requestOptions);
        const result = await request.json();
        console.log("Check Meta Result=>:", JSON.stringify(result));

        if (
            JSON.stringify(result).includes(`"key":"co2"`) ||
            JSON.stringify(result).includes(`"key":"co2compensation"`)
        ) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log("error in graphql api", err);
        return true;
    }
};
