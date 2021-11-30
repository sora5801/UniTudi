#!/bin/zsh

### Caution, this file will not work without a .pem file related to
### the AWS server. It will only allow one to be generated with a free
### license, so currently only Anna can run this file.

usage() {
    echo "Usage:"
    echo "./push_to_production.sh <AWS_SERVER_NAME> <AWS_SERVER_IP_ADDRESS>"
    echo "  <AWS_SERVER_NAME>              The name of the AWS server to push to for production."
    echo "  <AWS_SERVER_IP_ADDRESS>        The IP address of the AWS server to push to for production."
}

AWS_SERVER_NAME="$1"
AWS_SERVER_IP_ADDRESS="$2"

USERNAME="ubuntu"
PEM="unitudi.pem"

SERVER_ACCESS="${USERNAME}@${AWS_SERVER_NAME}"

function die() {
    echo "$*" 1>&2
    exit 1
}

function pushd() {
    command pushd "$@" > /dev/null
}

function popd() {
    command popd "$@" > /dev/null
}

if [ -z "$AWS_SERVER_NAME" ]; then
    usage
    exit 0
fi

if [ -z "$AWS_SERVER_IP_ADDRESS" ]; then
    usage
    exit 0
fi

if [ ! -f "$PEM" ]; then
    die "ERROR: No $PEM file was found in the current directory. Have you copied the .pem file into the current directory?"
fi

ssh -qi "$PEM" "$SERVER_ACCESS" "exit 0" &> /dev/null

if [ $? != 0 ]; then
    die "ERROR: Could not successfully access ${AWS_SERVER_NAME} using SSH."
fi

echo "INFO: Updating current main files for use in production..."

# Remove existing build components
rm -rf client/build/ client/node_modules/ &> /dev/null

# Update server dependencies based on issues in Ubuntu
sed -i "" "s/\"bcrypt\": \"^5.0.1\"/\"bcryptjs\": \"^2.4.3\"/g" server/package.json &> /dev/null
sed -i "" "s/\"mongoose\": \"^6.0.12\"/\"mongoose\": \"^5.4.20\"/g" server/package.json &> /dev/null

# Update requirement to use new bcryptjs package
sed -i "" "s/require(\"bcrypt\")/require(\"bcryptjs\")/g" server/app.js server/api/*/*.* server/models/*.* &> /dev/null

# Replace localhost references with server IP address
sed -i "" "s/localhost/${AWS_SERVER_IP_ADDRESS}/g" $(grep -rl "localhost" client/src | tr '\n' ' ') &> /dev/null

echo "INFO: Installing and building code..."

# Build client and copy build into server
pushd client/
if [ ! npm install &> /dev/null && npm run build &> /dev/null ]; then
    die "ERROR: Could not build client code."
fi
popd

echo "INFO: Removing existing files from server..."

# Remove existing client files
ssh -i "$PEM" "$SERVER_ACCESS" "rm -rf client/deploy/*" &> /dev/null

# Remove existing server files
ssh -i "$PEM" "$SERVER_ACCESS" "rm -rf server/*" &> /dev/null

echo "INFO: Copying new files to server..."

# Copy built client code to server
scp -rpi "$PEM" client/build/* "${SERVER_ACCESS}:/home/ubuntu/client/deploy/" &> /dev/null

# Copy server files to server
scp -rpi "$PEM" server/ "${SERVER_ACCESS}:/home/ubuntu/server/" &> /dev/null

# Build server files on server
ssh -i "$PEM" "$SERVER_ACCESS" "pushd server/server/ && npm install && popd" &> /dev/null

# Eliminate changes in local git view
git checkout -- *

echo "DONE: The build has been pushed to production."
