import Order from "../model/Order.js";
import Stores from "../model/Stores.js";
import { getSession } from "./analytics.js";
import { format } from "date-fns";

export async function getBilling(req, res) {
    const session = res.locals.shopify.session;
    console.log("billing=>", session);
    const { monthlyTotals } = await fetchBillingFomDB(session);
    console.log("=======", monthlyTotals);
    if (monthlyTotals) {
        res.status(200).json({
            data: formateProductFootprint(monthlyTotals),
        });
    } else {
        res.status(500).json({ error: "Failed to retrieve data" });
    }
}

export async function fetchBillingFomDB(session) {
    try {
        // Find the installation date for the shop from the store collection
        const store = await Stores.findOne({ storename: session.shop }).exec();

        if (!store || !store.date) {
            // Handle the case where the store or installation date is not found
            console.error("Store not found or installation date is missing.");
            return [];
        }

        const installationDate = store.date;

        // Create an aggregation pipeline to unwind the orders array
        // and group orders by month, starting from the installation month
        const aggregationPipeline = [
            {
                $unwind: "$orders",
            },
            {
                $match: {
                    "orders.orderDate": {
                        $gte: installationDate, // Start from installation date
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$orders.orderDate" },
                        month: { $month: "$orders.orderDate" },
                    },
                    totalCount: { $sum: 1 }, // Count the number of orders
                    totalAmount: { $sum: "$orders.amountAdded" }, // Sum of amountAdded
                    totalFee: { $sum: "$orders.feeAdded" }, // Sum of feeAdded
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month in ascending order
            },
        ];

        // Execute the aggregation pipeline
        const monthlyTotals = await Order.aggregate(aggregationPipeline);

        // Create the final result array
        const resultArray = monthlyTotals.map((result) => {
            const year = result._id.year;
            const month = result._id.month;
            // Format the date as 'Month, Year' (e.g., 'September, 2023')
            const formattedMonth = format(new Date(year, month - 1, 1), "MMMM, yyyy");
            return {
                month: formattedMonth, // Subtract 1 from the month to ensure correct month indexing
                totalCount: result.totalCount,
                totalAmount: result.totalAmount,
                totalFee: result.totalFee || 0, // Set to 0 if totalFee is missing
            };
        });

        return { monthlyTotals: resultArray };
    } catch (error) {
        console.error("Error fetching monthly order totals:", error);
        throw error;
    }
}

function formateProductFootprint(jsonData) {
    console.log("=>", jsonData);
    const formattedData = [];

    jsonData.forEach((item) => {
        const month = item.month;
        const totalCount = item.totalCount;
        const totalAmount = item.totalAmount;
        const totalFee = item.totalFee;
        const totalCost = "";
        formattedData.push([month, totalCount, totalAmount, `$${totalFee}`, totalCost]);
    });
    return formattedData;
}
