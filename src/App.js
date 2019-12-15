import React, { useState } from 'react'

import Switch from './Componenets/Switch'
import { Main, Header, Tag, Button, IconPlus, SidePanel, Split, DataView, Box, IdentityBadge } from '@aragon/ui'

// import { Changelly } from 'changelly-js'

import './App.css'


// const apiKey = process.env.REACT_APP_APIKey
// const apiSecret = process.env.REACT_APP_APISecret

// const changelly = new Changelly(apiKey, apiSecret)


function App() {

  const [sidePanelOpened, setSidePanelOpened] = useState(false)

  // const [currencies, setCurrencies] = useState([])

  // const refreshCurrencies = changelly.getCurrenciesFull().then(coins => {
  //   let enabled = coins
  //   .filter(coin => coin.enabled )
  //   .map(coin => coin.name)

  //   setCurrencies(enabled)
  //   console.log(enabled)
  // })

  // setInterval(refreshCurrencies, 10000000000)
  

  return (
    <Main>
      <Header
        primary={
          <>
            Coin Switch
            <Tag mode="identifier">Pro</Tag>
          </>
        }
        secondary={
        <Button 
          mode='strong' 
          label='Learn More' 
          icon={<IconPlus />} 
          onClick={() => {
            setSidePanelOpened(true)
          }
            
          } />}
      />

      <Split
        primary={
          <>
            <Switch></Switch>
          </>
        }
      />

      <SidePanel title='Add tokens' opened={sidePanelOpened} onClose={() => setSidePanelOpened(false)}>
        <DataView
            fields={['Account', 'Amount']}
            entries={[
              { account: '1234', amount: '-7.900,33 ANT' },
              { account: '4512', amount: '-8.760,90 ANT' },
              { account: '12345', amount: '+5.321 ANT' },
            ]}
            renderEntry={({ account, amount }) => {
              return [<IdentityBadge entity={account} />]
            }}
          />
      </SidePanel>
    </Main>
  )
}

export default App
