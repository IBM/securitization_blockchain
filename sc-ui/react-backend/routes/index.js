var express = require('express');
var router = express.Router();
const request = require('request')
const hfc = require('fabric-client')
var CAClient = require('fabric-ca-client')
var fs = require('fs')
var _ = require('underscore')
var util = require('util')
var async = require('async')
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

var exec = require('child_process').exec;


module.exports = router;
command_prefix = 'docker exec cli peer chaincode invoke -n sec -c \'{"Args":'

function uploadAdminCert(req, mspId) {
  var uploadAdminCertReq = {
    "msp_id": mspId,
    "adminCertName": "admin_cert" + Math.floor(Math.random() * 1000),
    "adminCertificate": user._signingIdentity._certificate,
    "peer_names": Object.keys(client._network_config._network_config.peers),
    "SKIP_CACHE": true
  }
  if ( ! req.body.api_endpoint.includes('/api/v1')) {
    var api_endpoint = req.body.api_endpoint + '/api/v1'
  } else {
    var api_endpoint = req.body.api_endpoint
  }
  var options = {
      url: api_endpoint + '/networks/' + req.body.network_id + '/certificates',
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Accept-Charset': 'utf-8',
          "Authorization": "Basic " + new Buffer(req.body.key + ":" + req.body.secret, "utf8").toString("base64")
      },
      body: uploadAdminCertReq
  }
  // console.log(options)
  console.log("uploading admin cert")
  request(options, function(err, res, body) {
    console.log("res")
    console.log(res)
    if (err) {
      console.log(err)
    }
  })
}

function enrollUser (username, client, networkId, client_crypto_suite, req, res) {
  return new Promise((resolve, reject) => {
    console.log("Monitoring Client User doesn't exist. Loading CA client to enroll")
    var org = Object.keys(client._network_config._network_config.organizations)[0]
    // console.log("loading org")
    // console.log(org)
    var certificateAuthorities = client._network_config._network_config.certificateAuthorities
    var certificateAuthorityName = Object.keys(certificateAuthorities)[0]
    var certificateAuthObj = certificateAuthorities[certificateAuthorityName]
    var registrar = client._network_config._network_config.certificateAuthorities[certificateAuthorityName].registrar[0]
    var mspId = client._network_config._network_config.organizations[org]['mspid']
    var ca = new CAClient(certificateAuthObj.url, {
      trustedRoots: [],
      verify: false
    }, certificateAuthObj.caName, client_crypto_suite)
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
      client.setUserContext(user).then( () => {
        console.log(username + " enrolled. Upload following certificate via blockchain UI: \n " + 'https://ibmblockchain-starter.ng.bluemix.net' + "/network/" + networkId + "/members/certificates")
        console.log(user._signingIdentity._certificate + '\n')
        resolve()
        // res.send("Upload this certificate \n" + user._signingIdentity._certificate )
        // uploadAdminCert(req, mspId)
      })
    }).catch((err) => {
      reject()
      console.error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);
      throw new Error('Failed to enroll admin');
    });
  })
}

// TODO, let user switch between local deployment and starter plan deployment
// if (fs.existsSync('./connection_profile.json')) {
//   initializeClient(null)
// }
// var client
function requestConnectionProfile(req, res) {
  return new Promise((resolve, reject) => {
    console.log("requesting connection profile")
    if ( ! req.body.api_endpoint.includes('/api/v1')) {
      var api_endpoint = req.body.api_endpoint + '/api/v1'
    } else {
      var api_endpoint = req.body.api_endpoint
    }
    // initializeClient()
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
        if (err) {
          // console.log("Error fetching connection profile")
          reject("Error fetching connection profile")
          // res.send(err)
        }
        fs.writeFile('./connection_profile.json', body, 'utf8', function(err){
          if (err) {
            console.log(err)
            console.log(err)
            reject("Error writing connection profile")
          } else {
            resolve()
          }
          // initializeClient()
        })
        // return json
        // return hfc.loadFromConfig(json)
    })
  })
  // TODO, remove this after testing
}

function loadConnectionProfile() {
  if (fs.existsSync('./connection_profile.json')) {
    console.log("Local connection profile loading")
    client = hfc.loadFromConfig('./connection_profile.json')
  }
}

function initializeClient(req, res) {
  console.log("Initializing HFC client")
  if (fs.existsSync('./connection_profile.json')) {
    console.log("Local connection profile loading")
    client = hfc.loadFromConfig('./connection_profile.json')
    org = Object.keys(client._network_config._network_config.organizations)[0]
    // console.log("loading org")
    // console.log(org)
    certificateAuthorities = client._network_config._network_config.certificateAuthorities
    certificateAuthorityName = Object.keys(certificateAuthorities)[0]
    certificateAuthObj = certificateAuthorities[certificateAuthorityName]
    var mspId = client._network_config._network_config.organizations[org]['mspid']
    var storePath = './'
    var client_crypto_suite = hfc.newCryptoSuite()
    var crypto_store = hfc.newCryptoKeyStore({path: storePath})
    var crypto_suite = hfc.newCryptoSuite()
    console.log(client)
    console.log(org)
    // console.log(crypto_suite)
    // crypto_suite.setCryptoKeyStore(crypto_store)
    // client.setCryptoSuite(crypto_suite)
    var username = "monitoring_admin"

    async.series([
      function(callback) {
        console.log("set CryptoKeyStore")
        crypto_suite.setCryptoKeyStore(crypto_store)
        // client.setCryptoSuite(crypto_suite)
        callback()
      },
      function(callback) {
        console.log("set CryptoSuite")
        client.setCryptoSuite(crypto_suite)
        callback()
      },
      function(callback) {
          hfc.newDefaultKeyValueStore({path: storePath}).then( (store) => {
            console.log("Set default keystore")
            client.setStateStore(store)
            callback()
          })
      },
      function(callback) {
        client.getUserContext(username, true).then ( (user) => {
        // res.send("Client Initialized")
        console.log("Loading user context")
        if (user && user.isEnrolled()) {
            console.log("Client Loaded From Persistence")
            // res.send("Client Loaded From Persistence")
            console.log("Be sure to upload following cert via blockchain UI: \n") //+ req.body.urlRestRoot + "/network/" + req.body.networkId + "/members/certificates")
            console.log(user._signingIdentity._certificate + '\n')
            res.json({"msg": "Please upload following cert to IBM Blockchain UI", "certificate": user._signingIdentity._certificate}) //{msg: "Please upload following cert to IBM Blockchain UI", cert: user._signingIdentity._certificate})
            callback()
          // TODO, render this certificate in UI, and only when admin calls fail
          } else {
              enrollUser(username, client, client._network_config._network_config['x-networkId'], client_crypto_suite, req).then( () => {
                callback()
              })
            }
        })
      },
      function(callback) {
        console.log("Requesting Chaincode information")
        peer = client.getPeersForOrgOnChannel()[0]._name
        channel = client.getChannel()
        sec_chaincode = {
          name: req.body.chaincode_id,
          version: req.body.chaincode_version
        }
        console.log("chaincode info, channel, peers set")
        // client.queryInstalledChaincodes(peer, true).then( (response) => {
        //   console.log(response)
        //   chaincodes = response
        // }).then ( (result) =>  {
        //   // sec_chaincode = _.where( chaincodes.chaincodes, {name: 'sec', version: 'v7'} )[0]
        //   sec_chaincode = _.where( chaincodes.chaincodes, {name: req.body.chaincode_id, version: req.body.chaincode_version} )[0]
        //   console.log(chaincodes)
        //   // res.sendStatus(200)
        // }).catch(
        //   console.log("Error loading chaincode, please confirm admin cert has been uploaded and chaincode id/version is correct")
        // );
      }
    ],
    function(err) {
      console.log(err)
    })
    // .then( () => {
    //   console.log("setCryptoKeyStore ")
    //   username = "monitoring_admin"
    //   // var crypto_store = hfc.newCryptoKeyStore({path: storePath})
    //   // crypto_suite.setCryptoKeyStore(crypto_store)
    //   client.setCryptoSuite(crypto_suite)
    // }).catch( (err) => {
    //     console.log("failed to set crypto_store")
    //     console.log(err)
    // })
    // // config.setCryptoSuite(client_crypto_suite);
    // // if (typeof(client) !== 'undefined') {
    // setTimeout( function () {
    //   console.log("Waiting")
    //
    //   hfc.newDefaultKeyValueStore({path: storePath}).then( (store) => {
    //       console.log("Set default keystore")
    //
    //       client.setStateStore(store).then(() => {
    //         client.getUserContext(username, true).then ( (user) => {
    //         // res.send("Client Initialized")
    //         console.log("Client Initialized")
    //         if (user && user.isEnrolled()) {
    //           console.log("Client Loaded From Persistence")
    //           // res.send("Client Loaded From Persistence")
    //           console.log("Be sure to upload following cert via blockchain UI: \n" + req.body.urlRestRoot + "/network/" + req.body.networkId + "/members/certificates")
    //           console.log(user._signingIdentity._certificate + '\n')
    //           // TODO, render this certificate in UI, and only when admin calls fail
    //         } else {
    //           console.log("Monitoring Client User doesn't exist. Loading CA client to enroll")
    //           enrollUser(username, client, req.body.urlRestRoot, req.body.networkId)
    //           }
    //         })
    //       })
    //     })
    // }, 3000)
    console.log("end of init_client")
    // }
  }
  else {
    console.log("connection profile doesn't exist, exiting")
    return
  }
}

// if (typeof(client) !== 'undefined') {
//   console.log("client loaded")
//   org = Object.keys(client._network_config._network_config.organizations)[0]
//   // console.log("loading org")
//   // console.log(org)
//   certificateAuthorities = client._network_config._network_config.certificateAuthorities
//   certificateAuthorityName = Object.keys(certificateAuthorities)[0]
//   certificateAuthObj = certificateAuthorities[certificateAuthorityName]
//   mspId = client._network_config._network_config.organizations[org]['mspid']
//   storePath = './'
//   client_crypto_suite = hfc.newCryptoSuite()
//   crypto_store = hfc.newCryptoKeyStore({path: storePath})
//   crypto_suite = hfc.newCryptoSuite()
//   crypto_suite.setCryptoKeyStore(crypto_store)
//   username = "monitoring_admin"
//   // var crypto_store = hfc.newCryptoKeyStore({path: storePath})
//   // crypto_suite.setCryptoKeyStore(crypto_store)
//   client.setCryptoSuite(crypto_suite)
//   hfc.newDefaultKeyValueStore({path: storePath}).then( (store) => {
//     client.setStateStore(store)
//   }).then( (result) => {
//     client.getUserContext(username, true).then ( (user) => {
//     // res.send("Client Initialized")
//     console.log("Client Initialized")
//     if (user && user.isEnrolled()) {
//       console.log("Client Loaded From Persistence")
//       // res.send("Client Loaded From Persistence")
//       console.log("Be sure to upload following cert via blockchain UI: \n" )
//       console.log(user._signingIdentity._certificate + '\n')
//       peer = client.getPeersForOrgOnChannel()[0]._name
//       channel = client.getChannel()
//       client.queryInstalledChaincodes(peer, true).then( (response) => {
//         console.log(response)
//         chaincodes = response
//       }).then ( (result) =>  {
//         sec_chaincode = _.where( chaincodes.chaincodes, {name: 'sec', version: 'v6'} )[0]
//         console.log(chaincodes)
//         // res.sendStatus(200)
//       })
//     }
//   })
// })
// }

router.post('/init_hfc_client', function (req, res) {
    // console.log("request received to initialize client")
    // command =  command_prefix + '\'{"Args":["process_payment", "asset1", "3000"]}\' -C myc'
    // exec(command)
    console.log("req")
    console.log(req)
    if (fs.existsSync('./connection_profile.json')) {
      console.log("Loading connection profile from local file")
      // var username = "monitoring_admin"
      // client = hfc.loadFromConfig('./connection_profile.json')
      initializeClient(req, res)
    } else {
      console.log("Requesting connection profile")
      // key = req.body.key
      // secret = req.body.secret
      // network_id = req.body.networkId
      requestConnectionProfile(req, res).then( () => {
        initializeClient(req, res)
      })
      // async.series([
      //   function(callback) {
      //     console.log("get connection_profile")
      //     requestConnectionProfile( req, res ).then( () =>
      //      {
      //        callback()
      //      }
      //     )
      //   },
      //   function(callback) {
      //     initializeClient(req, res)
      //     callback()
      //   }
      // ],
      // function(err) {
      //   console.log(err)
      // })

      // client = hfc.loadFromConfig(response)
    }
    // console.log(client)
    // console.log(req)
    // res.send(200)
});

// command = 'docker exec cli peer chaincode invoke -n sec -c '{"Args":["read","asset1"]}' -C myc 2> docker.out ; cat docker.out | grep chaincodeInvokeOrQuery | grep -v ESCC | awk -F \'payload:\' \'{print $2}\''

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
        console.log("req.body.method")
        console.log(req.body.method)
        if (req.body.method && req.body.method.includes('invoke') ) {
          console.log("invoking request")
          var transaction_id = client.newTransactionID(true)
          var txRequest = {
            chaincodeId: sec_chaincode.name, //chaincode.name,
            chaincodeVersion: sec_chaincode.version, //chaincode.version,
            txId: transaction_id,
            fcn: req.body.params.ctorMsg.function, // TODO, uncomment this
            args: req.body.params.ctorMsg.args
          }
          console.log(txRequest)
          proposeTransaction(txRequest)
          // if ( proposeTransaction(txRequest)) {
          //   submitTransaction(txRequest)
          // } else {
          //   console.log("transaction rejected")
          // }
      } else { // query
          console.log("query chaincode with hfc client")
          console.log("req.body.method")
          console.log(req.body.method)
          console.log(sec_chaincode)
          // var assetId = JSON.parse(req.body.params.ctorMsg.args).assetID
          var txRequest = {
            chaincodeId: sec_chaincode.name,
            chaincodeVersion: sec_chaincode.version,
            // txId: transaction_id,
            fcn: req.body.params.ctorMsg.function,
            args: req.body.params.ctorMsg.args
          }
          console.log("txRequest")
          console.log(txRequest)
          channel.queryByChaincode(txRequest).then( (cc_response) => {
            console.log("cc query response received")
            console.log(cc_response[0].toString())
            res.send( cc_response[0].toString() )
          }).catch ( (err) => {
            console.log("cc query failed")
            console.log(err)
            res.send(err)
          })
      }
  } else {
  // if (client == null) {
    console.log("hfc client not defined, invoking chaincode with docker")
    // if hyperledger client not initialized, assume local Docker network is running
    var command = 'docker exec cli peer chaincode invoke -n sec -c \'' + chaincode_query +  '\' -C myc 2> docker.out ; cat docker.out | grep chaincodeInvokeOrQuery | grep -v ESCC | awk -F \'payload:\' \'{print $2}\''
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
  // payload=$(docker exec cli peer chaincode invoke -n sec -c '{"Args":["read","asset1"]}' -C myc 2> docker.out ; cat docker.out | grep chaincodeInvokeOrQuery | grep -v ESCC | awk -F 'payload:' '{print $2}')
  // echo -e $payload
  // output=$(cat docker.out | grep chaincodeInvokeOrQuery | grep -v ESCC | awk -F 'payload:' '{print $2}' )
  // res.send(200)
});



// var chaincodes, peer, channel, sec_chaincode
// router.post('/getchaincodes', function (req, res) {
//   console.log("in getchaincodes call")
//   client.getUserContext('admin', true)
//   // console.log(req)
//   // res.send('received chaincode call')
//   peer = client.getPeersForOrgOnChannel()[0]._name
//   channel = client.getChannel()
//   client.queryInstalledChaincodes(peer, true).then( (response) => {
//     console.log(response)
//     chaincodes = response
//   }).then ( (result) =>  {
//     sec_chaincode = _.where( chaincodes.chaincodes, {name: 'sec', version: 'v7'} )[0]
//     console.log(chaincodes)
//     res.sendStatus(200)
//   });
// });

// function proposeTransaction(txRequest) {
//   channel.sendTransactionProposal(txRequest).then ( (proposalRes) => {
//     console.log("sending transaction proposal")
//     var proposalResponses = proposalRes[0];
//     var proposal = proposalRes[1];
//     let isProposalGood = false;
//     console.log("proposalResponses")
//     console.log(proposalResponses)
//     if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
//         console.log('Transaction proposal was accepted');
//         // return true;
//         // console.log("proposalResponses")
//         // console.log(proposalResponses)
//         // console.log("proposal")
//         // console.log(proposal)
//
//         setTimeout(function() {
//           channel.sendTransaction({
//             proposalResponses: proposalResponses,
//             proposal: proposal
//           }).then( (result) => {
//             console.log("transaction result")
//             console.log(result)
//             // res.send(result)
//           })
//         }, 1000)
//
//       } else {
//         console.log('Transaction proposal was rejected');
//         // console.log('Transaction proposal was rejected');
//         return false
//     }
//   }).catch ( (err) => {
//     console.log(err)
//     return false
//     // res.send(err)
//   });
// }

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

function proposeTransaction(txRequest) {
  channel.sendTransactionProposal(txRequest).then ( (proposalRes) => {
    console.log("sending transaction proposal")
    var proposalResponses = proposalRes[0];
    var proposal = proposalRes[1];
    let isProposalGood = false;
    if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
        console.log('Transaction proposal was accepted');
        // return true;
        channel.sendTransaction({
          proposalResponses: proposalResponses,
          proposal: proposal
        }).then( (res) => {
            console.log("Transaction result")
            console.log(res)
        })
      } else {
        console.log('Transaction proposal was rejected');
        // console.log('Transaction proposal was rejected');
        return false
      }
  }).catch ( (err) => {
    return false
    console.log(err)
    // res.send(err)
  });
}
