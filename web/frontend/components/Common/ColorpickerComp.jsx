import React from 'react'
import {
  ColorPicker,
  hsbToHex,
  Popover,
} from '@shopify/polaris'
import { useState } from 'react'

const ColorpickerComp = ({
  colors,
  state,
  value
}) => {
  const [color, setColor] = useState({
    hue: 1,
    brightness: 0,
    saturation: 39,
  })

  // console.log(hsbToHex(color))
  const [popoverActive, setPopoverActive] = useState(false)

  function handlePopoverClose() {
    setPopoverActive(false)
  }

  function handlePopoverOpen() {
    setPopoverActive(true)
  }
  // console.log(props.state1)

  const rbg = colors

  const activator = (
    <div
      className="kEdTUc"
      onClick={handlePopoverOpen}
      style={{
        height: '36px',
        width: '36px',
        cursor: 'pointer',
        border: '1px solid #AEB4B9',
        borderRadius: '0.3rem',
        background: `${rbg}`,
      }}
    />
  )
  return (
    <div className="Polaris-Connected__Item">
      <Popover
        active={popoverActive}
        activator={activator}
        onClose={handlePopoverClose}
      >
        <Popover.Section>
          <ColorPicker
            onChange={(e) => {
              console.log(value)
              state.setDesign({
                ...state.design,
                [value]: hsbToHex(e)
              })
              setColor(e)
            }}
            color={color}
          />
        </Popover.Section>
      </Popover>
    </div>
  )
}

export default ColorpickerComp
