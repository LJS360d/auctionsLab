import * as APIService from "./modules/APIService.js"
import * as Models from "./modules/models/responseModels.js"


const uuid = localStorage.getItem('uuid') ?? sessionStorage.getItem('uuid');
renderProfilePageOffAPIResponse(await APIService.post(JSON.stringify({uuid:uuid}), '/profile'));
function renderProfilePageOffAPIResponse(results){
    const profileData = new Models.userProfileResponseModel(results) 
    const profile = document.createElement('div')
    profile.innerHTML += `
    <button class="item-button" onclick=logout()>Logout</button>
    <h1>${profileData.username}</h1>
    <h3>${profileData.birthDate}</h3>
    <h3>${profileData.email}</h3>
    `;
    profile.className = "profile"
    document.body.appendChild(profile)
}
