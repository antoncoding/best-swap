import * as Changelly from './Changelly/index'
import * as CoinSwitch from './CoinSwitch/index'

export const getBestOffer = async (from, to, amount, fix) => {
  const [ changellyOffer, coinSwitchOffer ] = await Promise.all([
    Changelly.getExchangeAmount(from, to, amount, fix),
    CoinSwitch.getExchangeAmount(from, to, amount, fix)
  ])
  // const changellyOffer = await 
  // const coinSwitchOffer = await CoinSwitch.getExchangeAmount(from, to, amount, fix)
  console.log(`comparing ${changellyOffer.amount} vs ${coinSwitchOffer.amount}`)
  
  if (changellyOffer.amount > coinSwitchOffer.amount) return changellyOffer
  else return coinSwitchOffer
}

export const getMinForPair = async (from, to) => {
  
}