import React, { useState } from 'react'

import AwesomeDebouncePromise from 'awesome-debounce-promise'

import { DropDown, Button, Box, Split, IconArrowDown, TextInput, Field, textStyle } from '@aragon/ui'

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

  const [from, setFrom] = useState('btc')
  const [to, setTo] = useState('eth')

  const [inputValue, setInputValue] = useState(0)
  const [outputValue, setOutputValue] = useState(0)

  const [fresh, setFresh] = useState(true)

  const [, setMinAmountFix] = useState(0)
  const [minAmountFloat, setMinAmountFloat] = useState(0)

  const getExchangeAmount = async (from, to, amount) => {
    const result = await changelly.getExchangeAmount([ {from, to, amount} ])
    return result[0].result
  }

  // const searchAPI = text => fetch('/search?text=' + encodeURIComponent(text));
  const getAmountDebounced = AwesomeDebouncePromise(getExchangeAmount, 1000);

  let handleFromCoinChange = (index, items) => {
    setSelectedFrom(index)

    let _from = currencies[index].name
    setFrom(_from)

    updateMinAmounts(_from, to)
  }

  let handleToCoinChange = (index, items) => {
    setSelectedTo(index)
    let _to = currencies[index].name
    setTo(_to)
    updateMinAmounts(from, _to)
  }

  let handleAmountChange = async event => {
    const amount = event.target.value
    setInputValue(amount)
    const amountIn = await getAmountDebounced(from, to, amount)
    setOutputValue(amountIn)
  }

  let updateMinAmounts = (_from, _to) => {
    changelly.getPairsParams([{ from: _from, to: _to }]).then(pairParams => {
      const param = pairParams[0]
      setMinAmountFix(param.minAmountFixed)
      setMinAmountFloat(param.minAmountFloat)
    })
  }

  let logger = () => {
    console.log(`from ${selectedFrom} - ${from}, to ${selectedTo} - ${to}`)
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
    updateMinAmounts(from, to)
  }

  return (
    <>
      <Box>
        <Split
          primary={
            <>
              <Field label={`Amount (Min:${minAmountFloat})`} required>
                <TextInput
                  type='number'
                  value={inputValue}
                  placeholder='asldkfja'
                  onChange={event => {
                    handleAmountChange(event)
                  }}
                  adornment={<img alt={`${from}`} src={`https://cryptoicons.org/api/icon/${from}/25`} />}
                  adornmentPosition='end'
                ></TextInput>
                <div
                  css={`
                    ${textStyle('title1')};
                  `}
                ></div>
              </Field>

              {/* <Field label='MinAmount'>{minAmountFloat}</Field> */}
            </>
          }
          secondary={
            <>
              <Field label='from'>
                <DropDown items={currencyLabels} selected={selectedFrom} onChange={handleFromCoinChange} />
              </Field>
            </>
          }
        />
      </Box>

      <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
        <IconArrowDown></IconArrowDown>
      </div>
      <Box>
        <Split
          primary={
            <Field label='Amount'>
              <TextInput
                type='number'
                disabled
                value={outputValue}
                adornment={<img alt={`${to}`} src={`https://cryptoicons.org/api/icon/${to}/25`} />}
                adornmentPosition='end'
              ></TextInput>
            </Field>
          }
          secondary={
            <Field label='To'>
              <DropDown items={currencyLabels} selected={selectedTo} onChange={handleToCoinChange} />
            </Field>
          }
        ></Split>
      </Box>

      <Button onClick={logger}> </Button>
    </>
  )
}
