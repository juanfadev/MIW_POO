const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const landmarksFolder = './landmarks'

module.exports = class Landmark {
    
    constructor(id){
        this.id = id;
    }

    async getLandmarkById(id) {
        console.log("GetLandMarkByID");
        return await readFile(`${landmarksFolder}/${id}.json`, 'utf8');
    }

    async createNewLandmark(data) {
        let id = 0;
        let files = await this.readDir;
        let file = files.sort().reverse()[0];
        if (file) {
            let id = file + 1;
        }
        return this.updateLandmarkById(data, id);
    }

    async updateLandmarkById(data, id) {
        return writeFile(`${landmarksFolder}/${id}.json`, data, 'utf8').then(f => {
            console.log("File saved!")
            return this.getLandmarkById(id);
        });
    }

    async readDir() {
        return await readdir(testFolder);
    }

    async deleteLandmarkById(id) {
        return await unlink(`${landmarksFolder}/${id}.json`);
    }

    toHTML(data) {
        let json = JSON.parse(data);
        return `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <title>Landmark ${json.name}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
                <script src="main.js"></script>
            </head>
            <body>
                <h1>Landmark: ${json.name}</h1>
                <h2>Description:</h2>
                    <p>${json.description}</p>
                    <p>${json}</p>
                <h2>Address:</h2>
                <ul>
                    <li>
                        Locality: ${json.address.addressLocality}
                    </li>
                    <li>
                        Region: ${json.address.addressRegion}
                    </li>
                    <li>
                        Country: ${json.address.addressCountry}
                    </li>
                </ul>
                <img src="${json.photo}" alt="${json.name} photo" />
                <a href="${json.mainEntityOfPage}">Main URL</a>
            </body>
            </html>`
    }
}
