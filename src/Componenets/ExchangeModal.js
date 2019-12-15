import React, { useState } from 'react'

import { Modal, DataView, Button, IdentityBadge, Info, textStyle } from '@aragon/ui'
import { Changelly } from 'changelly-js'

// import { apiKey, apiSecret } from '../config'

export default function ExchangeModal(from, to, amount, address, refundAddress, changelly:Changelly) {
  // for Exchange panel
  const [opened, setOpened] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorOpened, setErrorOpened] = useState(false)


  const handleExchange = async () => {
    if (!address) {
      setErrorMessage('You need to specify receive address to proceed')
      setErrorOpened(true)
    } else {
      try{
        await changelly.createTransaction(from, to, address, amount, null, refundAddress)
        setOpened(true)
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
        <div
          style={{ fontSize: 20, padding: '20px', display: 'flex', justifyContent: 'center'}} 
        >
          Pay {amount} {from} to the following address:
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
