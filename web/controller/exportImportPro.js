import shopify from "../shopify.js";
import XLSX from 'xlsx'
async function delay(session, v) {
  setTimeout(async () => {
    return await shopify.api.rest.Metafield.all({
      session,
      metafield: {
        owner_id: v.id,
        owner_resource: "variant",
      },
    });
  }, 1000);
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
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  const uploadedFile = req.files.file;
  const workbook = XLSX.read(uploadedFile.data, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  for (const row of data) {
    // Perform your processing here for each row
    console.log(row);
  }

  res.send({ test: "File processed." });
};
