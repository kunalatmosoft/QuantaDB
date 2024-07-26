// Create User
document.getElementById('create-user-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = event.target.name.value;
  const age = parseInt(event.target.age.value, 10);
  await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, age }),
  });
  event.target.reset();
  displayUsers();
});

// Update User
document.getElementById('update-user-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = event.target.id.value;
  const name = event.target.name.value;
  const age = parseInt(event.target.age.value, 10);
  const newData = {};
  if (name) newData.name = name;
  if (age) newData.age = age;
  await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  });
  event.target.reset();
  displayUsers();
});

// Delete User
document.getElementById('delete-user-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = event.target.id.value;
  await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });
  event.target.reset();
  displayUsers();
});

// Read Users
document.getElementById('read-users').addEventListener('click', async () => {
  displayUsers();
});

// Display Users
async function displayUsers() {
  const response = await fetch('/api/users');
  const users = await response.json();
  const usersList = document.getElementById('users-list');
  usersList.innerHTML = '';
  users.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.className = 'user';
    userDiv.innerText = `ID: ${user.id} - Name: ${user.name} - Age: ${user.age}`;
    usersList.appendChild(userDiv);
  });
}

// Initial load
displayUsers();
