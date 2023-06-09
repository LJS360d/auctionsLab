import { cleanURL } from "../utils/cleanURL.js"

export function showSnackbar(label, color) {
    let labelColor = "#fff"
    const oldSnackbar = document.querySelector('.snackbar')
    if (oldSnackbar)
        removeSnackbar(oldSnackbar)
    if (color)
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
        if (document.querySelector('.snackbar'))
            removeSnackbar(snackbar)
    }, 3000)
}
function removeSnackbar(snackbar) {
    document.body.removeChild(snackbar)
}
export function showSnackbarGreenText(label) {
    showSnackbar(label, "#20e036")
}
export function showSnackbarRedText(label) {
    showSnackbar(label, "#d01313")
}
const params = new URL(location.href).searchParams
//Green Snack Bar
if (params.has('gsb')) {
    if (params.get('gsb') == 1)
        showSnackbarGreenText('Offer Sent')

    if (params.get('gsb') == 2)
        showSnackbarGreenText('The item has been put up for auction')

    cleanURL()
}
//Red Snack Bar
if (params.has('rsb')) {
    if (params.get('rsb') == 1)
        showSnackbarRedText('Something went wrong...')

    if (params.get('rsb') == 2)
        showSnackbarRedText('Your offer is too low')

    if (params.get('rsb') == 3)
        showSnackbarRedText('The image URL is invalid')

    if (params.get('rsb') == 4)
        showSnackbarRedText('Invalid categories')

    cleanURL()
}