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

const newMessage = `
010101000110111100100000011000010110110001101100001000000110001101110010011110010111000001110100011011110010000001100100011001010110011101100101011011100111001100101100001000000110100101110100001001110111001100100000011101000110100101101101011001010010000001110100011011110010000001100101011110000110100101110100001000000111010001101000011001010010000001101101011000010111010001110010011010010111100000101110001000000101001101100101011010010111101001100101001000000110001101101111011011100111010001110010011011110110110000100000011011110110011000100000011110010110111101110101011100100010000001100110011101010111010001110101011100100110010100101100001000000110010001100101011001100111100100100000011101000110100001100101001000000110111001101111011100100110110001110011001011000010000001100001011011100110010000100000011001010110110101100010011100101100001101001110010000000011110001000010010000100111111001000010010000100100001001111110000100000001000000010000000100000001000000010000001011100010000001010011011101000110000101111001001000000111001101101000011000010111001001110000001000000110000101101110011001000010000001110110011010010110011101101001011011000110000101101110011101000010111000100000010101000110100001100101001000000111000001101111011101110110010101110010001000000110100101110011001000000110100101101110001000000111100101101111011101010111001000100000011010000110000101101110011001000111001100101110
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
        startText.innerHTML += '_';
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
});

// Interactive terminal logic
terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const inputText = terminalInput.innerText.trim();
        terminalOutput.innerText = ''; // Clear the terminal output
        if (inputText.toLowerCase() === 'matrix') {
            triggerMatrixEffect();
        } else if (inputText.toLowerCase() === 'dexscreener') {
            window.open('https://dexscreener.com/solana/cim7gxrqnwczzqjfob3mt1ppgcjq9ubgbqavjynehxvn?maker=AyXmbLPCLV5A4uwoyiJwGCpJUwUFfnyt7mGpquYcaLoT', '_blank');
        } else if (inputText.toLowerCase() === 'university') {
            window.open('https://www.university.com/', '_blank');
        } else if (['T8', 'C8', 'S8'].includes(inputText)) { // Add more correct answers here
            revealKnight(inputText);
        } else {
            displayErrorMessage();
        }
        terminalInput.innerText = ''; // Clear the terminal input
    }
});

function revealKnight(inputText) {
    const correctMessages = {
        'T8': 'BE A MAN LIKE ME',
        'C8': 'STAY SHARP',
        'S8': 'KEEP IT UP'
    };
    const correctMessage = `
${correctMessages[inputText]}
    `;
    terminalOutput.innerText += `${correctMessage}`;
    stopMatrixEffect();
}

function displayErrorMessage() {
    const errorMessage = `
TRY AGAIN
<img src="error.jpg" alt="Try Again Image" class="responsive-image">
    `;
    terminalOutput.innerHTML = `${errorMessage}`; // Use innerHTML to include the image
    stopMatrixEffect();
}

function glitchEffect() {
    const originalText = contractAddressElement.textContent;
    const glitchText = "YOUR TICKET FOR FREEDOM";

    contractAddressElement.textContent = glitchText;
    setTimeout(() => {
        contractAddressElement.textContent = originalText;
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
