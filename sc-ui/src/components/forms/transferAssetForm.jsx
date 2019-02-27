import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import refreshState from '../helpers/refreshState.js';

class TransferAssetForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      asset_id: '',
      pool_id: ''
    };
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handlePaymentAmountChange = this.handlePaymentAmountChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
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
    console.log('transferring asset: ' + JSON.stringify(this.state));
    if (this.state.pool_id) {
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
              function: 'pool_asset',
              args: [this.state.asset_id, this.state.pool_id]
            }
          }
        })
      }
      console.log(config.body)
      fetch(window.location.href.replace('30000', '30001') + 'api/chaincode', config).then( () => {
        setTimeout( () => {
          console.log("getting values of pool")
          {
            var config_value = {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                method: "invoke",
                params: {
                  ctorMsg: {
                    function: 'value_asset_pool',
                    args: [this.state.asset_id]
                  }
                }
              })
            }
            console.log(Date.now())
            console.log("value pool")
            fetch(window.location.href.replace('30000', '30001') + 'api/chaincode', config_value).then( () => {
              console.log("getting values of pool")
              refreshState(1)
            })
          }
        }, 3000)
      })
    }

    if (this.state.originator_id) {
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
              function: 'set_originator',
              args: [this.state.asset_id, this.state.originator_id]
            }
          }
        })
      }
      console.log(config.body)
      console.log("refreshing")
      fetch(window.location.href.replace('30000', '30001') + 'api/chaincode', config).then(
        () => {
          refreshState(2)
        }
      ).then( () => {
        this.setState(this.state)
      })
    }
    this.setState({ open: false });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
    refreshState()
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    return (
      <div>
          <Button style={{'float':'right', 'padding':'15px'}} color="primary" variant="contained" size="small" onClick={this.handleClickOpen}>Transfer Asset</Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
          <DialogTitle id="form-dialog-title">Transfer Asset</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="asset_id"
              label="Asset ID"
              onChange={this.handleChange('asset_id')}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="pool_id"
              label="Pool ID"
              onChange={this.handleChange('pool_id')}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="originator_id"
              label="Originator ID"
              onChange={this.handleChange('originator_id')}
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
export default TransferAssetForm;
