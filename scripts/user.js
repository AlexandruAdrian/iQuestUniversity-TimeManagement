(() => {
  if (window.location.href.includes("login.html") && isLoggedIn()) {
    window.location.href = "./dashboard.html";
    return;
  } else if (window.location.pathname.includes("dashboard.html") && !isLoggedIn()) {
    window.location.href = "./login.html";
    return;
  }

  if (window.location.pathname.includes("dashboard.html") && isLoggedIn()) {
    displayUserData().catch(err => {
      const crash = document.getElementById("crash");
      const popup = crash.firstElementChild;
      crash.classList.add("modal-bg-active");
      const p = document.createElement('p');
      p.innerHTML = err;
      popup.insertBefore(p, popup.firstChild);
      popup.lastElementChild.addEventListener("click", () => {
        localStorage.clear();
        document.getElementById("crash").classList.remove("modal-bg-active");
        window.location.href = "./login.html";
      })
    });
  }
})();

function isLoggedIn() {
  const user = localStorage.getItem('user');
  if (!user) {
    return false;
  }
  return true;
}

async function getUserData() {
  const email = localStorage.getItem('user');
  const data = await fetch('https://reqres.in/api/users?page=1');
  const { data: users } = await data.json();
  const user = users.find(user => user.email === email);
  return user;
}
// Called only if route matches dashboard.html and the user is logged in
async function displayUserData() {
  const user = await getUserData();
  // In case local storage holds bad data
  if (!user) {
    throw new Error('Please login before using this feature');
  }
  // Display user data on the dashboard header
  const htmlUser = document.querySelector(".user").firstElementChild;
  const htmlAvatar = document.querySelector(".avatar").firstElementChild;
  htmlUser.innerHTML = `${user.first_name} ${user.last_name}`;
  htmlAvatar.setAttribute("src", user.avatar);
}
