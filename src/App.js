import React, { useState } from 'react'

import ChangellyEx from './Componenets/Changelly'
import { Main, Header, Tag, Button, IconPlus, SidePanel,} from '@aragon/ui'

import './App.css'

function App() {
  const [
    // sidePanelOpened,
    , 
    setSidePanelOpened
  ] = useState(false)

  return (
    <Main>
      <Header
        primary={
          <>
            Coin Switch
            <Tag mode='identifier'>Pro</Tag>
          </>
        }
        secondary={
          <Button
            // mode='strong'
            label='Learn More'
            icon={<IconPlus />}
            onClick={() => {
              setSidePanelOpened(true)
            }}
          />
        }
      />

      <ChangellyEx />
    </Main>
  )
}

export default App
