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


import * as Changelly from './ChangellyInterface';

export default function LastExchange(tx_from, tx_to, tx_amount_from, tx_amount_to, tx_id, payinAddress, exchangeName) {
  const [status, setStatus] = useState('unkown')

  const updateExchangeStatus = async () => {
    switch (exchangeName) {
      case 'changelly': {
        const result = await Changelly.getTransactionStatus(tx_id)
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
