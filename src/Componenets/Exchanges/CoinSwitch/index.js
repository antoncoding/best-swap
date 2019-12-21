import * as CoinSwitchAPI from './api'

const  EXCHANGE_NAME = 'coinswitch'

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
      if (amount < minDeposit || amount > maxDeposit) throw new Error(`CoinSwitch Invalid Amount: must be between ${minDeposit} and ${maxDeposit}`)
      const destinationAmount = amount * rate - minerFee
      return { amount: destinationAmount, id: '', exchange: EXCHANGE_NAME }
    }
  } catch (error) {
    console.error(error)
    return { amount: 0 }
  }
  
}