import React, { useState } from 'react'

import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { useAsync } from 'react-async-hook';
import useConstant from 'use-constant'

import { DropDown, Button, Box, Split, IconArrowDown, TextInput, Field, textStyle } from '@aragon/ui'

// import { apiKey, apiSecret } from '../config'
import { Changelly } from 'changelly-js'

const apiKey = process.env.REACT_APP_APIKey
const apiSecret = process.env.REACT_APP_APISecret

const changelly = new Changelly(apiKey, apiSecret)

const getExchangeAmount = async (_from, _to, _amount) => {
  const result = await changelly.getExchangeAmount([ {from: _from, to: _to, amount: _amount} ])
  return result[0].result
}

const useSearchExchangeAmount = () => {
  // Handle the input text state
  const [from, setFrom] = useState('btc');
  const [to, setTo] = useState('eth');
  const [amount, setAmount] = useState(0)

  // Debounce the original search async function
  const debouncedGetExchangeAmount = useConstant(() =>
    AwesomeDebouncePromise(getExchangeAmount, 300)
  );

  const search = useAsync(
    async (from, to, amount) => {
      // If the input is empty, return nothing immediately (without the debouncing delay!)
      if (from === to) {
        return [0];
      }
      // Else we use the debounced api
      else {
        return debouncedGetExchangeAmount(from, to, amount);
      }
    },
    // Ensure a new request is made everytime the text changes (even if it's debounced)
    [from, to, amount]
  );

  // Return everything needed for the hook consumer
  return {
    from, to, amount, setFrom, setTo, setAmount, search,
  };
};

export default function Switch() {
  const [currencies, updateCurrencies] = useState([])
  const [currencyLabels, undateLabels] = useState([])

  const [selectedFrom, setSelectedFrom] = useState(0)
  const [selectedTo, setSelectedTo] = useState(1)

  const { from, setFrom, to, setTo, amount, setAmount, search  } = useSearchExchangeAmount()

  
  const [fresh, setFresh] = useState(true)

  const [minAmountFloat, setMinAmountFloat] = useState(0)

  let handleFromCoinChange = (index, items) => {
    setSelectedFrom(index)

    let _from = currencies[index].name
    setFrom(_from)

    updateMinAmounts(_from, to)
    search.execute(_from, to, amount)
  }

  let handleToCoinChange = (index, items) => {
    setSelectedTo(index)
    let _to = currencies[index].name
    setTo(_to)
    updateMinAmounts(from, _to)
    search.execute(from, _to, amount)
  }

  let handleAmountChange = async event => {
    setAmount(event.target.value)
  }

  let updateMinAmounts = (_from, _to) => {
    changelly.getPairsParams([{ from: _from, to: _to }]).then(pairParams => {
      const param = pairParams[0]
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
                  value={amount}
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
                value={search.result || 0}
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
