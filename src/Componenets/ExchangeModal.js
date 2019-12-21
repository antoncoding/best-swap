import React, { useState } from 'react'

import { Modal, Button, Info, AddressField, IdentityBadge } from '@aragon/ui'

import * as Changelly from './ChangellyInterface'

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
  tx_id
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
        switch (exchangeName) {
          case 'changelly': {
            const result = await Changelly.createTransaction(
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
            // const result = {
            //   currencyFrom: from,
            //   currencyTo: to,
            //   amountExpectedFrom: amount,
            //   amountExpectedTo: '150.2314098712',
            //   id: '123412341234',
            //   payinAddress: 'bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej',
            //   payoutAddress: address,
            //   refundAddress: refundAddress,
            //   payinExtraId: null,
            // }
            console.log(result)

            setOpened(true)
            update_tx_from(result.currencyFrom)
            update_tx_to(result.currencyTo)
            update_tx_amount_from(result.amountExpectedFrom)
            update_tx_amount_to(result.amountExpectedTo)
            update_tx_id(result.id)
            update_payoutAddress(result.payoutAddress)
            update_payinAddress(result.payinAddress)
            update_payinExtraId(result.payinExtraId)
            break
          }

          default: {
            console.error('no exchagne?')
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
          <div style={{ fontSize: 14, paddingLeft: 20 }}> Transaction Created: {tx_id} </div>
          <div style={{ fontSize: 24, padding: 20 }}>
            {' '}
            Please send {tx_amount_from} {tx_from.toUpperCase()} to:{' '}
          </div>
          <div style={{ padding: 20 }}>
            <AddressField address={payinAddress} />
          </div>

          <div style={{ fontSize: 20, padding: 20 }}>
            We will send {tx_amount_to} {tx_to} to <IdentityBadge entity={payoutAddress} />{' '}
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
