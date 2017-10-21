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
        //console.log(event);
        var requestData = JSON.parse(JSON.stringify(event));
        var requestBody = requestData.body;
        console.log('request body' + requestBody);
        if (!requestData.headers['User-Agent'].includes('okhttp')) {
            console.log('11111111');
            var bodyJson = requestBody.split('&').reduce((json, data) => {
                var [key, val] = data.split('=');
                json[key] = val;
                return json;
            }, {});
        } else {
            console.log('22222222');
            var bodyJson = JSON.parse(requestBody);
            bodyJson.encoded_image = unescape(bodyJson.encoded_image);
        }
        console.log('body json' + bodyJson);
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
            callback(null, responses.success(error))
        });
    }
}