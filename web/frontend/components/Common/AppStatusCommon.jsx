import { AlphaCard, Button, HorizontalStack, Toast } from '@shopify/polaris';
import { useCallback, useState } from 'react'
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch.js";






// CARD-1
export const leftCardTitle1 = 'App Status';
export const leftCard1 = (
    <p>Activate the compensation checkbox at the cart by enabling the app. If there are issues with the app and your theme, you can disable the app and contact us</p>
);
export const RightCard1 = () => {
    const fetch = useAuthenticatedFetch();
    const [enabled, setEnabled] = useState(true);
    const [toastProps, setToastProps] = useState({ content: null });
    const toastMarkup = toastProps.content && (
        <Toast {...toastProps} onDismiss={() => setToastProps({ content: null })} />
    );

    const handleToggle = useCallback(async () => {
        setEnabled((enabled) => !enabled)
        // let response
        // try {
        //     response = await fetch(`/api/appStatus?status=${!enabled}`);
        //     console.log(response)
        // } catch (error) {
        //     console.log(error)
        // }

        // if (response.ok) {
        //     setToastProps({ content: "App Status Changed!" });
        //     setEnabled((enabled) => !enabled)
        // } else {
        //     setToastProps({
        //         content: "There was an error changing app status",
        //         error: true,
        //     });
        // }


    }, []);

    return (
        <>
            <AlphaCard>
                {toastMarkup}
                <HorizontalStack
                    gap="12"
                    align="space-between"
                    blockAlign="baseline"
                    wrap={true}
                >
                    <HorizontalStack gap="2" align="start" blockAlign="baseline">
                        <label htmlFor={"setting-toggle-uuid"}>
                            <p>
                                This app is <b>{enabled ? "activated" : "deactivated"}.</b>
                            </p>
                        </label>
                    </HorizontalStack>
                    <HorizontalStack align="end">
                        <Button
                            destructive={enabled}
                            role="switch"
                            id="setting-toggle-1"
                            ariaChecked={enabled ? "true" : "false"}
                            onClick={handleToggle}
                        // size="slim"
                        >
                            {enabled ? "Deactivate" : "Activate"}
                        </Button>
                    </HorizontalStack>
                </HorizontalStack >
            </AlphaCard>
        </>
    )
}
