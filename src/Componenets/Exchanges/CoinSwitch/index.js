import * as CoinSwitchAPI from './api'
import { amountCheck } from '../common'

const exchange = 'CoinSwitch'

/**
 * 
 * @param {string} from 
 * @param {string} to 
 * @param {number} amount 
 * @param {boolean} fix 
 * @param {{}} limit
 * @returns {Promise<{amount:number, id:string, exchange: string}>}
 */
export const getExchangeAmount = async (from, to, amount, fix, limit) => {
  try{
    if(limit) amountCheck(fix, amount, limit)
    if(fix) {
      const offer = await CoinSwitchAPI.getFixedRates({ depositCoin:from, destinationCoin:to, depositCoinAmount: amount })
      const id = offer.offerReferenceId;
      const destinationAmount = Number(offer.destinationCoinAmount)
      return { amount: destinationAmount, id, exchange }
    } else {
      const { limitMinDepositCoin: minDeposit, limitMaxDepositCoin: maxDeposit, rate, minerFee }
        = await CoinSwitchAPI.getRates(from, to)
      if (amount < minDeposit) throw new Error(`Min Amount: ${minDeposit}`)
      if (amount > maxDeposit) throw new Error(`Max Amount: ${maxDeposit}`)
      // if (amount < minDeposit || amount > maxDeposit) throw new Error(`CoinSwitch Invalid Amount: must be between ${} and ${maxDeposit}`)
      const destinationAmount = amount * rate - minerFee
      return { amount: destinationAmount, id: '', exchange }
    }
  } catch (error) {
    return { amount: 0, exchange, error: error.toString() }
  }
}

export const getMinMaxForPair = async (from, to) => {
  try {
    const [floatResult, fixResult] = await Promise.all([
      CoinSwitchAPI.getRates(from, to),
      CoinSwitchAPI.getFixedPairs(from, to)
    ]) 
    const { limitMinDepositCoin: minAmountFloat, limitMaxDepositCoin: maxAmountFloat } =  floatResult
    const { limitMinDepositCoin: minAmountFixed, limitMaxDepositCoin: maxAmountFixed } = fixResult[0]

    return { minAmountFloat, maxAmountFloat, minAmountFixed, maxAmountFixed, exchange }
    
  } catch (error) {
    return { error, exchange }
  }
}