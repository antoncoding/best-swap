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

import { Changelly } from './Exchanges';

export default function LastExchange(transaction) {
  const [status, setStatus] = useState('unkown')

  const updateExchangeStatus = async () => {
    switch (transaction.exchange) {
      case 'Changelly': {
        const result = await Changelly.getTransactionStatus(transaction.id)
        setStatus(result)
        break;
      }
      default :{
        console.error(`Unknown exchange`)
        break;
      }
    }
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
