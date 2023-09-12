import Order from "../database/model/Order.js";
import Stores from "../database/model/Stores.js";
import axios from "axios";
import getSymbolFromCurrency from "currency-symbol-map";
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
// Function to calculate the total feeAdded for the current month
export function calculateTotalFeeAddedForCurrentMonth(orders) {
  console.log("total fee=>", orders);
  if (orders) {
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
  return 0;
}

// Super ADmin Stats API
export async function getStatsSuper(req, res) {
  const shop = req.query.shop;
  const session = await getSession(shop);
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
  const cursor = req.query.cursor;
  const session = await getSession(shop);
  console.log("analytics", session);

  // const client = new shopify.api.clients.Rest({ session });
  // const data = await client.get({
  //   path: "orders",
  //   query: { status: "any" },
  // });
  // console.log("testing", data);

  const { orders, next, prev } = await fetchorderFromShopify(session, cursor);
  if (orders) {
    res.status(200).json({
      data: formateOrderData(orders),
      next: next,
      prev: prev,
    });
  } else {
    res.status(500).json({ error: "Failed to retrieve data" });
  }
}

// Fetch orders of store
async function fetchorderFromShopify(session, cursor = null) {
  try {
    let url;
    if (cursor != "null") {
      url = `https://${session.shop}/admin/api/2023-07/orders.json?limit=10&fields=order_number,created_at,line_items,total-price,customer,currency&page_info=${cursor}`;
    } else {
      url = `https://${session.shop}/admin/api/2023-07/orders.json?limit=10&tag=co2compensation&fields=order_number,created_at,line_items,total-price,customer,currency`;
    }
    const config = {
      headers: {
        "X-Shopify-Access-Token": session.accessToken,
      },
    };
    const response = await axios.get(url, config);
    console.log("response=>", response);
    if (response.status === 200) {
      const orders = response.data.orders;
      const linkHeader = response.headers.link;
      const nextPageUrl = parseLinkHeader(linkHeader, "next");
      const prevPageUrl = parseLinkHeader(linkHeader, "previous");
      console.log(nextPageUrl, "///////", prevPageUrl);
      // console.log("Shopify orders:", response.data);
      return { orders, next: nextPageUrl, prev: prevPageUrl };
    } else {
      console.error("Error fetching Shopify orders");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
function parseLinkHeader(header, relation) {
  console.log("header pageinfo", header);
  if (header && header.trim() !== "") {
    const links = header.split(",");
    for (const link of links) {
      const [url, rel] = link.split(";").map((s) => s.trim());
      if (rel === `rel="${relation}"`) {
        url.slice(1, -1); // Remove angle brackets around URL
        const pageInfoMatch = /page_info=([^&]*)/.exec(url.slice(1, -1));
        if (pageInfoMatch) {
          return pageInfoMatch[1];
        }
      }
    }
  }
  return null;
}
// Formate data for order table
export function formateOrderData(data) {
  // console.log("formating orders=", data);
  if (data.length > 0) {
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
        footprintReduction ? footprintReduction.price : "",
        `${currency}${parseFloat(order.total_price).toFixed(2)}`,
      ];
    });
    return transformedData;
  }
  return [];
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
