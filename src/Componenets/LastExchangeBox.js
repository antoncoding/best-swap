import React, { useState } from 'react'

import { Table, TableHeader, TableRow, TableCell, Text, Button, Help, shortenAddress } from '@aragon/ui'

export default function LastExchange(tx_from, tx_to, tx_amount_from, tx_amount_to, tx_id, payinAddress, changelly) {
  const [status, setStatus] = useState('unkown')

  // const getExchangeStatus = async () => {
  //   const result = await changelly.getStatus(tx_id)
  //   setStatus(result)
  // }

  // setInterval(()=>{
  //   if (tx_id !== '') getExchangeStatus()
  // }, 20000)

  return (
    <>
      <Table
        header={
          <TableRow>
            <TableHeader title='Last Transaction' />
          </TableRow>
        }
      >
        <TableRow>
          <TableCell>
            <Text>Id</Text>
          </TableCell>
          <TableCell>
            <Text>{tx_id}</Text>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Text>Transfer</Text>
          </TableCell>
          <TableCell>
            <Text>
              {tx_amount_from} {tx_from}
            </Text>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Text>To</Text>
          </TableCell>
          <TableCell>
            <Text> {shortenAddress(payinAddress)} </Text>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Text>You get</Text>
          </TableCell>
          <TableCell>
            <Text>
              {' '}
              {tx_amount_to} {tx_to}
            </Text>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Text>Status</Text>
          </TableCell>
          <TableCell>
            <Text>{status}</Text>
            <Help hint="What are Ethereum addresses made of?">  Can't find the exchange </Help>
          </TableCell>
        </TableRow>
        
      </Table>
    </>
  )
}
