(() => {
  if (window.location.href.includes("login.html") && isLoggedIn()) {
    window.location.href = "./dashboard.html";
  } else if (window.location.pathname.includes("dashboard.html") && !isLoggedIn()) {
    window.location.href = "./login.html";
  }
})();

function isLoggedIn() {
  const user = localStorage.getItem('user');
  if (!user) {
    return false;
  }
  return true;
}
