function refreshState(seconds) {
  let config = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      method: "query",
      params: {
        ctorMsg: {
          function: 'read_everything',
          args: []
        }
      }
    })
  }
  // TODO, what's the best way to do this? don't want to query for state too often. look into "setEvent" blockchain method
  var ms = 1000 + (1000 * seconds)
  var objects = localStorage.getItem('objects')
  setTimeout( () => {
    fetch(window.location.href.replace('30000', '30001') + 'api/chaincode', config)
      .then(response => response.json())
      .then((json) =>{
        console.log("in refreshState helper")
        var stateObjects = JSON.parse(json)
        console.log(stateObjects)
        // TODO, use react "set state" properly
        // this.setState({"objects": JSON.parse(json)})
        localStorage.setItem('objects', json)
        return JSON.parse(json)
    }).catch( (err) => {
        console.log("fetch failed")
    });
  }, ms)

}

export default refreshState;
