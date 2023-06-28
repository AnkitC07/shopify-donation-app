import { Button, Page, Text } from '@shopify/polaris'
import React from 'react'
import DataTableCommon from '../Common/DataTableCommon'

const Index = () => {
    // Table Data
    const rows = [
        ["September, 2023", "19", "€132", "€33", "€130.00"],
        ["August, 2023", "13", "€100", "€25", "€110.00"],
        ["July, 2023", "3", "€10", "€2.5", "€108.00"],
        ["June, 2023", "18", "€200", "€50", "€130.00"],
        ["May, 2023", "7", "€50", "€12.5", "€110.00"],
    ];
    const headings = [
        "Period",
        "Collected contributions",
        "Total contributions",
        "Usage costs",
        "Total Costs"
    ];
    const cols = ["text", "text", "text", "numeric", "numeric"];
    return (
        <>
            <div className="container-fluid page_margin" >
                <Page fullWidth >
                    <div className="contribution_table" style={{ margin: '40px 0px', }}>
                        <div className="header_table" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <Text variant="headingMd" alignment="start" as="h5">
                                Billing History
                            </Text>
                            <Button primary>Export to CSV</Button>
                        </div>
                        <DataTableCommon rows={rows} headings={headings} cols={cols} />
                    </div>
                </Page>
            </div>
        </>
    )
}

export default Index