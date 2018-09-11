import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import refreshState from '../helpers/refreshState.js'

class InitAssetForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      interestrate: '',
      balance: '',
      // monthlypayment: '',
      remainingpayments: ''
      // underwriting: ''
    };

    // this.handleChange = this.handleChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleInterestRateChange = this.handleInterestRateChange.bind(this);
    this.handleBalanceChange = this.handleBalanceChange.bind(this);
    this.handleUnderwritingChange = this.handleUnderwritingChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleIdChange(event) {
    console.log(event.target)
    this.setState({
      id: event.target.value
    });
  }

  handleInterestRateChange(event) {
    console.log(event.target)
    this.setState({
      interestrate: event.target.value
    });
  }

  handleBalanceChange(event) {
    console.log(event.target)
    this.setState({
      balance: event.target.value
    });
  }

  handleUnderwritingChange(event) {
    this.setState({
      underwriting: event.target.value
    });
  }

  handleSubmit = () =>  {
    // console.log("event")
    // console.log(event)
    console.log('creating asset with id: ' + JSON.stringify(this.state));
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
            function: "init_asset",
            // args: [this.state.id, this.state.balance, this.state.interestrate, this.state.monthlypayment, this.state.underwriting]
            args: [this.state.id, this.state.balance, String(parseFloat(this.state.interestrate) * 0.01) , this.state.remainingpayments]
            //args: Object.values(this.state)
          }
        }
      })
    }
    console.log("initializing asset")
    console.log(Date.now())
    fetch(window.location.href.replace('3000', '3001') + 'api/chaincode', config).then ( () => {
      refreshState(2)
    })

      // setTimeout( () => {
      //     refreshState()
    //     {
    //       var config_value = {
    //         method: 'POST',
    //         headers: {
    //           'Accept': 'application/json',
    //           'Content-Type': 'application/json',
    //           //"Authorization": "Basic " + new Buffer(key + ":" + secret, "utf8").toString("base64")
    //         },
    //         body: JSON.stringify({
    //           method: "invoke",
    //           params: {
    //             ctorMsg: {
    //               function: 'value_asset',
    //               // args: [this.state.id, this.state.balance, this.state.interestrate, this.state.monthlypayment, this.state.underwriting]
    //               args: [this.state.id]
    //               //args: Object.values(this.state)
    //             }
    //           }
    //         })
    //       }
    //       console.log(Date.now())
    //       console.log("value asset")
    //       fetch(window.location.href.replace('3000', '3001') + 'api/chaincode', config_value)
    //     }
      // }, 3000)
    // })
    this.setState({ open: false });
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

  // function generateTextFields(fields) {
  //
  //   return
  // }

  // <form onSubmit={this.handleSubmit}>
  //   <label>
  //     Id:
  //     <input type="text" name="id" value={this.state.id} onChange={this.handleIdChange} />
  //   </label>
  //   <label>
  //     InterestRate:
  //     <input type="text" name="interestrate" value={this.state.interestrate} onChange={this.handleInterestRateChange}  />
  //   </label>
  //   <label>
  //     Balance:
  //     <input type="text" name="balance" value={this.state.balance} onChange={this.handleBalanceChange} />
  //   </label>
  //   <label>
  //     Underwriting:
  //     <input type="text" name="underwriting" value={this.state.underwriting} onChange={this.handleUnderwritingChange} />
  //   </label> -->
  //
  //   <input type="submit" value="Submit" />
  // </form>


  render() {
    return (
      <div>
          <Button style={{'float':'right', 'padding':'15px'}} color="secondary" size="small" variant="contained" onClick={this.handleClickOpen}>Create New Asset</Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
          <DialogTitle id="form-dialog-title">Create Asset</DialogTitle>
          <DialogContent>
            <TextField
              required
              autoFocus
              margin="dense"
              id="id"
              label="Asset ID"
              onChange={this.handleChange('id')}
              fullWidth
            />
            <TextField
              required
              autoFocus
              margin="dense"
              id="interestrate"
              label="Interest Rate (%)"
              onChange={this.handleChange('interestrate')}
              fullWidth
            />
            <TextField
              required
              autoFocus
              margin="dense"
              id="balance"
              label="Balance"
              onChange={this.handleChange('balance')}
              fullWidth
            />
            <TextField
              required
              autoFocus
              margin="dense"
              id="remainingpayments"
              label="Number of Monthly Payments Remaining"
              onChange={this.handleChange('remainingpayments')}
              fullWidth
            />
          {/*
            <TextField
              autoFocus
              margin="dense"
              id="monthlypayment"
              label="Monthly Payment"
              onChange={this.handleChange('monthlypayment')}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="underwriting"
              label="Underwriting Information"
              onChange={this.handleChange('underwriting')}
              fullWidth
            />
            */}
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
export default InitAssetForm;
