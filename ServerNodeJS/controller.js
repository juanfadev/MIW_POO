const http = require('http');
const url = require('url');
const SCHEMA = "LandmarksOrHistoricalBuildings";
const PLACE = "Place";
const entities = [SCHEMA, PLACE];

module.exports = http.createServer((req, res) => {
    // CORS HEADERS
    res.setHeader('Access-Control-Allow-Origin', '*');
    // CORS HEADERS
    if (req.method == "OPTIONS") {
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");        
        res.end();
    } else {
        let service = require('./service.js');
        const reqUrl = url.parse(req.url, true);
        console.log('PREID:' + reqUrl.pathname.split('/')[2]);
        const id = parseInt(reqUrl.pathname.split('/')[2], 10);
        const entity = reqUrl.pathname.split('/')[1];
        //Change service based on entity
        switch (entity) {
            case SCHEMA:
                console.log(`Switching entity to ${SCHEMA}`);
                service = require('./service.js');
                break;
            case PLACE:
                console.log(`Switching entity to ${PLACE}`);
                service = require('./services/placeService.js');
                break;
            default:
                console.log('Request Type:' +
                    req.method + ' Invalid Endpoint: ' +
                    reqUrl.pathname);
                break;
        }
        console.log('ID:' + id);
        //ID endpoints
        if (!isNaN(id)) {
            console.log('Request Type:' +
                req.method + ' Endpoint: ' +
                reqUrl.pathname);
            switch (req.method) {
                case 'GET':
                    service.getEntity(req, res, id);
                    break;
                case 'PUT':
                    service.putEntity(req, res, id);
                    break;
                case 'DELETE':
                    service.deleteEntity(req, res, id);
                    break;
                default:
                    console.log('Not a proper method for this endpoint');
                    break;
            }
        } else if (reqUrl.pathname == '/' && req.method == 'GET') {
            console.log('Request Type:' +
                req.method + ' Endpoint: ' +
                reqUrl.pathname);
            service.indexRequest(req, res);
        } else if (entities.includes(entity) && req.method == 'GET') {
            console.log('Request Type:' +
                req.method + ' Endpoint: ' +
                reqUrl.pathname);
            service.getDefaultEntity(req, res);
            // POST Endpoint
        } else if (entities.includes(entity) && req.method == 'POST') {
            console.log('Request Type:' +
                req.method + ' Endpoint: ' +
                reqUrl.pathname);
            service.postEntity(req, res);
        } else if (reqUrl.pathname == `/LandmarksOrHistoricalBuildings` && req.method === 'POST') {
            console.log('Request Type:' +
                req.method + ' Endpoint: ' +
                reqUrl.pathname);
            service.postEntity(req, res);
        } else {
            console.log('Request Type:' +
                req.method + ' Invalid Endpoint: ' +
                reqUrl.pathname);
            service.invalidRequest(req, res);
        }
    }
});


