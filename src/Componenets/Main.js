import React, { useState } from 'react'

import LastExchangeBox from './LastExchangeBox'
import ExchangeModal from './ExchangeModal'

import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { useAsync } from 'react-async-hook'
import useConstant from 'use-constant'

import { Box, Split, IconArrowDown, TextInput, Field, Switch, _AutoCompleteSelected as AutoCompleteSelected } from '@aragon/ui'

import { Changelly } from './Exchanges'

const getExchangeAmount = async (_from, _to, _amount, _fix) => {
  return Changelly.getExchangeAmount(_from, _to, _amount, _fix)
}

const useSearchExchangeAmount = () => {
  // Handle the input text state
  const [from, setFrom] = useState('btc')
  const [to, setTo] = useState('eth')
  const [amount, setAmount] = useState(0)

  // Debounce the original search async function
  const debouncedGetExchangeAmountOnce = useConstant(() => AwesomeDebouncePromise(getExchangeAmount, 300))

  const debouncedGetExchangeAmount = useAsync(
    async (from, to, amount, fix) => {
      // If the input is empty, return nothing immediately (without the debouncing delay!)
      if (from === to) {
        console.log(`what up`)
        return [ 0 ]
      }
      // Else we use the debounced api
      else {
        return debouncedGetExchangeAmountOnce(from, to, amount, fix)
      }
    },
    // Ensure a new request is made everytime the text changes (even if it's debounced)
    [from, to, amount]
  )

  // Return everything needed for the hook consumer
  return {
    from,
    to,
    amount,
    setFrom,
    setTo,
    setAmount,
    debouncedGetExchangeAmount,
  }
}

export default function Main() {
  const [currencies, updateCurrencies] = useState([])
  const [address, setAddress] = useState('')
  const [refundAddress, setRefundAddress] = useState('')
  // const [address, setAddress] = useState('0xbAF99eD5b5663329FA417953007AFCC60f06F781')
  // const [refundAddress, setRefundAddress] = useState('bc1qjl8uwezzlech723lpnyuza0h2cdkvxvh54v3dn')

  const { from, setFrom, to, setTo, amount, setAmount, debouncedGetExchangeAmount } = useSearchExchangeAmount()

  const [fresh, setFresh] = useState(true)

  const [minAmountFloat, setMinAmountFloat] = useState(0)
  const [minAmountFixed, setMinAmountFixed] = useState(0)

  // For last Exchange Info Box, only update with
  const [tx_from, update_tx_from] = useState('')
  const [tx_to, update_tx_to] = useState('')
  const [tx_amount_from, update_tx_amount_from] = useState(0)
  const [tx_amount_to, update_tx_amount_to] = useState(0)
  const [payinAddress, update_payinAddress] = useState('')
  const [payoutAddress, update_payoutAddress] = useState('')
  const [payinExtraId, update_payinExtraId] = useState('')
  const [tx_id, update_tx_id] = useState('')
  // const [extraId_name, update_ExtraIdName] = useState('')
  const [fixed, setUseFix] = useState(false)

  // Auto Complete search
  const [searchTerm, setSearchTerm] = useState('')
  const [toSearchTerm, setToSearchTerm] = useState('')

  const [selectedFrom, setSelectedFrom] = useState({ symbol: 'btc', label: 'Bitcoin (btc)' })
  const [selectedTo, setSelectedTo] = useState({ symbol: 'eth', label: 'Ethereum (eth)' })

  let handleSwitchFixRate = useFix => {
    setUseFix(useFix)
    debouncedGetExchangeAmount.execute(from, to, amount, useFix)
    // getExchangeAmount(from, to, amount, useFix)
  }

  let handleFromCoinChange = label => {
    setSearchTerm(label)

    const fromObj = currencies.find(coin => coin.label === label)
    setSelectedFrom(fromObj)

    const _from = fromObj.symbol
    setFrom(_from)
    updateMinAmounts(_from, to)
    debouncedGetExchangeAmount.execute(_from, to, amount, fixed)
  }

  let handleToCoinChange = label => {
    setToSearchTerm(label)
    const toObj = currencies.find(coin => coin.label === label)
    setSelectedTo(toObj)
    const _to = toObj.symbol
    setTo(_to)
    updateMinAmounts(from, _to)
    debouncedGetExchangeAmount.execute(from, _to, amount, fixed)
  }

  let handleAmountChange = async event => {
    setAmount(event.target.value)
  }

  const handleAddressChange = async event => {
    setAddress(event.target.value)
  }

  const handleRefundAddressChange = async event => {
    setRefundAddress(event.target.value)
  }

  let updateMinAmounts = async (_from, _to) => {
    const { minAmountFixed, minAmountFloat } = await Changelly.getMinForFloatAndFix(_from, _to)
    setMinAmountFloat(minAmountFloat)
    setMinAmountFixed(minAmountFixed)
  }

  if (fresh) {
    Changelly.getCurrenciesSymbolAndLabel().then(_currencies => {
      setFresh(false)
      updateCurrencies(_currencies)
    })
    updateMinAmounts(from, to)
  }

  return (
    <Split
      primary={
        <div>
          <div
            style={{ fontSize: 16, paddingBottom: 8, paddingLeft: '21px', paddingRight: 0, textAlign: 'left', color: '#637381' }}
          >
            EXCHANGE
          </div>
          <Box>
            <Split
              primary={
                <>
                  <Field label={`Amount (Min:${fixed ? minAmountFixed : minAmountFloat})`} required>
                    <TextInput
                      type='number'
                      value={amount}
                      onChange={event => {
                        handleAmountChange(event)
                      }}
                      adornment={<img alt={`from`} src={`https://cryptoicons.org/api/icon/${from}/25`} />}
                      adornmentPosition='end'
                    ></TextInput>
                  </Field>

                  <Field label='Refund Address'>
                    <TextInput
                      required
                      wide='true'
                      onChange={handleRefundAddressChange}
                      type='text'
                      value={refundAddress}
                    ></TextInput>
                  </Field>
                </>
              }
              secondary={
                <>
                  <Field label='from'>
                    <AutoCompleteSelected
                      items={currencies
                        .filter(coin => {
                          if (searchTerm) return coin.label.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                          else return true
                        })
                        .map(coin => coin.label)}
                      onChange={setSearchTerm}
                      value={searchTerm}
                      onSelect={handleFromCoinChange}
                      renderSelected={x => <> {x.label} </>}
                      selected={selectedFrom}
                      onSelectedClick={() => {
                        setSelectedFrom(null)
                        setSearchTerm('')
                      }}
                      placeholder='Search To Show More'
                    />
                  </Field>
                </>
              }
            />
          </Box>

          <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
            <IconArrowDown></IconArrowDown>
          </div>

          <Box>
            {/* <span style={{ fontSize: 12, marginBottom: 10, textAlign: 'left', color: '#637381' }}></span> */}
            <div style={{ fontSize: 12, textAlign: 'right', color: '#637381' }}>Fix Rate</div>
            <div style={{ textAlign: 'right', color: '#637381' }}>
              <Switch checked={fixed} onChange={handleSwitchFixRate} />
            </div>
            <Split
              primary={
                <div>
                  <Field label='Amount'>
                    <TextInput
                      type='number'
                      disabled
                      value={ debouncedGetExchangeAmount.result ? debouncedGetExchangeAmount.result.amount : 0}
                      adornment={<img alt={`${to}`} src={`https://cryptoicons.org/api/icon/${to}/25`} />}
                      adornmentPosition='end'
                    ></TextInput>
                  </Field>

                  <Field label='Withdraw Address'>
                    <TextInput required wide='true' onChange={handleAddressChange} type='text' value={address}></TextInput>
                  </Field>
                </div>
              }
              secondary={
                <Field label='To'>
                  <AutoCompleteSelected
                    items={currencies
                      .filter(coin => {
                        if (toSearchTerm) return coin.label.toLowerCase().indexOf(toSearchTerm.toLowerCase()) > -1
                        else return true
                      })
                      .map(coin => coin.label)}
                    onChange={setToSearchTerm}
                    value={toSearchTerm}
                    onSelect={handleToCoinChange}
                    renderSelected={x => <> {x.label} </>}
                    selected={selectedTo}
                    onSelectedClick={() => {
                      setSelectedTo(null)
                      setToSearchTerm('')
                    }}
                    placeholder='Ethereum'
                  />
                </Field>
              }
            ></Split>
          </Box>
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
            {ExchangeModal(
              fixed,
              debouncedGetExchangeAmount.result ? debouncedGetExchangeAmount.result.id : '',
              from,
              to,
              amount,
              address,
              refundAddress,
              null, // refundExtraId
              'changelly',

              update_tx_from,
              update_tx_to,
              update_tx_amount_from,
              update_tx_amount_to,
              update_tx_id,
              update_payoutAddress,
              update_payinAddress,
              update_payinExtraId,
              // update_ExtraIdName,

              payinAddress,
              payoutAddress,
              payinExtraId,
              tx_from,
              tx_to,
              tx_amount_from,
              tx_amount_to,
              tx_id
              // extraId_name,
            )}
          </div>
        </div>
      }
      secondary={LastExchangeBox(tx_from, tx_to, tx_amount_from, tx_amount_to, tx_id, payinAddress, 'changelly')}
    />
  )
}
