import * as APIService from "./modules/APIService.js"
import * as Models from "./modules/models/responseModels.js"


const uuid = localStorage.getItem('uuid') ?? sessionStorage.getItem('uuid');
renderProfilePageOffAPIResponse(await APIService.post(JSON.stringify({uuid:uuid}), '/profile'));


const sendquery = document.getElementById('searchbutton').onclick = async () => {
    const searchValue = document.getElementById('searchinput').value
    const filterValue = document.getElementById('searchfilter').value
    window.open('/homepage.html?sv=' + searchValue + "&fv=" + filterValue, "_self")

}
document.addEventListener('keypress', (e) => {
    const searchValue = document.getElementById('searchinput').value
    if (e.key === 'Enter' && searchValue !== '') {
        sendquery()
    }
})
document.getElementById('searchfilter').addEventListener('change',sendquery)
function renderProfilePageOffAPIResponse(results){
    //TODO: Render Profile Page
    const profileData = new Models.userProfileResponseModel(results) 

    
    console.log(profileData);
}