let operationsList;
let operationsEval;
let evalStr;
let currentStep;
let isProcessing;

function evaluate(expression) {
    operationsList = [];
    operationsEval = [];
    evalStr = "";
    currentStep = -1;
    isProcessing = false;

    // Clear the explanation and evaluation boxes
    document.getElementById("explanation").innerText = "";
    document.getElementById("evaluation").innerText = "";

    if (!/^[0-9+\-*/^() ]+$/.test(expression)) {
        return "Invalid Expression";
    }
    let tokens = expression.match(/\d+|[+\-*/^()]/g);
    if (!tokens) return "Invalid Expression";

    let values = [];
    let ops = [];
    let openParen = 0, closeParen = 0;
    operationsList = [];

    for (let i = 0; i < tokens.length; i++) {
        if (!isNaN(tokens[i])) {
            values.push(parseInt(tokens[i]));
            operationsList.push(`push ${tokens[i]} (operands)`);
            operationsEval.push(evalStr);
        } else if (tokens[i] === '(') {
            ops.push(tokens[i]);
            operationsList.push(`push ${tokens[i]} (operators)`);
            operationsEval.push(evalStr);
            openParen++;
        } else if (tokens[i] === ')') {
            closeParen++;
            if (closeParen > openParen) return "Invalid Expression";
            while (ops.length > 0 && ops[ops.length - 1] !== '(') {
                if (values.length < 2) return "Invalid Expression";
                let op = ops.pop();
                let b = values.pop(), a = values.pop();
                values.push(applyOp(op, b, a));
                
                operationsList.push(`pop ${b} (operands)`);
                operationsList.push(`pop ${op} (operators)`);
                operationsList.push(`pop ${a} (operands)`);
                evalStr = `${b} ${evalStr}`;
                operationsEval.push(evalStr);
                evalStr = `${op} ${evalStr}`;
                operationsEval.push(evalStr);
                evalStr = `${a} ${evalStr}`;
                operationsEval.push(evalStr);
                
                operationsList.push(`push ${applyOp(op, b, a)} (operands)`);
                operationsEval.push(`${evalStr} = ${applyOp(op, b, a)}`);
                evalStr = "";
            }
            ops.pop();
            operationsList.push(`pop ( (operators)`);
            operationsEval.push(evalStr);
        } else if ("+-*/^".includes(tokens[i])) {
            while (ops.length > 0 && hasPrecedence(tokens[i], ops[ops.length - 1])) {
                if (values.length < 2) return "Invalid Expression";
                let op = ops.pop();
                let b = values.pop(), a = values.pop();
                values.push(applyOp(op, b, a));
               
                operationsList.push(`pop ${b} (operands)`);
                operationsList.push(`pop ${op} (operators)`);
                operationsList.push(`pop ${a} (operands)`);

                evalStr = `${b} ${evalStr}`;
                operationsEval.push(evalStr);
                evalStr = `${op} ${evalStr}`;
                operationsEval.push(evalStr);
                evalStr = `${a} ${evalStr}`;
                operationsEval.push(evalStr);
                
                operationsList.push(`push ${applyOp(op, b, a)} (operands)`);
                operationsEval.push(`${evalStr} = ${applyOp(op, b, a)}`);
                evalStr = "";
            }
            ops.push(tokens[i]);
            operationsList.push(`push ${tokens[i]} (operators)`);
            operationsEval.push(evalStr);
        } else {
            return "Invalid Expression";
        }
    }

    while (ops.length > 0) {
        if (values.length < 2) return "Invalid Expression";
        let op = ops.pop();
        let b = values.pop(), a = values.pop();
        values.push(applyOp(op, b, a));
        operationsList.push(`pop ${b} (operands)`);
        operationsList.push(`pop ${op} (operators)`);
        operationsList.push(`pop ${a} (operands)`);

        evalStr = `${b} ${evalStr}`;
        operationsEval.push(evalStr);
        evalStr = `${op} ${evalStr}`;
        operationsEval.push(evalStr);
        evalStr = `${a} ${evalStr}`;
        operationsEval.push(evalStr);
                
        operationsList.push(`push ${applyOp(op, b, a)} (operands)`);
        operationsEval.push(`${evalStr} = ${applyOp(op, b, a)}`);
        evalStr = "";
    }

    if (openParen !== closeParen) return "Invalid Expression";

    return values.pop();
}

function hasPrecedence(op1, op2) {
    if (op2 === '(' || op2 === ')') return false;
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };

    // Right-associative: only apply if op1 has lower precedence
    if (precedence[op1] < precedence[op2]) return true;
    if (precedence[op1] === precedence[op2] && op1 !== '^') return true;

    return false;
}


function applyOp(op, b, a) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return Math.floor(a / b);
        case '^': return Math.pow(a, b); // exponentiation a^b
    }
    return 0;
}


function startProcessing() {
    let expr = document.getElementById("expressionInput").value.trim();
    document.getElementById("operands").innerHTML = "";
    document.getElementById("operators").innerHTML = "";
    document.getElementById("result").innerText = "";
    document.getElementById("explanation").innerText = "";
    document.getElementById("evaluation").innerText = "";

    let result = evaluate(expr);

    if (result === "Invalid Expression") {
        document.getElementById("result").innerText = result;
        document.getElementById("nextBtn").disabled = true;
        document.getElementById("prevBtn").disabled = true;
        return;
    }

    document.getElementById("result").innerText = `Result: ${result}`;
    currentStep = -1;

    // Enable the buttons for valid expressions
    document.getElementById("nextBtn").disabled = false;
    document.getElementById("prevBtn").disabled = false;
}

function pushToStack(stack, value) {
    let newElement = document.createElement("div");
    newElement.classList.add("stack-element");
    newElement.textContent = value;
    newElement.style.transform = "translateY(-50px)";
    stack.appendChild(newElement);
    stack.style.height = `${stack.children.length * 50 + 20}px`;
    setTimeout(() => {
        newElement.style.transform = "translateY(0)";
    }, 50);
}

function popFromStack(stack) {
    if (stack.children.length > 0) {
        let element = stack.lastElementChild;
        element.style.transform = "translateY(-50px)";
        setTimeout(() => {
            stack.removeChild(element);
            stack.style.height = `${stack.children.length * 50 + 20}px`;
        }, 200);
    }
}

function performOperation(step, flag) {
    let operation = operationsList[step].split(" ");
    evalStr = operationsEval[step] || "";
    let action = operation[0];
    let value = operation[1];
    let type = operation[2];
    let explanationText = "";

    if (flag === 1) {
        // Moving forward (next)
        if (action === "push") {
            if (type === "(operands)") {
                pushToStack(document.getElementById("operands"), value, 'down');
                explanationText = `PUSH ${value} into the operand stack`;
            } else {
                pushToStack(document.getElementById("operators"), value, 'down');
                explanationText = `PUSH ${value} into the operator stack`;
            }
        } else if (action === "pop") {
            if (type === "(operands)") {
                popFromStack(document.getElementById("operands"), 'down');
                explanationText = `POP ${value} from the operand stack`;
            } else {
                popFromStack(document.getElementById("operators"), 'down');
                explanationText = `POP ${value} from the operator stack`;
            }
        }
    } else {
        // Moving backward (previous)
        if (action === "push") {
            if (type === "(operands)") {
                popFromStack(document.getElementById("operands"), 'up');
                explanationText = `UNDO PUSH ${value} from the operand stack`;
            } else {
                popFromStack(document.getElementById("operators"), 'up');
                explanationText = `UNDO PUSH ${value} from the operator stack`;
            }
        } else if (action === "pop") {
            if (type === "(operands)") {
                pushToStack(document.getElementById("operands"), value, 'up');
                explanationText = `UNDO POP ${value} into the operand stack`;
            } else {
                pushToStack(document.getElementById("operators"), value, 'up');
                explanationText = `UNDO POP ${value} into the operator stack`;
            }
        }
    }

    document.getElementById("explanation").innerText = explanationText;
    document.getElementById("evaluation").innerText = evalStr || "No operation yet";
}

function previousStep() {
    if (currentStep >= 0 && !isProcessing) {  // Changed from > 0 to >= 0
        isProcessing = true;
        performOperation(currentStep, 0);
        currentStep--;

        disableButtons();
        setTimeout(() => {
            isProcessing = false;
            // Only enable previous button if we can go further back
            document.getElementById("prevBtn").disabled = currentStep < 0;
            document.getElementById("nextBtn").disabled = false;
        }, 500);
    }
}

function nextStep() {
    if (currentStep < operationsList.length - 1 && !isProcessing) {
        isProcessing = true;
        currentStep++;
        performOperation(currentStep, 1);

        disableButtons();
        setTimeout(() => {
            isProcessing = false;
            // Only enable next button if we can go further
            document.getElementById("nextBtn").disabled = currentStep >= operationsList.length - 1;
            document.getElementById("prevBtn").disabled = false;
        }, 500);
    }
}


function disableButtons() {
    document.getElementById("nextBtn").disabled = true;
    document.getElementById("prevBtn").disabled = true;
}

function enableButtons() {
    document.getElementById("nextBtn").disabled = false;
    document.getElementById("prevBtn").disabled = false;
}