const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const placesFolder = './places'
const placeDefault = './entities/place.json'
const entities = './entities/entities.json'

module.exports = class Place {

    constructor(id) {
        this.id = id;
    }

    async getPlaceById(id) {
        console.log("GetLandMarkByID");
        return await readFile(`${placesFolder}/${id}.json`, 'utf8');
    }

    async createNewPlace(data) {
        let id = 0;
        let files = await this.readDir(placesFolder);
        console.log("FILES:" + files);
        let file = files.map((f) => stripExtension(f)).reverse()[0];
        if (file) {
            id = parseInt(file) + 1;
        }
        return this.updatePlaceById(data, id);
    }

    async updatePlaceById(data, id) {
        return writeFile(`${placesFolder}/${id}.json`, JSON.stringify(data), 'utf8').then(f => {
            console.log("File saved!")
            return this.getPlaceById(id);
        });
    }

    async readDir(folder) {
        return await readdir(folder);
    }

    async deletePlaceById(id) {
        return await unlink(`${placesFolder}/${id}.json`);
    }

    async defaultEntities() {
        console.log("Entities");
        return await readFile(entities, 'utf8');
    }

    async getAllPlaces() {
        const files = await this.readDir(placesFolder);
        const jsonArray = await Promise.all(files.map(async (file) => {
            const contents = await readFile(`${placesFolder}/${file}`, 'utf8');
            return JSON.parse(contents);
        }));
        return JSON.stringify(jsonArray);
    }

    async defaultPlace() {
        console.log("GetLandMark Default");
        return await readFile(placeDefault, 'utf8');
    }

    toHTML(data) {
        let json = JSON.parse(data);
        return `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <title>Place ${json.name}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <script type="application/ld+json">
                    ${data}
                </script>
            </head>
            <body>
                <h1>Place: ${json.name}</h1>
                <h2>Description:</h2>
                    <p>${json.description}</p>
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