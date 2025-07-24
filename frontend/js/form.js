// Form handling functionality

function startSwiping() {
    const name = document.getElementById('userName').value.trim();
    const departure = document.getElementById('departure').value;
    const travelMonth = document.getElementById('travelMonth').value;
    const budget = document.getElementById('budget').value;

    if (!name || !departure || !travelMonth || !budget) {
        alert('Mohon lengkapi semua kolom');
        return;
    }

    currentUser = { name, departure, travelMonth, budget };
    
    showScreen('swipeScreen');
    updateProgress(50);
    displayCurrentCard();
}

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('invalid', function() {
            this.style.borderColor = '#ff4458';
        });
        
        input.addEventListener('input', function() {
            this.style.borderColor = '#ddd';
        });
    });
});