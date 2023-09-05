import { Page, LegacyCard, DataTable, Text } from "@shopify/polaris";
import React from "react";

function DataTableCommon({ rows, headings, cols }) {
  return (
    <LegacyCard>
      <div className="common_table">
        <DataTable
          stickyHeader
          columnContentTypes={cols}
          headings={headings}
          rows={rows}

          // footerContent={`Showing ${rows.length} of ${rows.length} results`}
        />
        {rows.length <= 0 && (
          <div
            style={{
              height: "250px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text variant="headingMd" fontWeight="medium" as="h4">
              No data found
            </Text>
          </div>
        )}
      </div>
    </LegacyCard>
  );
}

export default DataTableCommon;
