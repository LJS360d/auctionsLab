import * as catalogueManager from "./modules/managers/catalogueManager.js";
import * as APIService from "./modules/APIService.js"
import * as Models from "./modules/models/ItemsResponseModels.js"
import * as buttonsManager from "./modules/managers/buttonsManager.js"
import { timeLeftUntilDate } from "./modules/utils/timeLeftUntilDate.js";
import { getLocalValute } from "./modules/utils/getLocalValute.js";
const params = new URL(location.href).searchParams
const sendquery = document.getElementById('searchbutton').onclick = async () => {
    catalogueManager.clearCatalogue()
    const searchValue = params.has('sv') ? params.get('sv') : String(document.getElementById('searchinput').value).toLowerCase()
    const filterValue = params.has('fv') ? params.get('fv') : String(document.getElementById('searchfilter').value)
    renderItemsOffAPIResponse(await APIService.postGetByName(searchValue,filterValue))
}
//Search Value
if(!params.has('sv'))
renderItemsOffAPIResponse(await APIService.getAllItems())
else{
    sendquery()
    params.delete('sv')
    params.delete('fv')
}

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendquery()
    }
})
document.getElementById('searchfilter').addEventListener('change',sendquery)

function renderItemsOffAPIResponse(itemsResponse) {
    const resultset = new Models.ItemResponseJSON(itemsResponse)
    resultset.itemResponseModelArray.forEach((item) => {
        renderItem(item)
    })
}

function renderItem(itemRes) {
    const item = new Models.ItemResponseModel(itemRes)
    const renderItem = document.createElement('div');
    renderItem.innerHTML += `
    <div class="item-top">
    <img src='${item.imageURL}' class='item-img'>
    <h4>${item.itemName}</h4>
    <label>Seller:${avoidOverflowFormat(item.seller)}</label>
    <label>Time Left:${timeLeftUntilDate(item.expireDate)} </label>
    <label>Highest Offer:${item.currentBid ?? item.minimumBid}${getLocalValute()}</label> 
    </div>
    <div class="item-bottom">
    <button class="item-button" race="offer" style="--c:#33ff28" value="${item.itemID}">Make an Offer</button>
    <button class="item-button" race="watchlist" style="--c:#E95A49" value="${item.itemID}">Add to Watchlist</button>
    </div>`;
    renderItem.className = 'item'
    document.getElementById('catalogue').appendChild(renderItem)
    buttonsManager.setItemButtonsOnclick()
}

function avoidOverflowFormat(string) {
    const CUT_POINT = 14
    if (string.length > CUT_POINT) {
        return `${string.substring(0, CUT_POINT - 1)}...`
    } else {
        return string
    }
}

/* Old Functions for Node Backend

const socket = io('ws://localhost:9090');
socket.on('connect', () => {
    socket.send('query', 'Select * from items')    
})
socket.on('disconnect', (reason) => {
    catalogueManager.clearCatalogue()
    catalogueManager.noItemsAvailable()
    document.append(reason)
})
socket.on('results', (results) => {
    results == null ? catalogueManager.noItemsAvailable() : renderItem(results);
    buttonsManager.setItemButtonsOnclick()
})
socket.on('error', (msg) => {
    catalogueManager.clearCatalogue()
    renderRow(msg)
}) 
function renderRow(result) {
    const row = document.createElement('div')
    let text = JSON.stringify(result).replace(/,/g, "|").replace(/[{}"]/g, "");
    row.textContent = text;
    row.className = 'result';
    document.body.appendChild(row)
}
function buildQuery() {
    const searchValue = String(document.getElementById('searchinput').value).toLowerCase()
    if (!isNaN(searchValue) && searchValue !== '') {
        return `Select * from items where ItemID = "${searchValue}"`
    }
    return searchValue === '' ? "Select * from items" : `Select * from items where Item_name like "%${searchValue}%"`
} */