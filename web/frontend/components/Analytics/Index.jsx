import {
  Button,
  DataTable,
  Divider,
  LegacyCard,
  Page,
  Pagination,
  Select,
  Text,
} from "@shopify/polaris";
import getSymbolFromCurrency from "currency-symbol-map";
import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import DataTableCommon from "../Common/DataTableCommon";
import { useAuthenticatedFetch } from "../../hooks";
import { exportFunc } from "../Common/functions";

const Index = () => {
  const fetch = useAuthenticatedFetch();
  const [selected, setSelected] = useState("today");
  const [rows, setRows] = useState([]);
  const [rows2, setRows2] = useState([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    totalCo2: 0,
    totalAmount: 0,
    totalFee: 0,
    currency: "",
  });
  const [exptloading, exptloadingState] = useState(false);

  function displayWeight(weightInKg) {
    if (weightInKg >= 1000) {
      const weightInTon = weightInKg / 1000;
      return { co2: weightInTon, unit: "ton CO2" };
    } else {
      return { co2: weightInKg, unit: "kg CO2" };
    }
  }

  // Top Cards
  const impactCards = [
    [
      "Footprint reductions",
      "View report",
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <Text variant="heading2xl" as="h3">
          {stats.totalCount}{" "}
        </Text>
        <span style={{ marginLeft: "4px", fontSize: "13px" }}>clicks</span>
      </div>,
    ],
    [
      "Total Offset",
      "View report",
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <Text variant="heading2xl" as="h3">
          {displayWeight(stats.totalCo2).co2}{" "}
        </Text>
        <span style={{ marginLeft: "4px", fontSize: "13px" }}>
          {displayWeight(stats.totalCo2).unit}
        </span>
      </div>,
    ],
    [
      "To climate mitigation",
      "View report",
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <Text variant="heading2xl" as="h3">
          {stats.currency}
          {stats.totalAmount}
        </Text>
      </div>,
    ],
    [
      "Service fees this month",
      "View report",
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <Text variant="heading2xl" as="h3">
          {stats.currency}
          {stats.totalFee}
        </Text>
      </div>,
    ],
  ];

  // Table Data

  const headings = [
    "Order",
    "Date",
    "CO2 Footprint",
    "Footprint Reduction",
    "Order Value",
  ];
  const cols = ["text", "numeric", "numeric", "numeric", "numeric"];

  const handleSelectChange = useCallback((value) => setSelected(value), []);

  const options = [
    { label: "Period", value: "period" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 days", value: "lastWeek" },
  ];

  // Fetching table data
  const fetchOrders = async () => {
    const req = await fetch(`/api/analytics`);
    const res = await req.json();
    if (res) {
      setRows(res.data);
      setRows2(res.collected);
    }
    console.log(res);
  };
  // Fetching analytics data
  const fetchAnalytics = async () => {
    const req = await fetch(`/api/analytics/stats`);
    const res = await req.json();
    if (res) {
      const stats = res.stats;
      const fee = res.fee;
      setStats({
        totalCount: stats.totalCount,
        totalCo2: stats.totalCo2,
        totalAmount: stats.totalAmount,
        totalFee: fee,
        currency: getSymbolFromCurrency(stats.currency),
      });
    }
    console.log(res);
  };
  useEffect(() => {
    fetchOrders();
    fetchAnalytics();
  }, []);

  return (
    <>
      <div className="container-fluid page_margin">
        <Page fullWidth>
          <Text variant="headingMd" alignment="start" as="h5">
            Your customer impact
          </Text>
          <div className="impact_cards" style={{ marginTop: "10px" }}>
            <div className="row">
              {impactCards.map(([title, button, text]) => (
                <div className="col-md-3" style={{ marginTop: "10px" }}>
                  <LegacyCard
                    sectioned
                    title={title}
                    // actions={[
                    //   {
                    //     content: (
                    //       <NavLink
                    //         to="/productFootprints"
                    //         style={{ color: "#2463bc" }}
                    //       >
                    //         {button}
                    //       </NavLink>
                    //     ),
                    //   },
                    // ]}
                  >
                    {text}
                  </LegacyCard>
                </div>
              ))}
            </div>
          </div>
          <div className="contribution_table" style={{ margin: "40px 0px" }}>
            <div
              className="header_table"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <Text variant="headingMd" alignment="start" as="h5">
                Customer Footprint Contributions
              </Text>
              <Button
                primary
                onClick={() => exportFunc(rows, headings, exptloadingState)}
                loading={exptloading}
              >
                Export to CSV
              </Button>
            </div>
            <DataTableCommon rows={rows} headings={headings} cols={cols} />
          </div>
          <div
            className="collected_contribution"
            style={{ backgroundColor: "#f9fafb", marginBottom: "30px" }}
          >
            <LegacyCard>
              <div
                className=" table2_top"
                style={{
                  margin: "0px 15px",
                  padding: "15px 0px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div className="col-sm-6">
                  <Text variant="headingMd" as="h2">
                    Collected Contributions
                  </Text>
                </div>
                <div className="col-sm-6">
                  <Select
                    options={options}
                    onChange={handleSelectChange}
                    value={selected}
                  />
                </div>
              </div>
              <Divider />
              <DataTable
                columnContentTypes={[
                  "text",
                  "numeric",
                  "numeric",
                  "numeric",
                  "numeric",
                  "numeric",
                ]}
                headings={[
                  "Orders",
                  "Customer Name",
                  "Customer Email",
                  "Offset Amount",
                  "Project",
                  "Date Purchase",
                ]}
                rows={rows2}
              />
              {rows2.length <= 0 && (
                <div
                  style={{
                    height: "350px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text variant="headingMd" fontWeight="medium" as="h4">
                    No matching offsets found
                  </Text>
                </div>
              )}
            </LegacyCard>
            <div
              style={{
                padding: "25px",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Pagination
                hasPrevious
                onPrevious={() => {
                  console.log("Previous");
                }}
                hasNext
                onNext={() => {
                  console.log("Next");
                }}
              />
              <span>Page 1 of 1 pages</span>
            </div>
          </div>
        </Page>
      </div>
    </>
  );
};

export default Index;
