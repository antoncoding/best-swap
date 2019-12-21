import * as Changelly from './Changelly/index'
import * as CoinSwitch from './CoinSwitch/index'

export const getBestOffer = async (from, to, amount, fix) => {
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

export const getMinForPair = async (from, to) => {
  const [ changellyMinMax, coinSwitchMinMax ] = await Promise.all([
    Changelly.getMinMaxForFloatAndFix(from, to)

  ])
}