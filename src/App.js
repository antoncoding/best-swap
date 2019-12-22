import React, { useState } from 'react'

import Exchange from './Componenets/Main'
import { Main, Header, Button, IconPlus, SidePanel, Box, ButtonBase } from '@aragon/ui'
import AragonUILogog from './aragonui-logo.png'
import ChangellyLogo from './changelly-logo.png'
import CoinSwitchLogo from './coinswitch-logo.png'
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
          <ButtonBase
            onClick={() => {
              window.open('https://ui.aragon.org/', '_blank')
            }}
            showFocusRing={false}
          >
            <img width={300} src={AragonUILogog} alt='aragon-ui'></img>
          </ButtonBase>
        </Box>

        <Box>
        <ButtonBase
            onClick={() => {
              window.open('https://changelly.com/?ref_id=oz145mh990w1b4wr', '_blank')
            }}
            showFocusRing={false}
          >
          <img width={300} src={ChangellyLogo} alt='changelly'></img>
          </ButtonBase>
        </Box>
        
        <Box>
          <ButtonBase
            onClick={() => {
              window.open('https://coinswitch.co/?ref=BO6PQLZZ9P', '_blank')
            }}
            showFocusRing={false}
          >
            <div style={{ paddingLeft: '20px', alignContent: 'center', alignItems: 'center' }}>
              <img width={300} src={CoinSwitchLogo} alt='coinswitch'></img>
            </div>
          </ButtonBase>
        </Box>
      </SidePanel>
    </Main>
  )
}

export default App
