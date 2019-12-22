import React, { useState } from 'react'

import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableCell,
  IconRefresh,  
  shortenAddress, 
  Button
} from '@aragon/ui'

import * as Aggregator from './Exchanges/aggregator'

export default function LastExchange(transaction) {
  const [status, setStatus] = useState('unkown')

  const updateExchangeStatus = async () => {
    const status = await Aggregator.getTransactionStatus(transaction.exchange, transaction.id)
    setStatus(status)
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
            Id
          </TableCell>
          <TableCell>
            {transaction.id}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            Transfer
          </TableCell>
          <TableCell>
              {transaction.amountFrom} {transaction.from}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            To
          </TableCell>
          <TableCell>
            {shortenAddress(transaction.payinAddress)}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            You get
          </TableCell>
          <TableCell>
            
              {transaction.amountTo} {transaction.to}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            Status
          </TableCell>
          <TableCell>
            <Button 
            onClick = {updateExchangeStatus}
            icon={<IconRefresh/>} 
            label={status}  />
            {/* <Help hint="What are Ethereum addresses made of?">  Can't find the exchange </Help> */}
          </TableCell>
        </TableRow>
        
      </Table>
    </>
  )
}
