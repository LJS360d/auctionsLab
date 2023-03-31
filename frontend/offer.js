import * as APIService from "./modules/APIService.js"
import * as Models from "./modules/models/ItemsResponseModels.js"
import { timeLeftUntilDate } from "./modules/utils/timeLeftUntilDate.js";
import { getLocalValute } from "./modules/utils/getLocalValute.js";
import { setInputFilter } from "./modules/utils/setInputFilter.js"
const itemID = new URL(location.href).searchParams.get('itemID');
renderOfferPageOffAPIResponse(await APIService.post(itemID, '/offerPage'));
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
function renderOfferPageOffAPIResponse(itemsResponse) {
    const resultset = new Models.ItemResponseJSON(itemsResponse)
    const item = new Models.ItemResponseModel(resultset.itemResponseModelArray[0]);
    const minOffer = add15PercentTo(item.currentBid ?? item.minimumBid);
    const offerPage = document.createElement('div');
    offerPage.innerHTML += `
    <div class="offer-left">
    <img src='${item.imageURL}' class='offer-img'>
    </div>

    <div class="offer-right">
    <h1 class="offer-title">${item.itemName}</h1>
    <label>${item.itemDescription}</label>
    <label>Seller:${item.seller}</label>
    <label>Time Left:${timeLeftUntilDate(item.expireDate)} </label>
    <h3>How Much do you Offer?</h3>
    <label>Highest Offer:${item.currentBid + getLocalValute()}</label>
    <label>Highest Bid by:${getUsernameFromUUID(item.highestBidder)}</label>
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
    setInputFilter(document.querySelector('.offer-input'), function (value) {

        return /^\d*\.?\d{0,2}$/.test(value)
    }, "Only numbers with 2 or less decimal digits are allowed")
}
function add15PercentTo(number) {
    const parsedNumber = parseFloat(number);
    return (parsedNumber < 1) ? 1 : parsedNumber + (parsedNumber * 0.15);
}
function getUsernameFromUUID(uuid) {
    return uuid;
    return new Promise((resolve, reject) => {
        //TODO: POST endpoint that returns username given UUID
        resolve("User" + uuid);
    })
}