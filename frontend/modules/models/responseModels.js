export class ItemResponseModel {
    imageURL;
    itemID;
    itemName;
    itemDescription;
    highestBidder;
    minimumBid;
    currentBid;
    seller;
    bidAddress;
    expireDate;
    constructor(item) {
        this.imageURL = item.Image_URL
        this.itemID = item.ItemID
        this.itemName = item.Item_Name
        this.itemDescription = item.Item_Description
        this.highestBidder = item.Highest_Bidder
        this.minimumBid = item.Minimum_Bid
        this.currentBid = item.Current_Bid
        this.seller = item.Seller
        this.bidAddress = item.Bid_Address
        this.expireDate = item.Expire_Date
        this.categories = item.Categories
    }
    toString(){
        let string = ''
        for (const key in this) {
            string += this[key]+';'
        }
        return string;
    }
}
export class ItemResponseJSON{
    itemResponseModelArray;
    /**
     * The ResultSet.toString() that is sent by the java backend
     * @param {String} resultSet 
     */
    constructor(resultSet){
        this.itemResponseModelArray = JSON.parse(resultSet)
    }
}

export class userProfileResponseModel{
    email;
    birthDate;
    username;
    balance;
    constructor(res){
        const user = JSON.parse(res)[0];
        this.email = user.Email;
        this.birthDate = user.Birth_Date;
        this.username = user.Username;
        this.balance = user.Balance;

    }
    toString(){
        let string = ''
        for (const key in this) {
            string += this[key]+';'
        }
        return string;
    }
}

export class categoriesResponseModel{
    categoriesArray = [];
    constructor(res){
        const categoriesJSON = JSON.parse(res);
        let categoriesVector = [];
        for (const entry of categoriesJSON) {
            if('Categories' in entry)
            categoriesVector = categoriesVector.concat(JSON.parse(entry.Categories))
        }
        this.categoriesArray = Array.from(new Set(categoriesVector))
    }
}