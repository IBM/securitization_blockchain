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
import BuySecurityForm from '../forms/buySecurityForm.jsx'
import InitSecurityForm from '../forms/initSecurityForm.jsx'
import SellSecurityForm from '../forms/sellSecurityForm.jsx'


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
function createData( id, rating, couponrate, pool, value, remainingpayments, maturity, investor ) {
  return { id, rating, couponrate, pool, value, remainingpayments, maturity, investor };
}

function generateData() {

  try {
    if ((localStorage.getItem('objects') != "undefined") && JSON.parse(localStorage.getItem('objects')) && JSON.parse(localStorage.getItem('objects')).securities) {
      console.log("securities found, setting variable")
      var securities = JSON.parse(localStorage.getItem('objects')).securities
    } else {
      throw "no securities found"
    }
  } catch (err) {
    var securities = []
    console.log(err)
  }

  var data = []
  if (!securities || securities.length == 0) {
    return data
  }
  for (var idx in securities) {
    data.push(
      createData(
        securities[idx].id, securities[idx].rating, securities[idx].couponrate, securities[idx].pool, securities[idx].value, securities[idx].remainingpayments, securities[idx].maturity, securities[idx].investor
      )
    )
    if (idx == (securities.length -1)) {
      return data
    }
  }
}
var data = generateData()

function SimpleSecurityTable(props) {
  const { classes } = props;
  const data = generateData()
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell> Security ID</TableCell>
            <TableCell> Pool</TableCell>
            <TableCell> Coupon Rate</TableCell>
            <TableCell> Investor </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => {
            return (
              <TableRow key={n.id}>
                <TableCell component="th" scope="row">{n.id}</TableCell>
                <TableCell>{n.pool}</TableCell>
                <TableCell>{n.couponrate.toFixed(2) * 100}%</TableCell>
                <TableCell>{n.investor}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <InitSecurityForm ></InitSecurityForm>
    </Paper>

  );
}

SimpleSecurityTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleSecurityTable);
