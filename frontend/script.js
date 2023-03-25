import * as catalogueManager from "./modules/catalogueManager.js";
import * as APIService from "./modules/APIService.js"
import * as Models from "./modules/models/ItemsResponseModels.js"
const socket = io('ws://localhost:8080');
//Use Spring Boot Backend API instead
socket.on('connect', () => {
    socket.send('query', 'Select * from items')
    //Promise {<pending>}
    APIService.getAllItems('nutella')
        .then(function (value) {
            console.log(value);
        })

})
socket.on('disconnect', (reason) => {
    catalogueManager.clearCatalogue()
    document.append(reason)
})
socket.on('results', (results) => {
    renderItem(results)
})
socket.on('error', (msg) => {
    catalogueManager.clearCatalogue()
    renderRow(msg)
})
const sendquery = document.getElementById('searchbutton').onclick = () => {
    catalogueManager.clearCatalogue()
    const query = buildQuery();
    socket.send('query', query);
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
    renderItem.innerHTML +=
    `
    <div>
    <img src='assets/${item.imageURL}' class='item-img'>
    <h4>${item.itemName}</h4>
    Seller:${item.seller} <br>
    Price:${item.currentBid ?? item.minimumBid}$
    </div>
    <div>
    <button class="item-button" style="--c:#33ff28" value="${item.itemID}" onclick="offer(this.value)">Make an Offer</button>
    <button class="item-button" style="--c:#E95A49" value="${item.itemID}" onclick="addToWatchlist(this.value)">Add to Watchlist</button>
    </div>`
    renderItem.className = 'item'
    document.getElementById('catalogue').appendChild(renderItem)
}
function buildQuery() {
    const searchValue = String(document.getElementById('searchinput').value).toLowerCase()
    if(!isNaN(searchValue) && searchValue!==''){
        return `Select * from items where ItemID = "${searchValue}"`
    }
    return searchValue==='' ? "Select * from items":`Select * from items where Item_name like "%${searchValue}%"`
}
