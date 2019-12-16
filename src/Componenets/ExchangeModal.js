import React, { useState } from 'react'

import { Modal, Button, Info, AddressField } from '@aragon/ui'
import { Changelly } from 'changelly-js'

// import { apiKey, apiSecret } from '../config'

export default function ExchangeModal(
  from,
  to,
  amount,
  address,
  refundAddress,
  changelly:Changelly,

  update_tx_from,
  update_tx_to,
  update_tx_amount_from,
  update_tx_amount_to,
  update_tx_id,
  update_payoutAddress,
  update_payinAddress,
  update_payinExtraId,
  // update_ExtraIdName,

  payinAddress,
  payoutAddress,
  payinExtraId,
  tx_from,
  tx_to,
  tx_amount_from,
  tx_amount_to,
  tx_id,
  // extraId_name,
) {

  // for Exchange panel
  const [opened, setOpened] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorOpened, setErrorOpened] = useState(false)

  const handleExchange = async () => {
    if (!address) {
      setErrorMessage('You need to specify receive address to proceed')
      setErrorOpened(true)
    } else {
      try {
        const result = await changelly.createTransaction(from, to, address, amount, null, refundAddress)
        // console.log(result)
        setOpened(true)
        update_tx_from(result.currencyFrom)
        update_tx_to(result.currencyTo)
        update_tx_amount_from(result.amountExpectedFrom)
        update_tx_amount_to(result.amountExpectedTo)
        update_tx_id(result.id)
        update_payoutAddress(result.payoutAddress)
        update_payinAddress(result.payinAddress)
        update_payinExtraId(result.payinExtraId)
        
        // update_ExtraIdName(extraId_name)
      
      } catch (error) {
        console.error(error)
        setErrorMessage(error.message)
        setErrorOpened(true)
      }
    }
  }

  return (
    <>
      <Button onClick={handleExchange} label='Exchange' mode='strong' />

      <Modal width={700} padding={40} visible={opened} onClose={() => setOpened(false)}>
        {tx_id}
        <div style={{ fontSize: 20, padding: '20px', display: 'flex', justifyContent: 'center' }}>
          Pay {tx_amount_from} {tx_from} to the following address: 
          <AddressField address={payinAddress || '' }/>
          {/* { extraId_name }  with {extraId_name}: {payinExtraId} */}
        </div>

        <div style={{ fontSize: 16, padding: '20px', display: 'flex', justifyContent: 'center' }}>
          You will receive {tx_amount_to} {tx_to} to the address: {payoutAddress} 
        </div>
      </Modal>

      {/* Error Modal */}
      <Modal closeButton={false} width={600} padding={30} visible={errorOpened} onClose={() => setErrorOpened(false)}>
        <Info title='Opps...' mode='error'>
          {errorMessage}
        </Info>
      </Modal>
    </>
  )
}
