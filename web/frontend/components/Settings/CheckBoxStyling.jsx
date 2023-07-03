import { Button, ButtonGroup, FormLayout, HorizontalStack, Layout, LegacyCard, Select, Text, TextField, VerticalStack } from '@shopify/polaris'
import React, { useCallback } from 'react'
import { useState } from 'react'
import ColorpickerComp from '../Common/ColorpickerComp'
import Colorpicker from '../Common/ColorpickerComp'

const CheckBoxStyling = () => {

    const [design, setDesign] = useState({
        fontFamily: 'default',
        fontColor: '#000000',
        borderColor: '#d1d1d1'
    })

    const handleSelectChange = useCallback(
        (value) => setDesign({
            ...design,
            fontFamily: value,
        }),
        [],
    );
    const fontOption = [
        {
            value: "auto",
            label: "Use your theme fonts",
        },
        {
            value: "sans-serif",
            label: "Sans Serif",
        },
        {
            value: "Helvetica",
            label: "Helvetica",
        },
        {
            value: "Tahoma",
            label: "Tahoma",
        },
        {
            value: "Trebuchet MS",
            label: "Trebuchet MS",
        },
        {
            value: "Times New Roman",
            label: "Times New Roman",
        },
        {
            value: "Georgia",
            label: "Georgia",
        },
        {
            value: "Garamond",
            label: "Garamond",
        },
        {
            value: "Courier New",
            label: "Courier New",
        },
    ];



    return (
        <div className="stylingCard_wrapper">
            <LegacyCard title="Preview">
                <LegacyCard.Section >
                    <div style={{
                        background: "#E5E5E5",
                        padding: "10px",
                    }}>
                        <div className="checkbox_wrapper" style={{
                            position: 'relative',
                        }}>
                            <div
                                className="left_checkbox"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 10,
                                    border: `1px solid ${design.borderColor}`,
                                    padding: "10px 15px",
                                    background: "#fff",
                                    fontFamily: design.fontFamily,
                                    color: design.fontColor
                                }}
                            >
                                <svg
                                    width={36}
                                    height={36}
                                    viewBox="0 0 40 40"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M20 36.6667V25L16.6667 21.6667"
                                        stroke="#53964D"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M28.3333 13.3333V14.6667C30.2709 15.7787 31.7802 17.5075 32.6207 19.5773C33.4612 21.6472 33.5844 23.9388 32.9707 26.0869C32.357 28.2349 31.0417 30.1155 29.2345 31.4289C27.4274 32.7423 25.2326 33.4127 23 33.3333H16.6667C14.3816 33.1782 12.2044 32.3028 10.448 30.8329C8.69151 29.3631 7.44609 27.3743 6.8906 25.1524C6.33511 22.9304 6.49813 20.5895 7.35624 18.466C8.21436 16.3425 9.72342 14.5456 11.6667 13.3333C11.6667 11.1232 12.5446 9.00358 14.1074 7.44078C15.6702 5.87797 17.7899 5 20 5C22.2101 5 24.3298 5.87797 25.8926 7.44078C27.4554 9.00358 28.3333 11.1232 28.3333 13.3333Z"
                                        stroke="#53964D"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M23.3333 23.3333L20 26.6667"
                                        stroke="#53964D"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div style={{ marginRight: 15 }}>
                                    <div style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
                                        <h4
                                            style={{
                                                margin: 0,
                                                fontSize: 14,
                                                fontWeight: 600
                                            }}
                                        >
                                            Reduce carbon footprint
                                        </h4>
                                        <div className="tooltip">
                                            <svg
                                                width={16}
                                                height={16}
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M8.75 8.75H7.25V8.639C7.25 7.982 7.4795 7.51475 8 7.25C8.28875 7.10375 8.75 6.824 8.75 6.5C8.75 6.08675 8.414 5.75 8 5.75C7.586 5.75 7.25 6.08675 7.25 6.5H5.75C5.75 5.2595 6.7595 4.25 8 4.25C9.2405 4.25 10.25 5 10.25 6.5C10.25 8 8.75 8.12375 8.75 8.75ZM7.25 11.75H8.75V10.25H7.25V11.75ZM8 2C4.6865 2 2 4.6865 2 8C2 11.3135 4.6865 14 8 14C11.3135 14 14 11.3135 14 8C14 4.6865 11.3135 2 8 2Z"
                                                    fill="#5C5F62"
                                                />
                                            </svg>
                                            <span className="tooltiptext">
                                                By reducing the carbon footprint of your purchase, <b> 100% </b> of your compensation is used to finance tree planting projects near you. Want to know more? Read through our process with full transparency and track our live climate mitigation projects at <span style={{ color: '#56B280' }}> www.emissa.eu.</span>
                                            </span>
                                        </div>
                                    </div>
                                    <p
                                        style={{
                                            margin: "3px 0px 0px 0px",
                                            fontSize: "9.5px",
                                            color: "#5B5B5B"
                                        }}
                                    >
                                        Offset 1.62 kg CO2 with
                                        <span style={{ color: "#53964D" }}>Emissa</span>
                                    </p>
                                </div>
                                <div
                                    className="check_custom"
                                    style={{ display: "flex", alignItems: "center" }}
                                >
                                    <span style={{ fontSize: 12, textAlign: "right" }}>€0.68</span>
                                    <input
                                        type="checkbox"
                                        name="footprint"
                                        id="reduce"
                                        style={{ accentColor: "#5a9d76", marginLeft: 5, height: 24, width: 15 }}
                                        onclick="test()"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                </LegacyCard.Section>

                <LegacyCard.Section>
                    {/* <Layout fullWidth> */}

                    <VerticalStack gap="8">

                        <VerticalStack gap="2">
                            <Text as="p" fontWeight="bold">
                                Font family
                            </Text>
                            <HorizontalStack gap="1">
                                <div className="styleInput" style={{ width: '100%' }}>
                                    <Select
                                        options={fontOption}
                                        onChange={handleSelectChange}
                                        value={design.fontFamily}
                                    />
                                </div>
                            </HorizontalStack>
                        </VerticalStack>

                        <VerticalStack gap="2">
                            <Text as="p" fontWeight="bold">
                                Font Color
                            </Text>
                            <HorizontalStack gap="1" wrap={false}>

                                <ColorpickerComp
                                    colors={design.fontColor}
                                    state={{ setDesign, design }}
                                    value={'fontColor'}
                                />
                                <div className="styleInput" style={{ width: '100%' }}>
                                    <TextField
                                        placeholder="000000"
                                        value={design.fontColor.replace('#', "")}
                                        onChange={(e) => {
                                            setDesign({
                                                ...design,
                                                fontColor: '#' + e,
                                            });
                                        }}
                                        prefix="#"
                                        autoComplete="off"
                                    />
                                </div>
                            </HorizontalStack>
                        </VerticalStack>


                        <VerticalStack gap="2">
                            <Text as="p" fontWeight="bold">
                                Border Color
                            </Text>
                            <HorizontalStack gap="1" wrap={false}>
                                <ColorpickerComp
                                    colors={design.borderColor}
                                    state={{ setDesign, design }}
                                    value={'borderColor'}
                                />
                                <div className="styleInput" style={{ width: '100%' }}>
                                    <TextField
                                        placeholder="default"
                                        value={design.borderColor.replace('#', "")}
                                        onChange={(e) => {
                                            setDesign({
                                                ...design,
                                                borderColor: '#' + e,
                                            });
                                        }}
                                        prefix="#"
                                        autoComplete="off"
                                    />
                                </div>
                            </HorizontalStack>
                        </VerticalStack>
                        <HorizontalStack align='end'>
                            <ButtonGroup >
                                <Button>Cancel</Button>
                                <Button primary>Save</Button>
                            </ButtonGroup>
                        </HorizontalStack>

                    </VerticalStack>
                    {/* </Layout> */}
                </LegacyCard.Section>
            </LegacyCard>
        </div>
    )
}

export default CheckBoxStyling