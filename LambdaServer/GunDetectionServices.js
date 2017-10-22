var firebase = require('firebase');
var axios = require('axios');
const DETECTION_INTERVAL = 600000; // 10 mins
const config = {
    apiKey: 'AIzaSyCwQpL7RWnl9yYU48VNGObXms4O7TUmUzw',
    authDomain: 'gundetection.firebaseapp.com',
    databaseURL: 'https://gundetection.firebaseio.com',
    projectId: 'gundetection',
    storageBucket: 'gundetection.appspot.com'
};

class GunDetectionServices {
    constructor() {
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
    }
    getPastGunDection(uuid, timestamp) {
        return firebase
            .database()
            .ref('/past/' + uuid)
            .once('value')
            .then(function(snapshot) {
                var datetime = snapshot.val().datetime;
                console.log('past gun detection from firebase', snapshot.val());
                if (parseInt(timestamp) - parseInt(datetime) <= DETECTION_INTERVAL) {
                    return true;
                }
                return false;
            })
            .catch(function(error) {
                return false;
            });
    }
    analyzeImage(text) {
        //console.log(text);
        return axios({
            method: 'POST',
            url:
                'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBJ3xU8C6KCSG-8zcAVXwfUEigT0oEEtFc',
            data: {
                requests: [
                    {
                        image: {
                            content: decodeURIComponent(text)
                        },
                        features: [
                            {
                                type: 'LABEL_DETECTION',
                                maxResults: 10
                            }
                        ]
                    }
                ]
            }
        })
            .then(function(response) {
                console.log('response:' + response);
                console.log(response.data.responses[0].labelAnnotations);
                return response;
            })
            .catch(function(error) {
                console.log('analyze failed', error.response);
                return error;
            });
    }
    analyzeGCP(response) {
        var labels = response.data.responses[0].labelAnnotations;
        return labels.some(label => {
            return label.description.includes('gun') || label.description.includes('firearm');
        });
    }
    detectGun(uuid, timestamp, lat, lon, encoded_image) {
        console.log(uuid);
        console.log(encoded_image);
        return this.getPastGunDection(uuid, timestamp)
            .then(passDectection => {
                if (passDectection) {
                    return false;
                }
                console.log('no past detection');
                return this.analyzeImage(encoded_image).then(response => {
                    if (!this.analyzeGCP(response)) {
                        return false;
                    }
                    console.log('gun detected');
                    var uuidRef = firebase.database().ref('/past/' + uuid);

                    Promise.all([
                        uuidRef.update({ datetime: timestamp }),
                        uuidRef.update({ coordinates: [lat, lon] })
                    ]).catch(err => console.error('update failed', err));
                    // firebase
                    //     .database()
                    //     .ref('/past/' + uuid + '/lastAlarmTimestamp')
                    //     .update({
                    //         datetime: timestamp
                    //     })
                    //     .catch(err => console.error('update failed', err));
                    return true;
                });
            })
            .catch(function(err) {
                console.log('detect gun failed', err);
                return false;
            });
    }
}

module.exports = GunDetectionServices;
