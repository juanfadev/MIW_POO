import NetworkService from './NetworkService.mjs'


const phpURL = "http://localhost:80/PHP_Server/api/";
const nodeURL = "http://localhost:3000";

NetworkService.baseUrl = phpURL;

document.addEventListener("DOMContentLoaded", () => {
    loadEntities();
});

document.getElementById("landmarksNav").addEventListener("click", () => {
    removeCSSClassCurrent();
    loadLandmarks();
    document.getElementById("landmarksNav").parentNode.classList.add('current');

});

document.getElementById("entitiesNav").addEventListener("click", () => {
    removeCSSClassCurrent();
    loadEntities();
    document.getElementById("entitiesNav").parentNode.classList.add('current');
});

document.getElementById("placesNav").addEventListener("click", () => {
    removeCSSClassCurrent();
    loadPlaces();
    document.getElementById("placesNav").parentNode.classList.add('current');
});


async function fetchAsync() {
    // await response of fetch call
    let response = await fetch('https://api.github.com');
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    return data;
}

// trigger async function
// log response or catch error of fetch promise
fetchAsync()
    .then(data => console.log(data))
    .catch(reason => console.log(reason.message))

function loadLandmarks() {
    console.log("Fetching data");
    NetworkService.getAllLandmarks()
        .then(data => {
            console.log(data);
            let articles = document.getElementById("articles");
            removeChildren(articles);
            try {
                data.forEach(j => loadArticle(j));
            } catch{
                loadArticle(data);
            }
        })
        .catch(reason => alert("Error on loading landmarks " + reason.message));

}

function loadPlaces(){
    console.log("Fetching data");
    NetworkService.getAllPlaces()
        .then(data => {
            console.log(data);
            let articles = document.getElementById("articles");
            removeChildren(articles);
            try {
                data.forEach(j => loadArticle(j));
            } catch{
                loadArticle(data);
            }
        })
        .catch(reason => alert("Error on loading landmarks " + reason.message));
}

function loadEntities() {
    console.log("Fetching data");
    NetworkService.getTemplates().then(data => {
        console.log(data);
        let articles = document.getElementById("articles");
        removeChildren(articles);
        data.forEach(j => loadEntity(j));
    }).catch(reason => alert("Error on loading entities " + reason.message))
}

function loadEntity(json) {
    let articles = document.getElementById("articles");
    let article = document.createElement('article');
    article.classList.add('box');
    article.classList.add('post');
    article.classList.add('post-excerpt');
    article.innerHTML = `<header>
    <h2><a href="#">${json['@type']}</a></h2></header>`
    let text = document.createElement('textarea');
    text.value = JSON.stringify(json, undefined, 2);
    article.appendChild(text);
    articles.appendChild(article);
}

function loadArticle(json) {
    console.log("LoadArticles");
    console.log(json);
    console.log(json.address);
    let articles = document.getElementById("articles");
    let article = document.createElement('article');
    article.classList.add('box');
    article.classList.add('post');
    article.classList.add('post-excerpt');
    article.innerHTML = `<header>
    <h2><a href="#">${json.name}</a></h2>
    <p>${json['@type']}</p>
    </header>
    <a href="#" class="image featured"><img src="${json.photo}" alt="${json.name}" /></a>
    <h3>Address: </h3>
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
    </ul>`
    articles.appendChild(article);
}

function removeChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function removeCSSClassCurrent(){
    document.querySelector("nav > ul > li.current").classList.remove('current');
}