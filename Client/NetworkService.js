import RequestService from './RequestService'

const BASE_URL = "http://localhost:3000"
const SCHEMA = "LandmarksOrHistoricalBuildings"
//const API_KEY = "?api-key=GET-YOUR-FREE-API-KEY:)"

class NetworkService {

  getLandmarkTemplate(){
    let url = `${BASE_URL}/`
    return RequestService.getRequest(url, json = true);
  }

  getAllLandmarks() {
    let url = `${BASE_URL}/${SCHEMA}/`
    return RequestService.getRequest(url, json = true);
  }

  getLandMark(id) {
    let url = `${BASE_URL}/${SCHEMA}/${id}`
    return RequestService.getRequest(url, json = true);
  }

  postLandMark(data){
    let url = `${BASE_URL}/${SCHEMA}/`
    return RequestService.postRequest(url, json = true, data);
  }

  putLandMark(data, id){
    let url = `${BASE_URL}/${SCHEMA}/${id}`
    return RequestService.putRequest(url, json = true, data);
  }

  deleteLandMark(data, id){
    let url = `${BASE_URL}/${SCHEMA}/${id}`
    return RequestService.deleteRequest(url, json = true, data);
  }

}

export default new NetworkService()