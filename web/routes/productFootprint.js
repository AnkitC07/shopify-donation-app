import express from "express";
import fetch from "node-fetch";
import shopify from "../shopify.js";
import { delay } from "../controller/exportImportPro.js";

const app = express();
const prodFootprint = express.Router();

// prodFootprint.get("/product-footprint", async (req, res) => {
//   console.log("product-footprint hit");
//   const session = res.locals.shopify.session;
//   console.log(res.locals.shopify.session);
//   let since_id = 0;
//   const data = [];

//   try {
//     while (since_id !== null) {
//       console.log("since_id:", since_id);
//       const products = await shopify.api.rest.Product.all({
//         session,
//         limit: 50,
//         since_id: since_id,
//       });

//       for (const product of products.data) {
//         console.log("product");
//         const productData = {
//           title: product.title,
//           product_id: product.id.toString(),
//           variants: [],
//         };
//         if (product.vendor !== "Emissa") {
//           for (const variant of product.variants) {
//             console.log("variant");
//             let metafield = {};

//             try {
//               metafield = await shopify.api.rest.Metafield.all({
//                 session,
//                 metafield: {
//                   owner_id: variant.id,
//                   owner_resource: "variant",
//                 },
//               });
//             } catch (err) {
//               metafield = await delay(session, variant);
//             }
//             // console.log("Metafield", metafield);
//             const footprintsData = metafield.data?.find((x) => x.key === "co2");
//             const compensationData = metafield.data?.find(
//               (x) => x.key === "co2compensation"
//             );

//             if (footprintsData?.value && compensationData?.value) {
//               productData.variants.push({
//                 variant_id: variant.id.toString(),
//                 sku: variant.sku,
//                 price: variant.price,
//                 footprints: footprintsData.value,
//               });
//             }
//           }
//         }

//         if (productData.variants.length > 0) {
//           data.push(productData);
//         }
//       }

//       if (products.data.length < 50) {
//         since_id = null; // All products fetched
//       } else {
//         since_id = products.data[products.data.length - 1].id;
//       }
//     }

//     res.status(200).json({
//       products: data,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       status: 400,
//       msg: err,
//     });
//   }
// });

prodFootprint.get("/product-footprint", async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const products = await fetchProductsWithMetafields(session);
    console.log("Products=>", products);
    res.status(200).json({ products: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, msg: "Internal server error" });
  }
});

async function fetchProductsWithMetafields(session) {
  const query = `query {
  productVariants(first: 10, query: "metafield_namespace:'co2compensation'") {
    edges {
      node {
        id
        title
        sku
        metafields(first: 1, namespace: "co2footprints") {
          edges {
            node {
              id
              key
              value
            }
          }
        }
        metafields2: metafields(first: 1, namespace: "co2compensation") {
          edges {
            node {
              id
              key
              value
            }
          }
        }
        product {
          id
        }
      }
    }
  }
}`;
console.log(session.shop)
  let requestOptions = {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": `${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    redirect: "follow",
  };
  try {
    const request = await fetch(
      `https://${session.shop}/admin/api/2023-04/graphql.json`,
      requestOptions
    );
    const result = await request.json();
    // console.log("result in graphql api", result.data.productVariants.edges)
    return result.data.productVariants.edges;
  } catch (err) {
    console.log("error in graphql api", err);
    return err;
  }

  // const client = new shopify.clients.Graphql({ session });
  // const data = await client.query({
  //   data: `query {
  //       products(first: 100) {
  //         edges {
  //           node {
  //             id
  //             title
  //             vendor
  //             variants(first: 10) {
  //               edges {
  //                 node {
  //                   id
  //                   sku
  //                   price
  //                   metafields(first: 10) {
  //                     edges {
  //                       node {
  //                         key
  //                         value
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }`,
  // });

  // const productsWithMetafields = data.products.edges.map((productEdge) => {
  //   const product = productEdge.node;

  //   if (product.vendor !== "Emissa") {
  //     const validVariants = product.variants.edges
  //       .map((variantEdge) => variantEdge.node)
  //       .filter((variant) => {
  //         const footprintsData = variant.metafields.edges.find(
  //           (metafieldEdge) => metafieldEdge.node.key === "co2"
  //         );
  //         const compensationData = variant.metafields.edges.find(
  //           (metafieldEdge) => metafieldEdge.node.key === "co2compensation"
  //         );
  //         return footprintsData && compensationData;
  //       });

  //     if (validVariants.length > 0) {
  //       return {
  //         title: product.title,
  //         product_id: product.id,
  //         variants: validVariants.map((variant) => ({
  //           variant_id: variant.id,
  //           sku: variant.sku,
  //           price: variant.price,
  //           footprints: variant.metafields.edges.find(
  //             (metafieldEdge) => metafieldEdge.node.key === "co2"
  //           ).node.value,
  //         })),
  //       };
  //     }
  //   }

  //   return null;
  // });

  // return productsWithMetafields.filter((product) => product !== null);
}

export default prodFootprint;
