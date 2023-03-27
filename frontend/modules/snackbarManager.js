export function showSnackbar(label) {
    const oldSnackbar = document.querySelector('.snackbar')
    if(oldSnackbar)
    removeSnackbar(oldSnackbar)
    const snackbar = document.createElement('div')
    snackbar.innerHTML += `
    <div class="snackbar-content">
    <label>${label}</label>
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