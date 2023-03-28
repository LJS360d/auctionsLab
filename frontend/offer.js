import * as catalogueManager from "./modules/catalogueManager.js";
import * as APIService from "./modules/APIService.js"
import * as Models from "./modules/models/ItemsResponseModels.js"
import * as buttonsManager from "./modules/buttonsManager.js"
import { timeLeftUntilDate } from "./modules/timeLeftUntilDate.js";
import { getLocalValute } from "./modules/getLocalValute.js";

const itemID = new URL(location.href).searchParams.get('itemID');
renderOfferPageOffAPIResponse(await APIService.post(itemID,'/offerPage'));
const sendquery = document.getElementById('searchbutton').onclick = async () => {
    window.open('/index.html',"_self")
    catalogueManager.clearCatalogue()
    const searchValue = String(document.getElementById('searchinput').value).toLowerCase()
    renderItemsOffAPIResponse(await APIService.postGetByName(searchValue))
}
document.addEventListener('keypress', (e) => {
    const searchValue = document.getElementById('searchinput').value
    if (e.key === 'Enter' && searchValue !== '') {
        sendquery()
    }
})
function renderOfferPageOffAPIResponse(itemsResponse){
    const resultset = new Models.ItemResponseJSON(itemsResponse)
    const item = new Models.ItemResponseModel(resultset.itemResponseModelArray[0]);
    const offerPage = document.createElement('div');
    offerPage.innerHTML +=`
    <div class="offer-left">
    <img src='${item.imageURL}' class='offer-img'>
    </div>
    <div class="offer-right">
    <h2 class="item-title">${item.itemName}</h2>
    <label>${item.itemDescription}</label>
    <label>Seller:${item.seller}</label>
    <label>Time Left:${timeLeftUntilDate(item.expireDate)} </label>
    <h3>How Much do you Offer?</h3>
    <label>Minimum Offer:${item.currentBid ?? item.minimumBid}${getLocalValute()}</label> 
    <form action="http://localhost:9090/" method="post" autocomplete="off">
    <input name="itemID" value="${itemID}" hidden="true">
    <input class="offer-input" type="text" name="offerInput" placeholder="${item.currentBid ?? item.minimumBid}€" oninput="this.value = parseFloat(value).toFixed(2) + '€'"
    onkeydown="" required>
    <button class="item-button" type="submit" name="offerFormSubmit">Confirm  <i class="fa fa-paper-plane"></i></button>
    </form>
    </div>`;
    offerPage.className = 'offer'
    document.body.appendChild(offerPage)
    
}

