const Router = require('express').Router();
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ASOjStFL2KFmkNwRL_7FnQa4AewCJmqSUmQnv_28ERfZ87S5CArvgVHGY9fYMFv_41p-oVPpF17sPh8P',
    'client_secret': 'EFtKzhOlzCvafyCJJJQBdxBqyJjTQikBzxBP_KAA35psNoSBhCcPzFUWHcLdYGZoFDmObryGmOC-NYts'
  });

Router.get('/', (req, res, next)=>{
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/pay/success",
            "cancel_url": "http://localhost:3000/failed"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "iPhone 6S",
                    "sku": "001",
                    "price": "120.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "120.00"
            },
            "description": "This is the payment description."
        }]
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response)
            throw error;
        } else {
            console.log(payment)
            payment['links'].forEach(n =>{
                if(n.method === 'REDIRECT'){
                    res.redirect(n.href)
                }
            })
        }
    });    
})

Router.get('/success', (req, res, next)=>{
    const PayerID = req.query.PayerID
    const PaymentID = req.query.paymentId

    const execute_payment_json = {
        "payer_id" : PayerID,
        "transactions" : [{
            "amount" : {
                "currency" : "USD",
                "total" : "120.00"
            }
        }]
    }
    paypal.payment.execute(PaymentID, execute_payment_json, (err, payment)=>{
        res.json(payment)
    })
})
module.exports = Router


