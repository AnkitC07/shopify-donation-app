import { Button, LegacyCard, Page, Text } from '@shopify/polaris'
import React from 'react'
import DataTableCommon from '../Common/DataTableCommon'

const Index = () => {

    // Top Cards
    const impactCards = [
        ["Footprint reductions",
            'View report',
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Text variant="heading2xl" as="h3">
                    4032{' '}
                </Text>
                {' clicks'}
            </div>
        ],
        ["Total Offset",
            'View report',
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Text variant="heading2xl" as="h3">
                    4032{' '}
                </Text>
                {' '}clicks
            </div>
        ],
        ["To climate mitigation",
            'View report',
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Text variant="heading2xl" as="h3">
                    €1,321.21
                </Text>
            </div>
        ],
    ]

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
        "Order",
        "Date",
        "CO2 Footprint",
        "Footprint Reduction",
        "Order Value"
    ];
    const cols = ["text", "numeric", "numeric", "numeric", "numeric"];

    return (
        <>
            <Page fullWidth>
                <Text variant="headingMd" alignment="start" as="h5">
                    Your customer impact
                </Text>
                <div className="impact_cards" style={{ marginTop: '20px' }}>
                    <div className="row">
                        {
                            impactCards.map(([title, button, text]) => (
                                <div className="col-md-4">  {console.log(title)}
                                    <LegacyCard sectioned title={title} actions={[{ content: button }]}>
                                        {text}
                                    </LegacyCard>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="contribution_table" style={{ margin: '40px', }}>
                    <div className="header_table" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <Text variant="headingMd" alignment="start" as="h5">
                            Customer Footprint Contributions
                        </Text>
                        <Button primary>Export to CSV</Button>
                    </div>
                    <DataTableCommon rows={rows} headings={headings} cols={cols} />
                </div>
                <div className="collected_contribution">

                </div>
            </Page>
        </>
    )
}

export default Index