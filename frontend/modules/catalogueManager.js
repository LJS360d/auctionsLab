clearCatalogue()
export function clearCatalogue() {
    const catalogue = document.getElementById('catalogue') ?? {firstChild:false}; 
    while(catalogue.firstChild){
        catalogue.removeChild(catalogue.lastChild)
    }
}
export function noItemsAvailable(){
    const catalogue = document.getElementById('catalogue') ?? {firstChild:false}; 
    const bg = document.createElement('img')
    bg.src = './assets/items-unavailable.png'
    bg.alt = 'No Items Available'
    catalogue.appendChild(bg)
}