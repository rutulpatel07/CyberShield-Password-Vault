
const strengthCriteria = [
    { regex: /.{8,}/, description: "At least 8 characters long" },
    { regex: /[A-Z]/, description: "Contains uppercase letter" },
    { regex: /[a-z]/, description: "Contains lowercase letter" },
    { regex: /[0-9]/, description: "Contains number" },
    { regex: /[^A-Za-z0-9]/, description: "Contains special character" }
];

// DOM elements
const passwordInput = document.getElementById('password');
const toggleButton = document.getElementById('toggle-password');
const strengthProgress = document.querySelector('.strength-progress');
const criteriaList = document.querySelector('.criteria-list');

// Initialize criteria list
strengthCriteria.forEach(criteria => {
    const criteriaItem = document.createElement('div');
    criteriaItem.className = 'criteria-item';
    criteriaItem.innerHTML = `
        <svg class="x-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span>${criteria.description}</span>
    `;
    criteriaList.appendChild(criteriaItem);
});

// Toggle password visibility
toggleButton.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    toggleButton.innerHTML = type === 'password' 
        ? '<svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
        : '<svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
});

// Check password strength
function getStrengthScore(password) {
    return strengthCriteria.filter(criteria => criteria.regex.test(password)).length;
}

function getStrengthColor(score) {
    if (score <= 2) return '#ef4444';
    if (score <= 3) return '#f59e0b';
    return '#10b981';
}

function updateStrengthIndicators(password) {
    const score = getStrengthScore(password);
    const percentage = (score / strengthCriteria.length) * 100;
    
    // Update progress bar
    strengthProgress.style.width = `${percentage}%`;
    strengthProgress.style.backgroundColor = getStrengthColor(score);
    
    // Update criteria icons
    const criteriaItems = document.querySelectorAll('.criteria-item');
    strengthCriteria.forEach((criteria, index) => {
        const isMet = criteria.regex.test(password);
        criteriaItems[index].innerHTML = `
            ${isMet 
                ? '<svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                : '<svg class="x-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
            }
            <span>${criteria.description}</span>
        `;
    });
}

passwordInput.addEventListener('input', (e) => {
    updateStrengthIndicators(e.target.value);
});
