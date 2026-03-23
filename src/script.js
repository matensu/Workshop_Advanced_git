// Get DOM elements
const clickBtn = document.getElementById('clickBtn');
const scrollBtn = document.getElementById('scrollBtn');
const message = document.getElementById('message');
const scrollContainer = document.getElementById('scrollContainer');

// Click event listener for first button
clickBtn.addEventListener('click', () => {
    message.textContent = ' Button clicked! You can add more interactivity here.';
    message.style.opacity = '0';
    setTimeout(() => {
        message.style.transition = 'opacity 0.5s ease';
        message.style.opacity = '1';
    }, 10);
});

// Click event listener for scroll button
scrollBtn.addEventListener('click', () => {
    const loremText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
    Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.
    In voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    `;
    
    scrollContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        scrollContainer.innerHTML += '<p>' + loremText + '</p>';
    }
    scrollContainer.scrollTop = 0;
});

// Page load message
window.addEventListener('load', () => {
    console.log('Web project loaded successfully!');
});
