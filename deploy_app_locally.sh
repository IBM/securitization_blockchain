#!/bin/bash
set -e
# Deploy locally
PROJECT_ROOT_DIR=$(pwd)
docker build -t securitization_blockchain .

echo "Starting local hyperledger network"
if [ ! -d fabric-samples] ; then
  git clone https://github.com/hyperledger/fabric-samples.git
fi
cd fabric-samples/chaincode-docker-devmode
docker-compose -f docker-compose-simple.yaml down
docker-compose -f docker-compose-simple.yaml up -d
cd $PROJECT_ROOT_DIR

echo "Uploading chaincode"
docker exec -it chaincode mkdir -p securitization
docker cp ./chaincode/src/. chaincode:/opt/gopath/src/chaincode/securitization/

echo "Building chaincode"
docker exec chaincode bash -c 'cd securitization && go build'

echo "Starting chaincode service"
docker exec chaincode pkill -f securitization
docker exec -d chaincode bash -c 'CORE_PEER_ADDRESS=peer:7052 CORE_CHAINCODE_ID_NAME=sec:0 ./securitization/securitization'

echo "Installing and instantiating chaincode"
docker exec cli peer chaincode install -p chaincodedev/chaincode/securitization -n sec -v 0
docker exec cli peer chaincode instantiate -n sec -v 0 -c '{"Args":["101"]}' -C myc

echo "Running test command"
docker exec cli peer chaincode invoke -n sec -c '{"Args":["read_everything"]}' -C myc

docker run --name securitization -itd -p 3000:3000 -p 3001:3001 -v /var/run/docker.sock:/var/run/docker.sock \
                                         -v /usr/local/bin/docker:/usr/local/bin/docker \
                                         securitization_blockchain bash -c 'cd /root/securitization_blockchain/sc-ui ; npm start | PORT=3001 node react-backend/bin/www'
echo "Tailing app logs, press Ctrl + C to exit"
docker log -f securitization
