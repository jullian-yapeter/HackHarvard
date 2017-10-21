var firebase = require('firebase');
var axios = require('axios');
const SmsService = require('./smsService')
const DETECTION_INTERVAL = 600000; // 10 mins
const config = {
    apiKey: "AIzaSyCwQpL7RWnl9yYU48VNGObXms4O7TUmUzw",
    authDomain: "gundetection.firebaseapp.com",
    databaseURL: "https://gundetection.firebaseio.com",
    projectId: "gundetection",
    storageBucket: "gundetection.appspot.com"
};

class GunDetectionServices {
    constructor() {
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
    }
    getPastGunDection(uuid, timestamp) {
        return firebase.database().ref('/past/' + uuid + '/lastAlarmTimestamp').once('value').then(function(snapshot) {
            var datetime = snapshot.val().datetime;
            if (timestamp - datetime <= DETECTION_INTERVAL) {
                return true;
            } else {
                return false;
            }
        }).catch(function(error) {
            return false;
        });
    }
    analyzeImage(text) {
        //console.log(text);
        return axios({
            method: 'POST',
            url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBJ3xU8C6KCSG-8zcAVXwfUEigT0oEEtFc',
            data: {
                "requests":[
                    {
                    "image":{
                        "content":decodeURIComponent(text)
                        },
                        "features":[
                            {
                            "type":"LABEL_DETECTION",
                            "maxResults":10
                            }
                        ]
                    }
                ]
            }
        }).then(function(response) {
            console.log('response:' + response);
            console.log(response.data.responses[0].labelAnnotations);
            return response;
        }).catch(function(error){
            console.log('analyze failed', error.response);
            return error;
        });
    }
    analyzeGCP(response) {
        var labels = response.data.responses[0].labelAnnotations;
        return labels.some((label) => {
            return label.description.includes('gun') || label.description.includes('firearm');
        }); 
    }
    detectGun(uuid, timestamp, lat, lon, encoded_image) {
        console.log(uuid);
        console.log(encoded_image);
        return this.getPastGunDection(uuid, timestamp)
        .then((passDectection) => {
            if (!passDectection) {
                console.log("no past detection");
                return this.analyzeImage(encoded_image)
                .then((response) => {
                    //console.log(response);
                    if (this.analyzeGCP(response)){
                        console.log('gun detected');
                        var pastRef = firebase.database().ref('/past/' + uuid + '/lastAlarmTimestamp');
                        pastRef.update({
                             'datetime': timestamp
                        }).catch(function (err) {
                            console.log('update failed', err);
                        });
                        return true;
                    } else {
                        return false;
                    }
                })
            } else {
                return false;
            }
        }).catch(function (err) {
            console.log('detect gun failed', err);
            return false;
        });
    }
}

module.exports = GunDetectionServices