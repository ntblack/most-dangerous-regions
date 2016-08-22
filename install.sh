NODE_VERSION="6.4.0"
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.4/install.sh | bash && 
export NVM_DIR="$HOME/.nvm" &&
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" &&
nvm install $NODE_VERSION &&
nvm use $NODE_VERSION &&
npm install -g . &&
echo "\nDONE"
