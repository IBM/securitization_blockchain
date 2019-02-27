import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
// import Modal from '@material-ui/core/Modal';
import Modal from '../modal.js';
import FormDialog from '../forms/FormDialog.js'
import InitAssetPoolForm from '../forms/initAssetPoolForm.jsx'
import ProcessPaymentForm from '../forms/processPaymentForm.jsx'


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

let id = 0;
function createData( id, value, assets, securities, excessspread ) {
  return { id, value, assets, securities, excessspread };
}

function generateData() {


  try {
    if ((localStorage.getItem('objects') != "undefined") && JSON.parse(localStorage.getItem('objects')) && JSON.parse(localStorage.getItem('objects')).pools) {
      console.log("pools found, setting variable")
      var pools = JSON.parse(localStorage.getItem('objects')).pools
    } else {
      throw "no pools found"
    }
  } catch (err) {
    var pools = []
    console.log(err)
  }

  console.log(pools)
  var data = []
  if (!pools || pools.length == 0) {
    return data
  }

  for (var idx in pools) {
    data.push(
      createData(
        pools[idx].id, pools[idx].Value, pools[idx].assets, pools[idx].securities, pools[idx].excessspread
      )
    )
    if (idx == (pools.length -1)) {
      console.log("data")
      console.log(data)
      return data
    }
  }
}
var data = generateData()

function SimplePoolTable(props) {
  const { classes } = props;
  const data = generateData()
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Pool ID</TableCell>
            <TableCell>Pool Assets</TableCell>
            <TableCell>Value of Pool Assets (Including Expected Interest)</TableCell>
            <TableCell>Securities</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => {
            return (
              <TableRow key={n.id}>
                <TableCell component="th" scope="row">
                  {n.id}
                </TableCell>
                <TableCell>{  n.assets ? n.assets.join(', ') : '' }</TableCell>
                <TableCell>{n.value.toFixed(2)}</TableCell>
                <TableCell>{  n.securities ? n.securities.join(', ') : '' }</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <InitAssetPoolForm></InitAssetPoolForm>
    </Paper>

  );
}

SimplePoolTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimplePoolTable);
