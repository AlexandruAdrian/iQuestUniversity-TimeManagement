import { isLoggedIn, getUserData } from "./modules/user.js";

(async () => {
  if (!isLoggedIn()) {
    window.location.pathname = "/login.html";
  }
  // Fetch user data
  const { username, pathToProfile } = await getUserData();
  // Display user data on the dashboard header
  const htmlUser = document.querySelector(".user").firstElementChild;
  const htmlAvatar = document.querySelector(".avatar").firstElementChild;
  htmlUser.innerHTML = username;
  htmlAvatar.setAttribute("src", pathToProfile);
  // Handle mobile menu
  const mobileMenuTrigger = document.querySelector(".mobile-menu-trigger");
  mobileMenuTrigger.addEventListener("click", openMobileMenu);
})();

function openMobileMenu() {
  // Select mobile menu and show it
  const mobileMenu = document.querySelector(".mobile-menu");
  const logOutBtn = mobileMenu.lastElementChild;
  toggleClass(mobileMenu, "hide-mobile-menu", "show-mobile-menu");
  // Add event listener on the close menu button and hide the menu on click
  const closeMobileMenuBtn = document.querySelector(".close-mobile-menu");
  closeMobileMenuBtn.addEventListener("click", closeMobileMenu);
  // Add event listener on the logout button
  logOutBtn.addEventListener("click", handleLogOut);
}

function closeMobileMenu() {
  const closeMobileMenuBtn = document.querySelector(".close-mobile-menu");
  const mobileMenu = document.querySelector(".mobile-menu");
  // Remove close button event listener
  toggleClass(mobileMenu, "show-mobile-menu", "hide-mobile-menu");
  closeMobileMenuBtn.removeEventListener("click", closeMobileMenu);
}

function handleLogOut() {
  localStorage.clear();
  window.location.pathname = "/login.html";
}

function toggleClass(element, removeClass, addClass) {
  element.classList.remove(removeClass);
  element.classList.add(addClass);
}
