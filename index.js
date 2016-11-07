const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const natural = require('natural');
const classifier = new natural.BayesClassifier();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            natural.BayesClassifier.load('classifier.json', null, function(err, classifier) {
              const resultClassifier = classifier.classify(event.message.text);
              switch(resultClassifier){
                case 'getPrice':
                  sendMessage(event.sender.id, {text: `Hi, the bitcoin price today is: 2333.90zl`});
                  break;
                case 'pay':
                  sendMessage(event.sender.id, {text: `Hi, do you want to pay your bill? Type the beneficiary name.`});
                  break;
                case 'topup':
                  sendMessage(event.sender.id, {text: `Hi, what's the operator? Play? Orange? Virgin?`});
                  break;
                case 'withdrawal':
                  sendMessage(event.sender.id, {text: `Hi, to which account do you want to send?`});
                  break;
                default:
                  sendMessage(event.sender.id, {text: `Sorry, I didn't understand, can you type again?`});
                  break;
                
              }
            });
        }
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};