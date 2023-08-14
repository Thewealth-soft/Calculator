/* This is the most covered script, it touches almost all the regular expression */

// Selecting the necessary HTML elements using their class names
const inputEl = document.querySelectorAll(".global");
const resultEl = document.querySelector(".result");
const deleteEl = document.querySelector(".del");
const equalEl = document.querySelector(".equal-to");
const operatorEl = document.querySelectorAll(".operator");
const bracketEl = document.querySelectorAll(".bracket");

// Initializing variables to store input and calculations
let currentInput = "";
let operatorInput = "";
let currentNumber = "";

// Adding event listeners to numeric buttons to capture user input
inputEl.forEach((button) => {
  button.addEventListener("click", () => {
    currentInput += button.value; // Append the clicked button's value to the current input
    currentNumber += button.value; // Append the clicked button's value to the current number being constructed
    resultEl.value = currentInput; // Display the current input in the result element
  });
});

// Adding event listeners to operator buttons to capture operator input
operatorEl.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (operatorInput !== "") {
      operatorInput = e.target.value; // Update the operator input with the clicked operator
      currentInput = currentInput + operatorInput; // Append the clicked operator to the current input
    } else {
      operatorInput = e.target.value; // Update the operator input with the clicked operator
      currentInput += operatorInput; // Append the clicked operator to the current input
      currentNumber = ""; // Reset the current number since an operator was clicked
    }
    resultEl.value = currentInput; // Display the updated current input in the result element
  });
});

// Adding event listener to the delete button to clear input and calculations
deleteEl.addEventListener("click", () => {
  operatorInput = "";
  currentInput = "";
  currentNumber = "";
  resultEl.value = ""; // Clear the result display
});

// Function to evaluate the given expression
function calculate(expression) {
  // Tokenizing the expression using regular expression
  const tokens = expression.match(/\d+(\.\d+)?|[+\-*/%^√!()]|[a-z]+/g);
  // const tokens = expression.match( /(\d+(\.\d+)?|[\+\-\*\/%^√|!]|[a-z]+|[\(\)])/g);

  if (!tokens) {
    throw new Error("Invalid expression");
  }

  // Operator precedence mapping
  const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "%": 2,
    "^": 3,
    "√": 3,
    "!": 3,
  };

  const operators = []; // Stack to hold operators
  const operands = []; // Stack to hold operands

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token === "(") {
      operators.push(token); // Push opening bracket onto the operator stack
    } else if (token === ")") {
      // Evaluate expressions within brackets
      while (operators.length > 0 && operators[operators.length - 1] !== "(") {
        applyTopOperator(operators, operands);
      }
      operators.pop(); // Pop opening bracket
    } else if (precedence[token]) {
      // Handle operators with precedence
      while (
        operators.length > 0 &&
        operators[operators.length - 1] !== "(" &&
        precedence[operators[operators.length - 1]] >= precedence[token]
      ) {
        applyTopOperator(operators, operands);
      }
      operators.push(token); // Push current operator onto the operator stack
    } else {
      const operand = parseFloat(token);
      if (isNaN(operand)) {
        throw new Error("Invalid operand");
      }
      operands.push(operand); // Push operand onto the operand stack
    }
  }

  while (operators.length > 0) {
    applyTopOperator(operators, operands); // Process remaining operators
  }

  if (operands.length !== 1) {
    throw new Error("Invalid expression");
  }

  return parseFloat(operands[0].toFixed(6)); // Return the final result
}

// Function to apply the top operator
function applyTopOperator(operators, operands) {
  const operator = operators.pop();

  if (operator === "√" || operator === "!") {
    const operand = operands.pop();
    const result = applyOperator(operator, operand, null);
    operands.push(result);
  } else {
    const operand2 = operands.pop();
    const operand1 = operands.pop();
    const result = applyOperator(operator, operand1, operand2);
    operands.push(result);
  }
}

// Function to perform the actual calculation based on the operator
function applyOperator(operator, operand1, operand2) {
  switch (operator) {
    case "+":
      return operand1 + operand2;
    case "-":
      return operand1 - operand2;
    case "*":
      return operand1 * operand2;
    case "/":
      if (operand2 === 0) {
        throw new Error("Division by zero");
      }
      return operand1 / operand2;
    case "%":
      return operand1 % operand2;
    case "^":
      return Math.pow(operand1, operand2);
    case "√":
      return Math.sqrt(operand1);
    case "!":
      if (operand1 <= 0 || !Number.isInteger(operand1)) {
        throw new Error("Factorial operand must be a positive integer");
      }
      let factorial = 1;
      for (let j = 1; j <= operand1; j++) {
        factorial *= j;
      }
      return factorial;
    default:
      throw new Error("Unsupported operator");
  }
}

// Adding event listener to the equal button to calculate and display the result
equalEl.addEventListener("click", () => {
  try {
    const result = calculate(currentInput);
    resultEl.value = result;
    // Reset the variables for the next calculation
    currentInput = result.toString();
    operatorInput = "";
    currentNumber = "";
  } catch (error) {
    resultEl.value = "Calculation error";
  }

});
