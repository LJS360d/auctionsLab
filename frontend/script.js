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
        `<img src='assets/${item.imageURL}' class='item-img'>
    <h2>${item.itemName}</h2>
    <p>Seller:${item.seller}</p>
    <p>Price:${item.currentBid ?? item.minimumBid}$</p>
    <span style="
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: baseline;
        flex-wrap: nowrap;">
    <button class="offer" value="${item.itemID}" onclick="offer(this.value)">Make an Offer</button>
    <button class="watch" value="${item.itemID}" onclick="addToWatchlist(this.value)">Add to Watchlist</button>
    </span>`
    renderItem.className = 'item'
    document.getElementById('catalogue').appendChild(renderItem)
}
function buildQuery() {
    const searchValue = String(document.getElementById('searchinput').value).toLowerCase()

    return searchValue==='' ? "Select * from items":`Select * from items where Item_name like "${searchValue}"`
}
