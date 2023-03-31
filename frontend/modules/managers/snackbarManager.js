export function showSnackbar(label,color) {
    let labelColor = "#fff"
    const oldSnackbar = document.querySelector('.snackbar')
    if(oldSnackbar)
    removeSnackbar(oldSnackbar)
    if(color)
    labelColor = color ?? "#fff"
    const snackbar = document.createElement('div')
    snackbar.innerHTML += `
    <div class="snackbar-content">
    <label style="color:${labelColor};">${label ?? "My guy...put a label"}</label>
    <span class="close" onclick="document.body.removeChild(this.parentElement.parentElement)">&times;</span>
    </div>
    `;
    snackbar.className = 'snackbar'
    document.body.appendChild(snackbar);
    setTimeout(() => {
        snackbar.className.replace("show", "");
        if(document.querySelector('.snackbar')) 
        removeSnackbar(snackbar)
    }, 3000)
}
function removeSnackbar(snackbar) {
    document.body.removeChild(snackbar)
}
export function showSnackbarGreenText(label){
    showSnackbar(label,"#20e036")
}
export function showSnackbarRedText(label){
    showSnackbar(label,"#d01313")
}
const params = new URL(location.href).searchParams
//Offer Green Snack Bar
if(params.has('ogsb')){
    if(params.get('ogsb') == 1)
    showSnackbarGreenText('Offer Sent')

}
//Offer Red Snack Bar
if(params.has('orsb')){
    if(params.get('orsb') == 1)
    showSnackbarRedText('Something whent wrong...')

    if(params.get('orsb') == 2)
    showSnackbarRedText('Your offer is too low')

}