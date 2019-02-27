import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import refreshState from '../helpers/refreshState.js'

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
    let config = {
      mode: "cors",
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
            args: Object.values(this.state)
          }
        }
      })
    }
    console.log('transferring asset to pool: ')
    fetch(window.location.href.replace('30000', '30001') + 'api/chaincode', config).then ( () =>  {
      console.log("submitted request to pool asset")
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
                  args: [this.state.assetId]
                }
              }
            })
          }
          console.log(Date.now())
          console.log("value pool")
          fetch(window.location.href.replace('30000', '30001') + 'api/chaincode', config_value).then( () => {
            console.log("getting values of pool")
            refreshState(3)
          })
        }
    }).catch(
      console.log("pool asset request failed")
    )
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
