import React, { Component, useState } from 'react'

// import { Button, FormControl, TextField, Grid } from '@material-ui/core'

import { DropDown, Button, Box, Split, IconArrowDown, TextInput, Accordion } from '@aragon/ui'

// import { apiKey, apiSecret } from '../config'
import { Changelly } from 'changelly-js'

const apiKey = process.env.REACT_APP_APIKey
const apiSecret = process.env.REACT_APP_APISecret

const changelly = new Changelly(apiKey, apiSecret)
export default function Switch() {
  const [currencies, updateCurrencies] = useState([])
  const [currencyLabels, undateLabels] = useState([])

  const [selectedFrom, setSelectedFrom] = useState(0)
  const [selectedTo, setSelectedTo] = useState(1)

  const [inputValue, setInputValue] = useState(0)
  const [outputValue, setoutputValue] = useState(0)

  const [fresh, setFresh] = useState(true)

  let handleFromChange = event => {
    setInputValue(event.target.value)
  }

  if (fresh) {
    changelly.getCurrenciesFull().then(coins => {
      setFresh(false)

      let enabled = coins.filter(coin => coin.enabled)
      updateCurrencies(enabled)

      let labels = enabled.map(coin => {
        return `${coin.fullName} (${coin.name})`
      })
      undateLabels(labels)
    })
  }

  return (
    <>
      <Box>
        <Split
          primary={
            <>
              <TextInput.Number
                value={inputValue}
                onChange={event => {
                  handleFromChange(event.target.value)
                }}
              ></TextInput.Number>
            </>
          }
          secondary={<DropDown items={currencyLabels} selected={selectedFrom} onChange={setSelectedFrom} />}
        />
      </Box>

      <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
        <IconArrowDown></IconArrowDown>
      </div>
      <Box>
        <Split
          primary={<TextInput.Number disabled value={outputValue}></TextInput.Number>}
          secondary={<DropDown items={currencyLabels} selected={selectedTo} onChange={setSelectedTo} />}
        ></Split>
      </Box>
    </>
  )
}
