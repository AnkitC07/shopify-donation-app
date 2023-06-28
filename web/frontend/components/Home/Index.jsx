import { useCallback, useState } from 'react'
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
import { leftCardTitle2, leftCard2, RightCard2 } from '../Common/SupportCommon'
import { leftCardTitle1, leftCard1, RightCard1 } from '../Common/AppStatusCommon'


const Index = () => {
    const [enabled, setEnabled] = useState(true);
    const badgeStatus = enabled ? "active" : "inactive";
    const contentStatus = enabled ? "Turn Off" : "Turn On";
    const handleToggle = useCallback(() => setEnabled((enabled) => !enabled), []);

    // CARD-1
    // const leftCardTitle1 = 'App Status';
    // const leftCard1 = (
    //     <p>Activate the compensation checkbox at the cart by enabling the app. If there are issues with the app and your theme, you can disable the app and contact us</p>
    // );
    // const rightCard1 = (
    //     <HorizontalStack
    //         gap="12"
    //         align="space-between"
    //         blockAlign="start"
    //         wrap={true}
    //     >
    //         <HorizontalStack gap="2" align="start" blockAlign="baseline">
    //             <label htmlFor={"setting-toggle-uuid"}>
    //                 <p>
    //                     Emissa app is <b>{badgeStatus}</b>
    //                 </p>
    //             </label>
    //         </HorizontalStack>
    //         <HorizontalStack align="end">
    //             <Button
    //                 destructive
    //                 role="switch"
    //                 id="setting-toggle-1"
    //                 ariaChecked={enabled ? "true" : "false"}
    //                 onClick={handleToggle}
    //                 size="slim"
    //             >
    //                 {contentStatus}
    //             </Button>
    //         </HorizontalStack>
    //     </HorizontalStack>
    // )

    // CARD-2
    // const leftCardTitle2 = 'Support';
    // const leftCard2 = (
    //     <p>In case you need help, you can contact our support</p>
    // );
    // const rightCard2 = (
    //     <HorizontalStack
    //         gap="12"
    //         align="space-between"
    //         blockAlign="start"
    //         wrap={true}
    //     >
    //         <HorizontalStack gap="2" align="start" blockAlign="baseline">
    //             <label htmlFor={"setting-toggle-2"}>
    //                 <p>
    //                     Need help?
    //                 </p>
    //             </label>
    //         </HorizontalStack>
    //         <HorizontalStack align="end">
    //             <Button plain
    //             >
    //                 Contact Support
    //             </Button>
    //         </HorizontalStack>
    //     </HorizontalStack>
    // )



    // CARD-3
    const leftCardTitle3 = 'Billing';
    const leftCard3 = (
        <p>All charges will appear on your normal Shopity bill, and will be paid through Shopify on a 30-day cycle</p>
    );


    const homeSections = [
        [leftCardTitle1, leftCard1, RightCard1],
        [leftCardTitle2, leftCard2, RightCard2],
        [leftCardTitle3, leftCard3, RightCard3],
    ]

    return (
        <>
            <Page fullWidth>
                <Text variant="headingXl" alignment="start" as="h4">
                    Emissa dashboard overview
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



const RightCard3 = () => {

    return (
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
}

export default Index