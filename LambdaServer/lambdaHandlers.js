const GunDetectionServices = require('./GunDetectionServices')
var twilio = require('./TwilioService');
var detected = false;

const responseHeaders = {
    'Content-Type':'application/json',
    'Access-Control-Allow-Origin' : '*', 
    'Access-Control-Allow-Credentials' : true 
}

const responses = {
    success: (data={}, code=200) => {
        return {
            'statusCode': code,
            'headers': responseHeaders,
            'body': JSON.stringify(data)
        }
    },
    error: (error) => {
        return {
            'statusCode': error.code || 500,
            'headers': responseHeaders,
            'body': JSON.stringify(error)
        }
    }
}

module.exports = {
    gunDetect : (event, context, callback) => {
        context.callbackWaitsForEmptyEventLoop = false;
        //console.log(event);
        var requestData = JSON.parse(JSON.stringify(event));
        var requestBody = requestData.body;
        if (!requestData.headers['User-Agent'].includes('okhttp')) {
            var bodyJson = requestBody.split('&').reduce((json, data) => {
                var [key, val] = data.split('=');
                json[key] = val;
                return json;
            }, {});
        } else {
            var bodyJson = JSON.parse(requestBody);
            bodyJson.encoded_image = unescape(bodyJson.encoded_image);
        }
        const gunDetectionServices = new GunDetectionServices();
        gunDetectionServices.detectGun(
            bodyJson.uuid,
            bodyJson.timestamp,
            bodyJson.lat,
            bodyJson.lon,
            bodyJson.encoded_image
        ).then((info) => {
            console.log(info);
            detected = info;
            if (!detected) {
                return callback(null, responses.success(detected));
            }
            return callback(null, responses.success(detected))
        }).then(()=>{
            return twilio.generateMessage(bodyJson.lat, bodyJson.lon, new Date());
        }).then((msg)=>{
            console.log(msg);
            return twilio.text(msg);
        }).then(()=>{
            return callback(null, responses.success(detected));
        }).catch(error => {
            console.log('error', error);
            return callback(null, responses.success(false))
        });
    }
}