# Installs dependencies for UI
apt-get update -y && \
apt-get install git curl -y && \
apt-get install build-essential python -y
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install v8.9.0
git clone https://github.com/IBM/securitization_blockchain
cd securitization_blockchain/sc-ui
npm install
cd react-backend
npm install
# PORT 8001 npm start | PORT=3001 node react-backend/bin/www
