import * as Changelly from './Changelly/index'
import * as CoinSwitch from './CoinSwitch/index'

export const getBestOffer = async (from, to, amount, fix, limits) => {
  // console.log(`[GET] get best offer with ${from}, ${to}, ${amount} limits`, limits)
  const offers = await Promise.all([
    Changelly.getExchangeAmount(from, to, amount, fix, limits[0]),
    CoinSwitch.getExchangeAmount(from, to, amount, fix, limits[1]),
  ])
  
  let bestOfferIndex = 0
  let bestOffer = offers[0].amount
  for(let i=0; i<offers.length; i++) {
    if(offers[i].amount > bestOffer)
    bestOfferIndex = i
    bestOffer = offers[i].amount

  }
  
  return { offers, bestOfferIndex }
}

export const getLimitsForPair = async (from, to) => {
  const limits = await Promise.all([
    Changelly.getMinMaxForPair(from, to),
    CoinSwitch.getMinMaxForPair(from, to)
  ])
  const validFloatLimits = limits.filter(limit => !limit.error && !limit.floatError)
  const validFixedLimits = limits.filter(limit => !limit.error && !limit.fixError)

  const minAmountFloat = Math.min(...validFloatLimits.map(limit=>Number(limit.minAmountFloat)))
  const minAmountFixed = Math.min(...validFixedLimits.map(limit=>Number(limit.minAmountFixed)))

  return { limits, minAmountFixed, minAmountFloat };
}

export const createTransaction = async (exchange, fix, rateId, from, to, amount, address, extraId = null, refundAddress = null, refundExtraId = null) => {
  switch (exchange) {
    case 'Changelly': {
      return await Changelly.createTransaction(fix, rateId, from, to, amount, address, extraId, refundAddress, refundExtraId)
    } 
    case 'CoinSwitch': {
      return await CoinSwitch.createOrder(fix, rateId, from, to, amount, address, extraId, refundAddress, refundExtraId)
    }
    default: {
      throw new Error(`${exchange} transaction not supported yet`);
    }
  }
}

export const getTransactionStatus = async (exchange, id) => {
  switch(exchange) {
    case 'Changelly': {
      return await Changelly.getTransactionStatus(id)
    } 
    case 'CoinSwitch': {
      return await CoinSwitch.getOrderStatus(id)
    }
    default: {
      throw new Error(`${exchange} transaction not supported yet`);
    }
  }
}