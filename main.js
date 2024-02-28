const display = document.querySelector('.display');
const displayText = document.querySelector('.display-numbers');

// DYNAMIC FONT SIZE IN DISPLAY
function adjustFontSize() {
    const containerWidth = display.offsetWidth;
    const textWidth = displayText.scrollWidth;
    const minimumSize = 27;

    // Calculate the current font size
    let currentFontSize = parseFloat(getComputedStyle(displayText).fontSize);
    let newFontSize = currentFontSize - 10;

    if (textWidth + 10 > containerWidth) {
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
    return +(a ** b).toFixed(3);
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
    // Define operator precedence
    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '%': 2,
        '^': 3,
        '√': 3,
        '(': 0, // Added for precedence
    };

    let array = string.split(/([+\-%*^/()√])/).filter(token => token.trim() !== '');

    let mergedTokens = [];
    let isNegative = false;
    let previousToken = null;

    for (let i = 0; i < array.length; i++) {
        let token = array[i];

        if (token === '-' && isNegative == false && (previousToken == null || /(?<=[+%*^/(√])/.test(previousToken))) {
            isNegative = true;
        } else {
            if (isNegative) {
                token = -token;
                isNegative = false;
            }
            mergedTokens.push(token);
        }
        previousToken = token;
    }

    let postfix = infixToPostfix(mergedTokens);
    let result = evaluatePostfix(postfix);

    if ((isNaN(result) || result == null) && result != "IDI0T") {
        displayText.textContent = "ERR0R";
    } else {
        displayText.textContent = result;
    }

    adjustFontSize();
}

function infixToPostfix(infix) {
    let postfix = [];
    let stack = [];
    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '%': 2,
        '^': 3,
        '√': 3,
        '(': 0, // Added for precedence
    };

    for (let token of infix) {
        if (!isNaN(token)) {
            postfix.push(token);
        } else if (token === '(') {
            stack.push(token);
        } else if (token === ')') {
            while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                postfix.push(stack.pop());
            }
            stack.pop(); // Discard '('
        } else {
            while (stack.length > 0 && precedence[stack[stack.length - 1]] >= precedence[token]) {
                postfix.push(stack.pop());
            }
            stack.push(token);
        }
    }

    while (stack.length > 0) {
        postfix.push(stack.pop());
    }

    return postfix;
}

function evaluatePostfix(postfix) {
    let stack = [];

    for (let token of postfix) {
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
        } else {
            let operand2 = stack.pop();
            let operand1 = stack.pop();
            console.log(token);
            console.log("Operands:" + operand1 + operand2);
            switch (token) {
                
                case '+':
                    stack.push(sum(operand1, operand2));
                    break;
                case '-':
                    stack.push(rest(operand1, operand2));
                    break;
                case '*':
                    stack.push(multiply(operand1, operand2));
                    break;
                case '/':
                    if (operand2 === 0) {
                        return "IDI0T";
                    } else {
                        stack.push(divide(operand1, operand2));
                    }
                    break;
                case '%':
                    stack.push(remainder(operand1, operand2));
                    break;
                case '^':
                    stack.push(power(operand1, operand2));
                    break;
                case '√':
                    !operand1 ? stack.push(squareRoot(operand2)) : stack.push(squareRoot(operand1));
                    break;
                default:
                    break;
            }
        }
    }

    return stack.pop();
}
