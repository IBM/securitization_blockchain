import React from 'react';

class SellSecurityForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      investorId: '',
      securityId: ''
    };

    this.handleinvestorIdChange = this.handleinvestorIdChange.bind(this);
    this.handlesecurityIdChange = this.handlesecurityIdChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleinvestorIdChange(event) {
    console.log(event.target)
    this.setState({
      investorId: event.target.value
    });
  }

  handlesecurityIdChange(event) {
    console.log(event.target)
    this.setState({
      securityId: event.target.value
    });
  }

  handleSubmit(event) {
    console.log('creating asset with id: ' + JSON.stringify(this.state));
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
            function: 'sell_security',
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
          Investor Id:
          <input type="text" name="id" value={this.state.investorId} onChange={this.handleinvestorIdChange} />
        </label>
        <label>
          Security Id:
          <input type="text" name="interestrate" value={this.state.securityId} onChange={this.handlesecurityIdChange}  />
        </label>

        <input type="submit" value="Submit" />
      </form>
    );
  }
}
export default SellSecurityForm;
