const Negotiator = require('negotiator');
const Place = require('./landmark.js');
let availableMediaTypes = ['text/html', 'text/plain', 'application/json', 'application/ld+json'];


exports.invalidRequest = function (req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Invalid Request');
};

exports.indexRequest = function (req, res) {
    let negotiator = new Negotiator(req);
    let mediaType = negotiator.mediaType(availableMediaTypes);
    console.log("Mediatype selected: " + mediaType);
    let landmark = new Place();
    landmark.defaultLandmark().then(data => {
        res.statusCode = 200;
        switch (mediaType) {
            case 'text/plain':
                resp.setHeader('Content-Type', 'text/plain');
                resp.end(data);
                break;
            case 'application/ld+json':
            case 'application/json':
                resp.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                break;
            case 'text/html':
            default:
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(landmark.toHTML(data));
        }
    }).catch(err => {
        console.log(error);
        this.invalidRequest(req, res);
    });
};

exports.getEntity = function (req, res, id) {
    let negotiator = new Negotiator(req);
    let mediaType = negotiator.mediaType(availableMediaTypes);
    console.log("Mediatype selected: " + mediaType);
    let landmark = new Place(id);
    landmark.getLandmarkById(id).then(data => {
        switch (mediaType) {
            case 'application/ld+json':
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/ld+json');
                res.end(JSON.stringify(data));
                break;
            case 'application/json':
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
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



exports.getDefaultEntity = function (req, res) {
    let negotiator = new Negotiator(req);
    let mediaType = negotiator.mediaType(availableMediaTypes);
    console.log("Mediatype selected: " + mediaType);
    let landmark = new Place();
    landmark.getDefaultEntity().then(data => {
        switch (mediaType) {
            case 'application/ld+json':
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/ld+json');
                res.end(JSON.stringify(data));
                break;
            case 'application/json':
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                break;
            case 'text/html':
            default:
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(landmark.toHTML(data));

        }
    })
}

exports.putEntity = function (req, res, id) {
    let body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        let negotiator = new Negotiator(req);
        let mediaType = negotiator.mediaType(availableMediaTypes);
        console.log("Mediatype selected: " + mediaType);
        let landmark = new Place(id);
        landmark.updateLandmarkById(JSON.parse(body), id).then(data => {
            res.statusCode = 200;
            switch (mediaType) {
                case 'application/ld+json':
                    res.setHeader('Content-Type', 'application/ld+json');
                    res.end(JSON.stringify(data));
                    break;
                case 'application/json':
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                    break;
                case 'text/html':
                default:
                    res.setHeader('Content-Type', 'text/html');
                    res.end(landmark.toHTML(data));
            }
        }).catch((error) => {
            console.log(error);
            this.invalidRequest(req, res);
        });
    });
}

exports.postEntity = function (req, res) {
    let body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        let negotiator = new Negotiator(req);
        let mediaType = negotiator.mediaType(availableMediaTypes);
        console.log("Mediatype selected: " + mediaType);
        let landmark = new Place();
        console.log(JSON.parse(body));
        landmark.createNewLandmark(JSON.parse(body)).then(data => {
            res.statusCode = 200;
            switch (mediaType) {
                case 'application/ld+json':
                    res.setHeader('Content-Type', 'application/ld+json');
                    res.end(JSON.stringify(data));
                    break;
                case 'application/json':
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                    break;
                case 'text/html':
                default:
                    res.setHeader('Content-Type', 'text/html');
                    res.end(landmark.toHTML(data));
            }
        }).catch((error) => {
            console.log(error);
            this.invalidRequest(req, res);
        });
    });
}

exports.deleteEntity = function (req, res, id) {
    const landmark = new Place();
    landmark.getLandmarkById(id).then(data => {
        landmark.deleteLandmarkById(id).then(() => {
            console.log(data + ' was deleted');
            res.statusCode = 200;
            res.end();
        }).catch(err => {
            console.log(err);
            this.invalidRequest(req, res);
        });
    }).catch(err => {
        console.log(err);
        this.invalidRequest(req, res);
    });

}

