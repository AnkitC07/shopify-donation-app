/* eslint-disable react/jsx-key */
import {
  Button,
  DataTable,
  Divider,
  FullscreenBar,
  HorizontalStack,
  LegacyCard,
  Page,
  Pagination,
  Select,
  Text,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate, useNavigation } from "react-router-dom";
import DataTableCommon from "../../components/DataTableCommon";
import "./index.css";
import api from "../../../appConfig";
import getSymbolFromCurrency from "currency-symbol-map";
import { exportFunc } from "../../components/functions";

const StoreDetail = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const shop = urlParams.get("shop");

  const navigate = useNavigate();
  const [selected, setSelected] = useState("today");

  const [rows, setRows] = useState([]);
  // const [rows2, setRows2] = useState([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    totalCo2: 0,
    totalAmount: 0,
    totalFee: 0,
    currency: "",
  });
  const [exptloading, exptloadingState] = useState(false);
  // pagination states
  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasPrevPage, setHasPrevPage] = useState(false);

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
      "",
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <Text variant="heading2xl" as="h3">
          {stats.totalCount}{" "}
        </Text>
        <span style={{ marginLeft: "4px", fontSize: "13px" }}>clicks</span>
      </div>,
    ],
    [
      "Total Offset",
      "",
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <Text variant="heading2xl" as="h3">
          {displayWeight(stats.totalCo2).co2}{" "}
        </Text>
        <span style={{ marginLeft: "4px", fontSize: "13px" }}>
          {" "}
          {displayWeight(stats.totalCo2).unit}
        </span>
      </div>,
    ],
    [
      "To climate mitigation",
      "",
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <Text variant="heading2xl" as="h3">
          {stats.currency}
          {stats.totalAmount}
        </Text>
      </div>,
    ],

    [
      "Service fees this month",
      "",
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
    "Order id",
    "Date",
    "CO2 Footprint",
    "Footprint Reduction",
    "Order Value",
  ];
  const cols = ["text", "numeric", "numeric", "numeric", "numeric"];

  // Second table Data
  // Table Data
  const rows2 = [
    ["September, 2023", "19", "€132", "€33", "€130.00"],
    ["August, 2023", "13", "€100", "€25", "€110.00"],
    ["July, 2023", "3", "€10", "€2.5", "€108.00"],
    ["June, 2023", "18", "€200", "€50", "€130.00"],
    ["May, 2023", "7", "€50", "€12.5", "€110.00"],
  ];
  const headings2 = [
    "Period",
    "Collected contributions",
    "Total contributions",
    "Service fees",
    "Total Costs",
  ];
  const cols2 = ["text", "text", "text", "numeric", "numeric"];

  // const handleSelectChange = useCallback((value) => setSelected(value), []);

  // const options = [
  //   { label: "Period", value: "period" },
  //   { label: "Yesterday", value: "yesterday" },
  //   { label: "Last 7 days", value: "lastWeek" },
  // ];

  const handleActionClick = useCallback(() => {
    navigate("/");
  }, []);

  // Fetching table data
  const fetchOrders = async (cursor = null) => {
    console.log("cursor=>", cursor);
    try {
      const req = await fetch(
        `${api}/api/analytics/super?shop=${shop}&cursor=${cursor}`
      );
      if (!req.ok) {
        throw new Error(`Failed to get data.`);
      }
      const res = await req.json();
      if (res) {
        setRows(res.data);
        // Update cursor and hasNextPage based on pageInfo
        setHasNextPage(res.next || false);
        setHasPrevPage(res.prev || false);
      }
      console.log("Table API=>", res);
    } catch (error) {
      console.log(error);
    }
  };
  // Fetching analytics data
  const fetchAnalytics = async () => {
    try {
      const req = await fetch(`${api}/api/analytics/stats/super?shop=${shop}`);
      if (!req.ok) {
        throw new Error(`Failed to get data.`);
      }
      const res = await req.json();
      if (res) {
        const stats = res.stats;
        const fee = res.fee;
        setStats({
          totalCount: stats.totalCount ?? 0,
          totalCo2: stats.totalCo2 ?? 0,
          totalAmount: stats.totalAmount ?? 0,
          totalFee: fee ?? 0,
          currency: getSymbolFromCurrency(stats.currency),
        });
      }
      console.log("Stats API=>", res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchAnalytics();
  }, []);

  const handleNextPageClick = () => {
    if (hasNextPage) {
      fetchOrders(hasNextPage);
    }
  };
  const handlePrevPageClick = () => {
    if (hasPrevPage) {
      fetchOrders(hasPrevPage);
    }
  };
  const ExportOrders = async () => {
    let since_id = 0;
    const orders = [];
    exptloadingState(true);
    while (since_id !== null) {
      const req = await fetch(
        `${api}/api/exportOrders?shop=${shop}&since_id=${since_id}`
      );
      const res = await req.json();
      console.log("export response", res);
      if (!res?.status) {
        since_id = res.since_id;
        console.log(since_id);
        orders.push(...res.orders);
      } else {
        exptloadingState(false);
        break;
      }
    }
    console.log("final orders", orders);
    exportFunc(orders, headings, exptloadingState);
  };
  return (
    <>
      <div className="container-fluid page_margin">
        <Page fullWidth>
          <div style={{ marginBottom: "50px" }}>
            <FullscreenBar onAction={handleActionClick}>
              <div
                style={{
                  display: "flex",
                  flexGrow: 1,
                  alignItems: "center",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                }}
              >
                <div style={{ marginLeft: "1rem", flexGrow: 1 }}>
                  <Text variant="headingMd" as="p">
                    {shop ? shop : ""}
                  </Text>
                </div>
              </div>
            </FullscreenBar>
          </div>
          <Text variant="headingMd" alignment="start" as="h5">
            Store Statistics
          </Text>
          <div className="impact_cards" style={{ marginTop: "10px" }}>
            <div className="row">
              {impactCards.map(([title, button, text]) => (
                <div className="col-md-3" style={{ marginTop: "10px" }}>
                  {" "}
                  {console.log(title)}
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
                    //         {" "}
                    //         {button}{" "}
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
          <div className="Compensations_table" style={{ margin: "40px 0px" }}>
            <div
              className="header_table"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div className="col-sm-8">
                <Text variant="headingMd" alignment="start" as="h5">
                  Compensations
                </Text>
              </div>
              <div
                className="col-sm-4"
                // style={{
                //   display: "flex",
                //   justifyContent: "space-between",
                //   flexWrap: "wrap",
                // }}
              >
                {/* <div className="select-export-wrapper" style={{ width: "70%" }}> */}
                {/* <Select
                    options={options}
                    onChange={handleSelectChange}
                    value={selected}
                  /> */}
                {/* </div> */}
                <div style={{ textAlign: "end" }}>
                  <Button
                    primary
                    onClick={() => ExportOrders()}
                    loading={exptloading}
                  >
                    Export to CSV
                  </Button>
                </div>
              </div>
            </div>
            <div
              className="collected_contribution"
              style={{ backgroundColor: "#f9fafb", marginBottom: "30px" }}
            >
              <DataTableCommon rows={rows} headings={headings} cols={cols} />
              <div
                style={{
                  padding: "25px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Pagination
                  hasPrevious={hasPrevPage}
                  onPrevious={() => {
                    handlePrevPageClick();
                  }}
                  hasNext={hasNextPage}
                  onNext={() => {
                    handleNextPageClick();
                  }}
                />
              </div>
            </div>
          </div>
          <div className="billing-history_table" style={{ margin: "40px 0px" }}>
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
                Billing History
              </Text>
              <Button primary>Export to CSV</Button>
            </div>

            <DataTableCommon rows={rows2} headings={headings2} cols={cols2} />
          </div>
        </Page>
      </div>
    </>
  );
};

export default StoreDetail;
