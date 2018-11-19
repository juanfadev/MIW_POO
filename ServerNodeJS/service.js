const url = require('url');
const fs = require('fs');
const Negotiator = require('negotiator');
const Landmark = require('./landmark.js');
let availableMediaTypes = ['text/html', 'text/plain', 'application/json', 'application/ld+json'];


exports.sampleRequest = function (req, res) {
    const reqUrl = url.parse(req.url, true);
    var name = 'World';
    if (reqUrl.query.name) {
        name = reqUrl.query.name
    }
    var response = {
        "text": "Hello " + name
    };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
};
exports.testRequest = function (req, res) {
    body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        postBody = JSON.parse(body);
        var response = {
            "text": "Post Request Value is  " + postBody.value
        };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
    });
};

exports.invalidRequest = function (req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Invalid Request');
};

exports.indexRequest = function (req, res) {
    let negotiator = new Negotiator(req);
    let mediaType = negotiator.mediaType(availableMediaTypes);
    console.log("Mediatype selected: " + mediaType);
    switch (mediaType) {
        case 'text/plain':
            resp.setHeader('Content-Type', mediaType);
            resp.end(alumnos.toText());
            break;
        case 'application/ld+json':
        case 'application/json':
            resp.setHeader('Content-Type', mediaType);
            resp.end(alumnos.toJson());
            break;
        case 'text/html':
        default:
            fs.readFile('index.html', 'utf8', function (err, datos) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(datos);
            });
    }
};

exports.getEntity = function (req, res, id) {
    let negotiator = new Negotiator(req);
    let mediaType = negotiator.mediaType(availableMediaTypes);
    console.log("Mediatype selected: " + mediaType);
    let landmark = new Landmark(id);
    landmark.getLandmarkById(id).then(data => {
        switch (mediaType) {
            case 'application/ld+json':
            case 'application/json':
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/ld+json');
                res.end(JSON.stringify(data));
                break;
            case 'text/html':
            default:
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(landmark.toHTML(data));

        }
    }).catch((error) => {
        console.log(error);
        this.invalidRequest(req, res);
    });
};



exports.getDefaultEntity = function (req, res, id) {

}

exports.putEntity = function (req, res, id) {
    let landmark = new Landmark(id);
    landmark.updateLandmarkById(JSON.parse(req.body), id).then(data => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    }).catch((error) => {
        console.log(error);
        this.invalidRequest(req, res);
    });
}

exports.postEntity = function (req, res) {
    let body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        let landmark = new Landmark();
        console.log(JSON.parse(body));
        landmark.createNewLandmark(JSON.parse(body)).then(data => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        }).catch((error) => {
            console.log(error);
            this.invalidRequest(req, res);
        });
    });
}

exports.deleteEntity = function (req, res) {
    const landmark = new Landmark();
    landmark.deleteLandmarkById(id).then(err => {
        console.log('path/file.txt was deleted');
        console.log(err);
        if (err) {
            this.invalidRequest(req, res);
        } else {
            res.statusCode = 200;
        }
    })
}

