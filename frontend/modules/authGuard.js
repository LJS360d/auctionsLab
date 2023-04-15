export function checkAuth() {
    
    if ((!sessionStorage.getItem('uuid') && !localStorage.getItem('uuid'))  || window.location.href == "/") {
        window.open("login.html","_self")
    }

}
window.addEventListener('load', checkAuth);
