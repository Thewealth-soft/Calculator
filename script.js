
const inputEl = document.querySelectorAll(".global");
const resultEl = document.querySelector(".result");
const deleteEl = document.querySelector(".del");
const equalEl = document.querySelector(".equal-to");
const operatorEl = document.querySelectorAll(".operator");
const bracketEl =document.querySelectorAll('.bracket')

let currentInput = "";
let operatorInput = "";
let currentNumber = "";

inputEl.forEach((button) => {
  button.addEventListener("click", () => {
    currentInput += button.value;
    currentNumber += button.value;
    resultEl.value = currentInput;
  });
});

operatorEl.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (operatorInput !== "") {
      operatorInput = e.target.value;
      currentInput = currentInput + operatorInput;
    } else {
      operatorInput = e.target.value;
      currentInput += operatorInput;
      currentNumber = "";
    }
    resultEl.value = currentInput;
  });
});

deleteEl.addEventListener("click", () => {
  operatorInput = "";
  currentInput = "";
  currentNumber = "";
  resultEl.value = "";
});

function calculate(expression) {
  const tokens = expression.match(
    // /(\d+(\.\d+)?|[\+\-\*\/%^√|!]|[a-z]+|[\(\)])/g
    /(\d+(\.\d+)?|[+\-*/%^√!]|[a-z]+|[()])/g
  );

  if (!tokens) {
    throw new Error("Invalid expression");
  }

  let result = parseFloat(tokens[0]);
  let operator = "";
  const stack = [];

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];

    if (isNaN(token)) {
      operator = token;
    } else {
      const operand = parseFloat(token);

      if (isNaN(operand)) {
        throw new Error("Invalid operand");
      }

      switch (operator) {
        case "+":
          result += operand;
          break;
        case "-":
          result -= operand;
          break;
        case "*":
          result *= operand;
          break;
        case "/":
          if (operand === 0) {
            throw new Error("Division by zero");
          }
          result /= operand;
          break;
        case "%":
          result %= operand;
          break;
        case "√":
          result = Math.sqrt(operand);
          break;
        case "^":
          result = Math.pow(result, operand);
          break;
        case "!":
          let factorial = 1;
          for (let j = 1; j <= operand; j++) {
            factorial *= j;
          }
          result = factorial;
          break;

        case "(":
          // Push current result and operator onto stack
          stack.push(result);
          stack.push(operator);
          result = operand; // Start evaluating expression within parentheses
          operator = "";
          break;
        case ")":
          // Pop operator and previous result from stack
          
            const prevOperator = stack.pop();
            const prevResult = stack.pop();
            switch (prevOperator) {
              case "+":
                result = prevResult + result;
                break;
              case "-":
                result = prevResult - result;
                break;
              case "*":
                result = prevResult * result;
                break;
              case "/":
                if (result === 0) {
                  throw new Error("Division by zero");
                }
                result = prevResult / result;
                break;
              case "%":
                result = prevResult % result;
                break;
              default:
                throw new Error("Unsupported operator");
            }
            operator = ""; // Reset the operator for the next iteration
          break;
        default:
          throw new Error("Unsupported operator");
      }
      operator = ""; // This is to reset the operation for the next iteration
    }
  }
  return result;
}

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
