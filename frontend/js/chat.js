// Chat functionality

function setupSingleGroupChat(match) {
    // Update chat header to show current group info
    document.getElementById('currentChatName').textContent = `${match.destination.emoji} ${match.destination.name}`;
    document.getElementById('currentChatDesc').textContent = `${match.groupSize} anggota • Grup Travel`;
    document.getElementById('currentChatAvatar').style.backgroundImage = `url('${match.destination.image}')`;
    
    // Set up group list to show only current group
    const chatGroupList = document.getElementById('chatGroupList');
    chatGroupList.innerHTML = '';

    // Show current group as active
    const listItem = document.createElement('li');
    listItem.classList.add('active');
    
    listItem.innerHTML = `
        <a href="#" onclick="return false;">
            <div class="chat-detail">
                <div class="chat-detail-left">
                    <div class="chat-profile-user" style="background-image: url('${match.destination.image}')"></div>
                    <div class="chat-user-info">
                        <div class="chat-user-nm">${match.destination.name}</div>
                        <div class="chat-desc">${match.groupSize} anggota • ${match.destination.province}</div>
                    </div>
                </div>
                <div class="chat-meta">
                    <div class="chat-seen">Aktif</div>
                    <div class="online-indicator"></div>
                </div>
            </div>
        </a>
    `;
    chatGroupList.appendChild(listItem);

    // Check if there are other groups for the same destination
    const sameDestinationGroups = findSameDestinationGroups(match.destination);
    
    // Add other groups for same destination if any
    if (sameDestinationGroups.length > 0) {
        sameDestinationGroups.forEach((group, index) => {
            const groupItem = document.createElement('li');
            groupItem.innerHTML = `
                <a href="#" onclick="requestJoinGroup(${group.id})">
                    <div class="chat-detail">
                        <div class="chat-detail-left">
                            <div class="chat-profile-user" style="background-image: url('${match.destination.image}')"></div>
                            <div class="chat-user-info">
                                <div class="chat-user-nm">${match.destination.name} #${group.id}</div>
                                <div class="chat-desc">${group.memberCount} anggota • Grup lain</div>
                            </div>
                        </div>
                        <div class="chat-meta">
                            <div class="join-btn">Gabung</div>
                        </div>
                    </div>
                </a>
            `;
            chatGroupList.appendChild(groupItem);
        });
    }
}

function findSameDestinationGroups(destination) {
    // Simulate finding other groups for the same destination
    const otherGroups = [];
    const groupCount = Math.floor(Math.random() * 3) + 1; // 1-3 other groups
    
    for (let i = 1; i <= groupCount; i++) {
        otherGroups.push({
            id: i + 1,
            destination: destination,
            memberCount: Math.floor(Math.random() * 5) + 2, // 2-6 members
            isFull: Math.random() > 0.7 // 30% chance group is full
        });
    }
    
    return otherGroups.filter(group => !group.isFull); // Only return groups that aren't full
}

function requestJoinGroup(groupId) {
    const confirmation = confirm(`Apakah Anda ingin bergabung dengan grup ${currentChat.destination.name} #${groupId}?`);
    if (confirmation) {
        // Simulate joining process
        alert(`Permintaan bergabung telah dikirim ke admin grup ${currentChat.destination.name} #${groupId}. Anda akan diberitahu jika permintaan diterima.`);
        
        // Add a system message about the join request
        chatMessages.push({
            sender: 'System',
            message: `${currentUser.name} telah mengirim permintaan bergabung ke grup lain dengan destinasi yang sama.`,
            type: 'system',
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });
        displayMessages();
    }
}

function showOtherDestinationGroups() {
    alert(`Fitur ini memungkinkan Anda mencari grup dengan destinasi lain. Kembali ke halaman kecocokan untuk melihat destinasi lain yang Anda sukai.`);
}

function displayMessages() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = '';

    if (chatMessages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="empty-state">
                <h3>💬 Mulai Percakapan</h3>
                <p>Belum ada pesan di grup ini. Mulai obrolan dengan menyapa anggota lain!</p>
            </div>
        `;
        return;
    }

    chatMessages.forEach(message => {
        const messageGroup = document.createElement('div');
        
        if (message.type === 'system') {
            messageGroup.className = 'message-group system';
            messageGroup.innerHTML = `
                <div style="text-align: center; padding: 10px; background: rgba(59, 2, 237, 0.1); border-radius: 15px; margin: 10px 0; font-size: 13px; color: #3B02ED;">
                    ${message.message}
                </div>
            `;
        } else {
            const isUser = message.sender === currentUser.name;
            const isAI = message.type === 'ai';
            
            messageGroup.className = `message-group ${isUser ? 'sender' : 'receiver'}`;
            
            const bubbleClass = isAI ? 'ai-message' : '';
            const bubbleStyle = isAI ? 'background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); color: #1976d2; border: 1px solid #42A5F5;' : '';
            
            messageGroup.innerHTML = `
                <div class="message-bubble ${bubbleClass}">
                    ${!isUser && !isAI ? `<div style="font-size: 11px; color: #808080; margin-bottom: 3px;">${message.sender}</div>` : ''}
                    ${isAI ? `<div style="font-size: 11px; color: #1976d2; margin-bottom: 3px; font-weight: 600;">🤖 AI Assistant</div>` : ''}
                    <div class="message" style="${bubbleStyle}">
                        ${message.message}
                    </div>
                    <div class="message-time">${message.time || '10:30'}</div>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageGroup);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message || !currentChat) return;

    const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // Check if message starts with /ask command
    if (message.toLowerCase().startsWith('/ask ')) {
        const aiQuestion = message.substring(5).trim();
        if (!aiQuestion) {
            input.value = '';
            return;
        }

        // Add user's AI question to chat
        chatMessages.push({
            sender: currentUser.name,
            message: `${aiQuestion} 🤖`,
            type: 'user',
            time: currentTime
        });

        input.value = '';
        displayMessages();

        // Generate AI response
        setTimeout(() => {
            const aiResponse = generateEnhancedAIResponse(aiQuestion);
            chatMessages.push({
                sender: 'AI Assistant',
                message: aiResponse,
                type: 'ai',
                time: currentTime
            });
            displayMessages();
        }, 1000);

        return;
    }

    // Regular message
    chatMessages.push({
        sender: currentUser.name,
        message: message,
        type: 'user',
        time: currentTime
    });

    input.value = '';
    
    // Simulate other users responding to regular messages
    setTimeout(() => {
        const responses = [
            "Setuju banget!",
            "Aku ikut!",
            "Ide yang bagus",
            "Ayo kita lakukan!",
            "Count me in!",
            "Timing yang pas!",
            "Aku juga mikir yang sama!",
            "Saran yang bagus!"
        ];
        const randomUser = currentChat.users[Math.floor(Math.random() * currentChat.users.length)];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        chatMessages.push({
            sender: randomUser.name,
            message: randomResponse,
            type: 'other',
            time: currentTime
        });
        displayMessages();
    }, Math.random() * 2000 + 1000);
    
    displayMessages();
}

function handleEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function displayTravelOptions() {
    const travelOptions = document.getElementById('travelOptions');
    const destination = currentChat.destination;
    
    const options = [
        { 
            type: 'Penerbangan', 
            price: 'Rp 3.500.000', 
            details: `${currentUser.departure} → ${destination.name}`,
            link: `https://www.tiket.com/pesawat/cari?from=${currentUser.departure}&to=${destination.name}`
        },
        { 
            type: 'Hotel', 
            price: 'Rp 1.200.000/malam', 
            details: `Hotel bintang 4 di ${destination.name}`,
            link: `https://www.pegipegi.com/hotel/${destination.name.toLowerCase()}`
        },
        { 
            type: 'Paket Wisata', 
            price: 'Rp 8.500.000', 
            details: 'Penerbangan + 4 malam akomodasi + tour',
            link: `https://www.panoramatour.com/indonesia/${destination.name.toLowerCase()}`
        }
    ];

    travelOptions.innerHTML = '';
    options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'recommendation-item';
        optionDiv.innerHTML = `
            <div class="rec-info">
                <strong>${option.type}</strong><br>
                <small>${option.details}</small>
            </div>
            <div class="rec-price">${option.price}</div>
            <a href="${option.link}" target="_blank" class="rec-link">Lihat</a>
        `;
        travelOptions.appendChild(optionDiv);
    });
}

function generateEnhancedAIResponse(message) {
    const destination = currentChat.destination;
    const month = currentUser.travelMonth;
    const budget = currentUser.budget;
    
    const contextualResponses = {
        weather: `Pada bulan ${month}, ${destination.name} biasanya memiliki cuaca yang menyenangkan. Bawa pakaian yang nyaman dan sepatu yang cocok untuk berjalan!`,
        budget: `Untuk budget ${budget}, Anda bisa menikmati akomodasi menengah dan pengalaman lokal yang menarik di ${destination.name}!`,
        safety: `${destination.name} umumnya aman untuk wisatawan. Ikuti saja tips keamanan standar saat bepergian!`,
        transport: `Berkeliling ${destination.name} mudah dengan berbagai pilihan transportasi lokal. Saya rekomendasikan untuk mendapat kartu transportasi!`,
        culture: `${destination.name} memiliki tradisi budaya yang kaya. Hormati adat istiadat lokal saat mengunjungi tempat-tempat bersejarah!`,
        food: `Kuliner di ${destination.name} sangat beragam! Jangan lewatkan makanan khas lokal dan warung-warung tradisional!`,
        activity: `Ada banyak aktivitas menarik di ${destination.name}. Dari wisata alam hingga budaya, semuanya bisa dinikmati sesuai minat Anda!`
    };

    // Check for keywords and provide contextual responses
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('cuaca') || lowerMessage.includes('weather') || lowerMessage.includes('iklim')) {
        return contextualResponses.weather;
    } else if (lowerMessage.includes('budget') || lowerMessage.includes('biaya') || lowerMessage.includes('harga')) {
        return contextualResponses.budget;
    } else if (lowerMessage.includes('aman') || lowerMessage.includes('safety') || lowerMessage.includes('keamanan')) {
        return contextualResponses.safety;
    } else if (lowerMessage.includes('transport') || lowerMessage.includes('transportasi') || lowerMessage.includes('perjalanan')) {
        return contextualResponses.transport;
    } else if (lowerMessage.includes('budaya') || lowerMessage.includes('culture') || lowerMessage.includes('tradisi') || lowerMessage.includes('adat')) {
        return contextualResponses.culture;
    } else if (lowerMessage.includes('makanan') || lowerMessage.includes('kuliner') || lowerMessage.includes('food') || lowerMessage.includes('makan')) {
        return contextualResponses.food;
    } else if (lowerMessage.includes('aktivitas') || lowerMessage.includes('kegiatan') || lowerMessage.includes('wisata') || lowerMessage.includes('tempat')) {
        return contextualResponses.activity;
    }
    
    return generateAIResponse(message);
}

function generateAIResponse(message) {
    const destination = currentChat.destination;
    const responses = {
        'recommend': [
            `Untuk ${destination.name}, saya rekomendasikan mengunjungi pasar lokal di pagi hari, mencoba kuliner khas, dan menikmati sunset dari tempat yang tinggi!`,
            `Jangan lewatkan situs budaya di ${destination.name}! Juga, coba kuliner lokal - rasanya luar biasa!`,
            `Saya sarankan booking aktivitas lebih awal, terutama atraksi populer di ${destination.name}. Cuaca biasanya bagus di bulan ${currentUser.travelMonth}!`
        ],
        'restaurant': [
            `Berikut beberapa restoran top di ${destination.name}: Warung lokal favorit dengan masakan tradisional dan restoran fusion modern.`,
            `Untuk kuliner di ${destination.name}, coba scene makanan jalanan - autentik dan lezat!`
        ],
        'activities': [
            `Aktivitas populer di ${destination.name} termasuk tur budaya, petualangan outdoor, dan pengalaman lokal. Budget sekitar Rp 700.000-1.400.000 per hari untuk aktivitas.`,
            `${destination.name} menawarkan hiking yang bagus, situs budaya, dan aktivitas air tergantung musimnya!`
        ]
    };

    if (message.toLowerCase().includes('restoran') || message.toLowerCase().includes('makanan') || message.toLowerCase().includes('kuliner')) {
        return responses.restaurant[Math.floor(Math.random() * responses.restaurant.length)];
    } else if (message.toLowerCase().includes('aktivitas') || message.toLowerCase().includes('kegiatan') || message.toLowerCase().includes('wisata')) {
        return responses.activities[Math.floor(Math.random() * responses.activities.length)];
    } else {
        return responses.recommend[Math.floor(Math.random() * responses.recommend.length)];
    }
}