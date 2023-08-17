import { DataTable, LegacyCard } from "@shopify/polaris";

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

export default DataTableCommon