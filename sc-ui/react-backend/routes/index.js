var express = require('express');
var router = express.Router();
const request = require('request')
const hfc = require('fabric-client')
var CAClient = require('fabric-ca-client')
var fs = require('fs')
var _ = require('underscore')
var util = require('util')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

var exec = require('child_process').exec;


module.exports = router;
command_prefix = 'docker exec cli peer chaincode invoke -n sec -c \'{"Args":'

function requestConnectionProfile(req) {
  console.log("requesting connection profile")
  console.log(req.body)
  if ( ! req.body.api_endpoint.includes('/api/v1')) {
    var api_endpoint = req.body.api_endpoint + '/api/v1'
  } else {
    var api_endpoint = req.body.api_endpoint
  }
  // console.log(req.body)
  var options = {
      url: api_endpoint + '/networks/' + req.body.network_id + '/connection_profile',
      // uri: api_endpoint + '/networks/' + req.body.network_id + '/connection_profile',
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Accept-Charset': 'utf-8',
          "Authorization": "Basic " + new Buffer(req.body.key + ":" + req.body.secret, "utf8").toString("base64")
      }
  }
  console.log(options)
  request(options, function(err, res, body) {
      let json = JSON.parse(body);
      console.log("body")
      console.log(body)
      console.log("connection profile request error")
      console.log(err)
      fs.writeFile('./connection_profile.json', body, 'utf8', function(err){
        if(err) {console.log(err)}
      })
      return json
      // return hfc.loadFromConfig(json)
  })
}

function enrollUser (username, client, url, networkId) {
  console.log("Monitoring Client User doesn't exist. Loading CA client to enroll")
  var registrar = client._network_config._network_config.certificateAuthorities[certificateAuthorityName].registrar[0]
  var ca = new CAClient(certificateAuthObj.url, {
    trustedRoots: [],
    verify: false
  }, certificateAuthObj.caName, crypto_suite)
  enrollment = ca.enroll({
    enrollmentID: registrar.enrollId,
    enrollmentSecret: registrar.enrollSecret
  }).then( (result) => {
    console.log("Enrolling client")
    // user = new User('admin', config );
    return client.createUser({
      username: username,
      mspid: mspId,
      cryptoContent: {
        privateKeyPEM: result.key.toBytes(),
        signedCertPEM: result.certificate
      }
    })
  }).then((user) => {
    //user.setEnrollment(res.key, res.certificate, 'org2')
    //user.setRoles('admin')
    // client.setUserContext(user)
    client.setUserContext(user)
    console.log(username + " enrolled. Please upload following certificate via blockchain UI: \n " + url + "/network/" + networkId + "/members/certificates")
    console.log(user._signingIdentity._certificate + '\n')
    // res.send("User created. Please upload following certificate via blockchain UI: " + user._signingIdentity._certificate)

    //return user
  }).catch((err) => {
    console.error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);
    throw new Error('Failed to enroll admin');
  });
}

router.post('/init_hfc_client', function (req, res) {
    console.log("request received to initialize client")
    console.log(req.body.api_endpoint)
    console.log(req.body)
    // command =  command_prefix + '\'{"Args":["process_payment", "asset1", "3000"]}\' -C myc'
    // exec(command)
    if (fs.existsSync('./connection_profile.json')) {
      // var options = {
      //     url: req.body.urlRestRoot + '/networks/' + req.body.networkId + '/connection_profile',
      //     method: 'GET',
      //     headers: {
      //         'Accept': 'application/json',
      //         'Content-Type': 'application/json',
      //         'Accept-Charset': 'utf-8',
      //         "Authorization": "Basic " + new Buffer(req.body.key + ":" + req.body.secret, "utf8").toString("base64")
      //     }
      // }
      // request(options, function(err, res, body) {
      //   let json = JSON.parse(body);
      //   fs.writeFile('./connection_profile.json', body, 'utf8', function(err){
      //     if (err) {console.log(err)}
      //   })
      //   config = hfc.loadFromConfig(json)
      // });
      // requestConnectionProfile(req)
      console.log("Local connection profile loading")
      client = hfc.loadFromConfig('./connection_profile.json')
    } else {
      // console.log("Requesting connection profile")
      client = hfc.loadFromConfig(requestConnectionProfile( req ))
    }
    console.log(client)
    org = Object.keys(client._network_config._network_config.organizations)[0]
    console.log("loading org")
    console.log(org)
    certificateAuthorities = client._network_config._network_config.certificateAuthorities
    certificateAuthorityName = Object.keys(certificateAuthorities)[0]
    certificateAuthObj = certificateAuthorities[certificateAuthorityName]
    mspId = client._network_config._network_config.organizations[org]['mspid']
    storePath = './'
    client_crypto_suite = hfc.newCryptoSuite()
    crypto_store = hfc.newCryptoKeyStore({path: storePath})
    crypto_suite = hfc.newCryptoSuite()
    crypto_suite.setCryptoKeyStore(crypto_store)
    username = "monitoring_admin"
    // var crypto_store = hfc.newCryptoKeyStore({path: storePath})
    // crypto_suite.setCryptoKeyStore(crypto_store)
    client.setCryptoSuite(crypto_suite)
    // config.setCryptoSuite(client_crypto_suite);

    hfc.newDefaultKeyValueStore({path: storePath}).then( (store) => {
      client.setStateStore(store)
    }).then( (result) => {
      client.getUserContext(username, true).then ( (user) => {
      // res.send("Client Initialized")
      // console.log("Client Initialized")
      if (user && user.isEnrolled()) {
        console.log("Client Loaded From Persistence")
        res.send("Client Loaded From Persistence")
        console.log("Be sure to upload following cert via blockchain UI: \n" + req.body.urlRestRoot + "/network/" + req.body.networkId + "/members/certificates")
        console.log(user._signingIdentity._certificate + '\n')
        // TODO, render this certificate in UI, and only when admin calls fail
      } else {
        console.log("Monitoring Client User doesn't exist. Loading CA client to enroll")
        enrollUser(username, client, req.body.urlRestRoot, req.body.networkId)
        // client.setUserContext(user)
        // console.log("Monitoring Client User doesn't exist. Loading CA client to enroll")
        // var ca = new CAClient(certificateAuthObj.url, {
        //   trustedRoots: [],
        //   verify: false
        // }, certificateAuthObj.caName, crypto_suite)
        // enrollment = ca.enroll({
        //   enrollmentID: registrar.enrollId,
        //   enrollmentSecret: registrar.enrollSecret
        // }).then( (result) => {
        //   console.log("Enrolling client")
        //   // user = new User('admin', config );
        //   return config.createUser({
        //     username: 'monitoring_admin',
        //     mspid: mspId,
        //     cryptoContent: { privateKeyPEM: result.key.toBytes(), signedCertPEM: result.certificate }
        //   })
        // }).then((user) => {
        //   //user.setEnrollment(res.key, res.certificate, 'org2')
        //   //user.setRoles('admin')
        //   config.setUserContext(user)
        //   console.log("\"monitoring_admin\" user created. Please upload following certificate via blockchain UI: \n " + req.body.urlRestRoot + "/network/" + req.body.networkId + "/members/certificates")
        //   console.log(user._signingIdentity._certificate + '\n')
        //   res.send("User created. Please upload following certificate via blockchain UI: " + user._signingIdentity._certificate)
        //
        //   //return user
        // }).catch((err) => {
        //   console.error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);
        //   throw new Error('Failed to enroll admin');
        //   });
        }
      })
    })
    console.log(req)
    res.send(200)
});

// command = 'docker exec cli peer chaincode invoke -n sec -c '{"Args":["read","asset1"]}' -C myc 2> foo.txt ; cat foo.txt | grep chaincodeInvokeOrQuery | grep -v ESCC | awk -F \'payload:\' \'{print $2}\''

router.post('/chaincode', function (req, res) {
  console.log("chaincode request received")
  console.log("req.body")
  console.log(req.body)


  var chaincode = req.body.params.ctorMsg
  console.log(chaincode.function)
  console.log(chaincode.args)
  // console.log(req.body.params.ctorMsg.function)
  // console.log(req.body.params.ctorMsg.args)
  var chaincode_query = JSON.stringify( {"Args" : [chaincode.function].concat(chaincode.args)} )
  console.log("chaincode_query")
  console.log(chaincode_query)

  // TODO, add check here for valid hfc client. If client not initialized, use docker
  if (typeof(client) !== 'undefined') {
        console.log("invoking chaincode with hfc client")
        console.log("req")
        // console.log(req)
        console.log(req.body)
        if (req.body.method && req.body.method === 'invoke') {
          console.log("invoking request")

          var transaction_id = client.newTransactionID(true)
          var txRequest = {
            chaincodeId: sec_chaincode.name, //chaincode.name,
            chaincodeVersion: sec_chaincode.version, //chaincode.version,
            txId: transaction_id,
            fcn: req.body.params.ctorMsg.function,
            args: req.body.params.ctorMsg.args
          }

          if (proposeTransaction(txRequest)) {
            console.log("transaction approved, submitting")
            // submitTransaction(txRequest)
          }
      } else { // query
          console.log("query chaincode with hfc client")
          // var assetId = JSON.parse(req.body.params.ctorMsg.args).assetID
          var request = {
              chaincodeId: sec_chaincode.name,
              chaincodeVersion: sec_chaincode.version,
              // txId: transaction_id,
              fcn: req.body.params.ctorMsg.function,
              args: req.body.params.ctorMsg.args
            }
          console.log(request)
          channel.queryByChaincode(request).then( (cc_response) => {
            // console.log(cc_response[0].toString())
            console.log(cc_response[0].toString())
            res.send( cc_response[0].toString() )
          }).catch ( (err) => {
            console.log(err)
            res.send(err)
          });
      }
  } else {
  // if (client == null) {
    console.log("hfc client not defined, invoking chaincode with docker")
    // if hyperledger client not initialized, assume local Docker network is running
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
  }
  // payload=$(docker exec cli peer chaincode invoke -n sec -c '{"Args":["read","asset1"]}' -C myc 2> foo.txt ; cat foo.txt | grep chaincodeInvokeOrQuery | grep -v ESCC | awk -F 'payload:' '{print $2}')
  // echo -e $payload
  // output=$(cat foo.txt | grep chaincodeInvokeOrQuery | grep -v ESCC | awk -F 'payload:' '{print $2}' )
  // res.send(200)
});



var chaincodes, peer, channel, sec_chaincode
router.post('/getchaincodes', function (req, res) {
  console.log("in getchaincodes call")
  client.getUserContext('admin', true)
  // console.log(req)
  // res.send('received chaincode call')
  peer = client.getPeersForOrgOnChannel()[0]._name
  channel = client.getChannel()
  client.queryInstalledChaincodes(peer, true).then( (response) => {
    console.log(response)
    chaincodes = response
  }).then ( (result) =>  {
    sec_chaincode = _.where( chaincodes.chaincodes, {name: 'sec', version: '4'} )[0]
    console.log(chaincodes)
    res.sendStatus(200)
  });
});

function proposeTransaction(txRequest) {
  channel.sendTransactionProposal(txRequest).then ( (proposalRes) => {
    console.log("sending transaction proposal")
    var proposalResponses = proposalRes[0];
    var proposal = proposalRes[1];
    let isProposalGood = false;
    console.log("proposalResponses")
    console.log(proposalResponses)
    if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
        console.log('Transaction proposal was good');
        // return true;
        var sendPromise = channel.sendTransaction({
          proposalResponses: proposalResponses,
          proposal: proposal
        })
        sendPromise.then( (result) => {
          console.log("transaction result")
          console.log(result)
          // res.send(result)
        })
      } else {
        console.log('Transaction proposal was rejected');
        // console.log('Transaction proposal was rejected');
        return false
    }
  }).catch ( (err) => {
    console.log(err)
    return false
    // res.send(err)
  });
}

function submitTransaction(txRequest) {
  // if (isProposalGood) {
    console.log(util.format('Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"', proposalResponses[0].response.status, proposalResponses[0].response.message));
    var promises = []
    var sendPromise = channel.sendTransaction({
      proposalResponses: proposalResponses,
      proposal: proposal
    })
    sendPromise.then( (result) => {
      console.log("transaction result")
      console.log(result)
      res.send(result)
    })
  // }
}
