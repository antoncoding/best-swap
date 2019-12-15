import React, { useState } from 'react'

import { Table, TableHeader, TableRow, TableCell, Text, Button, Help } from '@aragon/ui'

// import { apiKey, apiSecret } from '../config'

export default function LastExchange(from, to, amount, exchangeAmount, id, changelly) {
  const [status, setStatus] = useState('unkown')

  const getExchangeStatus = async id => {
    const result = await changelly.getExchangeStatus(id)
    setStatus(result)
  }

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
            <Text>{id}</Text>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Text>From</Text>
          </TableCell>
          <TableCell>
            <Text>
              {amount} {from}
            </Text>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Text>To</Text>
          </TableCell>
          <TableCell>
            <Text>
              {' '}
              {exchangeAmount} {to}
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
