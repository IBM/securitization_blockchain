import React from 'react';
import ReactDOM from 'react-dom'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

class InitHFCForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api_endpoint: '',
      chaincode_id: '',
      chaincode_version: '',
      // secure_context: '',
      key: '',
      secret: '',
      network_id: ''
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
    console.log('creating hyperledger client: ' + JSON.stringify(this.state));
    var config = {
      // mode: "cors",
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
        // 'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    }
    fetch('http://localhost:3001/init_hfc_client', config).then( (response) => {
        response.json().then(
          (body) => {
            console.log(body)
            // const element = <h1>Hello, world</h1>
            // const element =<Modal aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" open={this.state.open}></Modal>;
            // ReactDOM.render(element, document.getElementById('root'));
          }

        )
        // body.msg
        // body.certificate
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
  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {
    return (
      <div>
          <Button style={{'float':'right', 'padding':'15px'}} color="secondary" size="small" variant="contained" onClick={this.handleClickOpen}>Configure HF Client</Button>
          {/*<Modal id="cert_modal" aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            <div style={getModalStyle()} className={classes.paper}>
               <Typography variant="title" id="modal-title">
                 Text in a modal
               </Typography>
               <Typography variant="subheading" id="simple-modal-description">
                 Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
               </Typography>
               <SimpleModalWrapped />
             </div>
          </Modal>;*/}
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
          <DialogTitle id="form-dialog-title">Provide Hyperledger Credentials</DialogTitle>
          <DialogContent>
            <TextField
              required
              autoFocus
              margin="dense"
              id="id"
              label="API Endpoint"
              onChange={this.handleChange('api_endpoint')}
              fullWidth
            />
            <TextField
              required
              autoFocus
              margin="dense"
              id="key"
              label="Key"
              onChange={this.handleChange('key')}
              fullWidth
            />
            <TextField
              required
              autoFocus
              margin="dense"
              id="secret"
              label="Secret"
              onChange={this.handleChange('secret')}
              fullWidth
            />
            <TextField
              required
              autoFocus
              margin="dense"
              id="network_id"
              label="Network ID"
              onChange={this.handleChange('network_id')}
              fullWidth
            />
            <TextField
              required
              autoFocus
              margin="dense"
              id="chaincode_id"
              label="Chaincode ID"
              onChange={this.handleChange('chaincode_id')}
              fullWidth
            />
            <TextField
              required
              autoFocus
              margin="dense"
              id="chaincode_version"
              label="Chaincode Version"
              onChange={this.handleChange('chaincode_version')}
              fullWidth
            />
          {/*
            <TextField
              required
              autoFocus
              margin="dense"
              id="secure_context"
              label="Secure Context"
              onChange={this.handleChange('secure_context')}
              fullWidth
            />*/}
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
export default InitHFCForm;
