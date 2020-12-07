var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
    const bill_amount = req.body.bill_amount;
    const wallet_address = req.body.wallet_address;
    const people = req.body.people;
    // iterate through people email each address with the amount due  
    console.log(req.body);
    res.send(req.body.address);
})
module.exports = router;
