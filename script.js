// Homepage Modal Functionality
function showModal(category) {
    document.getElementById("modal").style.display = "block";
    document.getElementById("modal-text").innerText = `You selected the ${category} category`;
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// Registration Page Password Validation
document.getElementById('registrationForm')?.addEventListener('submit', function (event) {
    event.preventDefault();  // Prevent form from default submission

    const regUsername = document.getElementById('regUsername').value.trim();
    const regPassword = document.getElementById('regPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const registerMessage = document.getElementById('registerMessage');

    // Check if passwords match
    if (regPassword !== confirmPassword) {
        registerMessage.textContent = "Passwords do not match!";
        registerMessage.style.color = 'red';
        return;
    }

    // Store registered user in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if the username already exists
    const existingUser = users.find(user => user.username === regUsername);
    if (existingUser) {
        registerMessage.textContent = "Username already taken!";
        registerMessage.style.color = 'red';
        return;
    }

    // Add new user to localStorage
    users.push({ username: regUsername, password: regPassword });
    localStorage.setItem('users', JSON.stringify(users));

    registerMessage.textContent = "Registration successful! Redirecting to login...";
    registerMessage.style.color = 'green';

    // Redirect to login page after 2 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
});

// Login Form Submission
document.getElementById('loginForm')?.addEventListener('submit', function (event) {
    event.preventDefault();  // Prevent default form submission

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const loginMessage = document.getElementById('loginMessage');

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Find the user by username
    const user = users.find(user => user.username === username);

    // Check if account exists
    if (!user) {
        loginMessage.textContent = 'Account doesn’t exist. Please check your username.';
        loginMessage.style.color = 'red';
        return;
    }

    // Check if the password matches
    if (user.password !== password) {
        loginMessage.textContent = 'Incorrect password. Please try again.';
        loginMessage.style.color = 'red';
        return;
    }

    // Successful login
    sessionStorage.setItem('currentUser', username); // Store current user in session storage
    loginMessage.textContent = 'Login successful! Redirecting to products page...';
    loginMessage.style.color = 'green';

    // Redirect after 2 seconds to the products page
    setTimeout(() => {
        window.location.href = 'products.html';
    }, 2000);
});

// Profile Page
function displayProfile() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUsername = sessionStorage.getItem('currentUser'); // Get current user from session storage

    if (currentUsername) {
        const user = users.find(user => user.username === currentUsername);
        if (user) {
            document.getElementById('username').value = user.username; // Set username
            document.getElementById('address').value = user.address || ''; // Set address
            document.getElementById('mobile').value = user.mobile || ''; // Set mobile number
        }
    }
}

// Handle form submission to save profile changes
document.getElementById('editProfileForm')?.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from default submission

    const address = document.getElementById('address').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUsername = sessionStorage.getItem('currentUser'); // Get current user from session storage

    if (currentUsername) {
        const user = users.find(user => user.username === currentUsername);
        if (user) {
            user.address = address; // Update address
            user.mobile = mobile; // Update mobile number
            localStorage.setItem('users', JSON.stringify(users)); // Save updated users to localStorage
            displayProfile(); // Refresh profile display
            alert("Profile updated successfully!");
        }
    }
});

// Function to display saved addresses
function displayAddresses() {
    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    const addressList = document.getElementById('addressList');
    addressList.innerHTML = '';

    addresses.forEach((address, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = address;

        // Add an edit button next to each address
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editAddress(index);
        
        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteAddress(index);
        
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        addressList.appendChild(listItem);
    });
}

// Function to add or edit an address
document.getElementById('addressForm')?.addEventListener('submit', function (event) {
    event.preventDefault();  // Prevent default form submission
    const addressInput = document.getElementById('address');
    const address = addressInput.value.trim();

    if (!address) return; // Prevent saving empty addresses

    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    
    // Check if it's an edit or a new entry
    const editingIndex = addressInput.dataset.index; // Store index if editing
    if (editingIndex !== undefined) {
        addresses[editingIndex] = address; // Update the address
    } else {
        addresses.push(address); // Add new address
    }
    
    // Save back to localStorage
    localStorage.setItem('addresses', JSON.stringify(addresses));
    addressInput.value = ''; // Clear input field
    delete addressInput.dataset.index; // Clear editing index
    displayAddresses(); // Refresh the address list
});

// Function to edit an address
function editAddress(index) {
    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    const addressInput = document.getElementById('address');
    addressInput.value = addresses[index]; // Set the input to the address being edited
    addressInput.dataset.index = index; // Store the index to identify it's an edit
}

// Function to delete an address
function deleteAddress(index) {
    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    addresses.splice(index, 1); // Remove the address
    localStorage.setItem('addresses', JSON.stringify(addresses)); // Save the updated list
    displayAddresses(); // Refresh the address list
}

// Initial display of addresses on page load
document.addEventListener('DOMContentLoaded', () => {
    displayAddresses(); // Display addresses when DOM is fully loaded
    displayProfile(); // Load user profile information
});

// Function to handle logout
function logout() {
    sessionStorage.removeItem('currentUser'); // Remove current user from session storage
    window.location.href = 'index.html'; // Redirect to homepage
}
