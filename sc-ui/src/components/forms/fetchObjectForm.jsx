import React from 'react';
import ReactDOM from 'react-dom';
import GenerateCards from "../helpers/genCards.jsx"

class FetchObject extends React.Component {
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
    console.log('Requesting object with id: ' + JSON.stringify(this.state));
    let config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        //"Authorization": "Basic " + new Buffer(key + ":" + secret, "utf8").toString("base64")
      },
      body: JSON.stringify({
        method: "query",
        params: {
          ctorMsg: {
            function: 'read',
            args: Object.values(this.state)
          }
        }
      })
         // JSON.stringify( 'read' +  Object.values(this.state))
    }

    fetch(window.location.href.replace('30000', '30001') + 'api/chaincode', config)
      .then(response => response.json())
      .then((json) =>{
        console.log(json)
        const element = GenerateCards(JSON.parse(json))
        // TODO, ??
        // ReactDOM.render(element, document.getElementById('test'));

    }).catch( (err) => {
        console.log("fetch failed")
    });
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
export default FetchObject;
