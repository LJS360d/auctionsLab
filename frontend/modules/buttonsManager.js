const watchlistButton = document.getElementById('watchlist-button')
export var onWatchListButtonClick = watchlistButton.onclick = function () {
    console.log('watchlist');
}

const sellButton = document.getElementById('sell-button')
export var onSellItemButtonClick = sellButton.onclick = function () {
    console.log('sell');
}

export function setItemButtonsOnclick() {
    const offerButtons = document.querySelectorAll('.item-button');
    offerButtons.forEach((button) => {
        switch (button.getAttribute('race')) {
            case 'offer':
                button.onclick = function(){
                    const itemID = button.value;
                    console.log('Offer'+itemID);
                }
                break;
            case 'watchlist':
                button.onclick = function(){
                    const itemID = button.value;
                    console.log('Watch'+itemID);
                }
                break;

        }
    })
}
