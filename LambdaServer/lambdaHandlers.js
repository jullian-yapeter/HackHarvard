const GunDetectionServices = require('./GunDetectionServices')

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
        console.log(event);
        var requestBody = JSON.parse(JSON.stringify(event)).body;
        var bodyJson = requestBody.split('&').reduce((json, data) => {
            var [key, val] = data.split('=');
            json[key] = val;
            return json;
        }, {});
        console.log(bodyJson);
        const gunDetectionServices = new GunDetectionServices();
        gunDetectionServices.detectGun(
            bodyJson.uuid,
            bodyJson.timestamp,
            bodyJson.lat,
            bodyJson.lon,
            bodyJson.encoded_image
        ).then((info) => {
            callback(null, responses.success(info))
        }).catch(error => {
            callback(null, responses.error(error))
        });
    }
}