appendHeader()
//Functionalities for pages that are not /homepage.html
const sendquery = document.getElementById('searchbutton').onclick = async () => {
    const searchValue = document.getElementById('searchinput').value
    const categoryfilterValue = document.getElementById('orderfilter').value
    window.open('/homepage.html?sv=' + searchValue + "&fv=" + categoryfilterValue, "_self")
}
document.addEventListener('keypress', (e) => {
    const searchValue = document.getElementById('searchinput').value
    if (e.key === 'Enter' && searchValue !== '') {
        sendquery()
    }
})

function appendHeader() {
    const header = document.createElement('div')
    header.innerHTML += ` 
    <div class="header-left">
        <img class="logo" alt="Logo" id="logo" onclick="window.open('homepage.html','_self')">
        <div class="searchbar">
            <span class="searchfilter">
                <label>Category:</label>
                <select id="categoryfilter">
                    <option value="ItemID">ID</option>
                    <option value="Item_Name">Name</option>

                </select>
             </span>
            <span class="searchfilter">
                <label>Filter by:</label>
                <select id="orderfilter">
                    <option value="ItemID">ID</option>
                    <option value="Item_Name">Name</option>
                    <option value="Current_Bid desc">Highest Offer</option>
                    <option value="Current_Bid asc">Lowest Offer</option>
                    <option value="Expire_Date">Expire Date</option>
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
        <span class="header-button" id="profile-button">
            <i class="fa-solid fa-user"></i>
        </span>
    </div>`;
    header.className = 'header'
    document.body.appendChild(header);
}