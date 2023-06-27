import { Page, LegacyCard, DataTable } from "@shopify/polaris";
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
                    footerContent={`Showing ${rows.length} of ${rows.length} results`}
                />
            </div>
        </LegacyCard>
    );
}

export default DataTableCommon;