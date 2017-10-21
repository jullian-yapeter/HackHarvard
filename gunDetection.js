var axios = require('axios');

function analyze(response) {}

function analyzeSentiment(text) {
    return axios({
        method: 'POST',
        url: 'https://language.googleapis.com/v1/documents:analyzeSentiment',
        data: {
            document: {
                type: 'PLAIN_TEXT',
                content: text
            }
        }
    }).then(function(response) {
        return response.documentSentiment.score;
    });
}

function analyzeGCP(response) {
    var labels = response[0]['labelAnnotations'];
    var containsGun = labels.some(function(label) {
        label['description'] === 'gun';
    })

    if (containsGun) {
        return true;
    }
    return false;
}
