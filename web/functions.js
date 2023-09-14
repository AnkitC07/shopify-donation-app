import shopify from "./shopify.js";

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
    console.log("final product tag=>", product.tags);
}
