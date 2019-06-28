# bitcoin-invoice

## Overview
webAPI returns invoice of BTC  

## Requirement
node.js npm  

## Usage
YOUR_SERVER_ADDRESS/api/v1/invoice?amount=AMOUNT_SATOSHI  
return  
{"invoice":"bitcoin:BITCOIN_ADDRESS?amount=AMOUNT_SATOSHI","btc_address":"BITCOIN_ADDRESS"}

## install
`git clone https://github.com/KYpotato/bitcoin-invoice.git`  
`cd bitcoin-invoice`  
`npm install`  
make settings.js  
```
exports.port = YOUR_PORT;
exports.pubkey = YOUR_TESTNET_BTC_PUBLICKEY(tpub...);
exports.index_file = FILE_NAME(anything ok); 
```
`node index.js`  
