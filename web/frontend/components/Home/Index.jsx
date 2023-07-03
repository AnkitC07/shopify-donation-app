import { useCallback, useState } from 'react'
import {
    Page,
    Layout,
    Text,
    Button,
    TextField,
    AlphaCard,
} from "@shopify/polaris";
import { NavLink } from 'react-router-dom';

import DashboardRow from './DashboardRow';
import { leftCardTitle2, leftCard2, RightCard2 } from '../Common/SupportCommon'
import { leftCardTitle1, leftCard1, RightCard1 } from '../Common/AppStatusCommon'
import { PaidFeature } from './PaidFeature';


const Index = () => {

    // CARD-3
    const leftCardTitle3 = 'Billing';
    const leftCard3 = (
        <p>All charges will appear on your normal Shopity bill, and will be paid through Shopify on a 30-day cycle</p>
    );

    // Card-4
    const leftCardTitle4 = 'Activation key';
    const leftCard4 = (
        <p>In order to use the Emissa App you need to obtain a activation key for you store. Contact info@emissa.eu to receive your personal key.</p>
    );


    const homeSections = [
        [leftCardTitle1, leftCard1, RightCard1],
        [leftCardTitle4, leftCard4, RightCard4],
        [leftCardTitle2, leftCard2, RightCard2],
        [leftCardTitle3, leftCard3, RightCard3],
    ]

    return (
        <>
            <Page fullWidth>
                <Text variant="headingXl" alignment="start" as="h4">
                    Emissa dashboard overview
                </Text>
                {/* <PaidFeature /> */}
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
        <AlphaCard>
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
                            <NavLink to="/billingHistory">

                                <Button plain>
                                    Billing history
                                </Button>
                            </NavLink>
                        </span>
                        {' '}
                        <span>
                            <NavLink to="/analytics">
                                <Button plain>
                                    Contributions
                                </Button>
                            </NavLink>
                        </span>
                    </p>
                </div>
            </div>
        </AlphaCard>
    )
}
const RightCard4 = () => {
    const [value, setValue] = useState('');
    const handleChange = useCallback(
        (newValue) => setValue(newValue),
        [],
    );
    return (
        <AlphaCard>
            <TextField
                type="password"
                placeholder="Password"
                value={value}
                onChange={handleChange}
                autoComplete="off"
            />
        </AlphaCard>
    )
}



export default Index