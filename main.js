const display = document.querySelector('.display');
const displayText = document.querySelector('.display-numbers');

// DYNAMIC FONT SIZE IN  DISPLAY
function adjustFontSize() {
    const containerWidth = display.offsetWidth;
    const textWidth = displayText.scrollWidth;
    const minimumSize = 27;

    // Calculate the current font size
    let currentFontSize = parseFloat(getComputedStyle(displayText).fontSize);
    let newFontSize = currentFontSize - 10;

    if(textWidth + 10 > containerWidth) { 
        if (newFontSize < minimumSize) {
            displayText.style.fontSize = minimumSize + 'px';
        } else displayText.style.fontSize = newFontSize + 'px';
    } else if ((textWidth * 2) < containerWidth) {
        displayText.style.fontSize = '60px'
    }

}



// BUTTON HANDLING

/// Get all buttons and add event listeners to them
const buttons = document.querySelectorAll('.key');
buttons.forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

/// Function to handle button clicks and call adjustFontSize
function handleButtonClick() {
    adjustFontSize();
}


function appendToDisplay(value) {
    displayText.textContent += value;
}
function clearDisplay() {
    displayText.textContent = "";
}
function removeLastItem() {
    displayText.textContent = displayText.textContent.slice(0, -1);
}


// OPERATIONS

/// The "+" at the beginnings are to convert to floating number if .00
function sum(a, b) {
    return +(a + b).toFixed(2);
}
function rest(a, b) {
    return +(a - b).toFixed(2);
}
function divide(a, b) {
    return +(a / b).toFixed(2);
}
function multiply(a, b) {
    return +(a * b).toFixed(2);
}
function remainder(a, b) {
    return +(a % b).toFixed(2);
}
function power(a, b) {
    return +(a ** b).toFixed(2);
}
function squareRoot(a) {
    return +(Math.sqrt(a).toFixed(2))
}

// CALCULATE RESULT

/// Deisplay Variable
let displayString;
function calculateResult() {
    displayString = displayText.textContent;
    returnResult(displayString);
}

function returnResult(string) {
    // Split the input string
    let array = string.split(/([+\-%*^/()√])/).filter(token => token.trim() !== '');

    let mergedTokens = []; // Array to make my life easier when convertin negatives
    let isNegative = false; // Flag to track if the previous token was '-'
    let previousToken = null;

    // Merge '-' with the next token if necessary
    for (let i = 0; i < array.length; i++) {
        let token = array[i];

        if (token === '-' && isNegative == false && (previousToken == null || /(?<=[+%*^/(√])/.test(previousToken))) {
            // If the current token is '-' and the previous token wasn't '-',
            // set the flag to true to indicate that the next token should be merged
            isNegative = true;
        } else {
            if (isNegative) {
                token = -token;
                isNegative = false;
            } 
            mergedTokens.push(token); 
        } previousToken = token;
    }

    // Initialize variables
    let result = null;
    let operator = null;
    let operands = [];
    let stack = []; // To track parentheses (we operate on the stacks first)



    // Process each token
    for (let token of mergedTokens) {
        if (token === '(') {
            // Push opening parenthesis onto the stack
            stack.push(token);
        } else if (token === ')') {
            // Pop operands and operator(s) until we reach the opening parenthesis
            while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                let tempOperator = stack.pop();
                let tempOperands = operands.splice(operands.length - 2, 2);
                let tempResult = evaluateExpression(tempOperands[0], tempOperator, tempOperands[1]);
                operands.push(tempResult);
            }
            // Remove the parenthesis from the stack
            stack.pop();
        } else if (['+', '-', '*', '/', '%', '^','√'].includes(token)) {
            // Handle operators
            operator = token;
            stack.push(token); // Push operator onto the stack
        } else {
            // Handle operands
            operands.push(parseFloat(token));
            
        } previousToken = token;
    }
    // Evaluate any remaining expressions in the stack
    while (stack.length > 0 || operands.length > 1) {
        let tempOperator = stack.shift();
        let tempOperands = operands.splice(0, 2);
        let tempResult = evaluateExpression(tempOperands[0], tempOperator, tempOperands[1]);
        operands.push(tempResult);
    }

    // The final result will be the only element in the operands array
    result = operands[0];


    // Update display with the result
    if (isNaN(result) || result == null) {
        displayText.textContent = "ERR0R";
    } else {
        displayText.textContent = result;
    }

        console.log(mergedTokens);
    console.log(array);
    adjustFontSize();
}

function evaluateExpression(operand1, operator, operand2) {
    switch (operator) {
        case '+':
            console.log("sum")
            return sum(operand1, operand2);
        case '-':
            console.log("rest")
            return rest(operand1, operand2);
        case '*':
            return multiply(operand1, operand2);
        case '/':
            return divide(operand1, operand2);
        case '%':
            return remainder(operand1, operand2);
        case '^':
            return power(operand1, operand2);
        case '√':
            return squareRoot(operand1);
        default:
            return null;
    }
}
