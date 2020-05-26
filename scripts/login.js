window.onload = (() => {
  const button = document.querySelector("button");
  const inputs = document.querySelectorAll("input");

  inputs.forEach(input => input.addEventListener('focus', handleFocus));
  button.addEventListener('click', handleSubmit);
})();

function handleFocus() {
  const error = document.querySelector(".error");
  error.innerHTML = "";
}

async function handleSubmit(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const error = document.querySelector(".error");
  const isValid = validateLogin(username, password);

  if (isValid) {
    const { user } = await checkUser(username, password);

    if (!user) {
      error.innerHTML = "Wrong username or password";
    } else {
      localStorage.setItem('user', user)
    }
  } else {
    error.innerHTML = "Wrong username or password";
  }
}

function validateLogin(username = "", password = "") {
  if (username.trim().length === 0 || password.trim().length === 0) {
    return false;
  }

  return true;
}

async function checkUser(username = "", password = "", error) {
  const data = await fetch("../data.json");
  const { users } = await data.json();

  // Check if the user is registered
  const foundUser = users.find(user => user.username === username);
  if (!foundUser) {
    return {
      user: null
    };
  }

  // If user is registered check if the password matches the stored one
  if (password !== foundUser.password) {
    return {
      user: null
    };
  }

  return {
    user: username
  };
}
