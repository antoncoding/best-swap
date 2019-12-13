import React, { Component } from 'react'

import {
  Button,
  FormControl,
  TextField,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  TableCell,
  TableBody,
  Table,
  TableHead,
  TableRow,
} from '@material-ui/core'

// import { apiKey, apiSecret } from '../config'
import { Changelly } from 'changelly-js'

const apiKey = process.env.REACT_APP_APIKey
const apiSecret = process.env.REACT_APP_APISecret

const changelly = new Changelly(apiKey, apiSecret)

export default class HistoryBox extends Component {
  state = {
    helperText: null,
    input: '',
    page: 1,
    filter: 'currency',
    rows: [],
  }

  handleFilterChange = event => {
    this.setState({ offset: 0 })
    this.setState({ filter: event.target.value })
  }

  handleInputChange = event => {
    // this.setState({ offset: 0 })
    this.setState({ input: event.target.value })
  }

  handleSearch = () => {
    const limit = 10;
    const page = this.state.page
    const filter = {
      offset: (page-1)* limit,
      limit,
    }
    const key = this.state.filter
    const value = this.state.input
    filter[key] = value

    console.log(filter)
    changelly.getTransactions(filter).then(result => {
      this.setState({ rows: result })
    })
  }

  handlePageChange = (event) => {
    this.setState({ page: event.target.value })
  }

  render() {
    const columns = [
      { id: 'id', label: 'ID', minWidth: 120 },
      { id: 'createdAt', label: 'Created', minWidth: 100, format: timeStamp => new Date(timeStamp*1000).toISOString() },
      { id: 'status', label: 'Status', minWidth: 100 },
      { id: 'currencyFrom', label: 'From', minWidth: 50 },
      { id: 'currencyTo', label: 'To', minWidth: 50 },
      {
        id: 'payinAddress',
        label: 'Payin Address',
        minWidth: 350,
        align: 'left',
      },
      {
        id: 'payoutAddress',
        label: 'Payout Address',
        minWidth: 350,
        align: 'left',
      },
      {
        id: 'amountExpectedTo',
        label: 'Expect Amount',
        minWidth: 150,
        align: 'left',
      },
    ]

    return (
      <Grid container item xs={12}>
        <Grid container direction='row' justify='space-between' alignItems='flex-start'>
          <Grid container item xs={2} alignItems='flex-start'>
            <h4> Filter Records </h4>
          </Grid>

          <Grid container item xs={2} alignItems='flex-start'>
            <FormControl>
              <TextField
                size='small'
                variant='outlined'
                value={this.state.id}
                label={this.state.filter}
                helperText={this.state.helperText}
                onChange={this.handleInputChange}
              ></TextField>
            </FormControl>
          </Grid>
          <Grid container item xs={4} alignItems='flex-start'>
            <FormControl variant='outlined' size='small'>
              <InputLabel id='demo-simple-select-helper-label'>Filter</InputLabel>
              <Select value={this.state.filter} onChange={this.handleFilterChange}>
                <MenuItem value='currency'>
                  <em>currency</em>
                </MenuItem>
                <MenuItem value='address'>address</MenuItem>
                <MenuItem value='extraId'>extraId</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid container item xs={2} alignItems='flex-start'>
            <Button variant='outlined' onClick={this.handleSearch}>
              Search{' '}
            </Button>
          </Grid>

          <Grid container item xs={2} alignItems='flex-start'>
            <FormControl>
              <TextField
                size='small'
                variant='outlined'
                value={this.state.page}
                label='Page'
                onChange={this.handlePageChange}
              ></TextField>
            </FormControl>
          </Grid>
        </Grid>

        <Grid>
          <Paper>
            {/* <TableContainer> */}
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.rows.map(row => {
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                      {columns.map(column => {
                        const value = row[column.id]
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}
