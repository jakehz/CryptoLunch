
const password = require('./password.js').password;
const nodemailer = require("nodemailer");
async function sendEmail(payTo, amt, payerEmail, address) {
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
        text: `You owe ${payTo} ${amt} You can make your payment here: ${address}` 
    };

    transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    });
}
module.exports = sendEmail