import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import refreshState from '../helpers/refreshState.js';

class ProcessPaymentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      asset_id: '',
      paymentamount: ''
    };

    // this.handleChange = this.handleChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handlePaymentAmountChange = this.handlePaymentAmountChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  // handleChange(event) {
  //   console.log(event.target)
  //   this.setState({
  //     id: event.target.id,
  //     interestrate: event.target.interestrate,
  //     balance: event.target.balance
  //   });
  //   //this.setState(event.target.id)
  // }

  handleIdChange(event) {
    console.log(event.target)
    this.setState({
      asset_id: event.target.value
    });
  }

  handlePaymentAmountChange(event) {
    console.log(event.target)
    this.setState({
      paymentAmount: event.target.value
    });
  }

  handleSubmit = () =>  {
    // console.log("event")
    // console.log(event)
    this.setState({ open: false });
    var asset_id = this.state.id
    console.log('processing payment for asset: ' + JSON.stringify(this.state));
    let config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        //"Authorization": "Basic " + new Buffer(key + ":" + secret, "utf8").toString("base64")
      },
      body: JSON.stringify({
        method: "invoke",
        params: {
          ctorMsg: {
            function: 'process_payment',
            args: [this.state.id, this.state.paymentamount]
            //args: Object.values(this.state)
          }
        }
      })
    }
    console.log(config.body)
    fetch('http://localhost:3001/chaincode', config).then ( () => {
      refreshState(1)
      setTimeout( () => {
        {
          var config_value = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
              //"Authorization": "Basic " + new Buffer(key + ":" + secret, "utf8").toString("base64")
            },
            body: JSON.stringify({
              method: "invoke",
              params: {
                ctorMsg: {
                  function: 'value_asset_pool',
                  // args: [this.state.id, this.state.balance, this.state.interestrate, this.state.monthlypayment, this.state.underwriting]
                  args: [asset_id]
                  //args: Object.values(this.state)
                }
              }
            })
          }
          console.log(Date.now())
          console.log("value body")
          console.log(config_value)
          fetch('http://localhost:3001/chaincode', config_value).then( () => {
            refreshState(2)
          })
        }
      }, 3000)
    })


    // event.preventDefault();
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    return (
      <div>
          <Button style={{'float':'right', 'padding':'15px'}} color="primary" variant="contained" size="small" onClick={this.handleClickOpen}>Process Payment</Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
          <DialogTitle id="form-dialog-title">Process Payment</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="id"
              label="Asset ID"
              onChange={this.handleChange('id')}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="paymentamount"
              label="Payment Amount"
              onChange={this.handleChange('paymentamount')}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default ProcessPaymentForm;
