import React, { Component } from 'react'

import { Button, FormControl, TextField, Grid } from '@material-ui/core'

import { apiKey, apiSecret } from '../config'
import { Changelly } from 'changelly-js'

const changelly = new Changelly(apiKey, apiSecret)

export default class StatusBox extends Component {
  state = {
    helperText: null,
    id: '',
    status: 'status',
  }

  handleIDChange = event => {
    this.setState({ id: event.target.value })
  }

  handleSearch = () => {
    const id = this.state.id
    if (id.length !== 16) {
      this.setState({ helperText: 'Wrong ID Length' })
    } else {
      changelly
        .getStatus(id)
        .then(status => {
          this.setState({ status })
        })
        .catch(error => {
          this.setState({ helperText: error.message })
        })
    }
  }

  render() {
    return (
      <Grid container item xs={12}>
        <Grid container direction='row' justify='space-between' alignItems='flex-start'>
          <Grid container item xs={2} alignItems='flex-start'>
            <h4> Search By ID </h4>
          </Grid>
          <Grid container item xs={6} alignItems='flex-start'>
            <FormControl>
              <TextField
                size='small'
                variant='outlined'
                value={this.state.id}
                label='id'
                helperText={this.state.helperText}
                onChange={this.handleIDChange}
              ></TextField>
            </FormControl>
          </Grid>
          <Grid container item xs={2} alignItems='flex-start'>
            <Button variant='outlined' onClick={this.handleSearch}>
              Search{' '}
            </Button>
          </Grid>
          <Grid container item xs={2}>
            <p> {this.state.status} </p>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}
