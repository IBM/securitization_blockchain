import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import refreshState from '../helpers/refreshState.js'


class InitSecurityForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      rating: '',
      couponrate: '',
      value: '',
      monthsuntilmaturity: '',
      maturity: '',
      pool: '',
      investor: ''
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
    console.log('creating security with id: ' + JSON.stringify(this.state));
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
            function: 'init_security',
            args: [ this.state.id, String(parseFloat(this.state.couponrate) * 0.01), this.state.pool, this.state.monthsuntilmaturity]
            //args: Object.values(this.state)
          }
        }
      })
    }
    console.log(config.body)
    fetch(window.location.href.replace('3000', '3001') + 'api/chaincode', config).then( () => {
      refreshState(2)
    })
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
          <Button style={{'float':'center', 'padding':'15px'}} color="primary" variant="contained" size="small" onClick={this.handleClickOpen}>Create Security</Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
          <DialogTitle id="form-dialog-title">Create Security</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="id"
              label="Security ID"
              onChange={this.handleChange('id')}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="couponrate"
              label="Coupon Rate"
              onChange={this.handleChange('couponrate')}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="monthsuntilmaturity"
              label="Months Until Maturity"
              onChange={this.handleChange('monthsuntilmaturity')}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="pool"
              label="Pool"
              onChange={this.handleChange('pool')}
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
export default InitSecurityForm;
