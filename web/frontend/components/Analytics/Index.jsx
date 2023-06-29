import { Button, DataTable, Divider, LegacyCard, Page, Pagination, Select, Text } from '@shopify/polaris'
import React, { useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom';
import DataTableCommon from '../Common/DataTableCommon'

const Index = () => {
    const [selected, setSelected] = useState('today');

    // Top Cards
    const impactCards = [
        ["Footprint reductions",
            'View report',
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Text variant="heading2xl" as="h3">
                    4032{' '}
                </Text>
                <span style={{ marginLeft: '4px', fontSize: '13px' }}>clicks</span>

            </div>
        ],
        ["Total Offset",
            'View report',
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Text variant="heading2xl" as="h3">
                    1.32 {' '}
                </Text>
                <span style={{ marginLeft: '4px', fontSize: '13px' }}>tons CO2</span>

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

    // Second table Data
    const rows2 = [

    ]

    const handleSelectChange = useCallback((value) =>
        setSelected(value),
        [],);

    const options = [
        { label: 'Period', value: 'period' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'Last 7 days', value: 'lastWeek' },
    ];

    return (
        <>
            <div className="container-fluid page_margin" >
                <Page fullWidth>
                    <Text variant="headingMd" alignment="start" as="h5">
                        Your customer impact
                    </Text>
                    <div className="impact_cards" style={{ marginTop: '10px' }}>
                        <div className="row">
                            {
                                impactCards.map(([title, button, text]) => (
                                    <div className="col-md-4" style={{ marginTop: '10px' }}>  {console.log(title)}
                                        <LegacyCard sectioned title={title} actions={[{ content: <NavLink to='/productFootprints' style={{ color: '#2463bc' }}> {button} </NavLink> }]}>
                                            {text}
                                        </LegacyCard>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="contribution_table" style={{ margin: '40px 0px', }}>
                        <div className="header_table" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <Text variant="headingMd" alignment="start" as="h5">
                                Customer Footprint Contributions
                            </Text>
                            <Button primary>Export to CSV</Button>
                        </div>
                        <DataTableCommon rows={rows} headings={headings} cols={cols} />
                    </div>
                    <div className="collected_contribution" style={{ backgroundColor: '#f9fafb', marginBottom: '30px' }}>

                        <LegacyCard>
                            <div className=" table2_top" style={{ margin: '0px 15px', padding: '15px 0px', display: 'flex', alignItems: 'center' }}>
                                <div className='col-sm-6'>
                                    <Text variant="headingMd" as="h2">
                                        Collected Contributions
                                    </Text>
                                </div>
                                <div className="col-sm-6">
                                    <Select
                                        options={options}
                                        onChange={handleSelectChange}
                                        value={selected}
                                    />
                                </div>

                            </div>
                            <Divider />
                            <DataTable
                                columnContentTypes={[
                                    'text',
                                    'numeric',
                                    'numeric',
                                    'numeric',
                                    'numeric',
                                    'numeric',
                                ]}
                                headings={[
                                    'Orders',
                                    'Customer Name',
                                    'Customer Email',
                                    'Offset Amount',
                                    'Project',
                                    'Date Purchase',
                                ]}
                                rows={rows2}
                            />
                            {rows2.length <= 0 && (
                                <div style={{ height: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text variant="headingMd" fontWeight='medium' as="h4">
                                        No matching offsets found
                                    </Text>
                                </div>
                            )}
                        </LegacyCard>
                        <div style={{ padding: '25px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                            <Pagination
                                hasPrevious
                                onPrevious={() => {
                                    console.log('Previous');
                                }}
                                hasNext
                                onNext={() => {
                                    console.log('Next');
                                }}
                            />
                            <span>Page 1 of 1 pages</span>
                        </div>
                    </div>
                </Page>
            </div>
        </>
    )
}

export default Index