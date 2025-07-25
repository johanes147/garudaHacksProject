// Swipe functionality

function displayCurrentCard() {
    const cardStack = document.getElementById('cardStack');
    cardStack.innerHTML = '';

    if (currentDestinationIndex >= currentDestinations.length) {
        document.getElementById('swipeComplete').style.display = 'block';
        return;
    }

    const destination = currentDestinations[currentDestinationIndex];
    const card = document.createElement('div');
    card.className = 'destination-card';
    card.innerHTML = `
        <div class="card-image" style="background-image: url('${destination.image}')">
            <div class="card-emoji">${destination.emoji}</div>
        </div>
        <div class="card-content">
            <div class="card-love-text">
                Kunjungi <span class="card-love-line"></span>
            </div>
            <h3 class="card-title">${destination.name}</h3>
            <p class="card-description">${destination.description}</p>
        </div>
        <div class="card-choice m--reject"></div>
        <div class="card-choice m--like"></div>
        <div class="card-drag"></div>
    `;

    cardStack.appendChild(card);
    
    // Enhanced touch/drag functionality
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let animating = false;
    const decisionVal = 100;

    const cardDrag = card.querySelector('.card-drag');
    const cardReject = card.querySelector('.card-choice.m--reject');
    const cardLike = card.querySelector('.card-choice.m--like');

    function startDrag(e) {
        if (animating) return;
        
        isDragging = true;
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        cardDrag.style.cursor = 'grabbing';
        card.classList.add('dragging');
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        currentX = (e.type === 'mousemove' ? e.clientX : e.touches[0].clientX) - startX;
        const rotation = currentX * 0.1;
        
        card.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
        
        // Show choice overlays based on drag direction
        const opacity = Math.abs(currentX) / 150;
        if (currentX > 0) {
            cardLike.style.opacity = Math.min(opacity, 0.8);
            cardReject.style.opacity = 0;
        } else if (currentX < 0) {
            cardReject.style.opacity = Math.min(opacity, 0.8);
            cardLike.style.opacity = 0;
        } else {
            cardReject.style.opacity = 0;
            cardLike.style.opacity = 0;
        }
    }

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        animating = true;
        
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', endDrag);
        
        card.classList.remove('dragging');
        cardDrag.style.cursor = 'grab';
        
        // Determine swipe decision
        if (currentX >= decisionVal) {
            // Swiped right (like)
            card.classList.add('to-right');
            card.classList.add('inactive');
            swipeRight();
        } else if (currentX <= -decisionVal) {
            // Swiped left (reject)
            card.classList.add('to-left');
            card.classList.add('inactive');
            swipeLeft();
        } else {
            // Reset card position
            card.classList.add('reset');
            setTimeout(() => {
                card.style.transform = '';
                card.classList.remove('reset');
                cardReject.style.opacity = 0;
                cardLike.style.opacity = 0;
                animating = false;
            }, 300);
        }
        
        currentX = 0;
    }

    cardDrag.addEventListener('mousedown', startDrag);
    cardDrag.addEventListener('touchstart', startDrag);
    card.addEventListener('dblclick', () => {
    showReelsScreen(destination);
    });
}

function swipeRight() {
    const destination = currentDestinations[currentDestinationIndex];
    userLikes.push(destination);
    
    setTimeout(() => {
        nextDestination();
    }, 300);
}

function swipeLeft() {
    setTimeout(() => {
        nextDestination();
    }, 300);
}

function nextDestination() {
    currentDestinationIndex++;
    displayCurrentCard();
}

function goBack() {
    if (currentDestinationIndex >= currentDestinations.length) {
        // Reset for more swiping
        currentDestinationIndex = 0;
        shuffleDestinations();
        document.getElementById('swipeComplete').style.display = 'none';
    }
    showScreen('swipeScreen');
    updateProgress(50);
    displayCurrentCard();
}

 function showReelsScreen(destination) {
    // Save current card state
    window.tempCardState = {
        index: currentDestinationIndex,
        destination: destination
    };
    
    const reelsScreen = document.getElementById('reelsScreen');
    reelsScreen.innerHTML = `
        <div class="reels-header">
            <button class="btn back-btn" onclick="returnToCard()">← Kembali</button>
            <h2>${destination.name}</h2>
        </div>
        <div class="reels-container" id="reelsContainer">
            <div class="loading">Loading videos...</div>
        </div>
    `;
    
    showScreen('reelsScreen');
    loadDestinationReels(destination.name);
}

function loadDestinationReels(destinationName) {
    const tiktokVideos = {
        "Danau Toba" : {
            username: "pariwisatasumatera",
            ID: "7528993850057084166",
        },   
        "Borobudur" : {
            username: "wisatakelilingjogja",
            ID: "7478912338721082630",
        },
        "Bali" : {
            username: "bintiloddonpaketasyid",
            ID: "7316140384235670789",
        },
        "Yogyakarta" : { 
            username:"davidstwnn",
            ID: "7280798673016016133"
        },
        "Mandalika" : { 
            username: "_mixmik",
            ID: "7374339825580707078"
        },
        "Lombok" : {
            username: "itz.wifaaa",
            ID: "7371418952037141766"
        },
        "Morotai" : {
            username: "arya.ditaaa",
            ID: "7523465361350577464"
        },
        "Raja Ampat" : {
            username: "urdreamescape",
            ID: "7513144754805230856"
        },
        "Likupang" : {
            username: "lhs189",
            ID: "7469359514165234999"
        },
        "Tanjung Kelayang" : {
            username: "loesvirnando",
            ID: "729160056134495770"
        },
        "Wakatobi" : {
            username: "pesonawakatobi.id",
            ID: "7402849823931550981"
        },
        "Bromo Tengger Semeru" : {
            username: "inisiapayangkepo",
            ID: "7526820008316407046"
        }
    }

    const videoId = tiktokVideos[destinationName] || []; 

    reelsContainer.innerHTML = videoId.username
    reelsContainer.innerHTML = `
        <blockquote class="tiktok-embed"
            cite="https://www.tiktok.com/@${videoId.username}/video/${videoId.ID}"
            data-video-id="${videoId.ID}"
            style="max-width: 605px; min-width: 325px;">
            <section>
            <a target="_blank" title="@${videoId.username}" href="https://www.tiktok.com/@${videoId.username}?refer=embed">@${videoId.username}</a>
            </section>
        </blockquote>
    `;

    // Reload TikTok embed script to properly load the new video
    if (window.tiktokEmbed) {
        window.tiktokEmbed.reload();
    }
}

function returnToCard() {
    if (window.tempCardState) {
        currentDestinationIndex = window.tempCardState.index;
        showScreen('swipeScreen');
        displayCurrentCard();
        window.tempCardState = null;
    }
}

