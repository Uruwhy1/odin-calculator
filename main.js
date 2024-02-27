// DYNAMIC FONT SIZE IN  DISPLAY
const display = document.querySelector('.display');
const displayText = document.querySelector('.display-numbers');
const minimumSize = 27;


function adjustFontSize() {
    const containerWidth = display.offsetWidth;
    const textWidth = displayText.scrollWidth;


    // Calculate the current font size
    let currentFontSize = parseFloat(getComputedStyle(displayText).fontSize);

    console.log(currentFontSize);
    let newFontSize = currentFontSize - 10;
    console.log(newFontSize)

    if(textWidth + 10 > containerWidth) { 
        if (newFontSize < minimumSize) {
            displayText.style.fontSize = minimumSize + 'px';
        } else displayText.style.fontSize = newFontSize + 'px';
    } else if ((textWidth * 2) < containerWidth) {
        displayText.style.fontSize = '60px'
    }

}

// Function to handle button clicks and call adjustFontSize
function handleButtonClick() {
    adjustFontSize();
}

// Get all buttons and add event listeners to them
const buttons = document.querySelectorAll('.key');
buttons.forEach(button => {
    button.addEventListener('click', handleButtonClick);
});


// BUTTON HANDLING

/// Add numbers to display
function appendToDisplay(value) {
    displayText.textContent += value;
}

/// Clear Display
function clearDisplay() {
    displayText.textContent = "";
}
