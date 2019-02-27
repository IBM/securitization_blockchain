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
      remainingpayments: ''
    };
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
    console.log('creating asset with id: ' + JSON.stringify(this.state));
    var config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method: "invoke",
        params: {
          ctorMsg: {
            function: "init_asset",
            args: [this.state.id, this.state.balance, String(parseFloat(this.state.interestrate) * 0.01) , this.state.remainingpayments]
          }
        }
      })
    }
    console.log("initializing asset")
    console.log(Date.now())
    fetch(window.location.href.replace('30000', '30001') + 'api/chaincode', config).then ( () => {
      refreshState(2)
    })
    this.setState({ open: false });
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
