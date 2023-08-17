// src/components/Dashboard.js
import { Button, DataTable, Icon, LegacyCard, Page, Text, TextField } from '@shopify/polaris';
import React, { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    SearchMajor,
    SortMinor
} from '@shopify/polaris-icons';
import DataTableCommon from '../../components/DataTableCommon';
import './index.css'

function Dashboard() {
    const [searchText, setSearchText] = useState('');
    const handleChange = useCallback(
        value => setSearchText(value),
        [],
    );

    // Top Cards
    const impactCards = [
        ["Footprint reductions",
            '',
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Text variant="heading2xl" as="h3">
                    4032{' '}
                </Text>
                <span style={{ marginLeft: '4px', fontSize: '13px' }}>clicks</span>

            </div>
        ],
        ["Total Offset",
            '',
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Text variant="heading2xl" as="h3">
                    1.32 {' '}
                </Text>
                <span style={{ marginLeft: '4px', fontSize: '13px' }}>tons CO2</span>

            </div>
        ],
        ["To climate mitigation",
            '',
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Text variant="heading2xl" as="h3">
                    €1,321.21
                </Text>
            </div>
        ],

        ["Service fees this month",
            '',
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <Text variant="heading2xl" as="h3">
                    €21.17
                </Text>
            </div>
        ],
    ]

    // Table Data
    const rows = [
        ["www.storename.com", "352", "€122.67", "€12.2", <a href='#' style={{ color: 'rgb(36, 99, 188)', textDecoration: 'none', cursor: 'pointer' }}>Go to store</a>, <a href='#' style={{ color: 'rgb(36, 99, 188)', textDecoration: 'none', cursor: 'pointer' }}>View details</a>],
        ["www.storename.com", "352", "€122.67", "€12.2", <a href='#' style={{ color: 'rgb(36, 99, 188)', textDecoration: 'none', cursor: 'pointer' }}>Go to store</a>, <a href='#' style={{ color: 'rgb(36, 99, 188)', textDecoration: 'none', cursor: 'pointer' }}>View details</a>],
        ["www.storename.com", "352", "€122.67", "€12.2", <a href='#' style={{ color: 'rgb(36, 99, 188)', textDecoration: 'none', cursor: 'pointer' }}>Go to store</a>, <a href='#' style={{ color: 'rgb(36, 99, 188)', textDecoration: 'none', cursor: 'pointer' }}>View details</a>],
        ["www.storename.com", "352", "€122.67", "€12.2", <a href='#' style={{ color: 'rgb(36, 99, 188)', textDecoration: 'none', cursor: 'pointer' }}>Go to store</a>, <a href='#' style={{ color: 'rgb(36, 99, 188)', textDecoration: 'none', cursor: 'pointer' }}>View details</a>],
    ];
    const headings = [
        "Store url",
        "Total reductions",
        "Total compensated",
        "Total fees",
        "",
        "",
    ];
    const cols = ["text", "text", "text", "text", "numeric", "numeric",];

    return (
        <div className="container-fluid page_margin" >

            <Page fullWidth>
                <Text variant="headingMd" alignment="start" as="h5">
                    Last Month Statistics
                </Text>
                <div className="impact_cards" style={{ marginTop: '10px' }}>
                    <div className="row">
                        {
                            impactCards.map(([title, button, text]) => (
                                <div className="col-md-3" style={{ marginTop: '10px' }}>  {console.log(title)}
                                    <LegacyCard sectioned title={title} actions={[{ content: <NavLink to='/productFootprints' style={{ color: '#2463bc' }}> {button} </NavLink> }]}>
                                        {text}
                                    </LegacyCard>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="contribution_table" style={{ margin: '50px 0px', }}>
                    <div className="header_table" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <Text variant="headingMd" alignment="start" as="h5">
                            Active App Installations
                        </Text>
                    </div>
                    <div className='row' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div className="col-md-6 dashboard-search">
                            <TextField 
                                placeholder='Filter'
                                prefix={<Icon
                                    source={SearchMajor}
                                    color="base"
                                />}
                                value={searchText}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                        </div>
                        <div className="col-md-6" style={{ textAlign: 'right' }}>
                            <Button
                                icon={<Icon
                                    source={SortMinor}
                                    color="base"
                                />} >Sort</Button>
                        </div>
                    </div>
                    <DataTableCommon rows={rows} headings={headings} cols={cols} />
                </div>
            </Page>
        </div>
    );
}



export default Dashboard;
