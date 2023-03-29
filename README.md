

# Project Structure:



  

## `Backend` 
#### Plain Java with [JDBC](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/)  and [java.net](https://docs.oracle.com/javase/8/docs/api/java/net/package-summary.html) Integration with a NodeJS Proxy for sending UDP Datagrams to the main Backend 

`/lib`  

- **mysql-connector-j-8.0.31.jar** <-- **JDBC**
- json-20230227.jar <-- *Library needed to parse the ResultSet of a Query Result into a JSON format*

`/src`  

- AuctionsLabHttpServer.java 

`/sql`  

- auctions.sql <--*Script to build the mySQL DB **RUN AT LEAST ONCE BEFORE STARTING SERVER!!***

`**proxyServer.js**` <--*The NodeJS Proxy, **Runs on a different terminal** when launching the main Backend*
  
## `Frontend` 
#### Vanilla JS + HTML + CSS, API Service with XMLHttpRequests 

`/modules`

 - **APIService.js**
   
 - buttonsManager.js
   
 - catalogueManager.js
   
 - snackbarManager.js

    `Single Function Files`
 - getLocalValute()
 - timeLeftUntilDate(date)
 - setInputFilter(inputbox, inputFilter, errMsg)
  
	`/styles`
	- modal.css
	- snackbar.css
	- offer.css

	`/models`
	- **itemsResponseModels.js**

	`/assets`
	- images...

**`styles.css`**  <-- *Global Styles*

**`index.html`**  <-- *Homepage/Catalogue*

**`script.js`**   <-- *Homepage Script*


- offer.html	  <-- *Opened on **Make An Offer Button Click***

- offer.js	  <-- *Offer Page Script*

- sendoffer.html  <-- *Opened on **Confirm** button click in Offer Page*

- sendoffer.js    <-- *Script Run to send the offer Data to the NodeJS Proxy*
