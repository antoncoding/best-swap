import React, { useState } from 'react'

import Switch from './Componenets/Switch'
import Help from './Componenets/TokenHolderView'
import { Main, Header, Tag, Button, IconPlus, SidePanel, Split, DataView, Box, IdentityBadge } from '@aragon/ui'

import './App.css'



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

      <SidePanel title='How does this work?' opened={sidePanelOpened} onClose={() => setSidePanelOpened(false)}>
        <Help></Help>
      </SidePanel>
    </Main>
  )
}

export default App
