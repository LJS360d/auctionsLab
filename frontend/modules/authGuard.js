export function checkAuth() {
    if (!sessionStorage.getItem('uuid') && !localStorage.getItem('uuid')) {
        window.location.href = '/login.html';
    }
}
window.addEventListener('load', checkAuth);
