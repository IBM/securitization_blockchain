for i in $(ls ./chaincode/src/*go) ;
  do docker cp ${i} chaincode:/opt/gopath/src/chaincode/securitization/ ;
done
docker exec chaincode bash -c 'pkill -f securitization '
docker exec chaincode bash -c 'cd /opt/gopath/src/chaincode/securitization ; \
                                  go build ; if [ "$(echo $?)" == "0" ] ; \
                                    then CORE_PEER_ADDRESS=peer:7051 CORE_CHAINCODE_ID_NAME=sec:0 ./securitization \
                                  ; fi'
