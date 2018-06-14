# Installs dependencies for UI
# docker cp . $(docker ps -lq):/root/
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
# npm install node_pre_gyp
# npm install nopt
cd ~/securitization_blockchain/sc-ui
npm install
cd ~/securitization_blockchain/sc-ui/react_backend
npm install grpc@1.11.0 # this shouldn't be necessary since it's in package.json, but we get an error looking for "nopt" and other grpc dependencies otherwise
npm install
# PORT=3001 npm start | PORT=3001 node react-backend/bin/www
