
const password = require('./password.js').password;
const nodemailer = require("nodemailer");
async function sendEmail(payTo, amt, payer, payerEmail, desc, address) {
    let transport = nodemailer.createTransport({
        //host: 'smtp.ethereal.email',
        service: 'gmail',
        secure: false,
        auth: {
           user: 'cryptolunch6@gmail.com',
           pass: password
        },
    }); 

    const message = {
        from: '"CryptoLunch" <cryptolunch6@gmail.com>', // Sender address
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
sendEmail("jake", "100", "ipsa", "jakejhdz@gmail.com", "pizza", "address");