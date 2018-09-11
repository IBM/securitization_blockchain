import React from 'react';
import refreshState from '../helpers/refreshState.js'

class SetOriginatorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetId: '',
      originatorId: ''
    };

    this.handleOriginatorIdChange = this.handleOriginatorIdChange.bind(this);
    this.handleAssetIdChange = this.handleAssetIdChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOriginatorIdChange(event) {
    console.log(event.target)
    this.setState({
      investorId: event.target.value
    });
  }

  handleAssetIdChange(event) {
    console.log(event.target)
    this.setState({
      securityId: event.target.value
    });
  }

  handleSubmit(event) {
    console.log('setting originator: ' + JSON.stringify(this.state));
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
            function: 'set_originator',
            args: Object.values(this.state)
          }
        }
      })
    }
    console.log(config.body)
    fetch(window.location.href.replace('3000', '3001') + 'api/chaincode', config).then( () => {
      refreshState(2)
    })

    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Asset Id:
          <input type="text" name="id" value={this.state.assetId} onChange={this.handleAssetIdChange} />
        </label>
        <label>
          Originator Id:
          <input type="text" name="interestrate" value={this.state.originatorId} onChange={this.handleOriginatorIdChange}  />
        </label>

        <input type="submit" value="Submit" />
      </form>
    );
  }
}
export default SetOriginatorForm;
