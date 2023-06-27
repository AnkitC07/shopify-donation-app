import  { useCallback, useState } from 'react'
import {
    Page,
    Layout,
    Text,
    LegacyCard,
    HorizontalStack,
    Button,
    Card,
    AlphaCard,
    Divider,
} from "@shopify/polaris";
import DashboardRow from './DashboardRow';
import { leftCardTitle2, leftCard2, rightCard2 } from '../Common/SupportCommon'
import { leftCardTitle1, leftCard1, rightCard1 } from '../Common/AppStatusCommon'

const Index = () => {






    // CARD-3
    const leftCardTitle3 = 'Billing';
    const leftCard3 = (
        <p>All charges will appear on your normal Shopity bill, and will be paid through Shopify on a 30-day cycle</p>
    );
    const rightCard3 = (
        <div className="card3Wrapper">
            <div className="planName">
                <p><b>Account plan: </b>FREEMIUM</p>
            </div>
            <br />
            <p>You will be charged for the contribution you collected on behalf of your customers through the Emissa app</p>
            <br />
            <p>In addition, a 25% usage fee will be charged on top of each contribution</p>
            <br />
            <div>
                <p style={{ display: 'flex', gap: '10px' }}>
                    <span>
                        <Button plain>
                            Billing history
                        </Button>
                    </span>
                    {' '}
                    <span>
                        <Button plain>
                            Contributions
                        </Button>
                    </span>
                </p>
            </div>
        </div>
    )

    const homeSections = [
        [leftCardTitle1, <leftCard1 />, <rightCard1 />],
        [leftCardTitle2, <leftCard2 />, <rightCard2 />],
        [leftCardTitle3, leftCard3, rightCard3],
    ]

    return (
        <>
            <Page fullWidth>

                <Text variant="headingXl" alignment="start" as="h4">
                    Your customer impact
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
        </>
    )
}

export default Index