import { categoriesResponseModel } from "../models/responseModels.js"
import { getCategories } from "../APIService.js"
appendHeader()




//Functionalities for pages that are not /homepage.html
const sendquery = document.getElementById('searchbutton').onclick = async () => {
    const searchValue = document.getElementById('searchinput').value
    const orderFilterValue = document.getElementById('orderfilter').value
    const categoryFilterValue = String(document.getElementById('categoryfilter').value)
    window.open('/homepage.html?sv=' + searchValue +
        "&fv=" + orderFilterValue +
        "&cv=" + categoryFilterValue,
        "_self")
}
document.addEventListener('keypress', (e) => {
    const searchValue = document.getElementById('searchinput').value
    if (e.key === 'Enter' && searchValue !== '') {
        sendquery()
    }
})

async function appendHeader() {
    const header = document.createElement('div')
    header.innerHTML += ` 
        <div class="header-left">
            <img class="logo" alt="Logo" id="logo" onclick="window.open('homepage.html','_self')">
            <div class="searchbar">
                <span class="searchfilter" title="Search in Category">
                    <select id="categoryfilter">
                        <option value="" selected>All Categories</option>
                        <!--Built dynamically with result from /categories endpoint-->
                    </select>
                </span>
                <span class="searchfilter" title="Filter By">
                    <select id="orderfilter">
                        <optgroup label="Ascending Order">
                            <option value="Current_Bid asc">Lowest Offer</option>
                            <option value="ItemID asc">First Added</option>
                            <option value="Item_Name asc">Name (A-Z)</option>
                            <option value="Expire_Date asc">Expire Date</option>
                        </optgroup>
                        <optgroup label="Descending Order">
                            <option value="Current_Bid desc" >Highest Offer</option>
                            <option value="ItemID desc" selected>Last Added</option>
                            <option value="Item_Name desc">Name (Z-A)</option>
                            <option value="Expire_Date desc">Expire Date</option>

                        </optgroup>
                    </select>
                </span>
                <input type="text" class="searchinput" id="searchinput" maxlength="100" placeholder="Search"
                    pattern="[^'\x22]+">
                <button type="submit" class="searchbutton" id="searchbutton"><i class="fa fa-search"></i></button>
            </div>
        </div>
        <div class="header-right">
            <span class="header-button" id="watchlist-button">
                Check your Watchlist
                <i class="fa fa-map-o"></i>
            </span>
            <span class="header-button" id="sell-button">
                Sell an Item
                <i class="fa-solid fa-money-bill-trend-up"></i>
            </span>
            <span class="header-button" id="profile-button" title="View your profile">
                <i class="fa-solid fa-user"></i>
            </span>
        </div>`;
    header.className = 'header'
    document.body.appendChild(header);

    if (sessionStorage.getItem('categories')) {
        const categories = JSON.parse(sessionStorage.getItem('categories'))
        appendCategories(categories)
    } else {
        const categories = new categoriesResponseModel(await getCategories()).categoriesArray;
        sessionStorage.setItem('categories', JSON.stringify(categories))
        appendCategories(categories)
    }
}

function appendCategories(categories) {
    categories.forEach(category => {
        const categoryFilter = document.getElementById('categoryfilter')
        const categoryOption = document.createElement('option')
        categoryOption.value = category
        categoryOption.innerText = category.replace(/_/," ")
        categoryFilter.appendChild(categoryOption)
    })
}