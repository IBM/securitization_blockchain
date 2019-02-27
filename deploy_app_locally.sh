export COMPOSE_PROJECT_NAME=net
cd local
./startFabric.sh
docker run -itd -e DEPLOY_TYPE=local -p 30000:30000 -p 30001:30001 --name securitization --network net_basic kkbankol/securitization-blockchain bash -c 'cd /root/securitization_blockchain/sc-ui && PORT=30000 npm start | PORT=30001 DEPLOY_TYPE=local node react-backend/bin/www'
echo "Run \"docker logs -f securitization\" to follow application logs"
