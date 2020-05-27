export const isLoggedIn = () => {
  const user = localStorage.getItem('user');
  if (!user) {
    return false;
  }
  return true;
}

export const getUserData = async () => {
  const username = localStorage.getItem('user');
  const result = await fetch('../../data.json');
  const { users } = await result.json();
  const user = users.find(u => u.username === username);
  delete user.password
  return user;
}