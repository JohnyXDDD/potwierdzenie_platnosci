const port = 3001 || process.env.PORT
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const mysql = require('mysql');
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
const paymentsToCheck = []
let interval = setIntervalAsActive()
app.get('/addPaymentId', (req, res) => {
    const paymentId = req.query.paymentId;
    const index = paymentsToCheck.indexOf(paymentId);
    index == -1 && paymentsToCheck.push(paymentId)
    if (!interval) {
        interval = setIntervalAsActive()
    }
    res.redirect(`https://www.onet.pl?paymentId=${paymentId}`);
})
app.listen(port, () => console.log(`Server running on port ${port}`))

function setIntervalAsActive() {
    return setInterval(() => {
        console.log(paymentsToCheck)
        if (paymentsToCheck.length == 0) {
            console.log('Interval is stopped')
            clearInterval(interval)
            interval = undefined
        }
        else {
            paymentsToCheck.forEach(payment => checkPaymentStatus(payment))
        }
    }, 5000)
}

function checkPaymentStatus(id) {
    const options = {
        method: 'GET',
        url: `http://localhost:3010?paymentId=${id}`,
    }
    axios.request(options).then(response => {
        const paymentId = response.data.paymentId
        const paymentStatus = response.data.status;
        if (paymentStatus !== 'waiting') {
            updateDatabase(paymentId, paymentStatus)
        }
    }).catch(error => { })
}

function updateDatabase(id, status) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'node',
    });

    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected to MySQL!');
    });

    const sqlSelect = "UPDATE payments SET status='" + status + "' WHERE id='" + id + "'";

    connection.query(sqlSelect, (err, rows) => {
        if (err) throw err;
        const index = paymentsToCheck.indexOf(id);
        index > -1 && paymentsToCheck.splice(index, 1)
    });
    connection.end((err) => {
        if (err) throw err;
        console.log('Connection closed.');
    });
}