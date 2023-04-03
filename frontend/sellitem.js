import * as APIService from "./modules/APIService.js"
const params = new URL(location.href).searchParams;

const imageURL = params.get('imageURL');
const itemName = params.get('itemName');
const minimumBid = params.get('minimumBid');
const itemDescription = params.get('itemDescription');
const expireDate = params.get('expireDate');
const username = localStorage.getItem('username') ?? sessionStorage.getItem('username');
const itemData = {
    itemName: itemName,
    imageURL: imageURL,
    minimumBid: minimumBid !== '' ? minimumBid : 0,
    itemDescription: itemDescription,
    expireDate: expireDate !== '' ? expireDate : datetimeinAWeek(),
    username: username
};
await APIService.post(JSON.stringify(itemData), "/sellitem").then((res) => {
    
        if(Number(res) > 0)  window.open("homepage.html?gsb=2", "_self") 
        else window.open("homepage.html?rsb=1", "_self");
    
})
function datetimeinAWeek() {
    const now = new Date();
    now.setDate(now.getDate() + 7)
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
