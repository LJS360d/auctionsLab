import * as APIService from "../modules/APIService.js";

const itemID = new URL(location.href).searchParams.get('itemID');
const result = await APIService.post(itemID)
console.log(result);

