import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import refreshState from '../helpers/refreshState.js'


class InitOriginatorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      processingfee: '',
      company: ''
    };
    // this.handleChange = this.handleChange.bind(this);
  }
  handleSubmit = () =>  {
    // console.log("event")
    // console.log(event)
    console.log('creating originator with id: ' + JSON.stringify(this.state));
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
            function: 'init_originator',
            args: [this.state.id, this.state.company, String(parseFloat(this.state.processingfee) * 0.01)]
            //args: Object.values(this.state)
          }
        }
      })
    }
    console.log(config.body)
    fetch(window.location.href.replace('3000', '3001') + 'api/chaincode', config).then( () => {
      refreshState()
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

  render() {
    return (
      <div>
          <Button color="primary" variant="contained" onClick={this.handleClickOpen}>Create Originator</Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
          <DialogTitle id="form-dialog-title">Create New Originator</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="id"
              required
              label="Originator ID"
              onChange={this.handleChange('id')}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              required
              id="processingfee"
              label="Processing Fee (percentage of total loan)"
              onChange={this.handleChange('processingfee')}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="company"
              label="Company"
              onChange={this.handleChange('company')}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" variant="contained">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary" variant="contained">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>

    );
  }
}
export default InitOriginatorForm;
