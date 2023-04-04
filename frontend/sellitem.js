import { post } from "./modules/APIService.js"
import { validateJSON } from "./modules/utils/validateJSON.js"
const params = new URL(location.href).searchParams;

const imageURL = params.get('imageURL');
const itemName = params.get('itemName').replace(/'/g, "\\'");
const minimumBid = params.get('minimumBid');
const itemDescription = params.get('itemDescription').replace(/'/g, "\\'");
const expireDate = params.get('expireDate');
const categories = validateJSON(params.get('categories'));
const username = localStorage.getItem('username') ?? sessionStorage.getItem('username');
const itemData = {
    itemName: itemName,
    imageURL: imageURL,
    minimumBid: minimumBid !== '' ? minimumBid : 0,
    itemDescription: itemDescription,
    expireDate: expireDate !== '' ? expireDate : datetimeIn24h(),
    categories: categories ?? "{}",
    username: username
};
//TODO:send categories string
console.log(categories);
if (itemData.categories == "{}" && params.get('categories') !== '') {
    setTimeout(()=>{window.open("homepage.html?rsb=4", "_self")},5000)
} else
    await post(JSON.stringify(itemData), "/sellitem").then((res) => {
        if (Number(res) > 0) window.open("homepage.html?gsb=2", "_self")
        else window.open("homepage.html?rsb=1", "_self")
    })
function datetimeIn24h() {
    const now = new Date();
    now.setDate(now.getDate() + 1)
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}