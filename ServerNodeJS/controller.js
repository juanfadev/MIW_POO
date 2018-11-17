const http = require('http');
const url = require('url');
const SCHEMA = "LandmarksOrHistoricalBuildings"

module.exports = http.createServer((req, res) => {
    var service = require('./service.js');
    const reqUrl = url.parse(req.url, true);
    const id = reqUrl.pathname.split('/')[2];
    console.log('ID:' + id);
    //ID endpoints
    if (id) {
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

    }
    else if (reqUrl.pathname == '/' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);
        service.indexRequest(req, res);
    } else if (reqUrl.pathname == `/${SCHEMA}` && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);
        service.sampleRequest(req, res);
        // POST Endpoint
    } else if (reqUrl.pathname == '/test' && req.method === 'POST') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);
        service.testRequest(req, res);
    } else {
        console.log('Request Type:' +
            req.method + ' Invalid Endpoint: ' +
            reqUrl.pathname);
        service.invalidRequest(req, res);
    }
});