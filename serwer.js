const port = process.env.PORT || 3000
const express = require('express')
const cors = require('cors')
// require('dotenv').config()
const app = express()
app.use(cors())
// {
//     'origin':"*",
//     'Content-Type': 'text/plain',
//     'Access-Control-Allow-Origin' : '*',
//     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
// // }
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next()
// })
app.get('/', (req, res) => {
    const paymentId = req.query.paymentId;
    const randomNo = Math.floor(Math.random() * 2) + 1;
    let status = ''
    if (randomNo == 1) {
        status = 'canceled'
    }
    else if (randomNo == 2) {
        status = 'confirmed'
    }
    else {
        status = 'waiting'
    }
    res.send({
        paymentId: paymentId,
        status: status
    })
    res.redirect('https://www.interia.pl');
})
app.listen(port, () => console.log(`Server running on port ${port}`))