import React, { useState } from 'react'

import { Modal, Button, Info, AddressField, IdentityBadge } from '@aragon/ui'

import { Changelly } from './Exchanges/'

export default function ExchangeModal(
  fixed,
  fixRateId,
  from,
  to,
  amount,
  address,
  refundAddress,
  refundExtraId,
  exchangeName,

  updateTransaction,
  transaction
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
        switch (exchangeName) {
          case 'changelly': {
            const transaction = await Changelly.createTransaction(
              fixed,
              fixRateId,
              from,
              to,
              address,
              amount,
              null,
              refundAddress,
              refundExtraId
            )

            transaction.exchange = 'changelly'
            // console.log(transaction)

            setOpened(true)
            updateTransaction(transaction)
            break
          }

          default: {
            throw new Error(`${exchangeName} transaction not supported yet`);
          }
        }

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

      <Modal closeButton={false} width={800} padding={40} visible={opened} onClose={() => setOpened(false)}>
        <div style={{ padding: '20px', alignItems: 'center' }}>
          <div style={{ fontSize: 14, paddingLeft: 20 }}> Transaction Created: {transaction.id} </div>
          <div style={{ fontSize: 24, padding: 20 }}>
            {' '}
            Please send {transaction.amountFrom} {transaction.from.toUpperCase()} to:{' '}
          </div>
          <div style={{ padding: 20 }}>
            <AddressField address={transaction.payinAddress} />
          </div>

          <div style={{ fontSize: 20, padding: 20 }}>
            We will send {transaction.amountTo} {transaction.to} to <IdentityBadge entity={transaction.payoutAddress} />{' '}
          </div>
        </div>

        <div style={{ fontSize: 16, padding: '20px', display: 'flex', alignContent: 'center' }}></div>
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
