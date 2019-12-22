import * as Changelly from './Changelly/index'
import * as CoinSwitch from './CoinSwitch/index'

export const getBestOffer = async (from, to, amount, fix, limits) => {
  console.log(`with limit`, limits)
  const offers = await Promise.all([
    Changelly.getExchangeAmount(from, to, amount, fix),
    CoinSwitch.getExchangeAmount(from, to, amount, fix)
  ])
  
  let bestOffer = offers[0]
  for(let offer of offers.slice(1)) {
    if(offer.amount > bestOffer.amount)
    bestOffer = offer
  }
  console.log(`Best offer found: ${JSON.stringify(bestOffer)}`)

  return { offers, bestOffer }
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