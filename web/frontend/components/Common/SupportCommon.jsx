import { Button, HorizontalStack } from '@shopify/polaris';

export const leftCardTitle2 = 'Support';
export const leftCard2 = (
    <p>In case you need help, you can contact our support</p>
);
export const rightCard2 = (
    <HorizontalStack
        gap="12"
        align="space-between"
        blockAlign="start"
        wrap={true}
    >
        <HorizontalStack gap="2" align="start" blockAlign="baseline">
            <label htmlFor={"setting-toggle-2"}>
                <p>
                    Need help?
                </p>
            </label>
        </HorizontalStack>
        <HorizontalStack align="end">
            <Button plain
            >
                Contact Support
            </Button>
        </HorizontalStack>
    </HorizontalStack>
)
const SupportCommon = () => {
    // CARD-2

    return (
        <div>SupportCommon</div>
    )
}

export default SupportCommon