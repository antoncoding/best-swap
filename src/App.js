import React, { useState } from 'react'

import Exchange from './Componenets/Main'
import { Main, Header, Button, IconPlus, SidePanel, Box } from '@aragon/ui'
import AragonUILogog from './aragonui-logo.png'
import ChangellyLogo from './changelly-logo.png'
import './App.css'

function App() {
  const [sidePanelOpened, setSidePanelOpened] = useState(false)

  return (
    <Main>
      <Header
        primary={<></>}
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

      <Exchange />

      <SidePanel title='About BestSwap' opened={sidePanelOpened} onClose={() => setSidePanelOpened(false)}>
        <div style={{ padding: 20, fontSize: 15 }}> Powered By </div>
        <Box>
          <img width={300} src={AragonUILogog} alt='aragon-ui'></img>
        </Box>
        <Box>
          <img width={300} src={ChangellyLogo} alt='aragon-ui'></img>
        </Box>
      </SidePanel>
    </Main>
  )
}

export default App
