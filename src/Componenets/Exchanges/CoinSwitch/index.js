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
    amountCheck(fix, amount, limit)
    if(fix) {
      const offer = await CoinSwitchAPI.getFixedRates({ depositCoin:from, destinationCoin:to, depositCoinAmount: amount })
      const id = offer.offerReferenceId;
      const destinationAmount = Number(offer.destinationCoinAmount)
      return { amount: destinationAmount, id, exchange }
    } else {
      const { rate, minerFee } = await CoinSwitchAPI.getRates(from, to)
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
    const { limitMinDepositCoin: minAmountFloat, limitMaxDepositCoin: maxAmountFloat } = floatResult
    
    /** In CoinSwitch, it's possible that fix rate not supported but float rate supported */
    if (!fixResult[0].error) {
      const { limitMinDepositCoin: minAmountFixed, limitMaxDepositCoin: maxAmountFixed } = fixResult[0]
      return { minAmountFloat, maxAmountFloat, minAmountFixed, maxAmountFixed, exchange }
    } else {
      return { minAmountFloat, maxAmountFloat, fixError: fixResult[0].error }
    }
  } catch (error) {
    return { error, exchange }
  }
}

export const createOrder = async (
  fix,
  rateId,
  from,
  to,
  amount,
  address,
  extraId = null,
  refundAddress = null,
  refundExtraId = null
) => {
  if (fix) {
    const tx = await CoinSwitchAPI.createFixOrder( rateId, from, to, amount, address, extraId, refundAddress, refundExtraId )
    return {
      from,
      to,
      payoutAddress: address,
      amountFrom: tx.expectedDepositCoinAmount,
      amountTo: tx.expectedDestinationCoinAmount,
      id: tx.orderId,
      payinAddress: tx.exchangeAddress.address,
      payinExtraId: tx.exchangeAddress.tag,
      exchange,
    }
  } else {
    const tx = await CoinSwitchAPI.createOrder(from, to,  amount, address, extraId, refundAddress, refundExtraId)
    
    return {
      from,
      to,
      payoutAddress: address,
      amountFrom: tx.expectedDepositCoinAmount,
      amountTo: tx.expectedDestinationCoinAmount,
      id: tx.orderId,
      payinAddress: tx.exchangeAddress.address,
      payinExtraId: tx.exchangeAddress.tag,
      exchange,
    }
  }
}

export const getOrderStatus = async id => {
  const order = await CoinSwitchAPI.getOrderStatus(id)
  return order.status
}