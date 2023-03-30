# Project Structure:

## `Backend` 
#### Plain Java with [JDBC](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/)  and [java.net](https://docs.oracle.com/javase/8/docs/api/java/net/package-summary.html) Integration with a NodeJS Proxy for sending UDP Datagrams to the main Backend 

`/lib` <-- ***Dependencies*** 

- **mysql-connector-j-8.0.31.jar** <-- **JDBC**
- json-20230227.jar <-- *Library needed to parse the ResultSet of a Query Result into a JSON format*
- json-simple-1.1.1.jar <-- *For String to JSON Conversion in UDP Server*

`/src`  

- AuctionsLabHttpServer.java 
- TCPServer.java
- UDPServer.java

`/sql`  

- auctions.sql <--*Script to build the mySQL DB **RUN AT LEAST ONCE BEFORE STARTING SERVER!***


**`proxyServer.js`** <--*The NodeJS Proxy, **Runs in the background** when launching the main Backend, logs at backend/proxy.log*
  
## `Frontend` 
#### Vanilla JS + HTML + CSS, API Service with XMLHttpRequests, Using Socket.io to dialog with Proxy

`/modules`

 - **APIService.js** <--**Handles Requests to the Backend**

 - **authGuard.js**

    `/managers`
   
    - buttonsManager.js  
    - catalogueManager.js
    - snackbarManager.js

    `/utils` <-- *Single Function Files*

    - getLocalValute()
    - timeLeftUntilDate(date)
	- setInputFilter(inputbox, inputFilter, errMsg)
  
	`/styles`
	- modal.css
	- snackbar.css
	- offer.css
	- auth.css <-- *for both login.html and register.html*

	`/models`
	- **itemsResponseModels.js**

	`/assets`
	- images...

`Pages(Components)`
- **styles.css**  <-- *Global Styles*

- **homepage.html**  <-- *Homepage/Catalogue*
- **homepage.js**   <-- *Homepage Script*

- offer.html	  <-- *Opened on **Make An Offer Button Click***
- offer.js	  <-- *Offer Page Script*

- sendoffer.html  <-- *Opened on **Confirm** button click in Offer Page*
- sendoffer.js    <-- *Script Run to send the offer Data to the NodeJS Proxy*

`Auth Pages`

- login.html 
- login.js

- register.html
- register.js
