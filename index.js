
const express = require('express');
const app = express();
app.use(express.static('web'));

const bitcoin = require('bitcoinjs-lib');
const bip32 = require('bip32');
const base58check = require('base58check');
const NETWORK = bitcoin.networks.testnet;
const pubKey = 'tpubD8eQVK4Kdxg3gHrF62jGP7dKVCoYiEB8dFSpuTawkL5YxTus5j5pf83vaKnii4bc6v2NVEy81P2gYrJczYne3QNNwMTS53p5uzDyHvnw2jm';

var index = 0;
var parent = bip32.fromBase58(pubKey, NETWORK);

function getAddress(node){
    return bitcoin.payments.p2pkh({pubkey:node.publicKey, network:NETWORK}).address;
}

app.get('/api/v1/invoice', (req, res) => {
    var node = parent.derivePath(String(index));
    index++;
    //const address = "n14trMejKPL8HMBj2EhQkctsDfhMXHMtkJ";
    const address = getAddress(node);
    const ret_val = {invoice: 'bitcoin:' + address + "?amount=" + req.query.amount,
                    btc_address: address};
    res.json(ret_val);
});

app.listen(process.env.PORT, () => console.log('Listening on port ' + process.env.PORT));
