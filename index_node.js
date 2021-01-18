const express = require("express");
const bodyparser = require("body-parser")
const cors = require('cors')



const Web3 = require("web3");
const { type } = require("os");
const web3 = new Web3('http://foodchain-node2.etherhost.org:22002');

function getContractAbi(){
    'use strict';
    const fs = require('fs');
    var data = fs.readFileSync('food3.abi', 'utf-8');
    return JSON.parse(data);
}
// account property
const PRIVATE_KEY = '0xab09158d9a817633c28c74b6e6c1bf34c26ffadc1a961870beaeef38b0753495';
const ADDRESS = '0x7CbEb723CA0788af6549110fb2a9816ED0BAa1a6';
// contract property
const CONTRACT_ADDRESS = '0xA4fafbE0ea4823e262b4916EF93CC5A6306A5DBc';
const CONTRACT_ABI = getContractAbi();
// build contract
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);




app = express();
app.use(cors())
app.use(bodyparser.json())
app.use(express.static(__dirname + "/"));

app.get("/", (req, res) => {
//   res.sendFile("index.html");
// res.send('hello');
    res.sendFile('C:/Users/assas/Desktop/fff/f-pjoject/FinalProject_Web-21.html')
});



app.post("/Search",(req,res)=>{
    // console.log(req.body)
    // console.log(req.body.logno)
    console.log(req.body)
    console.log(req.body.blockno)
    contract.getPastEvents("AllEvents",
    {
        // filter: {logno: ['123456']},
        // filter:{logIndex:[18]},
        // fromBlock: 173653,//根據上面交易回傳receipt中的blocknumber
        // toBlock: 173653
        fromBlock: req.body.blockno,
        toBlock:req.body.blockno
    })
    .then(events => {
    console.log(events)
    res.send(events)
    })
    .catch((err) => console.error(err));

});



app.get('/FoodLogSectionUpchain',(req,res)=>{
    console.log(req.query)
    console.log(typeof(req.query['logno']))
    
    console.log(typeof(123213))
    // encoded = contract.methods.FoodLogSection(Number(req.query['longo']), '{"dst":[25.018022,122.537907]}', '123', '456').encodeABI();
    // req.query['title'].toString() req.query['loghash'].toString(), req.query['logname'].toString()
    encoded = contract.methods.FoodLogSection(req.query['logno'], req.query['title'],req.query['loghash'],req.query['logname'] ).encodeABI();
    var tx = {
        from: ADDRESS,
        to: CONTRACT_ADDRESS,
        gas: 238960,
        data: encoded,
    };
    web3.eth.accounts.signTransaction(tx, PRIVATE_KEY).then(
        signed => {
            web3.eth.sendSignedTransaction(signed.rawTransaction).
                on('receipt',function(receipt){
                    // console.log('recept',receipt)
                    // res.json(receipt) 

                    contract.getPastEvents("AllEvents",
                    {
                            
                            fromBlock:receipt['blockNumber'] ,//根據上面交易回傳receipt中的blocknumber
                            toBlock: receipt['blockNumber']
                    })
                    .then(events => {
                        console.log(events)
                        res.send(events)
                    })
                    .catch((err) => console.error(err));
                    
                })
                .catch((err) => console.error(err));
        }).catch((err) => console.error(err));


})

app.post('/FoodLogImageUpchain',(req,res)=>{
    console.log(req.body)
    encoded = contract.methods.FoodLogImage(
        req.body.logno, req.body.imageurl, req.body.filehash).encodeABI();
    var tx = {
        from: ADDRESS,
        to: CONTRACT_ADDRESS,
        gas: 238960,
        data: encoded,
    };
    web3.eth.accounts.signTransaction(tx, PRIVATE_KEY).then(
        signed => {
            web3.eth.sendSignedTransaction(signed.rawTransaction).
                on('receipt',(receipt)=>{
                    console.log(receipt)
                    // console.log(receipt[0]['blockNumber'])
                    console.log(receipt['blockNumber'])
                    
                    contract.getPastEvents("AllEvents",
                    {
                            
                            fromBlock:receipt['blockNumber'] ,//根據上面交易回傳receipt中的blocknumber
                            toBlock: receipt['blockNumber']
                    })
                    .then(events => {
                        console.log(events)
                        res.send(events)
                    })
                    .catch((err) => console.error(err));
                } )
                .catch((err) => console.error(err));
        }).catch((err) => console.error(err));
})


app.post('/FoodLogUpchain',(req,res)=>{
    
    console.log(req.body)
    encoded = contract.methods.FoodLog(
        req.body.lognoL, req.body.loghashL, req.body.LogName, req.body.Logorg, req.body.LogDate).encodeABI();
    var tx = {
        from: ADDRESS,
        to: CONTRACT_ADDRESS,
        gas: 238960,
        data: encoded,
    };
    web3.eth.accounts.signTransaction(tx, PRIVATE_KEY).then(
        signed => {
            web3.eth.sendSignedTransaction(signed.rawTransaction).
                on('receipt', (receptive)=>{
                    console.log(receptive)
                    // console.log(receptive['blockNumber']) 
                    contract.getPastEvents("AllEvents",
                    {
                            
                            fromBlock:receptive['blockNumber'] ,//根據上面交易回傳receipt中的blocknumber
                            toBlock: receptive['blockNumber']
                    })
                    .then(events => {
                        console.log(events)
                        res.send(events)
                    })
                    .catch((err) => console.error(err));
                })
                .catch((err) => console.error(err));
        }).catch((err) => console.error(err));
})



app.listen(process.env.PORT || 3000, () => {
  console.log("Listen on port 3000");
});
