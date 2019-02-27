FROM ubuntu:16.04
RUN apt-get update -y && \
apt-get install git curl -y && \
apt-get install build-essential python -y
# build image from local repo
RUN mkdir -p /root/securitization_blockchain/
COPY . /root/securitization_blockchain/.
# build image from git repo
# RUN git clone https://github.com/IBM/securitization_blockchain.git
RUN /root/securitization_blockchain/install_deps.sh
ENV PATH="/root/.nvm/versions/node/v8.9.0/bin/:${PATH}"
ENV PORT="30000"

# ENTRYPOINT /root/securitization_blockchain/sc-ui/
# on successful build, start container with following command
# docker run -it -p 30000:30000 -p 30001:30001 --name securitization -e DEPLOY_TYPE=local  --network net_basic kkbankol/securitization-blockchain bash -c 'cd /root/securitization_blockchain/sc-ui ; PORT=30000 npm start | PORT=30001 node react-backend/bin/www'
