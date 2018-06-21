import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import refreshState from '../helpers/refreshState.js';

class BuySecurityForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      investor_id: '',
      security_id: ''
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
    console.log('buying security: ' + JSON.stringify(this.state));
      var config = {
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
              function: 'buy_security',
              // or set_originator
              args: [this.state.investor_id, this.state.security_id]
            }
          }
        })
      }
      console.log(config.body)
      fetch('/api/chaincode', config).then( () => {
        refreshState(2)
      })
    // event.preventDefault();
    // event.preventDefault()
      this.setState({ open: false });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  // onChange = () => {
  //   this.setState(this.state)
  // }

  handleClose = () => {
    this.setState({ open: false });
    // refreshState()
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    return (
      <div>
          <Button style={{'float':'right', 'padding':'15px'}} color="secondary" size="small" variant="contained" onClick={this.handleClickOpen}>Buy Security</Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
          <DialogTitle id="form-dialog-title">Buy Security</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="investor_id"
              label="Investor ID"
              onChange={this.handleChange('investor_id')}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="pool_id"
              label="Security ID"
              onChange={this.handleChange('security_id')}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Buy
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default BuySecurityForm;
