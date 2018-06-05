function refreshState() {
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
          function: 'read_everything',
          args: []
        }
      }
    })
  }
  console.log("refreshing state")
  fetch('http://localhost:3001/chaincode', config)
    .then(response => response.json())
    .then((json) =>{
      console.log("returned")
      // const element = GenerateCards(JSON.parse(json))
      // ReactDOM.render(element, document.getElementById('test'));
      // console.log("this")
      // console.log(this)
      var stateObjects = JSON.parse(json)
      console.log(stateObjects)
      // TODO, use react "set state" properly
      // this.setState({"objects": JSON.parse(json)})
      localStorage.setItem('objects', json)
      return JSON.parse(json)
  }).catch( (err) => {
      console.log("fetch failed")
  });
}

export default (refreshState);
