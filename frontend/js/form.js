// Form handling functionality

function startSwiping() {
    const name = document.getElementById('userName').value.trim();
    const departure = document.getElementById('departure').value;
    const travelMonth = document.getElementById('travelMonth').value;
    const travelBudgetValue = document.getElementById('travelBudget').value;
    const accommodationbBudgetValue = document.getElementById('accommodationBudget').value;

    if (!name || !departure || !travelMonth || !travelBudgetValue || !accommodationbBudgetValue) {
        alert('Mohon lengkapi semua kolom');
        return;
    }

    currentUser = { name, departure, travelMonth, travelBudgetValue, accommodationbBudgetValue};
    
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

function formatRupiah(angka) {
    return 'Rp' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}