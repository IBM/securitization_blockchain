docker cp ./chaincode/src/. chaincode:/opt/gopath/src/chaincode/securitization/
docker exec chaincode bash -c 'pkill -f securitization '
docker exec chaincode bash -c 'cd /opt/gopath/src/chaincode/securitization ; \
                                  go build ; if [ "$(echo $?)" == "0" ] ; \
                                    then CORE_PEER_ADDRESS=peer:7052 CORE_CHAINCODE_ID_NAME=sec:0 ./securitization \
                                  ; fi'
