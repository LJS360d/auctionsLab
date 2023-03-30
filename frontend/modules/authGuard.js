export function checkAuth() {
    if (!sessionStorage.getItem('username') || !localStorage.getItem('username')) {
        window.location.href = '/login.html';
    }
}
window.addEventListener('load', checkAuth);
