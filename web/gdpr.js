import { DeliveryMethod } from "@shopify/shopify-api";
import { DataType } from "@shopify/shopify-api";
import { getProductId, getStoreAccessToken, updateProductId } from "./model/Controller/store.js";
import { removeProduct } from "./Product/product.js";
import shopify from "./shopify.js";
import Stores from "./model/Stores.js";
import { createUsageRecord } from "./billing.js";
import Order from "./model/Order.js";

// Add tag to order
async function addTagToOrder(payload, shop, session) {
    console.log("adding tag");
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
    console.log("tag added");
}

async function addToDB(obj, store, curr) {
    console.log("add to db:", obj, store, curr);
    // Define the shop identifier
    const shopIdentifier = store.storename;

    // Define the new order data
    const newOrderData = {
        co2Added: obj.co2FootprintValue,
        amountAdded: obj.currentPrice,
        feeAdded: obj.fee,
        orderDate: new Date(),
    };

    try {
        let foundOrder = await Order.findOne({ shop: shopIdentifier }).exec();

        if (foundOrder) {
            foundOrder.totalCount += 1;
            foundOrder.totalCo2 += Number(newOrderData.co2Added);
            foundOrder.totalAmount += Number(newOrderData.amountAdded);
            foundOrder.totalFee += Number(newOrderData.feeAdded);
            foundOrder.orders.push(newOrderData);
        } else {
            console.log(`Shop ${shopIdentifier} not found.`);
            foundOrder = new Order({
                shop: shopIdentifier,
                date: new Date(),
                totalCount: 1,
                totalCo2: Number(newOrderData.co2Added),
                totalAmount: Number(newOrderData.amountAdded),
                totalFee: Number(newOrderData.feeAdded),
                currency: curr,
                orders: [newOrderData],
            });
        }
        const updatedOrder = await foundOrder.save();
        console.log("Updated order for shop:", updatedOrder);
    } catch (error) {
        console.error("Error with database:", error);
    }
}

// Increase Active Charge
async function IncreaseActiveCharge(orderWebhookPayload, store, session, curr) {
    let co2TotalPrice = 0;

    for (const lineItem of orderWebhookPayload) {
        const co2Property = lineItem.properties.find(
            (property) => property.name === "lable" && property.value === "co2-with-Emissa"
        );
        if (co2Property) {
            const currentPrice = parseFloat(lineItem.price);

            const co2FootprintValue =
                lineItem.properties.find((property) => property.name === "footprint")?.value || null;
            const fee = 0.25;
            const obj = {
                co2FootprintValue: co2FootprintValue,
                currentPrice: currentPrice,
                fee: fee,
            };

            await addToDB(obj, store, curr);

            co2TotalPrice += currentPrice;
        }
    }

    console.log("Total Increased Price:", co2TotalPrice.toFixed(2));

    if (store) {
        try {
            const activeCharge = await shopify.api.rest.RecurringApplicationCharge.all({
                session: session,
            });

            const active = activeCharge.data.find((item) => item.status === "active");

            if (active && Number(active.balance_used) + 0.25 < Number(active.capped_amount)) {
                const usage_charge = new shopify.api.rest.UsageCharge({
                    session: session,
                });

                usage_charge.recurring_application_charge_id = active.id;
                usage_charge.description = "Co2 Compensation " + co2TotalPrice;
                usage_charge.price = co2TotalPrice;

                await usage_charge.save({ update: true });
                console.log("Charge updated:", usage_charge);
                return true;
            }
        } catch (error) {
            console.error("Error with Shopify API:", error);
        }
    }
    return false;
}

// Order Webhook handler
const handleOrder = async (payload, shop) => {
    let curr = payload.currency;
    console.log("Order update webhook paylaod", payload, shop, curr);
    const orderWebhookPayload = payload.line_items;
    // get store details
    const store = await Stores.findOne({ storename: shop });
    let session = {
        shop: shop,
        accessToken: store.storetoken,
    };

    if (JSON.stringify(orderWebhookPayload).includes("co2-with-Emissa")) {
        // Increasing Active Charge
        let IncreaseChargeResponse = await IncreaseActiveCharge(orderWebhookPayload, store, session, curr);
        if (!IncreaseChargeResponse) {
            console.log("Reached Charge Limit");
        }
        // Adding Tag
        await addTagToOrder(payload, shop, session);
        // Adding to DB
        // await addToDB()
    }
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
            try {
                handleOrder(payload, shop);
            } catch (error) {
                console.log("Error order webhook =", error.message);
            }

            // console.log('Order update webhook items', payload.line_items)
        },
    },
    SUBSCRIPTION_BILLING_ATTEMPTS_SUCCESS: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/webhooks",
        callback: async (topic, shop, body, webhookId) => {
            const payload = JSON.parse(body);
            console.log("SUBSCRIPTION_BILLING_ATTEMPTS_SUCCESS =>", payload);
        },
    },
    APP_SUBSCRIPTIONS_UPDATE: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/webhooks",
        callback: async (topic, shop, body, webhookId) => {
            const payload = JSON.parse(body);
            console.log("APP_SUBSCRIPTIONS_UPDATE =>", payload);
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
