import { Changelly } from 'changelly-js'
import { amountCheck } from '../common'

const apiKey = process.env.REACT_APP_APIKey
const apiSecret = process.env.REACT_APP_APISecret
const changelly = new Changelly(apiKey, apiSecret)

const exchange = 'Changelly'

export const getExchangeAmount = async (from, to, amount, fix, limit) => {
  try {
    if (limit) amountCheck(fix, amount, limit)
    if (!fix) {
      const result = await changelly.getExchangeAmount([{ from, to, amount }])
      return {
        amount: Number(result[0].result),
        id: '',
        exchange,
      }
    } else {
      const result = await changelly.getFixRateForAmount([{ from, to, amountFrom: amount }])
      return {
        amount: Number(result[0].amountTo),
        id: result[0].id,
        exchange,
      }
    }
  } catch(error) {
    return { amount:0, exchange, error: error.toString() }
  }
}

export const getMinMaxForPair = async (from, to) => {
  const pairParams = await changelly.getPairsParams([{ from, to }])
  const { minAmountFloat, minAmountFixed, maxAmountFloat, maxAmountFixed } = pairParams[0]
  return {
    minAmountFloat: Number(minAmountFloat),
    minAmountFixed: Number(minAmountFixed),
    maxAmountFloat: maxAmountFloat === null ? Number.MAX_VALUE : Number(maxAmountFloat),
    maxAmountFixed: maxAmountFixed === null ? Number.MAX_VALUE : Number(maxAmountFixed),
    exchange,
  }
  // return { minAmountFloat, minAmountFixed, maxAmountFloat, maxAmountFixed, exchange }
}

export const getCurrenciesSymbolAndLabel = async () => {
  const coins = await changelly.getCurrenciesFull()
  return coins
    .filter(coin => coin.enabled)
    .map(coin => {
      return {
        symbol: coin.name,
        label: `${coin.fullName} (${coin.name})`,
      }
    })
}

export const createTransaction = async (
  fix,
  rateId,
  from,
  to,
  address,
  amount,
  extraId = null,
  refundAddress = null,
  refundExtraId = null
) => {
  if (fix) {
    const tx = await changelly.createFixTransaction(
      from,
      to,
      address,
      rateId,
      refundAddress,
      amount,
      null,
      extraId,
      refundExtraId
    )
    return {
      from: tx.currencyFrom,
      to: tx.currencyTo,
      amountFrom: tx.amountExpectedFrom,
      amountTo: tx.amountExpectedTo,
      id: tx.id,
      payoutAddress: tx.payoutAddress,
      payinAddress: tx.payinAddress,
      payinExtraId: tx.payinExtraId,
      expiration: tx.payTill,
      exchange,
    }
  } else {
    const tx = await changelly.createTransaction(from, to, address, amount, extraId, refundAddress, refundExtraId)
    // const tx = {
    //   currencyFrom: from,
    //   currencyTo: to,
    //   amountExpectedFrom: amount,
    //   amountExpectedTo: '150.2314098712',
    //   id: '123412341234',
    //   payinAddress: 'bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej',
    //   payoutAddress: address,
    //   refundAddress: refundAddress,
    //   payinExtraId: null,
    // }
    return {
      from: tx.currencyFrom,
      to: tx.currencyTo,
      amountFrom: tx.amountExpectedFrom,
      amountTo: tx.amountExpectedTo,
      id: tx.id,
      payoutAddress: tx.payoutAddress,
      payinAddress: tx.payinAddress,
      payinExtraId: tx.payinExtraId,
      exchange,
    }
  }
}

export const getTransactionStatus = async id => {
  return await changelly.getStatus(id)
}
