
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login.html';
}
