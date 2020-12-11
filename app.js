var express = require('express');
const nodemailer = require('nodemailer');

var app = express();
const myModule = require('./myModule.js')
const port = 3000;

async function sendEmail(payTo, amt, payer, payerEmail, desc, address) {
    let transport = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
           user: 'cryptolunch6@gmail.com',
           pass: 'cryptoecs189f'
        },
    }); 

    const message = {
        from: '"CryptoLunch" <cryptolunch@gmail.com>', // Sender address
        to: payerEmail,         // recipient
        subject: 'Cryptolunch Payment ID', // Subject line
        text: `Hi ${payer}! You owe ${payTo} ${amt} for ${desc}. You can make your payment here: ${address}` 
    };

    transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    });
}

// timer = setInterval( function() { 
//     // check state of smart contract, if not paid out continue
//     if (paid) {
//         clearInterval(timer) //stop timer
//     }
//     sendEmail(); 
// }, 60000); // every hour


app.get('/', function (req, res){
    res.send('hello world')
});

app.listen(port, () =>  {
    console.log("Server listening at http://localhost:" + port);

});


