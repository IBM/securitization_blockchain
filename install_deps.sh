# Installs dependencies for UI
# docker cp . $(docker ps -lq):/root/
set -e
# set -x
## TODO, see if regular node install is faster
# curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
# sudo apt-get install -y nodejs

echo "installing nvm"
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
echo '
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm' >> .bash_profile
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install v8.9.0
echo "PATH=${PATH}:/root/.nvm/versions/node/v8.9.0/bin/" >> /etc/environment
# git clone https://github.com/IBM/securitization_blockchain
cd /root/securitization_blockchain/sc-ui
npm install

cd /root/securitization_blockchain/sc-ui/react-backend
pwd
# this shouldn't be necessary since it's in package.json, but we get an error looking for "nopt" and other grpc dependencies otherwise
npm install node-pre-gyp
npm install --only=dev
npm install
npm install grpc@1.11.0
# npm rebuild
# npm start | PORT=3001 node react-backend/bin/www
