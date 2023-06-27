import { Button, HorizontalStack } from '@shopify/polaris';
import ,{ useCallback, useState } from 'react'




const [enabled, setEnabled] = useState(true);
const badgeStatus = enabled ? "active" : "inactive";
const contentStatus = enabled ? "Turn Off" : "Turn On";
const handleToggle = useCallback(() => setEnabled((enabled) => !enabled), []);
// CARD-1
export const leftCardTitle1 = 'App Status';
export const leftCard1 = (
    <p>Activate the compensation checkbox at the cart by enabling the app. If there are issues with the app and your theme, you can disable the app and contact us</p>
);
export const rightCard1 = (
    <HorizontalStack
        gap="12"
        align="space-between"
        blockAlign="start"
        wrap={true}
    >
        <HorizontalStack gap="2" align="start" blockAlign="baseline">
            <label htmlFor={"setting-toggle-uuid"}>
                <p>
                    Emissa app is <b>{badgeStatus}</b>
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
                {contentStatus}
            </Button>
        </HorizontalStack>
    </HorizontalStack>
)
const AppStatusCommon = () => {

    return (
        <div>AppStatusCommon</div>
    )
}

export default AppStatusCommon