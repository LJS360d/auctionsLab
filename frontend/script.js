import * as catalogueManager from "./modules/catalogueManager.js";
import * as APIService from "./modules/APIService.js"
import * as Models from "./modules/models/ItemsResponseModels.js"
import * as buttonsManager from "./modules/buttonsManager.js"

const socket = io('ws://localhost:8080');
socket.on('connect', () => {
    socket.send('query', 'Select * from items')
    //Promise {<pending>}
    APIService.getAllItems('nutella')
        .then(function (value) {
            console.log(value);
        })
    APIService.get('Select * from items')
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
const sendquery = document.getElementById('searchbutton').onclick = () => {
    catalogueManager.clearCatalogue()
    const query = buildQuery();
    socket.send('query', query);
    /* const http = new XMLHttpRequest();
    http.open('GET',"localhost:8080")
    http.send(query) */
}
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendquery()
    }
})

function renderRow(result) {
    const row = document.createElement('div')
    let text = JSON.stringify(result).replace(/,/g, "|").replace(/[{}"]/g, "");
    row.textContent = text;
    row.className = 'result';
    document.body.appendChild(row)
}
function renderItem(itemRes) {
    const item = new Models.ItemResponseModel(itemRes)
    const renderItem = document.createElement('div');
    renderItem.innerHTML += `
    <div class="item-top">
    <img src='${item.imageURL}' class='item-img'>
    <h4>${item.itemName}</h4>
    <label>Seller:${avoidOverflowFormat(item.seller)}</label>
    <label>Time Left:${timeLeftUntil(item.expireDate)} </label>
    <label>Price:${item.currentBid ?? item.minimumBid}${getLocalValute()}</label> 
    </div>
    <div class="item-bottom">
    <button class="item-button" race="offer" style="--c:#33ff28" value="${item.itemID}">Make an Offer</button>
    <button class="item-button" race="watchlist" style="--c:#E95A49" value="${item.itemID}">Add to Watchlist</button>
    </div>`;
    renderItem.className = 'item'
    document.getElementById('catalogue').appendChild(renderItem)
}
function buildQuery() {
    const searchValue = String(document.getElementById('searchinput').value).toLowerCase()
    if (!isNaN(searchValue) && searchValue !== '') {
        return `Select * from items where ItemID = "${searchValue}"`
    }
    return searchValue === '' ? "Select * from items" : `Select * from items where Item_name like "%${searchValue}%"`
}
function timeLeftUntil(date) {
    const timeLeft = new Date(date) - new Date();
    return timeLeft >= 86400000 ? Math.floor(timeLeft / 86400000) + " day(s)" :
        timeLeft >= 3600000 ? Math.floor(timeLeft / 3600000) + " hour(s)" :
            timeLeft >= 60000 ? Math.floor(timeLeft / 60000) + " minute(s)" :
                Math.floor(timeLeft / 1000) + " second(s)";
}
function avoidOverflowFormat(string) {
    const CUT_POINT = 12
    if (string.length > CUT_POINT) {
        return `${string.substring(0, CUT_POINT - 1)}...`
    } else {
        return string
    }
}
function getLocalValute(){
    return '€'
}