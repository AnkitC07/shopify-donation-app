import { useCallback, useContext, useRef, useState } from "react";
import { Page, Layout, Text, Button, TextField, AlphaCard, Toast } from "@shopify/polaris";
import { NavLink } from "react-router-dom";

import DashboardRow from "./DashboardRow";
import { leftCardTitle2, leftCard2, RightCard2 } from "../Common/SupportCommon";
import { leftCardTitle1, leftCard1, RightCard1 } from "../Common/AppStatusCommon";
import { PaidFeature } from "./PaidFeature";
import { MainContext } from "../../context/MainContext";
import { useAuthenticatedFetch } from "../../hooks";

const Index = () => {
    // CARD-3
    const leftCardTitle3 = "Billing";
    const leftCard3 = (
        <p>All charges will appear on your normal Shopity bill, and will be paid through Shopify on a 30-day cycle</p>
    );

    // Card-4
    const leftCardTitle4 = "Activation key";
    const leftCard4 = (
        <p>
            In order to use the Emissa App you need to obtain a activation key for you store. Contact info@emissa.eu to
            receive your personal key.
        </p>
    );

    const homeSections = [
        [leftCardTitle1, leftCard1, RightCard1],
        [leftCardTitle4, leftCard4, RightCard4],
        [leftCardTitle2, leftCard2, RightCard2],
        [leftCardTitle3, leftCard3, RightCard3],
    ];

    return (
        <>
            <Page fullWidth>
                <Text variant="headingXl" alignment="start" as="h4">
                    Emissa dashboard overview
                </Text>
                {/* <PaidFeature /> */}
                <div className="home-pageWrapper" style={{ marginTop: "20px" }}>
                    <Layout>
                        {homeSections.map((card) => (
                            <DashboardRow rowData={card} />
                        ))}
                    </Layout>
                </div>
            </Page>
        </>
    );
};

const RightCard3 = () => {
    return (
        <AlphaCard>
            <div className="card3Wrapper">
                <div className="planName">
                    <p>
                        <b>Account plan: </b>FREEMIUM
                    </p>
                </div>
                <br />
                <p>
                    You will be charged for the contribution you collected on behalf of your customers through the
                    Emissa app
                </p>
                <br />
                <p>In addition, a 25% usage fee will be charged on top of each contribution</p>
                <br />
                <div>
                    <p style={{ display: "flex", gap: "10px" }}>
                        <span>
                            <NavLink to="/billingHistory">
                                <Button plain>Billing history</Button>
                            </NavLink>
                        </span>{" "}
                        <span>
                            <NavLink to="/analytics">
                                <Button plain>Contributions</Button>
                            </NavLink>
                        </span>
                    </p>
                </div>
            </div>
        </AlphaCard>
    );
};
const RightCard4 = () => {
    const fetch = useAuthenticatedFetch();
    const { password, setPassword, setIsActive } = useContext(MainContext);
    const [showSave, setShowSave] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const saveButtonRef = useRef(null);
    const handleChange = useCallback((newValue) => setPassword(newValue), []);

    const [toastProps, setToastProps] = useState({ content: null });
    const toastMarkup = toastProps.content && (
        <Toast {...toastProps} onDismiss={() => setToastProps({ content: null })} />
    );
    async function handleSave() {
        setIsLoading(true);
        let response;
        try {
            response = await fetch(`/api/setpassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: password }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("set password response", data);
                if (data.status == 200 && data.password) {
                    setPassword(data.password);
                    setIsActive(false);
                    console.log("Password matched Status Changed!");
                    // setToastProps({ content: "Password matched Status Changed!" });
                } else {
                    console.log("Passsword did not match.");
                    // setToastProps({
                    //     content: "Passsword did not match.",
                    //     error: true,
                    // });
                    // setPassword("");
                }
            } else {
                console.log("Something went wrong");
                // setToastProps({
                //     content: "Something went wrong",
                //     error: true,
                // });
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    }
    return (
        <>
            <AlphaCard>
                {/* {toastMarkup} */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "baseline",
                        width: "100%",
                    }}
                >
                    <div style={{ width: "100%" }}>
                        <TextField
                            onFocus={() => {
                                setShowSave(true);
                            }}
                            onBlur={() => {
                                setShowSave(false);
                                console.log("ref", saveButtonRef);
                            }}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                    </div>
                    {/* {showSave && ( */}
                    <div style={{ textAlign: "end", marginLeft: "10px" }}>
                        <Button ref={saveButtonRef} primary onClick={() => handleSave()}>
                            Save
                        </Button>
                    </div>
                    {/*  )} */}
                </div>
            </AlphaCard>
        </>
    );
};

export default Index;
