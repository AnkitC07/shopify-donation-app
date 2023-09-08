import Order from "../database/model/Order.js";
import Stores from "../database/model/Stores.js";
import axios from "axios";
import {
  calculateTotalFeeAddedForCurrentMonth,
  fetchStatsFromDB,
} from "./analytics.js";

export async function getHomeData(req, res) {
  try {
    // Fetch the list of stores
    const stores = await Stores.find(
      {},
      {
        storename: 1,
        storetoken: 1,
        _id: 0,
      }
    ).exec();

    if (stores) {
      console.log("stores", stores);

      // Create an array to store data for each store
      const storeData = [];

      // Initialize variables to accumulate totals
      let totalLastMonthCount = 0;
      let totalLastMonthAmount = 0;
      let totalLastMonthCo2 = 0;
      let totalThisMonthFeeAdded = 0;

      // Define date ranges for last month and this month
      const currentDate = new Date();
      const lastMonthStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );
      const thisMonthStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );

      // Loop through each store and fetch order data
      for (const store of stores) {
        const data = await fetchStatsFromDB({
          shop: store.storename,
          accessToken: store.storetoken,
        });

        // Calculate the total feeAdded for this month for this store
        let totalFeeAdded = 0;
        if (data && data.orders?.length > 0) {
          totalFeeAdded = calculateTotalFeeAddedForCurrentMonth(data.orders);
          totalThisMonthFeeAdded += totalFeeAdded;
        }
        // Calculate totals for last month based on order dates
        if (data && data?.orders) {
          data.orders.forEach((order) => {
            const orderDate = new Date(order.orderDate);
            if (
              orderDate >= lastMonthStartDate &&
              orderDate < thisMonthStartDate
            ) {
              totalLastMonthCount += 1;
              totalLastMonthAmount += order.amountAdded || 0;
              totalLastMonthCo2 += order.co2Added || 0;
            }
          });
        }

        // Store data for this store
        storeData.push({
          storename: store.storename,
          totalCount: data?.totalCount ? data?.totalCount : 0,
          totalAmount: data?.totalAmount ? data?.totalAmount : 0,
          totalFeeAdded: totalFeeAdded,
        });
      }

      // Respond with the store data
      res.status(200).json({
        stores: storeData,
        stats: {
          totalLastMonthCount: totalLastMonthCount,
          totalLastMonthAmount: totalLastMonthAmount,
          totalLastMonthCo2: totalLastMonthCo2,
          totalThisMonthFeeAdded: totalThisMonthFeeAdded,
        },
      });
    } else {
      res.status(500).json({ error: "Failed to retrieve data from db" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to retrieve data from db" });
  }
}
