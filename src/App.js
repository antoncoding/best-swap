import React from 'react';
import StatusBox from './Componenets/StatusBox'
import SearchBox from './Componenets/TxSearchBox'
import Grid from '@material-ui/core/Grid'
import changellyImg from './changelly-logo.png'
import './App.css';


function App() {
  return (
    <div className="App" >
      <header className="App-header">
      <img alt={'logo'} src={changellyImg} width={500} ></img>
      <Grid item xs={11}
        sm={10}
        container
        direction="row"
      >
          <StatusBox/>
          <SearchBox/>
      </Grid>
        
      </header>
      
    </div>
  );
}

export default App;
