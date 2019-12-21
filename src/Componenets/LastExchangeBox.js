import React, { useState } from 'react'

import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableCell, 
  Text, 
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
            <Text>Id</Text>
          </TableCell>
          <TableCell>
            <Text>{transaction.id}</Text>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Text>Transfer</Text>
          </TableCell>
          <TableCell>
            <Text>
              {transaction.amountFrom} {transaction.from}
            </Text>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Text>To</Text>
          </TableCell>
          <TableCell>
            <Text> {shortenAddress(transaction.payinAddress)} </Text>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Text>You get</Text>
          </TableCell>
          <TableCell>
            <Text>
              {' '}
              {transaction.amountTo} {transaction.to}
            </Text>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Text>Status</Text>
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
