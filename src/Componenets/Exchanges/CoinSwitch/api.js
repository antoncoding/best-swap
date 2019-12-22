const URI_PREFIX = process.env.REACT_APP_CORS_PREFIX || ''
const URI = URI_PREFIX + 'https://api.coinswitch.co/v2/'
console.log(`CoinSwitch: ${URI}`)
const API_KEY = process.env.REACT_APP_COINSWITCH_KEY
// const API_KEY = 'cRbHFJTlL6aSfZ0K2q7nj6MgV5Ih4hbA2fUG0ueO' // sandbox 
if (!API_KEY) throw Error('Missing CoinSwitch APIKey')

/**
 * @returns {Promise<Array<{name: string, symbol: string, parentCode:string | null}>>}
 */
export const getCoins = async () => {
  const coins = await requestCoinSwitch('coins', 'GET')
  const target = coins
    .filter(coin => {
      return coin.isActive && !coin.isFiat
    })
    .map(coin => {
      return {
        name: coin.name,
        symbol: coin.symbol,
        parentCode: coin.parentCode,
      }
    })
  return target
}

/**
 *
 * @param {string | null} depositCoin
 * @param {string |null} destinationCoin
 * @returns {Promise<Array<{depositCoin: string, destinationCoin:string, isActive:boolean}>>}
 */
export const getPairs = async (depositCoin = null, destinationCoin = null) => {
  if (!depositCoin && !destinationCoin) throw new Error('One of depositCoin or destinationCoin need to be specified')
  let params = {}
  if (depositCoin) params.depositCoin = depositCoin
  if (destinationCoin) params.destinationCoin = destinationCoin

  const pairs = await requestCoinSwitch('pairs', 'POST', params)
  return pairs
    .filter(pair => pair.isActive)
    .map(pair => {
      return {
        depositCoin: pair.depositCoin,
        destinationCoin: pair.destinationCoin,
      }
    })
}

/**
 *
 * @param {string} depositCoin
 * @param {string} destinationCoin
 * @returns {Promise<{ rate:number minerFee:number, limitMinDepositCoin:number, limitMaxDepositCoin:number,
 * limitMinDestinationCoin:number, limitMaxDestinationCoin:number }>}
 */
export const getRates = async (depositCoin, destinationCoin) => {
  const params = { depositCoin, destinationCoin }
  const rate = await requestCoinSwitch('rate', 'POST', params)
  return rate
}

/**
 *
 * @param {*} depositCoin
 * @param {*} destinationCoin
 * @returns {Promise<Array<{depositCoin: string, destinationCoin: string, isActive: boolean, limitMinDepositCoin: number,
 * limitMaxDepositCoin: number, limitMinDestinationCoin: number, limitMaxDestinationCoin: number}>>}
 */
export const getFixedPairs = async (depositCoin = null, destinationCoin = null) => {
  if (!depositCoin && !destinationCoin) throw new Error('One of depositCoin or destinationCoin need to be specified')
  let params = {}
  if (depositCoin) params.depositCoin = depositCoin
  if (destinationCoin) params.destinationCoin = destinationCoin

  const pairs = await requestCoinSwitch('fixed/pairs', 'POST', params)
  const result = pairs.filter(pair => pair.isActive)
  if(result.length ===0) return [ { error: 'Fix rate trading of this pair not supported' } ]
  return result
}

/**
 *
 * @param {{ depositCoin:string, destinationCoin:string, depositCoinAmount?:number, destinationCoinAmount?:number }} data
 * @return {Promise<{depositCoin: string, destinationCoin:string, depositCoinAmount: string, destinationCoinAmount: string, offerReferenceId:string, offerExpirationTime:number}>}
 */
export const getFixedRates = async params => {
  const { depositCoinAmount, destinationCoinAmount } = params
  if ((!depositCoinAmount && !destinationCoinAmount) || (depositCoinAmount && destinationCoinAmount))
    throw new Error('Only specify one of depositCoinAmount or destinationCoinAmount')
  const offer = await requestCoinSwitch('fixed/offer', 'POST', params)
  return offer
}

/**
 * Get rate for all pairs
 * @dev Will not return invalid pair, we can use this to filter unsupported coins
 * @param {Array<{depositCoin:string, destinationCoin:string}>} pairs
 * @returns {Promise<Array<{depositCoin: string, destinationCoin: string, rate: number, minerFee: number,
            limitMinDepositCoin: number, limitMaxDepositCoin: number,
            limitMinDestinationCoin: number, limitMaxDestinationCoin: number}>>}
 */
export const getBulkRate = async pairs => {
  return requestCoinSwitch('bulk-rate', 'POST', pairs)
}


/**
 * Float rate order
 * @param {string} depositCoin 
 * @param {string} destinationCoin 
 * @param {number} depositCoinAmount 
 * @param {string} address 
 * @param {string} tag 
 * @param {string} refundAddr
 * @param {string} refundTag 
 */
export const createOrder = async(depositCoin, destinationCoin, depositCoinAmount, address, tag, refundAddr, refundTag) => {
  if (!tag) tag = null
  if (!refundTag) refundTag =null
  const destinationAddress = { address, tag }
  const refundAddress = { address: refundAddr, tag: refundTag }
  const params = { depositCoin, destinationCoin, depositCoinAmount, destinationAddress, refundAddress }
  const order = await requestCoinSwitch('order', 'POST', params)
  return order
}

/**
 * Fix Rate Order
 * @param {string} offerReferenceId 
 * @param {string} depositCoin 
 * @param {string} destinationCoin 
 * @param {number} depositCoinAmount 
 * @param {string} address 
 * @param {string} tag 
 * @param {string} refundAddr 
 * @param {string} refundTag 
 */
export const createFixOrder = async(offerReferenceId, depositCoin, destinationCoin, depositCoinAmount, address, tag, refundAddr, refundTag) => {
  if (!tag) tag = null
  if (!refundTag) refundTag =null
  const destinationAddress = { address, tag }
  const refundAddress = { address: refundAddr, tag: refundTag }
  const params = { offerReferenceId, depositCoin, destinationCoin, depositCoinAmount, destinationAddress, refundAddress }
  const order = await requestCoinSwitch('fixed/order', 'POST', params)
  console.log(order)
  return order
}


export const getOrderStatus = async id => {
  const endpoint = `/order/${id}`
  return await requestCoinSwitch(endpoint, 'GET')
}

const requestCoinSwitch = async (endpoint, method, params) => {
  const url = URI + endpoint
  let options = {
    method,
    headers: {
      'x-api-key': API_KEY,
      'x-user-ip': '220.132.76.232',
      'content-type': 'application/json',
    },
  }
  if (method === 'POST') options.body = JSON.stringify(params)

  const response = await fetch(url, options)
  if (response.status === 200) {
    const resJson = await response.json()
    if (resJson.success) return resJson.data
    throw resJson.msg
  } else {
    throw await response.text()
  }
}
