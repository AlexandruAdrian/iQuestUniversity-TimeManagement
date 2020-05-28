(() => {
  const mobileMenuTrigger = document.querySelector(".mobile-menu-trigger");
  mobileMenuTrigger.addEventListener("click", openMobileMenu);
})();

function openMobileMenu() {
  const mobileMenu = document.querySelector(".mobile-menu");
  const logOutBtn = mobileMenu.lastElementChild;
  const closeMobileMenuBtn = document.querySelector(".close-mobile-menu");

  toggleClass(mobileMenu, "hide-mobile-menu", "show-mobile-menu");
  closeMobileMenuBtn.addEventListener("click", closeMobileMenu);
  logOutBtn.addEventListener("click", handleLogOut);
}

function closeMobileMenu() {
  const closeMobileMenuBtn = document.querySelector(".close-mobile-menu");
  const mobileMenu = document.querySelector(".mobile-menu");

  toggleClass(mobileMenu, "show-mobile-menu", "hide-mobile-menu");
  closeMobileMenuBtn.removeEventListener("click", closeMobileMenu);
}

function handleLogOut() {
  localStorage.clear();
  window.location.href = "./login.html";
}

function toggleClass(element, removeClass, addClass) {
  element.classList.remove(removeClass);
  element.classList.add(addClass);
}
