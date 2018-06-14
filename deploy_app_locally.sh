#!/bin/bash
# Deploy locally
PROJECT_ROOT_DIR=$(pwd)
docker build -t securitization_blockchain .

echo "Starting local hyperledger network"
git clone https://github.com/hyperledger/fabric-samples.git
cd fabric-samples/chaincode-docker-devmode
docker-compose -d -f docker-compose-simple.yaml up
cd $PROJECT_ROOT_DIR

echo "Uploading chaincode"
docker exec -it chaincode mkdir -p securitization
docker cp ./chaincode/src/. chaincode:/opt/gopath/src/chaincode/securitization/

echo "Building chaincode"
docker exec -it chaincode bash -c 'cd securitization && go build'

echo "Starting chaincode service"
docker exec -d -it chaincode bash -c 'CORE_PEER_ADDRESS=peer:7052 CORE_CHAINCODE_ID_NAME=sec:0 ./securitization/securitization'

echo "Installing and instantiating chaincode"
docker exec cli peer chaincode install -p chaincodedev/chaincode/securitization -n sec -v 0
docker exec cli peer chaincode instantiate -n sec  -v 0 -c '{"Args":["101"]}' -C myc

echo "Running test command"
docker exec cli peer chaincode invoke -n sec -c '{"Args":["read_everything"]}' -C myc
