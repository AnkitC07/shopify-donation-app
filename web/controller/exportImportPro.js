import shopify from "../shopify.js";
import XLSX from "xlsx";
import Bottleneck from "bottleneck";
import { addTag } from "../functions.js";

const limiter = new Bottleneck({
  maxConcurrent: 1, // Number of concurrent requests
  minTime: 500, // Minimum time between requests in milliseconds
});

export async function delay(session, v) {
  setTimeout(async () => {
    return await shopify.api.rest.Metafield.all({
      session,
      metafield: {
        owner_id: v.id,
        owner_resource: "variant",
      },
    });
  }, 500);
}
export const exportProducts = async (req, res) => {
  const session = res.locals.shopify.session;
  const products = await shopify.api.rest.Product.all({
    session,
    limit: 50,
    since_id: req.query.since_id,
  });

  const data = [];
  const count = await shopify.api.rest.Product.count({ session });
  try {
    for (let i = 0; i < products.data.length; i++) {
      const x = products.data[i];
      if (x.vendor !== "Emissa") {
        for (let j = 0; j < x.variants.length; j++) {
          const v = x.variants[j];
          console.log(v.id);
          let metafield = {};
          try {
            metafield = await shopify.api.rest.Metafield.all({
              session,
              metafield: {
                owner_id: v.id,
                owner_resource: "variant",
              },
            });
          } catch (err) {
            metafield = await delay(session, v);
          }

          let footprints = "";
          let compensation = "";
          const footprintsData = metafield.data?.find((x) => x.key === "co2");
          const compensationData = metafield.data?.find(
            (x) => x.key === "co2compensation"
          );

          if (footprintsData?.value) {
            footprints = footprintsData?.value;
          }
          if (compensationData?.value) {
            compensation = JSON.parse(compensationData?.value);
            compensation = compensation.amount;
          }

          const dataset = {
            title: `${x.title} ${v.title}`,
            product_id: x.id.toString(),
            variant_id: v.id.toString(),
            price: v.price,
            "Co2 Compensation": footprints,
            "Co2 Footprints": compensation,
            tags:x.tags
          };
          data.push(dataset);
        }
      }
    }
    res.status(200).json({
      products: data,
      count: count.count,
      productlength: products.data.length,
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      status: 400,
      msg: err,
    });
  }
};

export const importProducts = async (req, res) => {
  const session = res.locals.shopify.session;
  const shop = await shopify.api.rest.Shop.all({ session });
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  const uploadedFile = req.files.file;
  const workbook = XLSX.read(uploadedFile.data, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  for (const row of data) {
    console.log("Co2 Compensation:", row["Co2 Compensation"]);
    console.log("Co2 Footprints:", row["Co2 Footprints"]);
      console.log("running", row);
      // addMetafieldToVariant(session, row, shop.data[0]);
      await limiter.schedule(() =>
        addMetafieldToVariant(session, row, shop.data[0])
      );
  }
  res.send({ status: "File processed." });
};

async function addMetafieldToVariant(session, data, shop) {
  const products = await shopify.api.rest.Metafield.all({
    session,
    metafield: {
      owner_id: data.variant_id,
      owner_resource: "variant",
    },
  });

  const co2footprints = products.data?.find((x) => x.key === "co2");
  const co2compensation = products.data?.find(
    (x) => x.key === "co2compensation"
  );
  let co2 = {}
  let co2comp = {}
  if (co2footprints) {
    co2 = await metafield(session, data["Co2 Footprints"], co2footprints?.id, "update", {});
  } else {
    co2 = await metafield(session, data["Co2 Footprints"], co2footprints?.id, "create", {
      namespace: "co2footprints",
      key: "co2",
      type: "single_line_text_field",
      owner_id: data.variant_id,
      owner_resource: "variant",
      description: data.product_id,
    });
  }

  if (isNaN(data["Co2 Compensation"]) === false) {
    if (co2compensation) {
      const price = JSON.stringify({
        amount: data["Co2 Compensation"],
        currency_code: shop.currency,
      });
      co2comp = await metafield(session, price, co2compensation?.id, "update", {});
    } else {
      const price = JSON.stringify({
        amount: data["Co2 Compensation"],
        currency_code: shop.currency,
      });
      console.log(shop.currency);
      co2comp = await metafield(session, price, co2compensation?.id, "create", {
        namespace: "co2compensation",
        key: "co2compensation",
        type: "money",
        owner_id: data.variant_id,
        owner_resource: "variant",
        description: data.product_id,
      });
    }
  }
  // console.log(co2,co2comp)
  addTag(session,data)
}



async function metafield(session, value, id, type, obj) {


  const metafield = new shopify.api.rest.Metafield({
    session,
  });
  if (type === "update") {
    metafield.id = id;
  } else {
    metafield.namespace = obj.namespace;
    metafield.key = obj.key;
    metafield.type = obj.type;
    metafield.owner_id = obj.owner_id;
    metafield.owner_resource = obj.owner_resource;
    metafield.description = obj.description;
    console.log("create");
  }

  metafield.value = value;
   await metafield.save({
    update: true,
  });
  return metafield
}
