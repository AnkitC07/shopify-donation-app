import { Layout, Page, Text } from '@shopify/polaris'
import React from 'react'
import { leftCard1, leftCardTitle1, RightCard1 } from '../Common/AppStatusCommon'
import { leftCard2, leftCardTitle2, RightCard2 } from '../Common/SupportCommon'
import DashboardRow from '../Home/DashboardRow'
import RightCard3 from './CheckBoxStyling.jsx'

const Index = () => {

    // Card-3
    const leftCardTitle3 = 'Checkbox Styling';
    const leftCard3 = (
        <p>If you wish to change the look and feel of the default checkbox.</p>
    );



    const homeSections = [
        [leftCardTitle1, leftCard1, RightCard1],
        [leftCardTitle3, leftCard3, RightCard3],
        [leftCardTitle2, leftCard2, RightCard2],
    ]

    return (
        <>
            <div className="container-fluid page_margin" >
                <Page fullWidth>
                    <Text variant="headingXl" alignment="start" as="h4">
                        Settings
                    </Text>
                    <div className="home-pageWrapper" style={{ marginTop: '20px' }}>
                        <Layout >
                            {
                                homeSections.map(card => (
                                    <DashboardRow rowData={card} />
                                ))
                            }

                        </Layout>
                    </div>
                </Page>
            </div>
        </>

    )
}


export default Index