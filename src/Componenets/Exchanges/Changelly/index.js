import { Changelly } from 'changelly-js'

const apiKey = process.env.REACT_APP_APIKey
const apiSecret = process.env.REACT_APP_APISecret

const changelly = new Changelly(apiKey, apiSecret)

export const getExchangeAmount = async (from, to, amount, fix) => {
  if (!fix) {
    const result = await changelly.getExchangeAmount([{ from, to, amount }])
    return { amount: Number(result[0].result), id: '' }
  } else {
    const result = await changelly.getFixRateForAmount([{ from, to, amountFrom: amount }])
    return { amount: Number(result[0].amountTo), id: result[0].id }
  }
}

export const getMinMaxForFloatAndFix = async (from, to) => {
  const pairParams = await changelly.getPairsParams([{ from, to }])
  const { minAmountFloat, minAmountFixed, maxAmountFloat, maxAmountFixed } = pairParams[0]
  return { minAmountFloat, minAmountFixed, maxAmountFloat, maxAmountFixed }
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
    return await changelly.createFixTransaction(
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
  } else {
    return await changelly.createTransaction(from, to, address, amount, extraId, refundAddress, refundExtraId)
  }
}

export const getTransactionStatus = async (id) => {
  return await changelly.getStatus(id);
}