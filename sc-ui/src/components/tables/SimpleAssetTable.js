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
import InitAssetForm from '../forms/initAssetForm.jsx'
import TransferAssetForm from '../forms/transferAssetForm.jsx'
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
function createData( id, balance, interest, state, originator, pool ) {
  // id += 1;
  return { id, balance, interest, state, originator, pool };
}


// var data = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
//   createData('Gingerbread', 356, 16.0, 49, 3.9)
// ];

function generateData() {
  var assets = JSON.parse(localStorage.getItem('objects')).assets
  console.log(assets)
  var data = []
  for (var idx in assets) {
    data.push(
      createData(
        assets[idx].id, assets[idx].balance, assets[idx].interest, assets[idx].state, assets[idx].originator.id, assets[idx].pool
      )
    )
    if (idx == (assets.length -1)) {
      console.log("data")
      console.log(data)
      return data
    }
  }
}
var data = generateData()

function SimpleAssetTable(props) {
  const { classes } = props;
  const data = generateData()
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Asset ID</TableCell>
            <TableCell numeric>Balance</TableCell>
            <TableCell numeric>Interest Rate</TableCell>
            <TableCell> State</TableCell>
            <TableCell> Originator </TableCell>
            <TableCell> Pool </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => {
            return (
              <TableRow key={n.id}>
                <TableCell component="th" scope="row">{n.id}</TableCell>
                <TableCell numeric>{n.balance}</TableCell>
                <TableCell numeric>{n.interest}</TableCell>
                <TableCell >{n.state}</TableCell>
                <TableCell>{n.originator}</TableCell>
                <TableCell>{n.pool}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ProcessPaymentForm> </ProcessPaymentForm>
      <InitAssetForm  class="float-right"></InitAssetForm>
      <TransferAssetForm  class="float-right"></TransferAssetForm>
    </Paper>

  );
}

SimpleAssetTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleAssetTable);
