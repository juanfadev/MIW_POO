const Negotiator = require('negotiator');
const Landmark = require('./landmark.js');
const request = require('request');
let availableMediaTypes = ['text/plain', 'text/html', 'application/json', 'application/ld+json'];



exports.invalidRequest = function (req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Invalid Request');
};

exports.indexRequest = function (req, res) {
    let negotiator = new Negotiator(req);
    let mediaType = negotiator.mediaType(availableMediaTypes);
    console.log("Mediatype selected: " + mediaType);
    let landmark = new Landmark();
    landmark.defaultEntities().then(data => {
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
                res.end(landmark.toHTML(data));
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
    let landmark = new Landmark(id);
    landmark.getLandmarkById(id).then(data => {
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
    let landmark = new Landmark();
    landmark.getAllLandmarks().then(data => {
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
                res.end(landmark.toHTML(JSON.stringify(data)));

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
        let landmark = new Landmark(id);
        landmark.updateLandmarkById(JSON.parse(body), id).then(data => {
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
        let landmark = new Landmark();
        console.log(JSON.parse(body));
        landmark.createNewLandmark(JSON.parse(body)).then(data => {
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
                    res.end(landmark.toHTML(data));
            }
        }).catch((error) => {
            console.log(error);
            this.invalidRequest(req, res);
        });
    });
}

exports.deleteEntity = function (req, res, id) {
    const landmark = new Landmark();
    landmark.getLandmarkById(id).then(data => {
        landmark.deleteLandmarkById(id).then(() => {
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
/**
 * Validate entity against google structured data testing tool
 */
exports.validateEntity2 = function (req, res) {
    let body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        let headers = {
            'origin': 'https://search.google.com',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en,es-ES;q=0.9,es;q=0.8',
            'cookie': 'CONSENT=YES+ES.es+20160410-02-0; SID=OAUCy2UXjCT7aOtWqh1bif7hMwUN7oZa8XFbaTSMHptwuqr9lKg8iuT7GQBIfqB2F3etwA.; HSID=AHVnDpD82RGDfSAzy; SSID=ARMo_qkj2sh-V9hrk; APISID=sRw51tP_BjBGcsAj/APrd91mxlzP47J9cB; SAPISID=vyinwOcBsiaUfPC_/AeUahqb6nmUe1uRve; OGPC=19009353-2:; 1P_JAR=2018-11-30-13; NID=148=elQUuJEzLGwDGrxIkmPqF_odqjsL233GQyobZE7IidjJhajfSRqqDcKmbjb8KpwH2WBWqjUWy5KOqt02lG8tj2lrcAvneKP9XJAe5R4IJCpqSGRlDpiAe5HurwKT448DFqnnJ9qx_Qm1HEqHHkK7qV7jYGjXgj4hGBOx5w2F3_kIjgeul0c708YlKL4D6dl3i5tk88wM-zLDmQlRfSvWEINpUN7cnWE6wrr-i-qQYoTJa7TcoDb3M-0nHF3iZN-3orcvmoFzdblJ9tj86JKquKGV9QuszCbTBa5O5aEoCJAXkaND2vXz0g1Gou8Ew-l8NwD2lo_A57uMYXygkw; SIDCC=ABtHo-Eug2GigSVGpeOUTEcG-7Rlli7rsZkGacTQutOBld0us_0y5Lwkg7JE1gSo2zyrfJQxBl8OOeosd9cq',
            'x-client-data': 'CI+2yQEIpLbJAQjBtskBCKmdygEIqKPKARj5pcoB',
            'pragma': 'no-cache',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'accept': '*/*',
            'cache-control': 'no-cache',
            'authority': 'search.google.com',
            'referer': 'https://search.google.com/structured-data/testing-tool/u/0/?hl=es'
        };

        let dataString = 'html='+ body;
        let options = {
            url: 'https://search.google.com/structured-data/testing-tool/u/0/validate',
            method: 'POST',
            headers: headers,
            body: dataString,
            gzip: true
        };
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("RECEIVED VALIDATION");
            }
        }
        let validationBody = '';
        request(options, callback).on('data', function (chunk) {
            validationBody += chunk;
        }).on('end', () => {
            console.log('decoded chunk' + validationBody);
            res.end(validationBody.split(")]}'")[1]);
        });
    });

}