# Project Structure:

## `Backend` 
#### Plain Java with [JDBC](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/)  and [java.net](https://docs.oracle.com/javase/8/docs/api/java/net/package-summary.html) Integration with a NodeJS Proxy for sending UDP Datagrams to the main Backend 

`/lib` <-- ***Dependencies*** 

- **mysql-connector-j-8.0.31.jar** <-- **JDBC**
- json-20230227.jar <-- *Library needed to parse the ResultSet of a Query Result into a JSON format*
- json-simple-1.1.1.jar <-- *For String to JSON Conversion in UDP Server*

`/src`  

- AuctionsLabHttpServer.java <--*Starts the backend ***Contains Main method**
- TCPServer.java <--*Handles requests coming from APIService*
- UDPServer.java <--*Handles requests coming from Proxy Server*
- JSONParse.java
- EncryptionUtils.java

`/sql`  

- auctions.sql <--*Script to build the mySQL DB **RUN AT LEAST ONCE BEFORE STARTING SERVER!***


**`proxyServer.js`** <--*The NodeJS Proxy, **Runs in the background** when launching the main Backend, logs at backend/**proxy.log***
  
## `Frontend` 
#### Vanilla JS + HTML + CSS, API Service with XMLHttpRequests, Using Socket.io to dialog with Proxy

`/modules`

 - **APIService.js** <--**Handles Requests to the Backend**

 - **authGuard.js**

    `/managers`
    - buttonsManager.js  
    - catalogueManager.js
    - headerManager.js
    - loadingScreenManager.js
    - snackbarManager.js
  
	`/styles`

	- auth.css <-- *for both login.html and register.html*
	- catalogue.css
	- header.css <-- *+imports snackbar.css and modal.css*
	- loading.css
	- modal.css
	- offer.css
	- profile.css
	- snackbar.css

	`/utils` <-- *Single Function Files*

	- cleanURL()
    - getLocalValute()
	- isValidEmail()
	- isValidUUID()
	- setInputFilter(inputbox, inputFilter, errMsg)
    - timeLeftUntilDate(date)

	`/models`
	- **responseModels.js**

	`/assets`
	- images...

`Pages(Components)`
- **styles.css**  <-- *Reused Styles*

- **homepage.html**  <-- *Homepage/Catalogue*
- **homepage.js**   <-- *Homepage Script*

- offer.html	  <-- *Opened on **Make An Offer Button Click**;Built Dynamically*
- offer.js	  <-- *Sends itemID to /offerPage and received UUID to /uuidtousername, Builds offer page*

`Profile Viwer`

- profile.html <-- *Opened on **#profile-button** button click in Header;Built Dynamically*
- profile.js  <--*Sends UUID to POST /profile, Builds page relative to received data*

`Loading pages (For Update Queries)`

- sendoffer.html  <-- *Opened on **Confirm** button click in Offer Page -> Loading Component*
- sendoffer.js    <-- *Script Run to send the offer Data to the NodeJS Proxy*

- sellitem.html   <-- *Opened on **Confirm** button click in Sell Item Modal -> Loading Component*
- sellitem.js	<--*Sends item Data to POST /sellitem*

`Auth Pages`

- login.html 
- login.js

- register.html
- register.js
