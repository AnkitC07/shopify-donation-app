import Order from "../database/model/Order.js";
import Stores from "../database/model/Stores.js";
import axios from "axios";

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
export function calculateTotalFeeAddedForCurrentMonth(orders) {
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
export async function fetchStatsFromDB(session) {
  try {
    const foundOrder = await Order.findOne({ shop: session.shop }).exec();
    if (foundOrder) {
      return foundOrder || [];
    } else {
      // Return an empty array when the store is not found
      return [];
    }
  } catch (error) {
    console.error("Error fetching orders from the database:", error);
    throw error; // You can handle the error as needed in your application
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
      data: formateOrderData(data),
    });
  } else {
    res.status(500).json({ error: "Failed to retrieve data" });
  }
}

// Fetch orders of store
async function fetchorderFromShopify(session) {
  try {
    const config = {
      headers: {
        "X-Shopify-Access-Token": session.accessToken,
      },
    };
    const response = await axios.get(
      `https://${session.shop}/admin/api/2023-07/orders.json?tag=co2compensation&fields=order_number,created_at,line_items,total-price,customer`,
      config
    );

    if (response.status === 200) {
      const orders = response.data.orders;
      console.log("Shopify orders:", response.data);
      return orders;
    } else {
      console.error("Error fetching Shopify orders");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }

  // const client = new shopify.api.clients.Rest({ session });
  // const data = await client.get({
  //   path: "orders",
  //   query: {
  //     tag: "co2compensation",
  //     fields: "order_number,created_at,line_items,total-price,customer",
  //   },
  // });
  // console.log(data.body);
  // return data;
}
// Formate data for order table
function formateOrderData(data) {
  console.log("formating orders=", data);
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

try {
  fetch(arg);
} catch (error) {}
