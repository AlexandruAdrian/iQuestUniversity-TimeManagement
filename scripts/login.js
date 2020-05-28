(() => {
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
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const error = document.querySelector(".error");

  const isValid = validateLogin(email, password);
  if (isValid) {
    const { user } = await checkUser(email, password);

    if (!user) {
      error.innerHTML = "Wrong username or password";
    } else {
      localStorage.setItem('user', user.email);
      window.location.href = "./dashboard.html";
    }
  } else {
    error.innerHTML = "Wrong username or password";
  }
}

function validateLogin(email = "", password = "") {
  if (email.trim().length === 0 || password.trim().length === 0) {
    return false;
  }
  // Check if the email input is actually a valid e-mail
  const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regexp.test(email)) {
    return false;
  }

  return true;
}

async function checkUser(email = "", password = "") {
  const data = await fetch("https://reqres.in/api/users?page=1");
  const { data: users } = await data.json();
  const pass = '12345';
  // Check if the user is registered
  const foundUser = users.find(user => user.email === email);
  if (!foundUser) {
    return {
      user: null
    };
  }
  // If user is registered check if the password matches the stored one
  if (password !== pass) {
    return {
      user: null
    };
  }

  return {
    user: foundUser
  };
}
