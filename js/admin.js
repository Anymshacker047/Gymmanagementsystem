// admin.js - Admin Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check if admin
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        alert('Access Denied. Admins only.');
        window.location.href = 'index.html';
        return;
    }

    // Sidebar navigation
    document.querySelectorAll('.admin-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = e.target.getAttribute('data-target');
            if(target) {
                e.preventDefault();
                document.querySelectorAll('.admin-nav a').forEach(l => l.classList.remove('active'));
                document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
                
                e.target.classList.add('active');
                document.getElementById(target).classList.add('active');
            }
        });
    });

    // Load Data
    updateStats();
    loadOrders();
    loadOffers();
    loadSupplements();
    loadMembers();
    loadTickets();

    // Add Offer Form
    const addOfferForm = document.getElementById('addOfferForm');
    if (addOfferForm) {
        addOfferForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('offerTitle').value;
            const price = document.getElementById('offerPrice').value;
            const desc = document.getElementById('offerDesc').value;

            const offers = getDB(DB_OFFERS);
            offers.push({ id: generateId('off'), title, price, desc });
            setDB(DB_OFFERS, offers);
            
            addOfferForm.reset();
            loadOffers();
        });
    }

    // Add Supplement Form
    const addSupplementForm = document.getElementById('addSupplementForm');
    if (addSupplementForm) {
        addSupplementForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('suppTitle').value;
            const price = document.getElementById('suppPrice').value;
            const desc = document.getElementById('suppDesc').value;
            const img = document.getElementById('suppImg').value;

            const supps = getDB(DB_SUPPLEMENTS);
            supps.push({ id: generateId('sup'), title, price, desc, img });
            setDB(DB_SUPPLEMENTS, supps);
            
            addSupplementForm.reset();
            loadSupplements();
        });
    }
});

function updateStats() {
    const users = getDB(DB_USERS);
    const orders = getDB(DB_ORDERS);
    const tickets = getDB(DB_TICKETS);

    document.getElementById('statUsers').textContent = users.filter(u => u.role === 'user').length;
    document.getElementById('statOrders').textContent = orders.length;
    document.getElementById('statTickets').textContent = tickets.length;
}

// -- Orders --
function loadOrders() {
    const orders = getDB(DB_ORDERS);
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';

    orders.forEach(ord => {
        tbody.innerHTML += `
            <tr>
                <td>${ord.id}</td>
                <td>${ord.userName}</td>
                <td>${ord.type}</td>
                <td>${ord.itemName}</td>
                <td><strong>${ord.status}</strong></td>
                <td>
                    ${ord.status === 'Pending' ? `
                        <button class="btn" style="padding: 0.3rem 0.8rem; font-size: 0.9rem;" onclick="updateOrderStatus('${ord.id}', 'Confirmed')">Confirm</button>
                        <button class="btn btn-danger" style="padding: 0.3rem 0.8rem; font-size: 0.9rem;" onclick="updateOrderStatus('${ord.id}', 'Rejected')">Reject</button>
                    ` : 'Processed'}
                </td>
            </tr>
        `;
    });
}

function updateOrderStatus(id, newStatus) {
    const orders = getDB(DB_ORDERS);
    const idx = orders.findIndex(o => o.id === id);
    if (idx > -1) {
        orders[idx].status = newStatus;
        setDB(DB_ORDERS, orders);
        loadOrders();
    }
}

// -- Offers --
function loadOffers() {
    const offers = getDB(DB_OFFERS);
    const grid = document.getElementById('adminOffersGrid');
    grid.innerHTML = '';

    offers.forEach(off => {
        grid.innerHTML += `
            <div class="card" style="padding: 1.5rem;">
                <h4>${off.title}</h4>
                <div class="price" style="font-size: 1.5rem;">${off.price}</div>
                <p style="font-size: 0.9rem;">${off.desc}</p>
                <button class="btn btn-danger btn-full" style="padding: 0.5rem;" onclick="deleteOffer('${off.id}')">Delete</button>
            </div>
        `;
    });
}

function deleteOffer(id) {
    if(confirm('Delete this offer?')) {
        let offers = getDB(DB_OFFERS);
        offers = offers.filter(o => o.id !== id);
        setDB(DB_OFFERS, offers);
        loadOffers();
    }
}

// -- Supplements --
function loadSupplements() {
    const supps = getDB(DB_SUPPLEMENTS);
    const grid = document.getElementById('adminSupplementsGrid');
    if(!grid) return;
    grid.innerHTML = '';

    supps.forEach(sup => {
        grid.innerHTML += `
            <div class="card" style="padding: 1.5rem;">
                <img src="${sup.img}" alt="${sup.title}" style="height:100px; object-fit:cover; border-radius:5px; margin-bottom:1rem; width:100%;">
                <h4>${sup.title}</h4>
                <div class="price" style="font-size: 1.2rem;">${sup.price}</div>
                <button class="btn btn-danger btn-full" style="padding: 0.5rem; margin-top:1rem;" onclick="deleteSupplement('${sup.id}')">Delete</button>
            </div>
        `;
    });
}

function deleteSupplement(id) {
    if(confirm('Delete this supplement?')) {
        let supps = getDB(DB_SUPPLEMENTS);
        supps = supps.filter(s => s.id !== id);
        setDB(DB_SUPPLEMENTS, supps);
        loadSupplements();
    }
}

// -- Members --
function loadMembers() {
    const users = getDB(DB_USERS);
    const tbody = document.getElementById('membersTableBody');
    tbody.innerHTML = '';

    users.forEach(u => {
        tbody.innerHTML += `
            <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
            </tr>
        `;
    });
}

// -- Tickets --
function loadTickets() {
    const tickets = getDB(DB_TICKETS);
    const tbody = document.getElementById('supportTableBody');
    tbody.innerHTML = '';

    tickets.forEach(tkt => {
        tbody.innerHTML += `
            <tr>
                <td>${tkt.id}</td>
                <td>${tkt.userName}</td>
                <td>${tkt.subject}</td>
                <td>${tkt.message}</td>
                <td><strong>${tkt.status}</strong></td>
                <td>
                    ${tkt.status === 'Open' ? `
                        <button class="btn btn-outline" style="padding: 0.3rem 0.8rem; font-size: 0.9rem;" onclick="resolveTicket('${tkt.id}')">Resolve</button>
                    ` : 'Closed'}
                </td>
            </tr>
        `;
    });
}

function resolveTicket(id) {
    const tickets = getDB(DB_TICKETS);
    const idx = tickets.findIndex(t => t.id === id);
    if (idx > -1) {
        tickets[idx].status = 'Closed';
        setDB(DB_TICKETS, tickets);
        loadTickets();
        updateStats();
    }
}
