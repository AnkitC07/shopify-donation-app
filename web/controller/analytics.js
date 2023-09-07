import Stores from "../model/Stores.js";
import shopify from "../shopify.js";

// Session Function
export async function getSession(shop) {
  const store = await Stores.findOne({ storename: shop });
  let session = {
    shop: shop,
    accessToken: store.storetoken,
  };
  return session;
}

// Store API
export async function getOrders(req, res) {
  const session = res.locals.shopify.session;
  console.log("analytics", session);
  const data = await fetchorderFromShopify(session);
  if (data) {
    res.status(200).json({
      data: formateOrderData(data.body.orders),
      collected: formateCollectedContributions(data.body.orders),
      order: data,
    });
  } else {
    res.status(500).json({ error: "Failed to retrieve data" });
  }
}

// Super admin API
export async function getOrdersSuper(req, res) {
  const shop = req.query.shop;
  const session = getSession(shop);
  console.log("analytics", session);

  const data = await fetchorderFromShopify(session);
  if (data) {
    res.status(200).json({
      data: formateOrderData(data.body.orders),
      order: data,
    });
  } else {
    res.status(500).json({ error: "Failed to retrieve data" });
  }
}

// Fetch orders of store
async function fetchorderFromShopify(session) {
  const client = new shopify.api.clients.Rest({ session });
  const data = await client.get({
    path: "orders",
    query: {
      tag: "co2compensation",
      fields: "order_number,created_at,line_items,total-price,customer",
    },
  });
  console.log(data.body);
  return data;
}
// Formate data for order table
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
  return transformedData;
}

// Formate data for Collected Contributions table
function formateCollectedContributions(data) {
  console.log(data);
  const transformedData = data.map((order) => {
    return [
      `# ${order.order_number}`,
      order.customer.last_name,
      order.customer.email,
      "",
      "",
      order.created_at.split("T")[0],
    ];
  });
  return transformedData;
}
