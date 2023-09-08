import {
  Button,
  Divider,
  Icon,
  Page,
  Pagination,
  Text,
} from "@shopify/polaris";
import React, { useEffect, useRef, useState } from "react";
import { SortMinor } from "@shopify/polaris-icons";
import DataTableCommon from "../Common/DataTableCommon";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import * as XLSX from "xlsx";
import FileUploader from "./FileUploadComp";

const Index = () => {
  const fetch = useAuthenticatedFetch();
  const [exptloading, exptloadingState] = useState(false);
  const sortIcon = <Icon source={SortMinor} color="base" />;
  // Table states
  const [rows, setRows] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const headings = ["Product name", "SKU", "CO2 Footprint (kg CO2e)"];
  const cols = ["text", "text", "numeric"];

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const fetchProducts = async (currentCursor = null, direction = null) => {
    const req = await fetch(
      `/api/product-footprint?cursor=${
        currentCursor || ""
      }&direction=${direction}`
    );

    const res = await req.json();
    const products = res.products;
    const pageInfo = res.pageInfo;
    if (products) {
      setRows(products);
      // Update cursor and hasNextPage based on pageInfo
      setCursor(pageInfo);
      setHasNextPage(pageInfo.hasNextPage || false);
      setHasPrevPage(pageInfo.hasPreviousPage || false);
    }
    console.log(res);
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  const handleNextPageClick = () => {
    if (hasNextPage) {
      fetchProducts(cursor.endCursor, "next");
    }
  };
  const handlePrevPageClick = () => {
    if (hasPrevPage) {
      fetchProducts(cursor.startCursor, "before");
    }
  };

  // FILE IMPORT
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Call the backend API to upload the file
      handleUpload(formData);
    }
  };

  // IMPORT
  const handleUpload = async (formData) => {
    try {
      const req = await fetch(`/api/import_products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ checking: formData }),
      });
      const res = await req.json();

      console.log(res);

      // Handle response here
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const ImportPRoducts = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // EXPORT
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
                <FileUploader />
                {/* <Button icon={sortIcon} onClick={ImportPRoducts}>
                  Import CSV
                </Button> */}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
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
        </Page>
      </div>
    </>
  );
};

export default Index;
