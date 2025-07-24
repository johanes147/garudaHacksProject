// Matches functionality for Travel Match Indonesia

function showMatches() {
    generateMatches();
    showScreen('matchScreen');
    updateProgress(75);
}

function generateMatches() {
    matches = [];
    
    // Generate matches based on user's liked destinations
    userLikes.forEach(destination => {
        // Simulate finding other users who also liked this destination
        const matchingUsers = sampleUsers.filter(() => Math.random() > 0.3);
        
        if (matchingUsers.length > 0) {
            matches.push({
                destination: destination,
                users: matchingUsers,
                groupSize: matchingUsers.length + 1, // +1 for current user
                groupId: `group_${destination.id}_${Date.now()}`,
                createdAt: new Date(),
                isActive: true
            });
        }
    });

    displayMatches();
}

function displayMatches() {
    const matchesList = document.getElementById('matchesList');
    matchesList.innerHTML = '';

    if (matches.length === 0) {
        matchesList.innerHTML = `
            <div class="empty-state">
                <h3>Belum ada kecocokan</h3>
                <p>Terus swipe untuk menemukan lebih banyak teman perjalanan!</p>
                <button class="btn" onclick="goBack()" style="margin-top: 20px;">Kembali ke Swipe</button>
            </div>
        `;
        return;
    }

    matches.forEach((match, index) => {
        const matchItem = document.createElement('div');
        matchItem.className = 'match-item';
        matchItem.setAttribute('data-match-index', index);
        
        // Create user avatars display
        const userAvatars = match.users.slice(0, 3).map(user => 
            `<div class="user-avatar" title="${user.name}">${user.name.charAt(0)}</div>`
        ).join('');
        
        const moreUsers = match.users.length > 3 ? `<div class="user-avatar more">+${match.users.length - 3}</div>` : '';
        
        matchItem.innerHTML = `
            <div class="match-header">
                <div class="match-destination">
                    <span class="destination-emoji">${match.destination.emoji}</span>
                    <div class="destination-info">
                        <h3>${match.destination.name}</h3>
                        <p>${match.destination.province}</p>
                    </div>
                </div>
                <div class="match-status">
                    <span class="member-count">${match.groupSize} anggota</span>
                </div>
            </div>
            <div class="match-users">
                <div class="user-avatars">
                    ${userAvatars}
                    ${moreUsers}
                </div>
                <div class="user-names">
                    ${match.users.slice(0, 2).map(u => u.name).join(', ')}
                    ${match.users.length > 2 ? ` dan ${match.users.length - 2} lainnya` : ''}
                </div>
            </div>
            <div class="match-description">
                <p>${match.destination.description}</p>
            </div>
            <div class="match-actions">
                <button class="join-group-btn" onclick="joinGroup(matches[${index}])">
                    <span>💬</span> Gabung Grup
                </button>
                <button class="view-details-btn" onclick="viewDestinationDetails(matches[${index}].destination)">
                    <span>ℹ️</span> Detail
                </button>
            </div>
        `;
        
        // Add hover effects
        matchItem.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        matchItem.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        matchesList.appendChild(matchItem);
    });
}

function joinGroup(match) {
    // Show loading state
    const joinButton = event.target.closest('.join-group-btn');
    const originalText = joinButton.innerHTML;
    joinButton.innerHTML = '<span>⏳</span> Bergabung...';
    joinButton.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
        try {
            // Set current chat and navigate to chat screen
            currentChat = match;
            showScreen('chatScreen');
            updateProgress(100);
            
            // Set up single group chat interface
            setupSingleGroupChat(match);
            
            // Generate initial welcome messages
            chatMessages = [
                { 
                    sender: 'System', 
                    message: `🎉 Selamat datang di grup perjalanan ${match.destination.name}! Mari rencanakan petualangan yang tak terlupakan bersama-sama.`, 
                    type: 'system', 
                    time: getCurrentTime() 
                },
                { 
                    sender: match.users[0].name, 
                    message: `Halo semuanya! Excited banget mau jelajah ${match.destination.name} bareng! 🗺️✈️`, 
                    type: 'other', 
                    time: getCurrentTime(1) 
                },
                { 
                    sender: match.users[1] ? match.users[1].name : 'Sarah', 
                    message: `Ini pasti seru banget! Kapan kita mulai planning dan booking tiketnya? 🎒`, 
                    type: 'other', 
                    time: getCurrentTime(2) 
                },
                { 
                    sender: 'AI Assistant', 
                    message: `Halo semua! 👋 Saya di sini untuk membantu perencanaan perjalanan kalian. Ketik /ask diikuti pertanyaan untuk mendapat rekomendasi khusus ${match.destination.name}! Contoh: "/ask aktivitas menarik di ${match.destination.name}"`, 
                    type: 'ai', 
                    time: getCurrentTime(3) 
                }
            ];
            
            // Display messages and travel options
            displayMessages();
            displayTravelOptions();
            
            // Show success notification
            showNotification(`Berhasil bergabung dengan grup ${match.destination.name}!`, 'success');
            
        } catch (error) {
            console.error('Error joining group:', error);
            showNotification('Gagal bergabung dengan grup. Silakan coba lagi.', 'error');
            
            // Reset button state
            joinButton.innerHTML = originalText;
            joinButton.disabled = false;
        }
    }, 1000);
}

function viewDestinationDetails(destination) {
    // Create modal for destination details
    const modal = document.createElement('div');
    modal.className = 'destination-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeDestinationModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${destination.emoji} ${destination.name}</h2>
                <button class="modal-close" onclick="closeDestinationModal()">✕</button>
            </div>
            <div class="modal-body">
                <div class="destination-image" style="background-image: url('${destination.image}')"></div>
                <div class="destination-details">
                    <h3>📍 ${destination.province}</h3>
                    <p>${destination.description}</p>
                    <div class="destination-stats">
                        <div class="stat-item">
                            <span class="stat-icon">👥</span>
                            <span class="stat-text">Populer di kalangan traveler</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">⭐</span>
                            <span class="stat-text">Destinasi rekomendasi Kemenparekraf</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">📅</span>
                            <span class="stat-text">Cocok untuk ${currentUser.travelMonth}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn secondary" onclick="closeDestinationModal()">Tutup</button>
                <button class="btn primary" onclick="closeDestinationModal(); findGroupForDestination('${destination.id}')">
                    Cari Grup Lain
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles if not already present
    if (!document.getElementById('modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .destination-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
            }
            
            .modal-content {
                position: relative;
                background: white;
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            
            .modal-header {
                padding: 20px;
                background: linear-gradient(-30deg, #3B02ED, #8E2AE0 55%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .modal-body {
                padding: 0;
            }
            
            .destination-image {
                width: 100%;
                height: 200px;
                background-size: cover;
                background-position: center;
            }
            
            .destination-details {
                padding: 20px;
            }
            
            .destination-details h3 {
                margin-bottom: 15px;
                color: #3B02ED;
            }
            
            .destination-details p {
                margin-bottom: 20px;
                line-height: 1.6;
                color: #666;
            }
            
            .destination-stats {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .stat-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 10px;
            }
            
            .stat-icon {
                font-size: 18px;
            }
            
            .stat-text {
                color: #666;
                font-size: 14px;
            }
            
            .modal-footer {
                padding: 20px;
                display: flex;
                gap: 10px;
                border-top: 1px solid #eee;
            }
            
            .btn.secondary {
                background: #6c757d;
                flex: 1;
            }
            
            .btn.primary {
                background: linear-gradient(-30deg, #3B02ED, #8E2AE0 55%);
                flex: 2;
            }
        `;
        document.head.appendChild(modalStyles);
    }
}

function closeDestinationModal() {
    const modal = document.querySelector('.destination-modal');
    if (modal) {
        modal.remove();
    }
}

function findGroupForDestination(destinationId) {
    // Find all groups for this destination
    const destinationGroups = matches.filter(match => 
        match.destination.id.toString() === destinationId.toString()
    );
    
    if (destinationGroups.length > 1) {
        showNotification(`Ditemukan ${destinationGroups.length} grup untuk destinasi ini!`, 'info');
    } else {
        showNotification('Hanya ada 1 grup untuk destinasi ini saat ini.', 'info');
    }
}

function getCurrentTime(minutesOffset = 0) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutesOffset);
    return now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add notification styles if not present
    if (!document.getElementById('notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notification-styles';
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1001;
                padding: 15px 20px;
                border-radius: 10px;
                color: white;
                font-weight: 500;
                animation: slideInRight 0.3s ease;
                max-width: 350px;
            }
            
            .notification.success {
                background: linear-gradient(135deg, #28a745, #20c997);
            }
            
            .notification.error {
                background: linear-gradient(135deg, #dc3545, #fd7e14);
            }
            
            .notification.info {
                background: linear-gradient(135deg, #007bff, #6f42c1);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-icon {
                font-size: 18px;
            }
            
            .notification-message {
                flex: 1;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(notificationStyles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Helper function to format match data for API
function formatMatchForAPI(match) {
    return {
        destinationId: match.destination.id,
        destinationName: match.destination.name,
        groupSize: match.groupSize,
        users: match.users.map(user => ({
            id: user.id,
            name: user.name,
            interests: user.interests
        })),
        createdAt: match.createdAt,
        isActive: match.isActive
    };
}

// Enhanced match generation with more realistic data
function generateEnhancedMatches() {
    matches = [];
    
    userLikes.forEach(destination => {
        // Generate multiple groups per destination sometimes
        const groupCount = Math.random() > 0.7 ? 2 : 1;
        
        for (let i = 0; i < groupCount; i++) {
            const matchingUsers = sampleUsers.filter(() => Math.random() > 0.4);
            
            if (matchingUsers.length > 0) {
                matches.push({
                    destination: destination,
                    users: matchingUsers,
                    groupSize: matchingUsers.length + 1,
                    groupId: `group_${destination.id}_${i + 1}_${Date.now()}`,
                    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
                    isActive: true,
                    groupNumber: i + 1
                });
            }
        }
    });

    // Sort matches by creation date (newest first)
    matches.sort((a, b) => b.createdAt - a.createdAt);
}

// Function to refresh matches (useful for "Pull to refresh" functionality)
function refreshMatches() {
    const matchesList = document.getElementById('matchesList');
    matchesList.innerHTML = '<div class="loading-spinner">🔄 Mencari kecocokan baru...</div>';
    
    setTimeout(() => {
        generateEnhancedMatches();
        displayMatches();
        showNotification('Kecocokan telah diperbarui!', 'success');
    }, 1500);
}