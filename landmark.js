const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const landmarksFolder = './landmarks'
const landmarkDefault = './entities/landmark.json'
const entities = './entities/entities.json'

module.exports = class Landmark {

    constructor(id) {
        this.id = id;
    }

    async getLandmarkById(id) {
        console.log("GetLandMarkByID");
        return await readFile(`${landmarksFolder}/${id}.json`, 'utf8');
    }

    async createNewLandmark(data) {
        let id = 0;
        let files = await this.readDir(landmarksFolder);
        console.log("FILES:" + files);
        let file = files.map((f) => stripExtension(f)).reverse()[0];
        if (file) {
            id = parseInt(file) + 1;
        }
        return this.updateLandmarkById(data, id);
    }

    async updateLandmarkById(data, id) {
        return writeFile(`${landmarksFolder}/${id}.json`, JSON.stringify(data), 'utf8').then(f => {
            console.log("File saved!")
            return this.getLandmarkById(id);
        });
    }

    async readDir(folder) {
        return await readdir(folder);
    }

    async deleteLandmarkById(id) {
        return await unlink(`${landmarksFolder}/${id}.json`);
    }

    async defaultEntities() {
        console.log("Entities");
        return await readFile(entities, 'utf8');
    }

    async getAllLandmarks() {
        const files = await this.readDir(landmarksFolder);
        const jsonArray = await Promise.all(files.map(async (file) => {
            const contents = await readFile(`${landmarksFolder}/${file}`, 'utf8');
            return JSON.parse(contents);
        }));
        return JSON.stringify(jsonArray);
    }

    async defaultLandmark() {
        console.log("GetLandMark Default");
        return await readFile(landmarkDefault, 'utf8');
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
                <script type="application/ld+json">
                    ${data}
                </script>
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

function stripExtension(filename) {
    return filename.split('.')[0];
}