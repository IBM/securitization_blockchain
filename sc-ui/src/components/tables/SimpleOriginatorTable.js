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
import InitOriginatorForm from '../forms/initOriginatorForm.jsx'
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
function createData( id, processingfee, company, assets, balance ) {
  // id += 1;
  return { id, processingfee, company, assets, balance };
}

function generateData() {
  if (JSON.parse(localStorage.getItem('objects')) && JSON.parse(localStorage.getItem('objects')).originators ) {
    var originators = JSON.parse(localStorage.getItem('objects')).originators
  } else {
    var originators = []
  }

  // console.log(originators)
  var data = []
  if (!originators || originators.length == 0) {
    return data
  }
  for (var idx in originators) {
    data.push(
      createData(
        originators[idx].id, originators[idx].processingfee, originators[idx].company, originators[idx].assets, originators[idx].balance
      )
    )
    if (idx == (originators.length -1)) {
      // console.log("data")
      // console.log(data)
      return data
    }
  }
}
var data = generateData()

function SimpleOriginatorTable(props) {
  const { classes } = props;
  const data = generateData()
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Originator ID</TableCell>
            <TableCell>Processing Fee</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Assets</TableCell>
            <TableCell>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => {
            return (
              <TableRow key={n.id}>
                <TableCell component="th" scope="row">
                  {n.id}
                </TableCell>
                <TableCell>{n.processingfee * 100}%</TableCell>
                <TableCell>{n.company}</TableCell>
                <TableCell>{n.assets}</TableCell>
                <TableCell>{n.balance}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <InitOriginatorForm></InitOriginatorForm>
    </Paper>

  );
}

SimpleOriginatorTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleOriginatorTable);
