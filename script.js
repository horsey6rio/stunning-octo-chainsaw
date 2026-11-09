const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let currentValue = '0';
let storedValue = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function clearCalculator() {
  currentValue = '0';
  storedValue = null;
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function appendNumber(value) {
  if (value === '.' && currentValue.includes('.')) {
    return;
  }

  if (shouldResetDisplay) {
    currentValue = '0';
    shouldResetDisplay = false;
  }

  if (currentValue === '0' && value !== '.') {
    currentValue = value;
  } else {
    currentValue += value;
  }

  updateDisplay();
}

function applyPercent() {
  const numericValue = Number(currentValue) / 100;
  currentValue = String(numericValue);
  updateDisplay();
}

function backspace() {
  if (shouldResetDisplay) {
    currentValue = '0';
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  if (currentValue.length <= 1) {
    currentValue = '0';
  } else {
    currentValue = currentValue.slice(0, -1);
  }

  updateDisplay();
}

function calculate(a, b, op) {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return b === 0 ? 'Error' : a / b;
    default:
      return b;
  }
}

function handleOperator(nextOperator) {
  const inputValue = Number(currentValue);

  if (storedValue === null) {
    storedValue = inputValue;
  } else if (operator) {
    const result = calculate(storedValue, inputValue, operator);
    storedValue = Number(result);
    currentValue = String(result);
    updateDisplay();
  }

  operator = nextOperator;
  shouldResetDisplay = true;
}

function evaluateExpression() {
  if (storedValue === null || operator === null) {
    return;
  }

  const result = calculate(storedValue, Number(currentValue), operator);
  currentValue = String(result);
  storedValue = null;
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

buttons.forEach((button) => {
  const { value, action } = button.dataset;

  button.addEventListener('click', () => {
    if (button.classList.contains('num')) {
      appendNumber(value);
      return;
    }

    if (button.classList.contains('func')) {
      if (action === 'clear') {
        clearCalculator();
      } else if (action === 'backspace') {
        backspace();
      } else if (action === 'percent') {
        applyPercent();
      }
      return;
    }

    if (button.classList.contains('op')) {
      handleOperator(value);
      return;
    }

    if (button.classList.contains('eq')) {
      evaluateExpression();
    }
  });
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    appendNumber(key);
  } else if (key === '.') {
    appendNumber('.');
  } else if (['+', '-', '*', '/'].includes(key)) {
    handleOperator(key);
  } else if (key === 'Enter' || key === '=') {
    evaluateExpression();
  } else if (key === 'Backspace') {
    backspace();
  } else if (key === 'Delete' || key === 'Escape') {
    clearCalculator();
  }
});

updateDisplay();
