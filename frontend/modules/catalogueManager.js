export function clearCatalogue() {
    const catalogue = document.getElementById('catalogue') ?? {firstChild:false}; 
    while(catalogue.firstChild){
        catalogue.removeChild(catalogue.lastChild)
    }
}