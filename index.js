
const express = require('express');
const app = express();
const settings = require('./settings');
app.use(express.static('web'));
var fs = require('fs');

const bitcoin = require('bitcoinjs-lib');
const bip32 = require('bip32');
const base58check = require('base58check');
const NETWORK = bitcoin.networks.testnet;
const pubKey = settings.pubkey;
const test_address = settings.test_address;

console.log(settings.index_file);

var index;
try {
    fs.statSync(settings.index_file)
    var file = fs.readFileSync(settings.index_file, 'utf-8');
    index = file;
    console.log("file content:" + file);
} catch(err){
    index = 0;
}

var parent = bip32.fromBase58(pubKey, NETWORK);

function getAddress(node){
    return bitcoin.payments.p2pkh({pubkey:node.publicKey, network:NETWORK}).address;
}

app.get('/api/v1/invoice', (req, res) => {
    var node = parent.derivePath(String(index));
    index++;
    fs.writeFile(settings.index_file, index, function(err) {
        if(err){
            console.log(err);
        }
    });
    //const address = test_address;
    const address = getAddress(node);
    const ret_val = {invoice: 'bitcoin:' + address + "?amount=" + req.query.amount,
                    btc_address: address};
    res.json(ret_val);
});

app.listen(settings.port, () => console.log('Listening on port ' + settings.port));
