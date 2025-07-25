// Main Application State
let currentUser = {};
let currentDestinations = [];
let currentDestinationIndex = 0;
let userLikes = [];
let matches = [];
let currentChat = null;
let chatMessages = [];

// Indonesian destinations recommended by Kementerian Pariwisata Indonesia
const destinations = [
    // 5 Destinasi Super Prioritas
    { 
        id: 1, 
        name: "Danau Toba", 
        province: "Sumatera Utara", 
        emoji: "🏔️", 
        description: "Danau vulkanis terbesar di dunia dengan Pulau Samosir di tengahnya",
        image: "https://images.pexels.com/photos/1601513/pexels-photo-1601513.jpeg"
    },
    { 
        id: 2, 
        name: "Borobudur", 
        province: "Jawa Tengah", 
        emoji: "🛕", 
        description: "Candi Buddha terbesar di dunia, warisan UNESCO",
        image: "https://images.pexels.com/photos/18566202/pexels-photo-18566202.jpeg"
    },
    { 
        id: 3, 
        name: "Mandalika", 
        province: "Nusa Tenggara Barat", 
        emoji: "🏎️", 
        description: "Destinasi pantai dengan sirkuit MotoGP dan budaya Sasak",
        image: "https://images.pexels.com/photos/30013786/pexels-photo-30013786.jpeg"
    },
    { 
        id: 4, 
        name: "Labuan Bajo", 
        province: "Nusa Tenggara Timur", 
        emoji: "🦎", 
        description: "Pintu gerbang menuju Taman Nasional Komodo dan wisata bahari",
        image: "https://images.pexels.com/photos/12376211/pexels-photo-12376211.jpeg"
    },
    { 
        id: 5, 
        name: "Likupang", 
        province: "Sulawesi Utara", 
        emoji: "🏖️", 
        description: "Pantai pasir putih dan wisata bahari di ujung utara Sulawesi",
        image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400&h=250&fit=crop"
    },
    // Destinasi Prioritas Lainnya
    { 
        id: 6, 
        name: "Yogyakarta", 
        province: "Daerah Istimewa Yogyakarta", 
        emoji: "🏛️", 
        description: "Kota budaya dengan Kraton, Malioboro, pantai dan kuliner khas",
        image: "https://images.unsplash.com/photo-1687677347201-4fb42183f98c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    { 
        id: 7, 
        name: "Raja Ampat", 
        province: "Papua Barat", 
        emoji: "🐠", 
        description: "Surga bawah laut dengan keanekaragaman hayati tertinggi",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop"
    },
    { 
        id: 8, 
        name: "Bromo Tengger Semeru", 
        province: "Jawa Timur", 
        emoji: "🌋", 
        description: "Gunung berapi aktif dengan sunrise spektakuler",
        image: "https://images.pexels.com/photos/20139557/pexels-photo-20139557.jpeg"
    },
    { 
        id: 9, 
        name: "Bali", 
        province: "Bali", 
        emoji: "🏝️", 
        description: "Pulau Dewata dengan pantai, pura, dan budaya Hindu",
        image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=250&fit=crop"
    },
    { 
        id: 10, 
        name: "Tanjung Kelayang", 
        province: "Bangka Belitung", 
        emoji: "⛰️", 
        description: "Pantai dengan batu granit unik dan air laut jernih",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
    },
    { 
        id: 11, 
        name: "Wakatobi", 
        province: "Sulawesi Tenggara", 
        emoji: "🪸", 
        description: "Taman nasional laut dengan terumbu karang terbaik dunia",
        image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=250&fit=crop"
    },
    { 
        id: 12, 
        name: "Morotai", 
        province: "Maluku Utara", 
        emoji: "🛩️", 
        description: "Pulau bersejarah dengan pantai eksotis dan situs Perang Dunia II",
        image: "https://images.unsplash.com/photo-1542163846-abf6a9fe52e2?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
];

// Sample users for matching
const sampleUsers = [
    { id: 1, name: "Sarah", age: 25, interests: ["photography", "food"] },
    { id: 2, name: "Mike", age: 28, interests: ["adventure", "culture"] },
    { id: 3, name: "Lisa", age: 24, interests: ["beaches", "nightlife"] },
    { id: 4, name: "David", age: 30, interests: ["history", "art"] },
    { id: 5, name: "Emma", age: 26, interests: ["nature", "hiking"] }
];

// Utility Functions
function shuffleDestinations() {
    currentDestinations = [...destinations].sort(() => Math.random() - 0.5);
}

function updateProgress(percentage) {
    document.getElementById('progressFill').style.width = percentage + '%';
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Initialize app
function initializeApp() {
    shuffleDestinations();
    updateProgress(25);
}

// Initialize the app when page loads
window.addEventListener('load', initializeApp);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    const activeScreen = document.querySelector('.screen.active');
    
    if (activeScreen && activeScreen.id === 'swipeScreen') {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            swipeLeft();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            swipeRight();
        }
    }
});

// Add error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});