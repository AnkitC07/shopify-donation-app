import { Button, Divider, Icon, Page, Text } from '@shopify/polaris'
import React from 'react'
import {
    SortMinor
} from '@shopify/polaris-icons';
import DataTableCommon from '../Common/DataTableCommon';

const Index = () => {
    const sortIcon = (
        <Icon
            source={SortMinor}
            color="base"
        />
    )
    // Table Data
    const rows = [
        ["Sustainable T-shirt", "4352-1823-1291", "4.32"],
        ["Sustainable T-shirt", "4352-1823-1291", "6.45"],
        ["Sustainable T-shirt", "4352-1823-1291", "8.22"],
    ];
    const headings = [
        "Product name",
        "SKU",
        "CO2 Footprint (kg CO2e)",
    ];
    const cols = ["text", "text", "numeric"];
    return (
        <>
            <div className="container-fluid page_margin" >
                <Page fullWidth title='Product Footprints'>
                    <div className="intro" style={{ marginBottom: '30px', marginTop: '5px' }}>
                        <Text variant="headingMd" as="h6">
                            Intro
                        </Text>
                        <br />
                        <p>On this page you can edit and see the carbon footprint all of your store’s products. You can either adjust a single product and click save, or you can upload a CSV file you received from you contact at Emissa. Use the “export CSV” button to download an overview of your store’s product footprints.</p>
                    </div>
                    <Divider />
                    <div className="footprintsValues" style={{ marginTop: '50px' }}>
                        <div className="header_footprintsValues" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <Text variant="headingMd" alignment="start" as="h5" >
                                Product Footprint Values
                            </Text>
                            <div className="header_buttons" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '5px' }}>
                                <Button icon={sortIcon}>Import CSV</Button>
                                <Button icon={sortIcon}>Export CSV</Button>
                                <Button primary>Save</Button>
                            </div>
                        </div>
                        <DataTableCommon rows={rows} headings={headings} cols={cols} />
                    </div>
                </Page>
            </div>
        </>
    )
}

export default Index