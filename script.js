const keys = document.querySelector("#calc_keys");
const display = document.getElementById("calc_display");
const calculator = document.getElementById("calculator");

function operate(x, y, operator){
    let firstNum = parseFloat(x);
    let secondNum = parseFloat(y);
    if (operator === "add") return firstNum + secondNum;
    if (operator === "subtract") return firstNum - secondNum;
    if (operator === "multiply") return firstNum * secondNum;
    if (operator === "divide") return firstNum / secondNum;
}

const getKeyType = key => {
    const { action } = key.dataset;
    if (!action) return "number";
    if (action === "add" || action === "subtract" || action === "multiply" || action === "divide") {
        return "operator";
    }
    return action;
}

const createDisplay = (key, displayNum, state) => {
    let keyContent = key.textContent;
    let keyType = getKeyType(key);
    const { 
        firstValue,
        operator,
        modValue,
        previousKeyType
    } = state;

    if (keyType === "number"){
        return displayNum === "0" ||
        previousKeyType === "operator" ||
        previousKeyType === "equals"
        ? keyContent
        : displayNum + keyContent;
        
    }
    
    if (keyType === "decimal"){
        if (previousKeyType === "operator" || previousKeyType === "equals") return "0.";
        if (!displayNum.includes(".")) return displayNum + ".";
        return displayNum;
    }

    if (keyType === "operator"){
        return firstValue &&
        operator &&
        previousKeyType !== "operator" &&
        previousKeyType !== "equals"
        ? operate(firstValue, displayNum, operator)
        : displayNum;
    }

    if (keyType === "clear"){
        return 0;
    }

    if (keyType === "equals"){
        return firstValue 
        ? previousKeyType === "equals"
            ? operate(displayNum, modValue, operator)
            : operate(firstValue, displayNum, operator)
        : displayNum;
    }
}

const updateCalcState = (key, calculator, calculated, displayNum) => {
    const keyType = getKeyType(key);
    const {
        firstValue,
        operator,
        modValue,
        previousKeyType
    } = calculator.dataset;

    calculator.dataset.previousKeyType = keyType;

    if (keyType === "operator"){
        calculator.dataset.operator = key.dataset.action;
        calculator.dataset.firstValue = firstValue &&
        operator &&
        previousKeyType !== "operator" &&
        previousKeyType !== "equals"
        ? calculated
        : displayNum;
    }

    if (keyType === "equals"){
        calculator.dataset.modValue = firstValue && previousKeyType === "calculate"
        ? modValue
        : displayNum;
    }

    if (keyType === "clear"){
        calculator.dataset.firstValue = "";
        calculator.dataset.modValue = "";
        calculator.dataset.operator = "";
        calculator.dataset.previousKeyType = "";
    }
}

const updateVisuals = (key, calculator) => {
    const keyType = getKeyType(key);
    Array.from(key.parentNode.children).forEach(k => k.classList.remove("active"));

    if (keyType === "operator") key.classList.add("active");
    if (keyType === "clear" && key.textContent !== "AC") key.textContent = "AC";
    if (keyType !== "clear"){
        const clearButton = calculator.querySelector("[data-action=clear]");
        clearButton.textContent = "CE";
    }
}

keys.addEventListener("click", (e) => {
    if (!e.target.matches("button")) return;
    const key = e.target;
    const displayNum = display.textContent;
    const calculatedDisplay = createDisplay(key, displayNum, calculator.dataset);

    display.textContent = calculatedDisplay;
    updateCalcState(key, calculator, calculatedDisplay, displayNum);
    updateVisuals(key, calculator);
});