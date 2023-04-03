import * as APIService from "./modules/APIService.js"
import * as Models from "./modules/models/responseModels.js"
import { timeLeftUntilDate } from "./modules/utils/timeLeftUntilDate.js";
import { getLocalValute } from "./modules/utils/getLocalValute.js";
import { setInputFilter } from "./modules/utils/setInputFilter.js"
const itemID = new URL(location.href).searchParams.get('itemID');
renderOfferPageOffAPIResponse(await APIService.post(itemID, '/offerPage'));

async function renderOfferPageOffAPIResponse(itemsResponse) {
    const resultset = new Models.ItemResponseJSON(itemsResponse)
    const item = new Models.ItemResponseModel(resultset.itemResponseModelArray[0]);
    const minOffer = add15PercentTo(item.currentBid) ?? ((item.minimumBid <= 0) ? 1 : item.minimumBid) ;
    const offerPage = document.createElement('div');
    offerPage.innerHTML += `
    <div class="offer-left">
    <img src='${item.imageURL}' class='offer-img'>
    </div>

    <div class="offer-right">
    <h1 class="offer-title">${item.itemName}</h1>
    <label>${item.itemDescription}</label> <br>
    <label>Seller:${item.seller}</label>
    <label><b>Time Left:${timeLeftUntilDate(item.expireDate)}</b></label>
    <h3>How Much do you Offer?</h3>
    <label>Highest Offer:${item.currentBid ?? 0}${getLocalValute()}</label>
    <label>Highest Bid by:${await getUsernameFromUUID(item.highestBidder)}</label>
    <label>Minimum Offer:${minOffer}${getLocalValute()}</label> 
    <form action="sendoffer.html" method="get" autocomplete="off">
    <input name="itemID" value="${itemID}" hidden="true">
    <input name="minOffer" value="${minOffer}" hidden="true">
    <input class="offer-input" type="text" name="offerInput" placeholder="${minOffer + getLocalValute()}" required>
    <button class="item-button" type="submit">Confirm  <i class="fa fa-paper-plane"></i></button>
    </form>
    </div>`;
    offerPage.className = 'offer'

    document.body.appendChild(offerPage)
    setInputFilter(document.querySelector('.offer-input'),(value)=>{
        return /^\d*\.?\d{0,2}$/.test(value)
    }, "Only numbers with 2 or less decimal digits are allowed")
}
function add15PercentTo(number) {
    if(number === null || number === undefined) return null;
    const parsedNumber = parseFloat(number);
    return (parsedNumber < 1) ? 1 : parsedNumber + (parsedNumber * 0.15);
}
async function getUsernameFromUUID(uuid) {
    const res = JSON.parse(await APIService.post(uuid,'/uuidtousername')) 
    return res[0].Username
}