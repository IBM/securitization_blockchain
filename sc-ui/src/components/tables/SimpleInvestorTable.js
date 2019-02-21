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
import InitInvestorForm from '../forms/initInvestorForm.jsx'
import BuySecurityForm from '../forms/buySecurityForm.jsx'
import SellSecurityForm from '../forms/sellSecurityForm.jsx'
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
function createData( id, balance, securities ) {
  // id += 1;
  return { id, balance, securities };
}

function generateData() {

  try {
    if ((localStorage.getItem('objects') != "undefined") && JSON.parse(localStorage.getItem('objects')) && JSON.parse(localStorage.getItem('objects')).investors) {
      var investors = JSON.parse(localStorage.getItem('objects')).investors
    } else {
      throw "no investors found"
    }
  } catch (err) {
    var investors = []
    console.log(err)
  }

  console.log("investors")
  console.log(investors)
  var data = []
  if (!investors || investors.length == 0) {
    return data
  }
  for (var idx in investors) {
    data.push(
      createData(
        investors[idx].id, investors[idx].balance, investors[idx].securities
      )
    )
    if (idx == (investors.length -1)) {
      return data
    }
  }
}
var data = generateData()

function SimpleInvestorTable(props) {
  const { classes } = props;
  const data = generateData()
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Investor ID</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Securities</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => {
            return (
              <TableRow key={n.id}>
                <TableCell component="th" scope="row">{n.id}</TableCell>
                <TableCell>${n.balance.toFixed(2)}</TableCell>
                <TableCell>{  n.securities ? n.securities.join(', ') : '' }</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <InitInvestorForm ></InitInvestorForm>
      <BuySecurityForm ></BuySecurityForm>
      <SellSecurityForm ></SellSecurityForm>
    </Paper>

  );
}

SimpleInvestorTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleInvestorTable);
