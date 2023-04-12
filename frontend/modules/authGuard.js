export function checkAuth() {
    if (!sessionStorage.getItem('uuid') && !localStorage.getItem('uuid')) {
        window.open("login.html","_self")
    }
}
window.addEventListener('load', checkAuth);
