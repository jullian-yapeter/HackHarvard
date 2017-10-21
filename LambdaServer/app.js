var axios = require('axios');
axios({
    method: 'POST',
    url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDE0Zl_i1EP5Y99yKGfge6_X_250z7T7h4',
    data: {
        "requests":[
            {
                "image": {
                    "content": decodeURIComponent("%2F9j%2F4AAQSkZJRgABAQAAAQABAAD%2F2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAs")
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
    console.log(response.data.responses[0].labelAnnotations);
    return response;
}).catch(function(error){
    console.log('analyze failed', error.response);
    return error;
});