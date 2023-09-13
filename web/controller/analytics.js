import Order from "../model/Order.js";
import Stores from "../model/Stores.js";
import shopify from "../shopify.js";
import getSymbolFromCurrency from "currency-symbol-map";

// Session Function
export async function getSession(shop) {
  const store = await Stores.findOne({ storename: shop });
  let session = {
    shop: shop,
    accessToken: store.storetoken,
  };
  return session;
}
// Function to calculate the total feeAdded for the current month
function calculateTotalFeeAddedForCurrentMonth(orders) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // Get the current month (0-11)

  const totalFeeAdded = orders
    .filter((order) => {
      // Parse the order's orderDate and get its month
      const orderDate = new Date(order.orderDate);
      const orderMonth = orderDate.getMonth();

      // Return true for orders in the current month
      return orderMonth === currentMonth;
    })
    .reduce((total, order) => total + order.feeAdded, 0);

  return totalFeeAdded;
}

// Stats API
export async function getStats(req, res) {
  const session = res.locals.shopify.session;
  const data = await fetchStatsFromDB(session);
  if (data) {
    const monthFee = calculateTotalFeeAddedForCurrentMonth(data.orders);
    res.status(200).json({
      stats: data,
      fee: monthFee,
    });
  } else {
    res.status(500).json({ error: "Failed to retrieve data from db" });
  }
}
// Super ADmin Stats API
export async function getStatsSuper(req, res) {
  const shop = req.query.shop;
  const session = getSession(shop);
  const data = await fetchStatsFromDB(session);
  if (data) {
    res.status(200).json({
      stats: data,
    });
  } else {
    res.status(500).json({ error: "Failed to retrieve data from db" });
  }
}

// Fetch stats from db
async function fetchStatsFromDB(session) {
  try {
    const orders = await Order.findOne({ shop: session.shop }).exec();
    return orders;
  } catch (error) {
    console.error("Error fetching orders from the database:", error);
    throw error; // You can handle the error as needed in your application
  }
}
// Store API
export async function getOrders(req, res) {
  const session = res.locals.shopify.session;
  const cursor = req.query.cursor;
  // console.log("analytics", session);
  const { data, pageInfo } = await fetchorderFromShopify(session, cursor);
  if (data) {
    res.status(200).json({
      data: formateOrderData(data.body.orders),
      collected: formateCollectedContributions(data.body.orders),
      order: data,
      pageInfo: pageInfo,
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
async function fetchorderFromShopify(session, cursor = null) {
  // check is it is initial fetch or pagination fetch
  let query;
  if (cursor != "null") {
    query = {
      limit: 10,
      fields:
        "order_number,created_at,line_items,total-price,customer,currency",
      page_info: cursor,
    };
  } else {
    query = {
      limit: 10,
      tag: "co2compensation",
      fields:
        "order_number,created_at,line_items,total-price,customer,currency",
    };
  }
  // console.log("query:", query);
  const client = new shopify.api.clients.Rest({ session });
  const data = await client.get({
    path: "orders",
    query: query,
  });
  console.log("shopify page info", data.pageInfo);
  return { data, pageInfo: data.pageInfo };
}

// Formate data for order table
export function formateOrderData(data) {
  // console.log(data);
  const transformedData = data.map((order) => {
    const currency = getSymbolFromCurrency(order.currency);
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
      footprintReduction ? `${currency}${footprintReduction.price}` : "",
      `${currency}${parseFloat(order.total_price).toFixed(2)}`,
    ];
  });
  return transformedData;
}

// Formate data for Collected Contributions table
function formateCollectedContributions(data) {
  // console.log(data);
  const transformedData = data.map((order) => {
    return [
      `# ${order.order_number}`,
      order.customer.last_name,
      order.customer.email,
      "NA",
      "NA",
      order.created_at.split("T")[0],
    ];
  });
  return transformedData;
}
