const startText = document.getElementById('startText');
const startMessage = "ESCAPE";
let startIndex = 0;
let mistakeMade = false;

const typeSound = document.getElementById('typeSound');
const videoScreen = document.getElementById('videoScreen');
const transitionVideo = document.getElementById('transitionVideo');
const encodedMessageElement = document.getElementById('encodedMessage');
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');
const contractAddressElement = document.getElementById('contractAddress');
const telegramLinkElement = document.getElementById('telegramLink').querySelector('a');
const fallingTextContainer = document.getElementById('fallingTextContainer');
const enterButton = document.getElementById('enterButton'); // Enter button
const backgroundMusic = document.getElementById('backgroundMusic'); // Background music

const newMessage = `
010101000110100001101001011100110010000001110000011100100110111101101001011001010110001101110100001000000110100001101111011011000110010000111010011101000110100001101111011001010010000001101011011001010111100101110011001000000111010001101111001000000111100101101111011101010111001000100000011001100111001001100101011001000110111101101101001011000010000001110100011010000110010100100000011000100110110001101111011011110110111000111010011101000110100001101001011100100111010000101110001000000110100101101110001000000110010101100011011000010111000011100000100000011101000110100001100101001000000100110101100001011101000111001001101001011110000011101000010111001011100010000001101001011101000010011101110011001000000110011001101111011100100010000001110100011010000110010100100000011101110110000101110010011100100110100101101111011100100111001100101110
`.replace(/\s/g, ''); // dense block of zeros and ones without spaces

let matrixEffectRunning = false;

function playTypeSound() {
    if (!typeSound.paused) return;
    typeSound.currentTime = 0;
    typeSound.play();
}

function stopTypeSound() {
    typeSound.pause();
    typeSound.currentTime = 0;
}

function typeStartText() {
    if (startIndex < startMessage.length) {
        if (startIndex === 3 && !mistakeMade) {
            startText.textContent += 'X';  // intentional mistake
            setTimeout(() => {
                startText.textContent = startText.textContent.slice(0, -1);
                setTimeout(typeStartText, 200);  // correct the mistake and continue typing
            }, 500);
            mistakeMade = true;
        } else {
            startText.textContent += startMessage.charAt(startIndex);
            startIndex++;
            setTimeout(typeStartText, 200);
        }
    } else {
        startText.innerHTML = startMessage + '<span class="blink">_</span>';
        startText.addEventListener('click', startVideo);
    }
}

function startVideo() {
    startText.style.display = 'none'; // Hide the start text
    document.getElementById('startScreen').style.display = 'none';
    videoScreen.style.display = 'flex';
    transitionVideo.play();
}

transitionVideo.addEventListener('ended', () => {
    // Close video on mobile devices after it ends
    if (window.innerWidth <= 600) {
        startSite();
    } else {
        startSite();
    }
    backgroundMusic.play(); // Start playing background music when the video ends
});

function startSite() {
    videoScreen.style.display = 'none';
    document.getElementById('mainScreen').style.display = 'block';
    displayEncodedMessage();
    terminalInput.focus(); // Focus the terminal input when the video ends
    setInterval(revealT8Hint, 600000); // Reveal T8 every 10 minutes
}

function displayEncodedMessage() {
    let encodedIndex = 0;

    function typeEncodedMessage() {
        if (encodedIndex < newMessage.length) {
            playTypeSound();
            encodedMessageElement.innerHTML = newMessage.substring(0, encodedIndex + 1);
            encodedIndex++;
            setTimeout(typeEncodedMessage, 10);  // faster typing effect
        } else {
            stopTypeSound();
            encodedMessageElement.innerHTML = newMessage;
            terminalInput.focus(); // Ensure the terminal input is focused after typing ends
            // Store the original message
            encodedMessageElement.dataset.originalText = newMessage;
        }
    }

    typeEncodedMessage();
}

function revealT8Hint() {
    const originalText = encodedMessageElement.innerHTML;
    encodedMessageElement.innerHTML = ''; // Clear the existing content
    const chars = originalText.split('');
    const fragment = document.createDocumentFragment();

    chars.forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        fragment.appendChild(span);

        if (index === Math.floor(chars.length / 2)) {
            const hintSpan = document.createElement('span');
            hintSpan.textContent = 'T8';
            hintSpan.style.color = 'green';
            hintSpan.style.position = 'relative';
            hintSpan.style.animation = 'revealT8 1s linear';
            fragment.appendChild(hintSpan);
        }
    });

    encodedMessageElement.appendChild(fragment);

    setTimeout(() => {
        encodedMessageElement.innerHTML = originalText;
    }, 1200); // Revert back after 1200ms
}

encodedMessageElement.addEventListener('click', () => {
    navigator.clipboard.writeText(newMessage).then(() => {
        alert('Binary message copied to clipboard!');
    });
});

encodedMessageElement.addEventListener('mouseover', () => {
    if (!matrixEffectRunning) {
        const originalText = encodedMessageElement.textContent;
        randomizeText(encodedMessageElement, originalText);
        encodedMessageElement.addEventListener('mouseout', () => {
            encodedMessageElement.textContent = originalText;
        }, { once: true });
    }
});

function randomizeText(element, originalText) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const textArray = originalText.split('');
    const randomArray = textArray.map(char => {
        return Math.random() < 0.5 ? characters.charAt(Math.floor(Math.random() * characters.length)) : char;
    });
    element.textContent = randomArray.join('');
}

function copyAddress() {
    const contractAddress = document.getElementById('contractAddress').textContent;
    navigator.clipboard.writeText(contractAddress).then(() => {
        alert('Contract address copied to clipboard!');
    });
}

document.addEventListener("DOMContentLoaded", () => {
    typeStartText();
    setInterval(glitchEffect, 12000); // Trigger glitch every 12 seconds
    scrollToTopOnMobile(); // Scroll to top on mobile when content is loaded
});

// Interactive terminal logic
terminalInput.addEventListener('focus', () => {
    // Any additional logic for mobile if needed
    if (window.innerWidth <= 600) {
        // Specific adjustments for mobile devices
        terminalInput.scrollIntoView({ behavior: 'smooth' });
    }
});

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleTerminalInput();
    }
});

enterButton.addEventListener('click', handleTerminalInput);

function handleTerminalInput() {
    const inputText = terminalInput.innerText.trim();
    terminalOutput.innerText = ''; // Clear the terminal output

    if (inputText.toLowerCase() === 'matrix') {
        triggerMatrixEffect();
    } else if (inputText.toLowerCase() === 'dexscreener') {
        window.open('https://dexscreener.com/solana/cim7gxrqnwczzqjfob3mt1ppgcjq9ubgbqavjynehxvn?maker=AyXmbLPCLV5A4uwoyiJwGCpJUwUFfnyt7mGpquYcaLoT', '_blank');
    } else if (inputText.toLowerCase() === 'university') {
        window.open('https://www.university.com/', '_blank');
    } else if (inputText.toLowerCase() === 'alpha') {
        window.open('https://x.com/cobratate', '_blank');
    } else if (['T8', 'solana', 'secret'].includes(inputText)) { // Add more correct answers here
        revealKnight(inputText);
    } else {
        displayErrorMessage();
    }

    terminalInput.innerText = ''; // Clear the terminal input
    terminalInput.focus(); // Ensure input remains focused
}

function revealKnight(inputText) {
    const correctMessages = {
        'T8': 'You think you’re tough because you dabble in the markets? Please. You’re nothing but a bunch of keyboard warriors. I’m Andrew Tate, and I’m here to wake you up.',
        'solana': 'I will crash Solana Network',
        'secret': 'Here’s a secret most of you don’t get: The real money in crypto isn’t made by following the hype. It’s made by the insiders, the ones who know the game before you even hear about it. If you want to win, you need to start thinking like the masterminds pulling the strings, not the clueless masses following the herd.'
    };
    const correctMessage = `
${correctMessages[inputText]}
    `;
    terminalOutput.innerText += `${correctMessage}`;
    stopMatrixEffect();
}

function displayErrorMessage() {
    const errorMessage = `
<img src="error.jpg" alt="Try Again Image" class="responsive-image">
    `;
    terminalOutput.innerHTML = `${errorMessage}`; // Use innerHTML to include the image
    stopMatrixEffect();
}

function glitchEffect() {
    const originalText = contractAddressElement.textContent;
    const glitchText = "FREEDOM TICKET";

    // Store the original text in a dataset attribute if not already stored
    if (!contractAddressElement.dataset.originalText) {
        contractAddressElement.dataset.originalText = originalText;
    }

    contractAddressElement.textContent = glitchText;
    setTimeout(() => {
        contractAddressElement.textContent = contractAddressElement.dataset.originalText;
    }, 1200); // Revert back after 1200ms
}

function triggerMatrixEffect() {
    matrixEffectRunning = true;
    const text = encodedMessageElement.dataset.originalText; // Retrieve the original text from the dataset
    encodedMessageElement.innerHTML = ''; // Clear the existing content
    const chars = text.split('');
    const fragment = document.createDocumentFragment();

    chars.forEach(char => {
        const span = document.createElement('span');
        span.classList.add('matrix-fall');
        span.textContent = char;
        fragment.appendChild(span);
    });

    encodedMessageElement.appendChild(fragment); // Append the new fragment

    const spans = encodedMessageElement.querySelectorAll('span');

    spans.forEach(span => {
        const delay = Math.random() * 2; // Random delay between 0 and 2 seconds
        span.style.animationDelay = `${delay}s`;
    });
}

function stopMatrixEffect() {
    matrixEffectRunning = false;
    // Revert back to the original text
    const originalText = encodedMessageElement.dataset.originalText;
    encodedMessageElement.innerHTML = originalText;
}

function scrollToTopOnMobile() {
    if (window.innerWidth <= 600) {
        // Specific adjustments for mobile devices
        window.scrollTo(0, 0);
    }
}

// Scroll to top on mobile when content is loaded
document.addEventListener("DOMContentLoaded", () => {
    typeStartText();
    setInterval(glitchEffect, 12000); // Trigger glitch every 12 seconds
    scrollToTopOnMobile(); // Scroll to top on mobile when content is loaded
});
