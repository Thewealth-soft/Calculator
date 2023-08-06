const inputEl = document.querySelectorAll(".global");
const resultEl = document.querySelector(".result");
const deleteEl = document.querySelector(".del");
const equalEl = document.querySelector(".equal-to");
const operatorEl = document.querySelectorAll(".operator");

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
  operatorInput = e.target.value;
  currentInput += operatorInput;
  currentNumber = "";
  resultEl.value = currentInput;
});
})


deleteEl.addEventListener("click", () => {
  operatorInput = "";
  currentInput = "";
  currentNumber = "";
  resultEl.value = "";
});

function calculate(expression) {
  const tokens = expression.match(/[\+\-\*\/]/g);

  console.log(`this is the token click ${tokens}`);
  if (!tokens) {
    throw new Error("Invalid expression");
  }

  let result = tokens[0];
  let operator = "";

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];
    console.log(`This is the token from loop ${token}`);
    if (!isNaN(token)) {
      operator = token;
      if (operator !== "%") {
        throw new Error("Unsupported operator");
      }
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
          result /= operand;
          break
        default:
          throw new Error("Unsupported operator");
      }
      operator = "";
    }
  }
  return result;
}


equalEl.addEventListener("click", () => {
  try {
    const inputExpression = currentInput + currentNumber;
    const result = calculate(inputExpression);
    resultEl.value = result;
    // This to Reset the variables for the next calculation
    currentInput = "";
    operatorInput = "";
    currentNumber = "";
  } catch (error) {
    resultEl.value = "Calculation error";
  }
});
