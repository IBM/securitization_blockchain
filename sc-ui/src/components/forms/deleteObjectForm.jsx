import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';


class DeleteObjectForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: ''
    };
    // this.handleChange = this.handleChange.bind(this);
  }
  handleSubmit = () =>  {
    // console.log("event")
    // console.log(event)
    console.log('deleting object id: ' + JSON.stringify(this.state));
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
            function: 'delete',
            args: [this.state.id]
            //args: Object.values(this.state)
          }
        }
      })
    }
    console.log(config.body)
    fetch('/api/chaincode', config)
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
          <Button style={{'float':'right', 'padding':'15px'}} color="primary" size="small" variant="contained" onClick={this.handleClickOpen}>Delete Object</Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
          <DialogTitle id="form-dialog-title">Delete Object</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="id"
              required
              label="Object ID"
              onChange={this.handleChange('id')}
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
export default DeleteObjectForm;
