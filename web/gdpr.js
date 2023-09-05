import { DeliveryMethod } from "@shopify/shopify-api";
import { DataType } from "@shopify/shopify-api";
import {
  getProductId,
  getStoreAccessToken,
  updateProductId,
} from "./model/Controller/store.js";
import { removeProduct } from "./Product/product.js";
import shopify from "./shopify.js";
import Stores from "./model/Stores.js";
import { createUsageRecord } from "./billing.js";

async function addTagToOrder(payload, shop, session) {
  console.log("present");
  const temptags = payload.tags;
  const t = temptags.split(",");
  t.push("co2compensation");
  t.join(",");

  // method 1
  const order = new shopify.api.rest.Order({ session: session });
  order.id = payload.id;
  order.tags = t;
  await order.save({
    update: true,
  });

  //method 2
  // const client = new shopify.api.clients.Rest({ session });
  // const data = await client.put({
  //   path: "orders/" + payload.id,
  //   data: { order: { id: payload.id, tags: t } },
  //   type: DataType.JSON,
  // });
  // console.log("final tags-", data.tags);
}

async function IncreaseActiveCharge(orderWebhookPayload, store, session) {
  let totalIncreasedPrice = 0;
  // Order Prices
  // Iterate through each line item
  orderWebhookPayload.forEach((lineItem) => {
    // Check if the line item has the desired property
    const co2Property = lineItem.properties.find(
      (property) =>
        property.name === "lable" && property.value === "co2-with-Emissa"
    );
    if (co2Property) {
      // Convert the price to a number and calculate the increased price with a 25% increment
      const currentPrice = parseFloat(lineItem.price);
      const increasedPrice = currentPrice * 1.25;

      // Add the increased price to the total
      totalIncreasedPrice += increasedPrice;
    }
  });
  // Now you have the total increased price for the relevant line items
  console.log("Total Increased Price:", totalIncreasedPrice.toFixed(2)); // Rounding to 2 decimal places

  if (store) {
    // get list of reccuring charges
    const activeCharge = await shopify.api.rest.RecurringApplicationCharge.all({
      session: session,
    });
    console.log("active charge=>", activeCharge);
    // Increase active
    const activeIds = activeCharge.data
      .filter((item) => item.status === "active")
      .map((item) => item.id);
    const usage_charge = new shopify.api.rest.UsageCharge({ session: session });
    usage_charge.recurring_application_charge_id = activeIds;
    usage_charge.description = "Co2 Compensation " + totalIncreasedPrice;
    usage_charge.price = totalIncreasedPrice;
    await usage_charge.save({
      update: true,
    });
    console.log("charge updated=>", usage_charge);
  }
  return totalIncreasedPrice.toFixed(2);
}

const handleOrder = async (payload, shop) => {
  // let capacityReached = false;

  console.log("Order update webhook paylaod", payload, shop);
  // The order webhook payload you provided
  const orderWebhookPayload = payload.line_items;

  // get store details
  const store = await Stores.findOne({ storename: shop });
  let session = {
    shop: shop,
    accessToken: store.storetoken,
  };

  // Increasing Active Charge
  // let totalIncreasedPrice = await IncreaseActiveCharge(
  //   orderWebhookPayload,
  //   store,
  //   session
  // );
  if (JSON.stringify(orderWebhookPayload).includes("co2-with-Emissa")) {
    await addTagToOrder(payload, shop, session);
  }
  // Adding Tag
};

/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  /**
   * Customers can request their data from a store owner. When this happens,
   * Shopify invokes this webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
   */
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "orders_requested": [
      //     299938,
      //     280263,
      //     220458
      //   ],
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "data_request": {
      //     "id": 9999
      //   }
      // }
    },
  },

  /**
   * Store owners can request that data is deleted on behalf of a customer. When
   * this happens, Shopify invokes this webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-redact
   */
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "orders_to_redact": [
      //     299938,
      //     280263,
      //     220458
      //   ]
      // }
    },
  },

  /**
   * 48 hours after a store owner uninstalls your app, Shopify invokes this
   * webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#shop-redact
   */
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com"
      // }
    },
  },
  ORDERS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      handleOrder(payload, shop);
      // console.log('Order update webhook items', payload.line_items)
    },
  },
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("Uninstall=>", payload);

      const session = await getStoreAccessToken(shop);
      const id = await getProductId(shop);
      console.log("session", session, id);
      // await removeProduct(session, id)
      updateProductId(shop, "");
      // console.log('Order update webhook items', payload.line_items)
    },
  },
};
