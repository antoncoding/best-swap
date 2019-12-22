import * as Changelly from './Changelly/index'
import * as CoinSwitch from './CoinSwitch/index'

export const getBestOffer = async (from, to, amount, fix, limits) => {
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

  const validLimits = limits.filter(limit => !limit.error)

  const minAmountFloat = Math.min(...validLimits.map(limit=>Number(limit.minAmountFloat)))
  const minAmountFixed = Math.min(...validLimits.map(limit=>Number(limit.minAmountFixed)))

  return { limits, minAmountFixed, minAmountFloat };
}