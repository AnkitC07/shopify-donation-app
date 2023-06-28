import { AlphaCard, Divider, Layout, LegacyCard } from '@shopify/polaris'
import React from 'react'

const DashboardRow = ({ rowData }) => {
    const [leftCardTitle, leftCard, RightCard,] = rowData
    return (
        <>
            {/* <Layout.Section> */}
            <div style={{ width: '100%' }}>
                <div className="row" style={{ alignItems: "center" }}>
                    <div className="col-md-6">
                        <div className="left-card-layout">
                            <LegacyCard title={leftCardTitle} sectioned>
                                {leftCard}
                            </LegacyCard>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="right-card-layout">
                            <AlphaCard>
                                <RightCard />
                            </AlphaCard>
                        </div>
                    </div>
                </div>
                <div style={{ margin: '15px' }}>
                    <Divider />
                </div>
            </div>
            {/* </Layout.Section> */}
        </>
    )
}

export default DashboardRow