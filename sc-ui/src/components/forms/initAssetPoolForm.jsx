import React from 'react';

class InitAssetPoolForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: ''
    };

    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleIdChange(event) {
    console.log(event.target)
    this.setState({
      id: event.target.value
    });
  }

  handleSubmit(event) {
    console.log('creating asset pool with id: ' + JSON.stringify(this.state));
    let config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //"Authorization": "Basic " + new Buffer(key + ":" + secret, "utf8").toString("base64")
      },
      body: JSON.stringify({
        params: {
          ctorMsg: {
            function: 'init_asset_pool',
            args: Object.values(this.state)
          }
        }
      })
    }
    console.log(config.body)
    fetch('http://localhost:3001/chaincode', config)

    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Id:
          <input type="text" name="id" value={this.state.id} onChange={this.handleIdChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
export default InitAssetPoolForm;
