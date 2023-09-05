import Stores from "../model/Stores.js";
import shopify from "../shopify.js";

export async function getSession(shop) {
  const store = await Stores.findOne({ storename: shop });
  let session = {
    shop: shop,
    accessToken: store.storetoken,
  };
  return session;
}

export async function getOrders(req, res) {
  const session = res.locals.shopify.session;
  console.log("analytics", session);
  const data = await fetchorderFromShopify(session);
  if (data) {
    // If data is retrieved successfully, send it with a status code of 200
    res.status(200).json({ data: formateOrderData(data.body.orders) });
  } else {
    // If there's an error or no data found, send an error status and message
    res.status(500).json({ error: "Failed to retrieve data" });
  }
}

async function fetchorderFromShopify(session) {
  const client = new shopify.api.clients.Rest({ session });
  const data = await client.get({
    path: "orders",
    query: {
      tag: "co2compensation",
      fields: "order_number,created_at,line_items,total-price",
    },
  });
  console.log(data.body);
  return data;
}

function formateOrderData(data) {
  console.log(data);
  const transformedData = data.map((order) => {
    const footprintReduction = order.line_items.find(
      (item) =>
        item.properties &&
        item.properties.some(
          (prop) => prop.name === "lable" && prop.value === "co2-with-Emissa"
        )
    );

    const co2FootPrint = order.line_items.find(
      (item) =>
        item.properties &&
        item.properties.some((prop) => prop.name === "footprint")
    );

    return [
      `# ${order.order_number}`,
      order.created_at.split("T")[0],
      co2FootPrint
        ? co2FootPrint.properties.find((prop) => prop.name === "footprint")
            .value
        : "",
      footprintReduction ? footprintReduction.price : "",
      `€${parseFloat(order.total_price).toFixed(2)}`,
    ];
  });

  console.log(transformedData);
  return transformedData;
}
