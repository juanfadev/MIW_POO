class RequestService {

    async getRequest(url, json = true) {
        const settings = headers('GET', json);
        let response = await fetch(url, settings);
        if (response.ok) return await response.json();
        throw new Error(response.status);
    }

    async postRequest(url, json = true, data) {
        let settings = headers('POST', json);
        settings.body = JSON.stringify(data);
        let response = await fetch(url, settings);
        if (response.ok) return await response.json();
        throw new Error(response.status);
    }

    async deleteRequest(url, json = true, data) {
        let settings = headers('DELETE', json);
        settings.body = JSON.stringify(data);
        let response = await fetch(url, settings);
        if (response.ok) return await response.json();
        throw new Error(response.status);
    }

    async putRequest(url, json = true, data) {
        let settings = headers('PUT', json);
        settings.body = JSON.stringify(data);
        let response = await fetch(url, settings);
        if (response.ok) return await response.json();
        throw new Error(response.status);
    }

    

    headers(method, json) {
        if (method === 'POST') {
            let settings = {
                method: 'POST'
            };
        } else if (method === 'GET') {
            let settings = {
                method: 'GET'
            };
        } else {
            let settings = {
                method: 'GET'
            };
        }
        if (json) {
            settings.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };
            return settings;
        } else {
            settings.headers = {
                Accept: 'text/html',
                'Content-Type': 'text/html',

            };
            return settings;
        }
    }
}


export default new RequestService()