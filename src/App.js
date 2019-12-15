import React, { useState } from 'react'

import Switch from './Componenets/Switch'
import { Main, Header, Tag, Button, IconPlus, SidePanel, Split, DataView, IdentityBadge } from '@aragon/ui'

import './App.css'

function App() {
  const [sidePanelOpened, setSidePanelOpened] = useState(false)

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
              { account: 'test1', amount: '-7.900,33 ANT' },
              { account: 'test2', amount: '-8.760,90 ANT' },
              { account: 'test3', amount: '+5.321 ANT' },
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
