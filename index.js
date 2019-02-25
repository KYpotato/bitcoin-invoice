
const express = require('express');
const app = express();
const settings = require('./settings');
app.use(express.static('web'));

const bitcoin = require('bitcoinjs-lib');
const bip32 = require('bip32');
const base58check = require('base58check');
const NETWORK = bitcoin.networks.testnet;
const pubKey = settings.pubkey;
const test_address = settings.test_address;

var index = process.init_index;
var parent = bip32.fromBase58(pubKey, NETWORK);

function getAddress(node){
    return bitcoin.payments.p2pkh({pubkey:node.publicKey, network:NETWORK}).address;
}

app.get('/api/v1/invoice', (req, res) => {
    var node = parent.derivePath(String(index));
    index++;
    console.log("index:" + index);
    //const address = test_address;
    const address = getAddress(node);
    const ret_val = {invoice: 'bitcoin:' + address + "?amount=" + req.query.amount,
                    btc_address: address};
    res.json(ret_val);
});

app.listen(settings.port, () => console.log('Listening on port ' + settings.port));

