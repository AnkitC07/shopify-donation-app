import { Button, HorizontalStack } from '@shopify/polaris';
import { useCallback, useState } from 'react'





// CARD-1
export const leftCardTitle1 = 'App Status';
export const leftCard1 = (
    <p>Activate the compensation checkbox at the cart by enabling the app. If there are issues with the app and your theme, you can disable the app and contact us</p>
);
export const RightCard1 = () => {
    const [enabled, setEnabled] = useState(true);
    const handleToggle = useCallback(() => setEnabled((enabled) => !enabled), []);

    return (
        <HorizontalStack
            gap="12"
            align="space-between"
            blockAlign="start"
            wrap={true}
        >
            <HorizontalStack gap="2" align="start" blockAlign="baseline">
                <label htmlFor={"setting-toggle-uuid"}>
                    <p>
                        Emissa app is <b>{enabled ? "active" : "inactive"}</b>
                    </p>
                </label>
            </HorizontalStack>
            <HorizontalStack align="end">
                <Button
                    destructive
                    role="switch"
                    id="setting-toggle-1"
                    ariaChecked={enabled ? "true" : "false"}
                    onClick={handleToggle}
                    size="slim"
                >
                    {enabled ? "Turn Off" : "Turn On"}
                </Button>
            </HorizontalStack>
        </HorizontalStack >
    )
}
