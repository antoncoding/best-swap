import * as CoinSwitchAPI from './api'

const  EXCHANGE_NAME = 'CoinSwitch'

/**
 * 
 * @param {string} from 
 * @param {string} to 
 * @param {number} amount 
 * @param {boolean} fix 
 * @returns {Promise<{amount:number, id:string, exchange: string}>}
 */
export const getExchangeAmount = async (from, to, amount, fix) => {
  try{
    if(fix) {
      const offer = await CoinSwitchAPI.getFixedRates({ depositCoin:from, destinationCoin:to, depositCoinAmount: amount })
      const id = offer.offerReferenceId;
      const destinationAmount = Number(offer.destinationCoinAmount)
      return { amount: destinationAmount, id, exchange: EXCHANGE_NAME }
    } else {
      const { limitMinDepositCoin: minDeposit, limitMaxDepositCoin: maxDeposit, rate, minerFee } = await CoinSwitchAPI.getRates(from, to)
      if (amount < minDeposit) throw new Error(`Min Amount: ${minDeposit}`)
      if (amount > maxDeposit) throw new Error(`Max Amount: ${maxDeposit}`)
      // if (amount < minDeposit || amount > maxDeposit) throw new Error(`CoinSwitch Invalid Amount: must be between ${} and ${maxDeposit}`)
      const destinationAmount = amount * rate - minerFee
      return { amount: destinationAmount, id: '', exchange: EXCHANGE_NAME }
    }
  } catch (error) {
    return { amount: 0, exchange: EXCHANGE_NAME, error }
  }
  
}