import * as catalogueManager from "./modules/catalogueManager.js";
import * as APIService from "./modules/APIService.js"

const socket = io('ws://localhost:8080');
//Use Spring Boot Backend API instead
socket.on('connect', () => {
    socket.send('query', 'Select * from items')
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
const sendquery = document.getElementById('sendquery').onclick = () => {
    catalogueManager.clearCatalogue()
    const query = buildQuery();
    APIService.getItems()
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
function renderItem(results) {
    const item = document.createElement('div');
    item.innerHTML += 
    `<img src='assets/${results.Image_URL}' class='item-img'>
    <h2>${results.Item_Name}</h2>
    <p>${results.Item_Description}</p>
    <p>Seller:${results.Seller}</p>
    <p>Price:${results.ItemID}</p>`;
    item.className = 'item'
    document.getElementById('catalogue').appendChild(item)
}
function buildQuery() {
    return document.getElementById('queryinpt').value;
}