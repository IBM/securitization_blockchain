var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

var exec = require('child_process').exec;


module.exports = router;
command_prefix = 'docker exec cli peer chaincode invoke -n sec -c \'{"Args":'

router.post('/init_asset', function (req, res) {
  console.log("request received to initialize asset")
  console.log(req)
  command =  command_prefix + '\'{"Args":["process_payment", "asset1", "3000"]}\' -C myc'
  exec(command)
  res.send(200)
});

// command = 'docker exec cli peer chaincode invoke -n sec -c '{"Args":["read","asset1"]}' -C myc 2> foo.txt ; cat foo.txt | grep chaincodeInvokeOrQuery | grep -v ESCC | awk -F \'payload:\' \'{print $2}\''

router.post('/chaincode', function (req, res) {
  console.log("request received to initialize asset")
  var chaincode = req.body.params.ctorMsg
  console.log(chaincode.function)
  console.log(chaincode.args)
  // console.log(req.body.params.ctorMsg.function)
  // console.log(req.body.params.ctorMsg.args)
  var chaincode_query = JSON.stringify( {"Args" : [chaincode.function].concat(chaincode.args)} )
  console.log("chaincode_query")
  console.log(chaincode_query)

  // var command = command_prefix + chaincode_query + '}\' -C myc'
  var command = 'docker exec cli peer chaincode invoke -n sec -c \'' + chaincode_query +  '\' -C myc 2> foo.txt ; cat foo.txt | grep chaincodeInvokeOrQuery | grep -v ESCC | awk -F \'payload:\' \'{print $2}\''

  console.log(command)
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      res.send(500)
      return;
    }
    res.send(stdout)
    console.log(stdout);
  });

  // payload=$(docker exec cli peer chaincode invoke -n sec -c '{"Args":["read","asset1"]}' -C myc 2> foo.txt ; cat foo.txt | grep chaincodeInvokeOrQuery | grep -v ESCC | awk -F 'payload:' '{print $2}')
  // echo -e $payload
  // output=$(cat foo.txt | grep chaincodeInvokeOrQuery | grep -v ESCC | awk -F 'payload:' '{print $2}' )
  // res.send(200)
});
