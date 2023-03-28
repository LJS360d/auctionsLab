import * as catalogueManager from "./modules/catalogueManager.js";
import * as APIService from "./modules/APIService.js"
import * as Models from "./modules/models/ItemsResponseModels.js"
import { timeLeftUntilDate } from "./modules/timeLeftUntilDate.js";
import { getLocalValute } from "./modules/getLocalValute.js";
import { setInputFilter } from "./modules/setInputFilter.js"
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
    <h1 class="offer-title">${item.itemName}</h1>
    <label>${item.itemDescription}</label>
    <label>Seller:${item.seller}</label>
    <label>Time Left:${timeLeftUntilDate(item.expireDate)} </label>
    <h3>How Much do you Offer?</h3>
    <label>Minimum Offer:${item.currentBid ?? item.minimumBid}${getLocalValute()}</label> 

    <form action="sendoffer.html" method="get" autocomplete="off">
    <input name="itemID" value="${itemID}" hidden="true">
    <input class="offer-input" type="text" name="offerInput" placeholder="${item.currentBid ?? item.minimumBid}€" required> <br>
    <button class="item-button" type="submit">Confirm  <i class="fa fa-paper-plane"></i></button>
    </form>

    </div>`;
    offerPage.className = 'offer'

    document.body.appendChild(offerPage)
    setInputFilter(document.querySelector('.offer-input'), function(value) {
        return /^\d*\.?\d{0,2}$/.test(value); 
      }, "Only numbers with 2 or less decimal digits are allowed")
    
}

