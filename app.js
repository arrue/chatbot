'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const access_token = "EAAlh0yeDiv4BAHNxf3Dvfbkt5ZCMDF52N2DKZBjyhejNlp42H9mCNDfLyffyMnv7kyG5ZAMmFZCBCQSZBaH5hKKqPfNZBz90MwONxqiX3wX5LEsABLOtkZCWOFAd5fO5iJipbO6RV1VCguCpWMZAAFQENndOLuFJJH5aXxT0upOMVAZDZD"

const app = express();

app.set('port', 5000);
app.use(bodyParser.json());

app.get('/', function(req, response){
    response.send('Hola Mundo!');
})

app.get('/webhook', function(req, response){
    if(req.query['hub.verify_token'] === 'ChatBotMariaDeLaEsperanza_token'){
        response.send(req.query['hub.challenge']);
    } else {
        response.send('Colegio Maria de la Espranza no tienes permisos.');
    }
});

app.post('/webhook/', function(req, res){
    const webhook_event = req.body.entry[0];
    if(webhook_event.messaging) {
        webhook_event.messaging.forEach(event => {
          handleEvent(event.sender.id, event);
        });
    }
    res.sendStatus(200);
});

function handleEvent(senderId, event){
    if(event.message){
        handleMessage(senderId, event.message)
    }else if(event.postback){
        handlePostback(senderId, event.postback.payload)
    }
}

function handleMessage(senderId, event){
    if(event.text){
        defaultMessage(senderId);
    }else if(event.attachments){
        handleAttachments(senderId, event);
    }
}

function defaultMessage(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Hola soy un bot de messenger y te invito a utilizar nuestro menu",
            "quick_replies":[
                {
                    "content_type": "text",
                    "title": "Conocenos",
                    "payload": "SERVICIOS_PAYLOAD"
                },
                {
                    "content_type": "text",
                    "title": "Acerca de",
                    "payload": "ABOUT_PAYLOAD"
                }
            ]
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function handlePostback(senderId, payload){
    console.log(payload)
    switch (payload){
        case "GET_STARTED_CHATBOTMARIADELAESPERANZA":
            console.log(payload)
        break;
        case "SERVICIOS_PAYLOAD":
            showServicios(senderId);
        break;
    }
}
 
function senderActions(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "sender_action": "typing_on"
    }
    callSendApi(messageData);
}

function handleAttachments(senderId, event){
    let attachment_type = event.attachments[0].type;
    switch (attachment_type){
        case "image":
            console.log(attachment_type);
        break;
        case "video":
            console.log(attachment_type);
        break;
        case "audio":
            console.log(attachment_type);
        break;
        case "file":
            console.log(attachment_type);
        break;
        default: 
            console.log(attachment_type);
        break;
    }
}

function callSendApi(response) {
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {
            "access_token": access_token
        },
        "method": "POST",
        "json": response
    },
    function(err) {
        if(err) {
            console.log('Ha ocurrido un error')
        } else {
            console.log('Mensaje enviado')
        }
    }
    )  
}

function showServicios(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Preprimaria",
                            "subtitle": "blablabla",
                            "image_url": "https://www.facebook.com/colegiomariadelaesperanza/photos/a.232940890241905/1110950415774277/?type=3&theater",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Preprimaria",
                                    "payload": "PREPRIMARIA_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "Primaria",
                            "subtitle": "blablabla",
                            "image_url": "https://www.facebook.com/colegiomariadelaesperanza/photos/a.232940890241905/1098016553734330/?type=3&theater",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Primaria",
                                    "payload": "PRIMARIA_PAYLOAD",
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData)
}

app.listen(app.get('port'), function(){
    console.log('Nuestro servidor esta funcionando con el barto en el puerto: ', app.get('port'));
});