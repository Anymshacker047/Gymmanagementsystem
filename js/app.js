// app.js - Client Side Logic

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    
    // Render dynamic content if on index.html
    if (document.getElementById('offersGrid')) {
        renderOffers();
        renderSupplements();
    }

    // Auth forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);

    // Support form
    const supportForm = document.getElementById('supportForm');
    if (supportForm) supportForm.addEventListener('submit', handleSupport);

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
});

function updateNavbar() {
    const user = getCurrentUser();
    const userInfo = document.getElementById('userInfo');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminBtn = document.getElementById('adminBtn');

    if (user) {
        if(userInfo) userInfo.textContent = `Hello, ${user.name}`;
        if(loginBtn) loginBtn.style.display = 'none';
        if(logoutBtn) logoutBtn.style.display = 'inline-block';
        if(user.role === 'admin' && adminBtn) {
            adminBtn.style.display = 'inline-block';
        }
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;
    const errorMsg = document.getElementById('loginError');

    const users = getDB(DB_USERS);
    const user = users.find(u => u.email === email && u.password === pass);

    if (user) {
        setCurrentUser(user);
        window.location.href = user.role === 'admin' ? 'admin.html' : 'index.html';
    } else {
        errorMsg.textContent = 'Invalid credentials!';
    }
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const pass = document.getElementById('signupPassword').value;
    const errorMsg = document.getElementById('signupError');

    const users = getDB(DB_USERS);
    if (users.find(u => u.email === email)) {
        errorMsg.textContent = 'Email already registered!';
        return;
    }

    const newUser = { id: generateId('u'), name, email, password: pass, role: 'user' };
    users.push(newUser);
    setDB(DB_USERS, users);
    
    setCurrentUser(newUser);
    window.location.href = 'index.html';
}

function handleLogout() {
    logoutUser();
    window.location.href = 'index.html';
}

function renderOffers() {
    const grid = document.getElementById('offersGrid');
    const offers = getDB(DB_OFFERS);
    grid.innerHTML = '';
    
    offers.forEach(off => {
        grid.innerHTML += `
            <div class="card">
                <h3>${off.title}</h3>
                <div class="price">${off.price}</div>
                <p>${off.desc}</p>
                <button class="btn btn-full" onclick="placeOrder('Joining Plan', '${off.title}')">Select Plan</button>
            </div>
        `;
    });
}

function renderSupplements() {
    const grid = document.getElementById('supplementsGrid');
    const supps = getDB(DB_SUPPLEMENTS);
    grid.innerHTML = '';
    
    supps.forEach(sup => {
        grid.innerHTML += `
            <div class="card">
                <img src="${sup.img}" alt="${sup.title}">
                <h3>${sup.title}</h3>
                <div class="price">${sup.price}</div>
                <p>${sup.desc}</p>
                <button class="btn btn-full" onclick="placeOrder('Supplement', '${sup.title}')">Buy Now</button>
            </div>
        `;
    });
}

function placeOrder(type, itemName) {
    const user = getCurrentUser();
    if (!user) {
        alert('Please login to place an order.');
        window.location.href = 'login.html';
        return;
    }

    const orders = getDB(DB_ORDERS);
    const newOrder = {
        id: generateId('ord'),
        userId: user.id,
        userName: user.name,
        type: type,
        itemName: itemName,
        status: 'Pending'
    };
    orders.push(newOrder);
    setDB(DB_ORDERS, orders);
    
    alert(`Successfully placed order for ${itemName}. Status: Pending.`);
}

function handleSupport(e) {
    e.preventDefault();
    const user = getCurrentUser();
    const statusMsg = document.getElementById('supportStatus');

    if (!user) {
        alert('Please login to submit a support ticket.');
        window.location.href = 'login.html';
        return;
    }

    const subject = document.getElementById('supportSubject').value;
    const message = document.getElementById('supportMessage').value;

    const tickets = getDB(DB_TICKETS);
    tickets.push({
        id: generateId('tkt'),
        userId: user.id,
        userName: user.name,
        subject,
        message,
        status: 'Open'
    });
    setDB(DB_TICKETS, tickets);

    document.getElementById('supportForm').reset();
    statusMsg.textContent = 'Ticket submitted successfully! We will contact you soon.';
}
