import React, { useState } from 'react'

import LastExchangeBox from './LastExchangeBox'
import ExchangeModal from './ExchangeModal'

import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { useAsync } from 'react-async-hook'
import useConstant from 'use-constant'

import {
  RadioList,
  LoadingRing,
  LinkBase,
  Box,
  Split,
  IconArrowDown,
  IconArrowRight,
  IconLock,
  IconUnlock,
  TextInput,
  Field,
  Switch,
  _AutoCompleteSelected as AutoCompleteSelected,
  Button,
} from '@aragon/ui'

import { Changelly } from './Exchanges'

import * as Aggregator from './Exchanges/aggregator'

const getAggregateBestOffer = async (_from, _to, _amount, _fix) => {
  return await Aggregator.getBestOffer(_from, _to, _amount, _fix)
}

const useSearchExchangeAmount = () => {
  // Handle the input text state
  const [from, setFrom] = useState('btc')
  const [to, setTo] = useState('eth')
  const [amount, setAmount] = useState(0)
  const [fixed, setUseFix] = useState(false)
  const [currentOffer, setCurrentOffer] = useState(null)
  const [offers, setOffers] = useState([])

  // Debounce the original search async function
  const debouncedGetOffersOnce = useConstant(() => AwesomeDebouncePromise(getAggregateBestOffer, 300))

  const debouncedGetOffers = useAsync(
    async (from, to, amount, fix) => {
      if (from !== to && amount !== 0) {
        const { offers, bestOffer } = await debouncedGetOffersOnce(from, to, amount, fix)
        setOffers(offers)
        setCurrentOffer(bestOffer)
      }
    },
    // Ensure a new request is made everytime the text changes (even if it's debounced)
    [from, to, amount, fixed]
  )

  // Return everything needed for the hook consumer
  return {
    debouncedGetOffers,

    from,
    to,
    amount,
    fixed,
    offers,
    currentOffer,

    setUseFix,
    setFrom,
    setTo,
    setAmount,
    setOffers,
    setCurrentOffer,
  }
}

export default function Main() {
  const [currencies, updateCurrencies] = useState([])
  // const [address, setAddress] = useState('')
  // const [refundAddress, setRefundAddress] = useState('')
  const [address, setAddress] = useState('0xbAF99eD5b5663329FA417953007AFCC60f06F781')
  const [refundAddress, setRefundAddress] = useState('bc1qjl8uwezzlech723lpnyuza0h2cdkvxvh54v3dn')

  const {
    from,
    setFrom,
    to,
    setTo,
    amount,
    setAmount,
    debouncedGetOffers,
    offers,
    fixed,
    setUseFix,
    currentOffer,
  } = useSearchExchangeAmount()

  const [fresh, setFresh] = useState(true)

  const [minAmountFloat, setMinAmountFloat] = useState(0)
  const [minAmountFixed, setMinAmountFixed] = useState(0)

  // For last Exchange Info Box, only update with
  const [transaction, updateTransaction] = useState({
    from: '',
    to: '',
    amountFrom: 0,
    amountTo: 0,
    payinAddress: '',
    payoutAddress: '',
    payinExtraId: '',
    id: '',
    exchange: 'unkown',
  })

  // Auto Complete search
  const [searchTerm, setSearchTerm] = useState('')
  const [toSearchTerm, setToSearchTerm] = useState('')

  const [selectedFrom, setSelectedFrom] = useState({ symbol: 'btc', label: 'Bitcoin (btc)' })
  const [selectedTo, setSelectedTo] = useState({ symbol: 'eth', label: 'Ethereum (eth)' })

  let handleSwitchFixRate = async useFix => {
    setUseFix(useFix)
  }

  let handleFromCoinChange = async label => {
    setSearchTerm(label)

    const fromObj = currencies.find(coin => coin.label === label)
    setSelectedFrom(fromObj)

    const _from = fromObj.symbol
    setFrom(_from)
    updateMinAmounts(_from, to)
  }

  let handleToCoinChange = async label => {
    setToSearchTerm(label)
    const toObj = currencies.find(coin => coin.label === label)
    setSelectedTo(toObj)
    const _to = toObj.symbol
    setTo(_to)
    updateMinAmounts(from, _to)
  }

  let handleAmountChange = async event => {
    const _amount = event.target.value
    setAmount(_amount)
  }

  const handleAddressChange = async event => {
    setAddress(event.target.value)
  }

  const handleRefundAddressChange = async event => {
    setRefundAddress(event.target.value)
  }

  let updateMinAmounts = async (_from, _to) => {
    const { minAmountFixed, minAmountFloat } = await Changelly.getMinMaxForFloatAndFix(_from, _to)
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
            You Send
          </div>

          {/* <div> */}

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
                      // adornment={}
                      // adornmentPosition='end'
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

          <div style={{ padding: '15px', display: 'flex', justifyContent: 'center' }}>
            {/* <img style={{ width: 25, height: 25 }} alt={`from`} src={`https://cryptoicons.org/api/icon/${from}/25`} /> */}
            <span style={{ paddingLeft: 15, paddingRight: 15 }}>
              {' '}
              <IconArrowDown />{' '}
            </span>

            {/* <img style={{ width: 25, height: 25 }} alt={`${to}`} src={`https://cryptoicons.org/api/icon/${to}/25`} /> */}
            <LinkBase
              style={{ paddingLeft: 25 }}
              onClick={() => {
                setUseFix(!fixed)
              }}
            >
              {fixed ? <IconLock /> : <IconUnlock />}
            </LinkBase>
          </div>

          <Box>
            <Split
              primary={
                <div>
                  <Field label='Offers'>
                    {/* <TextInput
                      type='number'
                      disabled
                      value={currentOffer ? currentOffer.amount : 0}
                      adornment={
                        debouncedGetOffers.loading ? (
                          <LoadingRing />
                        ) : (
                          <img alt={`${to}`} src={`https://cryptoicons.org/api/icon/${to}/25`} />
                        )
                      }
                      adornmentPosition='end'
                    ></TextInput> */}
                    {debouncedGetOffers.loading ? (
                      <LoadingRing />
                    ) : (
                      <RadioList
                        items={
                          offers.length > 0
                            ? offers.map(offer => {
                                return offer.error ?
                                { title: `${offer.amount} ${to.toUpperCase()}`,
                                  description: `${offer.exchange}:  ${offer.error}` } : 
                                { 
                                  title: `${offer.amount} ${to.toUpperCase()}`,
                                  description: `${offer.exchange}` 
                                }
                              })
                            : [{ description: `No ${fixed ? 'fix rate' : 'float rate'} offers ` }]
                        }
                      />
                    )}
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
                    renderSelected={x => <LinkBase disabled>{x.label}</LinkBase>}
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
              currentOffer ? currentOffer.id : '',
              from,
              to,
              amount,
              address,
              refundAddress,
              null, // refundExtraId
              currentOffer ? currentOffer.exchange : '',

              updateTransaction,
              transaction
            )}
          </div>
        </div>
      }
      secondary={LastExchangeBox(transaction)}
    />
  )
}
