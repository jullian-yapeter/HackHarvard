var twilio = require('twilio');
var axios = require('axios');

var accountSid = 'AC26428257217bf39204381e50ac8cf1f9';
var authToken = '9b78591857048edc714bc76b7343f6a6';
var receiver = '+19292739691';
var sender = '+14159094122';

var geoCodingAPI = 'AIzaSyDEtpXuQTPIjRriZDytcqOtD0aUE8kHN2M';
var t = new twilio(accountSid, authToken);;

exports.generateMessage = function(lat, lng, date) {
    var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${parseFloat(lat)},${parseFloat(lng)}&key=${geoCodingAPI}`;

    return axios.get(url).then(response => {
        console.log(response);
        var localAddress = response.data.results[0].formatted_address;

        return `Emergency! Potentially armed and hostile indivial spotted at ${localAddress} at ${date}.`;
    }).catch(err => console.error(err));
}

exports.text = function(message) {
    console.log("sending msg")
    if (typeof message !== 'string') {
        throw new Error('Invalid message format');
    }

    return t.messages
        .create({
            body: message,
            //mediaUrl: imgURls,    
            to: receiver,
            from: sender
        })
        .then(response => {
            console.log('Twilio Response: ', response);
        })
        .catch(err => {
            console.error('error: ', err);
        });
}

// class TwilioService {
//     constructor() {
//         if (!t) {
//             t = new twilio(accountSid, authToken);
//         }
//     }

//     generateMessage(data) {
//         var { lat, lng, date } = data;
//         var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${geoCodingApi}`;

//         return axios.get(url).then(({ results }) => {
//             var localAddress = results[0].formatted_address;

//             return `Emergency! Potentially armed and hostile indivial spotted at ${localAddress} at ${date}.`;
//         });
//     }

//     text(message) {
//         // if (typeof imgURls !== 'object') {
//         //     throw new Error('Invalid data format');
//         // }
//         console.log("sending msg")
//         if (typeof message !== 'string') {
//             throw new Error('Invalid message format');
//         }

//         return t.messages
//             .create({
//                 body: message,
//                 //mediaUrl: imgURls,
//                 to: receiver,
//                 from: sender
//             })
//             .then(response => {
//                 console.log('Twilio Response: ', response);
//             })
//             .catch(err => {
//                 console.error('error: ', err);
//             });
//     }
// }

// module.exports = TwilioService