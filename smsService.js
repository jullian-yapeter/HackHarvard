var twilio = require('twilio');

var accountSid = 'AC26428257217bf39204381e50ac8cf1f9'; // Your Account SID from www.twilio.com/console
var authToken = '9b78591857048edc714bc76b7343f6a6'; // Your Auth Token from www.twilio.com/console
var receiver = '+19292739691';
var sender = '+14159094122';

var client = new twilio(accountSid, authToken);

exports.textStatic = function(req, res) {
    // var message = req.search.message;

    return text({ location: '11th St & 24th Ave', date: new Date() }, [
        'https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/2T0t-6V/mafioso-killer-gun-aiming-viewer-a-threatening-mafia-mob-looking-in-camera-with-an-ominous-face-loading-his-gun-aiming-it-at-the-viewer-shooting-going-away-close-up-shot_vkf_biqg__S0000.jpg'
    ]).then(function(response) {
        return res.send(response);
    });
};

function text(data, imgUrls) {
    if (typeof data !== 'object') {
        throw new Error('Invalid data format');
    }

    if (typeof imgUrls !== 'object') {
        throw new Error('Invalid img url parameter format');
    }

    function reverseGeocode(latlng) {
        // latlng in the form lat,lng
        return axios
            .get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${API_KEY}`
            )
            .then(response => {
                return response.results[0].formatted_address;
            });
    }

    return reverseGeocode(data.latlng)
        .then(address => {
            return `Warning! There was a potentially armed hostile individual spotted at ${address} at ${data.date}.`;
        })
        .then(message =>
            client.messages.create({
                body: message,
                mediaUrl: imgUrls,
                // to: receiver,
                from: sender
            })
        )
        .then(
            function({ body, dateCreated }) {
                return body;
                // do something with the response
                // firebase.database().ref('messages/' + response.sid).set({
                //     status: "sent",
                //     message: body,
                //     date: dateCreated,
                // })
            },
            function(err) {
                console.error(err);
            }
        );
}
