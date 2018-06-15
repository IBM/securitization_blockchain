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
# ENTRYPOINT /root/securitization_blockchain/sc-ui/
# on successful build, run with
# docker run -it -p 3000:3000 -p 3001:3001 -v /var/run/docker.sock:/var/run/docker.sock -v /usr/local/bin/docker:/usr/local/bin/docker securitization_blockchain bash -c 'npm start | PORT=3001 node react-backend/bin/www'
