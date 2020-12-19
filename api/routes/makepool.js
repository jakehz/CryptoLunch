var express = require('express');
var router = express.Router();
const Web3 = require('web3')
const usd_to_wei = require('../convert_usd_to_wei.js');
const sendEmail = require('../sendEmail.js');
const rpcURL = 'http://127.0.0.1:9545/';
const web3 = new Web3(rpcURL);
const get_sc_object = require('../get_sc_object.js');
//const EthereumTX = require('ethereumjs-tx').Transaction;

const smartContract = get_sc_object('Pool');

const abi = JSON.stringify(smartContract.abi);
console.log(abi);
const bytecode = smartContract.evm.bytecode.object;
console.log(bytecode);
let deploy_contract = new web3.eth.Contract(JSON.parse(abi));
let account = "";
(async function(){
    const ganacheAccounts = await web3.eth.getAccounts();
    account = ganacheAccounts[0];
})();

router.post('/', function (req, res) {
    let parameter = {
    from: account,
    gas: web3.utils.toHex(800000),
    gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
    }
    console.log("sent from account:" + account);
    const bill_amount = req.body.bill_amount;
    const wallet_address = req.body.wallet_address;
    const people = req.body.people;
    const requester_name = req.body.requester_name;
    console.log(bill_amount);
    console.log(wallet_address);
    console.log(people);
    // convert usd to wei 
    let amount_due_wei = usd_to_wei(bill_amount);
    let contractAddress = "";
    deploy_contract.deploy(
        {data:bytecode, arguments:[amount_due_wei, wallet_address]}
    ).send(parameter).on('confirmation', () => {}).then((newContractInstance) => {
        console.log('Deployed Contract Address : ', newContractInstance.options.address);
    })
    for (const amount in people) {
            console.log("sending emails:");
            console.log(people);
            console.log(people[amount]);
            sendEmail(requester_name, people[amount], people, 'DUMMY_ADDRESS');

        }
    // iterate through people email each address with the amount due  
    console.log(req.body);
    res.send({people: people});
});
module.exports = router;
