import { showSnackbarGreenText } from "./snackbarManager.js";
import { setInputFilter } from "../utils/setInputFilter.js";

const watchlistButton = document.getElementById('watchlist-button')
export var onWatchListButtonClick = watchlistButton.onclick = function () {
    showWatchlistModal()
    function showWatchlistModal() {
        const modal = document.createElement('div')
        modal.innerHTML += `
        <div class="modal-content">
        <span class="close" onclick="document.body.removeChild(this.parentElement.parentElement)">&times;</span>

        <p>Watchlist Modal</p>

        </div>`;
        modal.className = 'modal'
        modal.style.display = 'block'
        document.body.appendChild(modal)
        document.addEventListener('keydown', closeModalOnEscape)
    }
}
const sellButton = document.getElementById('sell-button')
export var onSellItemButtonClick = sellButton.onclick = function () {
    showSellModal()
    function showSellModal() {
        const modal = document.createElement('div')
        modal.innerHTML += `
        <div class="modal-content">
        <span class="close" onclick="document.body.removeChild(this.parentElement.parentElement)">&times;</span>
        <form action="/sellitem.html" method="get" autocomplete="off">
            <h2>Put an item up for auction</h2>
            <label>Image URL</label>
            <input type="url" name="imageURL" maxlength="300" placeholder="URL to the item's image">
            <label>Item Name</label>
            <input type="text" name="itemName" maxlength="50" placeholder="Your item's name at birth" required>
            <label>Item Description</label>
            <textarea name="itemDescription" cols="10" rows="10" maxlength="300" placeholder="Write something cool about it"></textarea>
            <label>Categories</label>
            <input type="select" name="categories" placeholder="Category Name:Subcategory,Another Category:[Many,Sub Categories]">
            <br><br><br>
            <label>Minimum Bid</label>
            <input class="value-input" type="text" name="minimumBid" placeholder="10.00">
            <label>Expire Date</label>
            <input type="date" name="expireDate" value="${todayPlusAWeek()}" min="${tomorrow()}" max="${todayPlusAMonth()}">
            <button class="item-button" type="submit">Confirm  <i class="fa fa-paper-plane"></i></button>
        </form>
        </div>`;
        //TODO: add categories selector
        modal.className = 'modal'
        modal.style.display = 'block'
        document.body.appendChild(modal)
        setInputFilter(document.querySelector('.value-input'), function (value) {
            return /^\d*\.?\d{0,2}$/.test(value);
        }, "Only numbers with 2 or less decimal digits are allowed")
        document.addEventListener('keydown', closeModalOnEscape)
    }
    function tomorrow() {
        //Seconds in a day = 86 400 
        return new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
    function todayPlusAWeek() {
        //Seconds in a week = 604 800 
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
    function todayPlusAMonth() {
        let nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth.toISOString().split('T')[0];
    }

}

const profileButton = document.getElementById('profile-button');
export var onProfileButtonClick = profileButton.onclick = function () {
    gotoProfile()
    function gotoProfile() {
        window.open('/profile.html', '_self')
    }
}

export function setItemButtonsOnclick() {
    const offerButtons = document.querySelectorAll('.item-button');
    offerButtons.forEach((button) => {
        switch (button.getAttribute('race')) {
            case 'offer':
                button.onclick = function () {
                    const itemID = button.value;
                    window.open(`/offer.html?itemID=${itemID}`, '_self')
                }
                break;
            case 'watchlist':
                button.onclick = function () {
                    const itemID = button.value;
                    //TODO:Check watchlist IF itemID already present -> Red Text:"The item is already in your watchlist"
                    showSnackbarGreenText("Not Yet Implemented")
                }
                break;

        }
    })
}

function closeModalOnEscape(e) {
    if (e.key == 'Escape') {
        document.body.removeChild(document.querySelector('.modal'))
        document.removeEventListener('keydown', closeModalOnEscape)
    }
}