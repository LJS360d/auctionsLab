import * as APIService from "./modules/APIService.js"
import * as Models from "./modules/models/responseModels.js"


const uuid = localStorage.getItem('uuid') ?? sessionStorage.getItem('uuid');
renderProfilePageOffAPIResponse(await APIService.post(JSON.stringify({uuid:uuid}), '/profile'));
function renderProfilePageOffAPIResponse(results){
    const profileData = new Models.userProfileResponseModel(results) 
    const profile = document.createElement('div')
    profile.innerHTML += `
    <h1>${profileData.username}</h1>
    TODO:Build profile page
    `;
    profile.className = "profile"
    document.body.appendChild(profile)
}