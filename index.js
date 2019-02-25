
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

/* get index info from db */
MongoClient.connect(settings.mongodb_uri, function(err, client){
    if(err) { return console.dir(err); }
    console.log("connected to db");
    const db = client.db(settings.indexdb);
    db.collection('index', function(err, collection){
        if(err){ return console.dir(err); }
        /* index   :next wallet index */
        collection.find().toArray(function(err, items){
            console.log(items);
            for(var i = 0; i < items.length; i++){
                if(index < items[i].index){
                    index = items[i].index;
                }
            }
            console.log(index);
            //stop if thera are no index
            if(items.length == 0){
                console.log("there are no index info on db");
                return;
            }
        });
    });
});

var parent = bip32.fromBase58(pubKey, NETWORK);

function getAddress(node){
    return bitcoin.payments.p2pkh({pubkey:node.publicKey, network:NETWORK}).address;
}

app.get('/api/v1/invoice', (req, res) => {
    var node = parent.derivePath(String(index));
    console.log("index:" + index);
    index++;
    /* update db */
    //connect to db
    MongoClient.connect(settings.mongodb_uri, function(err, client){
        if(!err){
            //use db
            const db = client.db(settings.indexdb);
            db.collection("index", function(err, collection){
                if(!err){
                    //update
                    var filter = {};               
                    var update_data = {$set:{index: index}};
                    collection.updateOne(filter, update_data, function(err, result){
                        console.log("update db:" + result);
                    })
                }else{
                    console.dir(err); 
                }
            })
        }else{
            console.dir(err); 
        }
    })
    //const address = test_address;
    const address = getAddress(node);
    const ret_val = {invoice: 'bitcoin:' + address + "?amount=" + req.query.amount,
                    btc_address: address};
    res.json(ret_val);
});

app.listen(settings.port, () => console.log('Listening on port ' + settings.port));

