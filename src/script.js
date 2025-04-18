
// Common passwords list (simplified version)
const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome'];

const strengthCriteria = [
    { regex: /.{8,}/, description: "At least 8 characters long" },
    { regex: /[A-Z]/, description: "Contains uppercase letter" },
    { regex: /[a-z]/, description: "Contains lowercase letter" },
    { regex: /[0-9]/, description: "Contains number" },
    { regex: /[^A-Za-z0-9]/, description: "Contains special character" }
];

// Matrix background animation
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const chars = 'ABCDEF0123456789';
const drops = [];
const fontSize = 14;
const columns = width / fontSize;

for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(26, 31, 44, 0.05)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#9b87f5';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

// Start matrix animation
setInterval(drawMatrix, 33);

// DOM elements
const passwordInput = document.getElementById('password');
const toggleButton = document.getElementById('toggle-password');
const generateButton = document.getElementById('generate-password');
const copyButton = document.getElementById('copy-password');
const strengthProgress = document.querySelector('.strength-progress');
const criteriaList = document.querySelector('.criteria-list');
const timeToCrack = document.getElementById('time-to-crack');
const commonCheck = document.getElementById('common-check');

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

// Generate password
function generatePassword() {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    passwordInput.value = password;
    passwordInput.type = 'text';
    updateStrengthIndicators(password);
    showToast('Strong password generated!');
}

// Copy to clipboard
function copyToClipboard() {
    if (passwordInput.value) {
        navigator.clipboard.writeText(passwordInput.value)
            .then(() => showToast('Password copied to clipboard!'));
    }
}

// Show toast message
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Estimate time to crack
function estimateCrackTime(password) {
    const combinations = Math.pow(95, password.length); // 95 printable ASCII characters
    const guessesPerSecond = 1000000000; // Assume 1 billion guesses per second
    const seconds = combinations / guessesPerSecond;
    
    if (seconds < 60) return 'less than a minute';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours';
    if (seconds < 31536000) return Math.floor(seconds / 86400) + ' days';
    return Math.floor(seconds / 31536000) + ' years';
}

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

    // Update time to crack estimate
    timeToCrack.textContent = `Time to crack: ${estimateCrackTime(password)}`;

    // Check if password is common
    if (password) {
        if (commonPasswords.includes(password.toLowerCase())) {
            commonCheck.textContent = '⚠️ This is a commonly used password!';
            commonCheck.style.color = '#ef4444';
        } else {
            commonCheck.textContent = '✅ Password is not in common password list';
            commonCheck.style.color = '#10b981';
        }
    } else {
        commonCheck.textContent = '';
    }
}

// Event listeners
passwordInput.addEventListener('input', (e) => {
    updateStrengthIndicators(e.target.value);
});

toggleButton.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    toggleButton.innerHTML = type === 'password' 
        ? '<svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
        : '<svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
});

generateButton.addEventListener('click', generatePassword);
copyButton.addEventListener('click', copyToClipboard);
