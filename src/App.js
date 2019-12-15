import React, { useState } from 'react'

import ChangellyEx from './Componenets/Changelly'
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
          // mode='strong' 
          label='Learn More' 
          icon={<IconPlus />} 
          onClick={() => {
            setSidePanelOpened(true)
          }
            
          } />}
      />

      {/* <Split
        primary={
          <> */}
            <ChangellyEx/>
          {/* </>
        }
      /> */}
    </Main>
  )
}

export default App
