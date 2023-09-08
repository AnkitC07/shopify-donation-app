/* eslint-disable react/jsx-key */
// src/components/Dashboard.js
import {
  Button,
  DataTable,
  Icon,
  LegacyCard,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { SearchMajor, SortMinor } from "@shopify/polaris-icons";
import DataTableCommon from "../../components/DataTableCommon";
import "./index.css";
import api from "../../../appConfig";

function Dashboard() {
  const [rows, setRows] = useState([]);
  const [sortDirection, setSortDirection] = useState("ascending");
  const [searchQuery, setSearchQuery] = useState("");
  const [originalRows, setOriginalRows] = useState([]);
  const [stats, setStats] = useState({
    totalCount: 0,
    totalCo2: 0,
    totalAmount: 0,
    totalFee: 0,
  });

  const fetchHomeData = async () => {
    try {
      const response = await fetch(`${api}/api/home`);
      if (!response.ok) {
        throw new Error(`Failed to get data.`);
      }

      const data = await response.json();
      if (data) {
        setRows(formateTableData(data.stores));
        setOriginalRows(formateTableData(data.stores));
        setStats({
          totalCount: data.stats.totalLastMonthCount,
          totalCo2: data.stats.totalLastMonthCo2,
          totalAmount: data.stats.totalLastMonthAmount,
          totalFee: data.stats.totalThisMonthFeeAdded,
        });
      }
      console.log("Home data=>", data);
      return data; // Return the response data after successful login
    } catch (error) {
      console.log(error.mesaage);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

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
          {displayWeight(stats.totalCo2).unit}
        </span>
      </div>,
    ],
    [
      "To climate mitigation",
      "",
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <Text variant="heading2xl" as="h3">
          €{stats.totalAmount}
        </Text>
      </div>,
    ],

    [
      "Service fees this month",
      "",
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <Text variant="heading2xl" as="h3">
          €{stats.totalFee}
        </Text>
      </div>,
    ],
  ];
  function formateTableData(homeData) {
    return homeData.map((item) => {
      const storenameParts = item.storename.split(".");
      const storeDomain = storenameParts[0];
      const storeDetails = [
        `www.${storeDomain}.com`,
        item.totalCount,
        `€${item.totalAmount}`,
        `€${item.totalFeeAdded}`,
        <a
          href="#"
          style={{
            color: "rgb(36, 99, 188)",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Go to store
        </a>,
        <NavLink
          to={`/storeDetail?shop=${item.storename}`}
          style={{
            color: "rgb(36, 99, 188)",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          View details
        </NavLink>,
      ];
      return storeDetails;
    });
  }

  // Table Data
  //   const rows = [
  //     [
  //       "www.storename.com",
  //       "352",
  //       "€122.67",
  //       "€12.2",
  //       <a
  //         href="#"
  //         style={{
  //           color: "rgb(36, 99, 188)",
  //           textDecoration: "none",
  //           cursor: "pointer",
  //         }}
  //       >
  //         Go to store
  //       </a>,
  //       <a
  //         href="#"
  //         style={{
  //           color: "rgb(36, 99, 188)",
  //           textDecoration: "none",
  //           cursor: "pointer",
  //         }}
  //       >
  //         View details
  //       </a>,
  //     ],
  //     [
  //       "www.storename.com",
  //       "352",
  //       "€122.67",
  //       "€12.2",
  //       <a
  //         href="#"
  //         style={{
  //           color: "rgb(36, 99, 188)",
  //           textDecoration: "none",
  //           cursor: "pointer",
  //         }}
  //       >
  //         Go to store
  //       </a>,
  //       <a
  //         href="#"
  //         style={{
  //           color: "rgb(36, 99, 188)",
  //           textDecoration: "none",
  //           cursor: "pointer",
  //         }}
  //       >
  //         View details
  //       </a>,
  //     ],
  //     [
  //       "www.storename.com",
  //       "352",
  //       "€122.67",
  //       "€12.2",
  //       <a
  //         href="#"
  //         style={{
  //           color: "rgb(36, 99, 188)",
  //           textDecoration: "none",
  //           cursor: "pointer",
  //         }}
  //       >
  //         Go to store
  //       </a>,
  //       <a
  //         href="#"
  //         style={{
  //           color: "rgb(36, 99, 188)",
  //           textDecoration: "none",
  //           cursor: "pointer",
  //         }}
  //       >
  //         View details
  //       </a>,
  //     ],
  //     [
  //       "www.storename.com",
  //       "352",
  //       "€122.67",
  //       "€12.2",
  //       <a
  //         href="#"
  //         style={{
  //           color: "rgb(36, 99, 188)",
  //           textDecoration: "none",
  //           cursor: "pointer",
  //         }}
  //       >
  //         Go to store
  //       </a>,
  //       <NavLink
  //         to="/storeDetail?shop=www.storename.com"
  //         style={{
  //           color: "rgb(36, 99, 188)",
  //           textDecoration: "none",
  //           cursor: "pointer",
  //         }}
  //       >
  //         View details
  //       </NavLink>,
  //     ],
  //   ];
  const headings = [
    "Store url",
    "Total reductions",
    "Total compensated",
    "Total fees",
    "",
    "",
  ];
  const cols = ["text", "text", "text", "text", "numeric", "numeric"];

  const handleSort = () => {
    const sortedRows = [...originalRows].sort((rowA, rowB) =>
      sortDirection === "ascending"
        ? rowA[0].localeCompare(rowB[0])
        : rowB[0].localeCompare(rowA[0])
    );

    setOriginalRows(sortedRows);
    setSortDirection(
      sortDirection === "ascending" ? "descending" : "ascending"
    );
  };
  const handleSearch = (value) => {
    setSearchQuery(value);
    const filteredRows = rows.filter((row) =>
      row[0].toLowerCase().includes(value.toLowerCase())
    );
    setOriginalRows(filteredRows);
  };

  return (
    <div className="container-fluid page_margin">
      <Page fullWidth>
        <Text variant="headingMd" alignment="start" as="h5">
          Last Month Statistics
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
                  actions={[
                    {
                      content: (
                        <NavLink
                          to="/productFootprints"
                          style={{ color: "#2463bc" }}
                        >
                          {" "}
                          {button}{" "}
                        </NavLink>
                      ),
                    },
                  ]}
                >
                  {text}
                </LegacyCard>
              </div>
            ))}
          </div>
        </div>
        <div className="contribution_table" style={{ margin: "50px 0px" }}>
          <div
            className="header_table"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <Text variant="headingMd" alignment="start" as="h5">
              Active App Installations
            </Text>
          </div>
          <div
            className="row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div className="col-md-6 dashboard-search">
              <TextField
                type="search"
                placeholder="Filter"
                prefix={<Icon source={SearchMajor} color="base" />}
                value={searchQuery}
                onChange={handleSearch}
                autoComplete="off"
              />
            </div>
            <div className="col-md-6" style={{ textAlign: "right" }}>
              <Button
                onClick={handleSort}
                icon={<Icon source={SortMinor} color="base" />}
              >
                Sort
              </Button>
            </div>
          </div>
          <DataTableCommon
            rows={originalRows}
            headings={headings}
            cols={cols}
          />
        </div>
      </Page>
    </div>
  );
}

export default Dashboard;
