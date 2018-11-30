const Negotiator = require('negotiator');
const Place = require('../place.js');
let availableMediaTypes = ['text/plain','text/html',  'application/json', 'application/ld+json'];


exports.invalidRequest = function (req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Invalid Request');
};

exports.indexRequest = function (req, res) {
    let negotiator = new Negotiator(req);
    let mediaType = negotiator.mediaType(availableMediaTypes);
    console.log("Mediatype selected: " + mediaType);
    let place = new Place();
    place.defaultEntities().then(data => {
        switch (mediaType) {
            case 'text/plain':
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(data);
                break;
            case 'application/ld+json':
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/ld+json');
                res.end(data);
                break;
            case 'application/json':
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(data);
                break;
            case 'text/html':
            default:
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(place.toHTML(data));
        }
    }).catch((err) => {
        console.log(err);
        this.invalidRequest(req, res);
    });
};

exports.getEntity = function (req, res, id) {
    let negotiator = new Negotiator(req);
    let mediaType = negotiator.mediaType(availableMediaTypes);
    console.log("Mediatype selected: " + mediaType);
    let place = new Place(id);
    place.getPlaceById(id).then(data => {
        switch (mediaType) {
            case 'application/ld+json':
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/ld+json');
                res.end(data);
                break;
            case 'application/json':
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(data);
                break;
            case 'text/html':
            default:
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(place.toHTML(data));

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
    let place = new Place();
    place.getAllPlaces().then(data => {
        switch (mediaType) {
            case 'application/ld+json':
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/ld+json');
                res.end(data);
                break;
            case 'application/json':
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(data);
                break;
            case 'text/html':
            default:
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(place.toHTML(JSON.stringify(data)));

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
        let place = new Place(id);
        place.updatePlaceById(JSON.parse(body), id).then(data => {
            res.statusCode = 200;
            switch (mediaType) {
                case 'application/ld+json':
                    res.setHeader('Content-Type', 'application/ld+json');
                    res.end(data);
                    break;
                case 'application/json':
                    res.setHeader('Content-Type', 'application/json');
                    res.end(data);
                    break;
                case 'text/html':
                default:
                    res.setHeader('Content-Type', 'text/html');
                    res.end(place.toHTML(data));
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
        let place = new Place();
        console.log(JSON.parse(body));
        place.createNewPlace(JSON.parse(body)).then(data => {
            res.statusCode = 200;
            switch (mediaType) {
                case 'application/ld+json':
                    res.setHeader('Content-Type', 'application/ld+json');
                    res.end(data);
                    break;
                case 'application/json':
                    res.setHeader('Content-Type', 'application/json');
                    res.end(data);
                    break;
                case 'text/html':
                default:
                    res.setHeader('Content-Type', 'text/html');
                    res.end(place.toHTML(data));
            }
        }).catch((error) => {
            console.log(error);
            this.invalidRequest(req, res);
        });
    });
}

exports.deleteEntity = function (req, res, id) {
    const place = new Place();
    place.getPlaceById(id).then(data => {
        place.deletePlaceById(id).then(() => {
            console.log(data + ' was deleted');
            res.statusCode = 200;
            res.end(data);
        }).catch(err => {
            console.log(err);
            this.invalidRequest(req, res);
        });
    }).catch(err => {
        console.log(err);
        this.invalidRequest(req, res);
    });

}

