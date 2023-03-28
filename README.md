

# Project Structure:



  

## `Backend` 
#### Plain Java with [JDBC](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/)  and [java.net](https://docs.oracle.com/javase/8/docs/api/java/net/package-summary.html) Integration

`/lib`  

- **mysql-connector-j-8.0.31.jar** <-- **JDBC**
- json-20230227.jar <-- *Library needed to parse the ResultSet of a Query Result into a JSON format*

`/src`  

- AuctionsLabHttpServer.java 

  
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
