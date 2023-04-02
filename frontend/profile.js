import * as APIService from "./modules/APIService.js"
import * as Models from "./modules/models/responseModels.js"


const uuid = localStorage.getItem('uuid') ?? sessionStorage.getItem('uuid');
renderProfilePageOffAPIResponse(await APIService.post(JSON.stringify({uuid:uuid}), '/profile'));
function renderProfilePageOffAPIResponse(results){
    //TODO: Render Profile Page
    const profileData = new Models.userProfileResponseModel(results) 

    
    console.log(profileData);
}