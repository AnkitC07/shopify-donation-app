import shopify from "../shopify.js";
import { formateOrderData, getSession } from "./analytics.js";

export const exportOrders = async (req, res) => {
  try {
    console.log("export hit");
    const shop = req.query.shop;
    const session = await getSession(shop);
    const client = new shopify.api.clients.Rest({ session });
    console.log("export since id=<", req.query.since_id);
    const data = await client.get({
      path: "orders",
      query: {
        limit: 50,
        tag: "co2compensation",
        fields:
          "id,  order_number,created_at,line_items,total-price,customer,currency",
        since_id: req.query.since_id,
      },
    });
    console.log("export orders=<", data.body.orders);
    res.status(200).json({
      orders: formateOrderData(data.body.orders),
      since_id: data.body.orders[data.body.orders.length - 1]?.id || null,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: 400,
      msg: error,
    });
  }
};
