import { Button, Divider, Icon, Page, Text } from "@shopify/polaris";
import React, { useState } from "react";
import { SortMinor } from "@shopify/polaris-icons";
import DataTableCommon from "../Common/DataTableCommon";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import * as XLSX from "xlsx";

const Index = () => {
  const fetch = useAuthenticatedFetch();
  const [exptloading, exptloadingState] = useState(false);
  const sortIcon = <Icon source={SortMinor} color="base" />;
  // Table Data
  const rows = [
    ["Sustainable T-shirt", "4352-1823-1291", "4.32"],
    ["Sustainable T-shirt", "4352-1823-1291", "6.45"],
    ["Sustainable T-shirt", "4352-1823-1291", "8.22"],
  ];
  const headings = ["Product name", "SKU", "CO2 Footprint (kg CO2e)"];
  const cols = ["text", "text", "numeric"];

  const ImportPRoducts = async () => {
    const req = await fetch(`/api/import_products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ checking: "data" }),
    });
    const res = await req.json();

    console.log(res);
  };

  const ExportProducts = async () => {
    let since_id = 0;
    const products = [];
    let productLengthCount = 0;
    exptloadingState(true);
    while (since_id !== null) {
      const req = await fetch(`/api/export_products?since_id=${since_id}`);
      const res = await req.json();
      since_id = res.products[res.products.length - 1].product_id;
      productLengthCount = productLengthCount + res.productlength;
      console.log(
        productLengthCount - 1 === res.count,
        productLengthCount,
        res.count
      );
      if (productLengthCount === res.count) {
        since_id = null;
      }
      products.push(...res.products);
      console.log(res, since_id);
    }

    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Convert the workbook to a buffer
    const excelBuffer = XLSX.write(workbook, { type: "array" });

    // Save the XLSX file
    const fileName = "products.xlsx";
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    console.log(products);
    exptloadingState(false);
  };

  return (
    <>
      <div className="container-fluid page_margin">
        <Page fullWidth title="Product Footprints">
          <div
            className="intro"
            style={{ marginBottom: "30px", marginTop: "5px" }}
          >
            <Text variant="headingMd" as="h6">
              Intro
            </Text>
            <br />
            <p>
              On this page you can edit and see the carbon footprint all of your
              store’s products. You can either adjust a single product and click
              save, or you can upload a CSV file you received from you contact
              at Emissa. Use the “export CSV” button to download an overview of
              your store’s product footprints.
            </p>
          </div>
          <Divider />
          <div className="footprintsValues" style={{ marginTop: "50px" }}>
            <div
              className="header_footprintsValues"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <Text variant="headingMd" alignment="start" as="h5">
                Product Footprint Values
              </Text>
              <div
                className="header_buttons"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "5px",
                }}
              >
                <Button icon={sortIcon} onClick={ImportPRoducts}>
                  Import CSV
                </Button>
                <Button
                  icon={sortIcon}
                  onClick={ExportProducts}
                  loading={exptloading}
                >
                  Export CSV
                </Button>
                <Button primary>Save</Button>
              </div>
            </div>
            <DataTableCommon rows={rows} headings={headings} cols={cols} />
          </div>
        </Page>
      </div>
    </>
  );
};

export default Index;
