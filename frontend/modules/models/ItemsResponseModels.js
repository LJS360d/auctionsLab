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