# Installs dependencies for UI
# docker cp . $(docker ps -lq):/root/
set -e
# set -x
apt-get update -y
apt-get install curl git build-essential python2.7 -y
ln -s /usr/bin/python2.7 /usr/bin/python
echo "installing nvm"
mkdir -p ~/.nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
echo '
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm' >> .bash_profile
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install v8.9.0
echo "PATH=${PATH}:/root/.nvm/versions/node/v8.9.0/bin/" >> /etc/environment

git clone https://github.com/IBM/securitization_blockchain ~/securitization_blockchain
cd ~/securitization_blockchain/sc-ui
npm install

cd ~/securitization_blockchain/sc-ui/react-backend
npm install

echo "127.0.0.1 peer0.org1.example.com
127.0.0.1 ca.example.com
127.0.0.1 orderer.example.com
" >> /etc/hosts
# this shouldn't be necessary since it's in package.json, but we get an error looking for "nopt" and other grpc dependencies otherwise
# npm install node-pre-gyp
# npm install --only=dev
# npm install
# npm install grpc@1.11.0
