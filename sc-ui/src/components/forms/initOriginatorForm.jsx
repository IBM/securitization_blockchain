import React from 'react';

class InitOriginatorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originatorId: ''
    };

    this.handleOriginatorIdChange = this.handleOriginatorIdChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOriginatorIdChange(event) {
    console.log(event.target)
    this.setState({
      originator_id: event.target.value
    });
  }

  handleSubmit(event) {
    console.log('creating originator with id: ' + JSON.stringify(this.state));
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
            function: 'init_originator',
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
          <input type="text" name="originator_id" value={this.state.originatorId} onChange={this.handleOriginatorIdChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
export default InitOriginatorForm;
