// db.js - Handles localStorage Data Initialization & Helper Functions

const DB_USERS = 'gym_users';
const DB_OFFERS = 'gym_offers';
const DB_SUPPLEMENTS = 'gym_supplements';
const DB_ORDERS = 'gym_orders';
const DB_TICKETS = 'gym_tickets';

function initDB() {
    // 1. Initialize Users (with 1 Admin)
    if (!localStorage.getItem(DB_USERS)) {
        const defaultUsers = [
            { id: 'u_1', name: 'Admin', email: 'admin@gym.com', password: 'admin', role: 'admin' }
        ];
        localStorage.setItem(DB_USERS, JSON.stringify(defaultUsers));
    }

    // 2. Initialize Offers
    if (!localStorage.getItem(DB_OFFERS)) {
        const defaultOffers = [
            { id: 'off_1', title: '1 Month Starter', price: '₹1500', desc: 'Access to cardio & weights.' },
            { id: 'off_2', title: '3 Months Pro', price: '₹4000', desc: 'Full access + 2 PT sessions.' },
            { id: 'off_3', title: '1 Year Elite', price: '₹12000', desc: 'Unlimited access + Locker + Supplements discount.' }
        ];
        localStorage.setItem(DB_OFFERS, JSON.stringify(defaultOffers));
    }

    // 3. Initialize Supplements
    if (!localStorage.getItem(DB_SUPPLEMENTS)) {
        const defaultSupps = [
            { id: 'sup_1', title: 'Whey Protein Isolate', price: '₹4500', desc: '2kg, Chocolate flavor.', img: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&auto=format&fit=crop' },
            { id: 'sup_2', title: 'Creatine Monohydrate', price: '₹1500', desc: '500g, Unflavored.', img: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=500&auto=format&fit=crop' },
            { id: 'sup_3', title: 'Pre-Workout Blast', price: '₹2200', desc: '30 Servings, Fruit Punch.', img: 'https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=500&auto=format&fit=crop' }
        ];
        localStorage.setItem(DB_SUPPLEMENTS, JSON.stringify(defaultSupps));
    }

    // 4. Initialize Orders & Tickets arrays
    if (!localStorage.getItem(DB_ORDERS)) localStorage.setItem(DB_ORDERS, JSON.stringify([]));
    if (!localStorage.getItem(DB_TICKETS)) localStorage.setItem(DB_TICKETS, JSON.stringify([]));
}

// Helpers
const getDB = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setDB = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const generateId = (prefix) => prefix + '_' + Math.random().toString(36).substr(2, 9);
const getCurrentUser = () => JSON.parse(sessionStorage.getItem('currentUser'));
const setCurrentUser = (user) => sessionStorage.setItem('currentUser', JSON.stringify(user));
const logoutUser = () => sessionStorage.removeItem('currentUser');

// Run initialization
initDB();
