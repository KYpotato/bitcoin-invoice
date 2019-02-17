
const express = require('express');
const app = express();
app.use(express.static('web'));

const bitcoin = require('bitcoinjs-lib');
const bip32 = require('bip32');
const base58check = require('base58check');
const NETWORK = bitcoin.networks.mainnet;
const pubKey = 'xprv9s21ZrQH143K25QhxbucbDDuQ4naNntJRi4KUfWT7xo4EKsHt2QJDu7KXp1A3u7Bi1j8ph3EGsZ9Xvz9dGuVrtHHs7pXeTzjuxBrCmmhgC6';

var index = 0;
var parent = bip32.fromBase58(pubKey, NETWORK);

function getAddress(node){
    return bitcoin.payments.p2pkh({pubkey:node.publicKey, network:NETWORK}).address;
}

//app.get('/', (req, res) => res.send('Hello'));
app.get('/api/v1/invoice', (req, res) => {
    var node = parent.derivePath("m/0'/" + String(index));
    index++;
    //const address = "n14trMejKPL8HMBj2EhQkctsDfhMXHMtkJ";
    const address = getAddress(node);
    const ret_val = {invoice: 'bitcoin:' + address + "?amount=" + req.query.amount,
                    btc_address: address};
    res.json(ret_val);
});

app.listen(3000, () => console.log('Listening on port 3000'));