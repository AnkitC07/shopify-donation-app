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
import React, { useCallback, useState } from "react";
import { NavLink, useNavigate, useNavigation } from "react-router-dom";
import DataTableCommon from "../../components/DataTableCommon";
import "./index.css";

const StoreDetail = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const shop = urlParams.get("shop");

  const navigate = useNavigate();
  const [selected, setSelected] = useState("today");

  // Top Cards
  const impactCards = [
    [
      "Footprint reductions",
      "",
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <Text variant="heading2xl" as="h3">
          4032{" "}
        </Text>
        <span style={{ marginLeft: "4px", fontSize: "13px" }}>clicks</span>
      </div>,
    ],
    [
      "Total Offset",
      "",
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <Text variant="heading2xl" as="h3">
          1.32{" "}
        </Text>
        <span style={{ marginLeft: "4px", fontSize: "13px" }}>tons CO2</span>
      </div>,
    ],
    [
      "To climate mitigation",
      "",
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <Text variant="heading2xl" as="h3">
          €1,321.21
        </Text>
      </div>,
    ],

    [
      "Service fees this month",
      "",
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <Text variant="heading2xl" as="h3">
          €21.17
        </Text>
      </div>,
    ],
  ];

  // Table Data
  const rows = [
    ["# 1234", "12-06-2023", 4.32, "€2", "€130.00"],
    ["# 1234", "12-06-2023", 4.32, "€2", "€110.00"],
    ["# 2341", "12-06-2023", 4.32, "€2", "€108.00"],
    ["# 1234", "12-06-2023", 4.32, "€2", "€130.00"],
    ["# 1234", "12-06-2023", 4.32, "€2", "€110.00"],
    ["# 2341", "12-06-2023", 4.32, "€2", "€108.00"],
  ];
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

  const handleSelectChange = useCallback((value) => setSelected(value), []);

  const options = [
    { label: "Period", value: "period" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 days", value: "lastWeek" },
  ];

  const handleActionClick = useCallback(() => {
    navigate("/");
  }, []);
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
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div className="select-export-wrapper" style={{ width: "70%" }}>
                  <Select
                    options={options}
                    onChange={handleSelectChange}
                    value={selected}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <Button primary>Export to CSV</Button>
                </div>
              </div>
            </div>
            <DataTableCommon rows={rows} headings={headings} cols={cols} />
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
