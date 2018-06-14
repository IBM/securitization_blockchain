import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class PoolAsset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetId: '',
      poolId: ''
    };

    this.handlePoolIdChange = this.handlePoolIdChange.bind(this);
    this.handleAssetIdChange = this.handleAssetIdChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlePoolIdChange(event) {
    console.log(event.target)
    this.setState({
      poolId: event.target.value
    });
  }

  handleAssetIdChange(event) {
    console.log(event.target)
    this.setState({
      securityId: event.target.value
    });
  }

  handleSubmit = () =>  {
    // console.log("event")
    // console.log(event)
    console.log('transferring asset: ' + JSON.stringify(this.state));
    let config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //"Authorization": "Basic " + new Buffer(key + ":" + secret, "utf8").toString("base64")
      },
      body: JSON.stringify({
        method: "invoke",
        params: {
          ctorMsg: {
            function: 'pool_asset',
            // or set_originator
            args: Object.values(this.state)
          }
        }
      })
    }
    console.log(config.body)
    fetch('http://localhost:3001/chaincode', config).then ( () =>
      setTimeout( () => {
        {
          var config_value = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              //"Authorization": "Basic " + new Buffer(key + ":" + secret, "utf8").toString("base64")
            },
            body: JSON.stringify({
              method: "invoke",
              params: {
                ctorMsg: {
                  function: 'value_pool',
                  // args: [this.state.id, this.state.balance, this.state.interestrate, this.state.monthlypayment, this.state.underwriting]
                  args: [this.state.poolId]
                  //args: Object.values(this.state)
                }
              }
            })
          }
          console.log(Date.now())
          console.log("value pool")
          fetch('http://localhost:3001/chaincode', config_value)
        }
      }, 5000)
    )
    // event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pool Id:
          <input type="text" name="id" value={this.state.poolId} onChange={this.handlePoolIdChange} />
        </label>
        <label>
          Asset Id:
          <input type="text" name="assetId" value={this.state.assetId} onChange={this.handleAssetIdChange}  />
        </label>

        <input type="submit" value="Submit" />
      </form>
    );
  }
}
export default PoolAsset;
