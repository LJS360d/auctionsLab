import * as catalogueManager from "./modules/managers/catalogueManager.js";
import * as APIService from "./modules/APIService.js"
import * as Models from "./modules/models/responseModels.js"
import * as buttonsManager from "./modules/managers/buttonsManager.js"
import { timeLeftUntilDate } from "./modules/utils/timeLeftUntilDate.js";
import { getLocalValute } from "./modules/utils/getLocalValute.js";
import { cleanURL } from "./modules/utils/cleanURL.js";
const params = new URL(location.href).searchParams
await appendCategories()
const sendquery = document.getElementById('searchbutton').onclick = async () => {
    catalogueManager.clearCatalogue()
    handleParams()
    const searchValue = String(document.getElementById('searchinput').value).toLowerCase()
    const filterValue = String(document.getElementById('orderfilter').value)
    const categoryValue = String(document.getElementById('categoryfilter').value)
    renderItemsOffAPIResponse(await APIService.postGetByName(searchValue, filterValue, categoryValue))

    function handleParams() {
        if (params.has('sv')) {
            document.getElementById('searchinput').value = params.get('sv')
            params.delete('sv')
        } if (params.has('fv')) {
            document.getElementById('orderfilter').value = params.get('fv')
            params.delete('fv')
        } if (params.has('cv')) {
            document.getElementById('categoryfilter').value = params.get('cv')
            params.delete('cv')
        }
    }
}
//Search Value
if (!params.has('sv') && !params.has('cv'))
    renderItemsOffAPIResponse(await APIService.getAllItems())
else {
    sendquery()
    cleanURL();
}


document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendquery()
    }
})
document.getElementById('orderfilter').addEventListener('change', sendquery)
document.getElementById('categoryfilter').addEventListener('change', sendquery)

function renderItemsOffAPIResponse(itemsResponse) {
    const resultset = new Models.ItemResponseJSON(itemsResponse)
    if (resultset.itemResponseModelArray.length > 0) {
        resultset.itemResponseModelArray.forEach((item) => {
            renderItem(item)
        })
        buttonsManager.setItemButtonsOnclick()
    } else
        catalogueManager.noItemsAvailable()
}

function renderItem(itemRes) {
    const item = new Models.ItemResponseModel(itemRes)
    const renderItem = document.createElement('div');
    renderItem.innerHTML += `
    <div class="item-top">
    <img src='${item.imageURL}' class='item-img'>
    <h5>${item.itemName}</h5>
    <label>Seller:${avoidOverflowFormat(item.seller)}</label>
    <label>Time Left:${timeLeftUntilDate(item.expireDate)} </label>
    <label>Going for:${item.currentBid ?? item.minimumBid}${getLocalValute()}</label> 
    </div>
    <div class="item-bottom">
    <button class="item-button" race="offer" style="--c:#33ff28" value="${item.itemID}">Make an Offer</button>
    <button class="item-button" race="watchlist" style="--c:#E95A49" value="${item.itemID}">Add to Watchlist</button>
    </div>`;
    renderItem.className = 'item'
    renderItem.ondblclick = () => {
        window.open(`offer.html?itemID=${item.itemID}`, '_self')
    }
    document.getElementById('catalogue').appendChild(renderItem)

    function avoidOverflowFormat(string) {
        const CUT_POINT = 14
        if (string.length > CUT_POINT) {
            return `${string.substring(0, CUT_POINT - 1)}...`
        } else {
            return string
        }
    }
}

async function appendCategories() {
    const categories = sessionStorage.getItem('categories') ?
        JSON.parse(sessionStorage.getItem('categories')) : await fetchAndStoreCategories()

    categories.forEach(category => {
        const categoryOption = document.createElement('option')
        categoryOption.value = category
        categoryOption.innerText = category.replace(/_/, " ")
        document.getElementById('categoryfilter').appendChild(categoryOption)
    })

    async function fetchAndStoreCategories() {
        const categories = new Models.categoriesResponseModel(await APIService.getCategories()).categoriesArray
        sessionStorage.setItem('categories', JSON.stringify(categories))
        return categories;
    }
}