import React from 'react';

class InitSecurityForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      couponRate: '',
      poolId: ''
    };

    // this.handleChange = this.handleChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleCouponRateChange = this.handleCouponRateChange.bind(this);
    this.handlePoolIdChange = this.handlePoolIdChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleIdChange(event) {
    console.log(event.target)
    this.setState({
      id: event.target.value
    });
  }

  handleCouponRateChange(event) {
    console.log(event.target)
    this.setState({
      interestrate: event.target.value
    });
  }

  handlePoolIdChange(event) {
    console.log(event.target)
    this.setState({
      balance: event.target.value
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
            function: 'init_security',
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
        <label>
          InterestRate:
          <input type="text" name="interestrate" value={this.state.couponRate} onChange={this.handleCouponRateChange}  />
        </label>
        <label>
          Balance:
          <input type="text" name="balance" value={this.state.poolId} onChange={this.handlePoolIdChange} />
        </label>

        <input type="submit" value="Submit" />
      </form>
    );
  }
}
export default InitSecurityForm;
