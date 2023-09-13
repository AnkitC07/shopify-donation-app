import { AlphaCard, Button, HorizontalStack } from "@shopify/polaris";
import { useCallback, useContext, useState } from "react";
import { Toast } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch.js";
import { MainContext } from "../../context/MainContext.jsx";

// CARD-1
export const leftCardTitle1 = "App Status";
export const leftCard1 = (
    <p>
        Activate the compensation checkbox at the cart by enabling the app. If there are issues with the app and your
        theme, you can disable the app and contact us
    </p>
);
export const RightCard1 = () => {
    const { password, enabled, isActive, setEnabled } = useContext(MainContext);
    const fetch = useAuthenticatedFetch();
    // const [enabled, setEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toastProps, setToastProps] = useState({ content: null });
    const toastMarkup = toastProps.content && (
        <Toast {...toastProps} onDismiss={() => setToastProps({ content: null })} />
    );
    const handleToggle = useCallback(async (flag) => {
        setIsLoading(true);
        // setEnabled((enabled) => !enabled)
        let response;
        try {
            console.log("apps Status: ", flag);
            response = await fetch(`/api/appStatus?status=${!flag}`);
            console.log(response);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }

        if (response.ok) {
            setToastProps({ content: "App Status Changed!" });
            setEnabled((enabled) => !enabled);
        } else {
            setToastProps({
                content: "There was an error changing app status",
                error: true,
            });
        }
    }, []);

    return (
        <>
            <AlphaCard>
                {toastMarkup}
                <HorizontalStack gap="12" align="space-between" blockAlign="baseline" wrap={true}>
                    <HorizontalStack gap="2" align="start" blockAlign="baseline">
                        <label htmlFor={"setting-toggle-uuid"}>
                            <p>
                                This app is <b>{enabled ? "activated" : "deactivated"}.</b>
                            </p>
                        </label>
                    </HorizontalStack>
                    <HorizontalStack align="end">
                        <Button
                            disabled={isActive}
                            destructive={enabled}
                            role="switch"
                            id="setting-toggle-1"
                            ariaChecked={enabled ? "true" : "false"}
                            onClick={() => handleToggle(enabled)}
                            loading={isLoading}
                            // size="slim"
                        >
                            {enabled ? "Deactivate" : "Activate"}
                        </Button>
                    </HorizontalStack>
                </HorizontalStack>
            </AlphaCard>
        </>
    );
};
