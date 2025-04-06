// Expression conversion variables
let steps;
let currentStep;
let isProcessing; 
let inddd;
let s;
let hide_flag = 0;

// Instruction strings
let st1 = `Reverse the infix expression. Note while reversing each ‘(‘ will become ‘)’ and each ‘)’ becomes ‘(‘.\n`;
let st2 = `Convert the reversed infix expression to postfix expression.`;
let st3 = `Initialize an empty stack to store operators and an empty string for the postfix expression.`;
let st4 = `Scan the infix expression from left to right.`;
let st5 = `The current character is `;
let st6 = `Push it onto the stack.`;
let st7 = `Add it to the output expression.`;
let st8 = `There is no equal or higher precedence operator, so push it onto the stack.`;
let st9 = `Pop from the stack and append to the postfix expression until ‘(‘ is found, then pop ‘(‘ without appending.`;
let st11 = `Now pop and append all remaining operators from the stack to the postfix expression.`;

let p1 = `Reverse the given prefix expression to convert into postfix.`;
let p2 = `The current character is `;
let p3 = `Push it onto the stack.`;
let p4 = `Then pop two operands from the Stack\nCreate a string by concatenating the two operands and the operator between them.\nstring = (operand1 + operator + operand2)\nAnd push the resultant string back to stack.`;

function isValidExpression(expression, fromType) {
    const validCharsRegex = /^[a-zA-Z+\-*^/()]+$/;
    if (!validCharsRegex.test(expression)) {
        return "Invalid characters in expression. Only alphabets, +, -, *, /, ^ and () are allowed.";
    }

    const tokens = expression.match(/[a-zA-Z]+|[+\-*^/()]/g);

    if (fromType === "prefix") {
        if (!/[+\-*^/]/.test(tokens[0]) | /[()]/.test(expression)) {
            return "Input is not a valid prefix expression.";
        }
    } else if (fromType === "postfix") {
        if (!/[+\-*^/]/.test(tokens[tokens.length - 1]) | /[()]/.test(expression)) {
            return "Input is not a valid postfix expression.";
        }
    } else if (fromType === "infix") {
        let balance = 0;
        for (const char of expression) {
            if (char === "(") balance++;
            if (char === ")") balance--;
            if (balance < 0) break;
        }
        const invalidOperatorSequence = /[+\-/*^]{2,}/;
        const invalidStartEnd = /^[+\-/*^]|[+\-/*^]$/;

        if (balance !== 0 || invalidOperatorSequence.test(expression) || invalidStartEnd.test(expression)) {
            return "Input is not a valid infix expression.";
        }
    }

    return true;
}

function prec(c) {
    if (c === '^') return 3;
    else if (c === '/' || c === '*') return 2;
    else if (c === '+' || c === '-') return 1;
    else return -1;
}

// Token visualization variables
let tokenElements;
let currentTokenIndex;
let currentTokenSet = 0;
let tokenSets = [];
let visible = false;

function createTokenVisualization(tokens, setIndex = 0) {
    const tokenList = document.querySelector('.token-list');
    tokenList.innerHTML = '';
    tokenElements = [];

    tokens.forEach((token, index) => {
        const li = document.createElement('li');
        li.textContent = token;
        li.dataset.index = index;
        tokenList.appendChild(li);
        tokenElements.push(li);
    });

    currentTokenIndex = -1;
    currentTokenSet = setIndex;
}

function updateActiveToken() {
    tokenElements.forEach((element, index) => {
        if (index === currentTokenIndex) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
}

function highlightCurrentToken(index) {
    currentTokenIndex = index;
    updateActiveToken();
    
    if (tokenElements[index]) {
        const container = document.querySelector('.element-container');
        const element = tokenElements[index];
        const containerWidth = container.offsetWidth;
        const elementOffset = element.offsetLeft;
        const elementWidth = element.offsetWidth;
        
        container.scrollTo({
            left: elementOffset - (containerWidth / 2) + (elementWidth / 2),
            behavior: 'smooth'
        });
    }
}

function infixTo(tokens, toType) {
    tokenSets[currentTokenSet] = tokens;
    
    let part = "";
    let result = "";
    let st = [];
    
    if (toType === "prefix") {
        let reversed = tokens.reverse().join("");
        reversed = reversed.replace(/\(/g, 'X').replace(/\)/g, '(').replace(/X/g, ')');
        tokens = reversed.match(/[a-zA-Z]+|[+\-^*/()]/g);
        part = st1 + `The reversed expression is ${tokens.join(' ')}`;
        currentTokenSet++;
        tokenSets[currentTokenSet] = tokens;
        steps.push(["", part, "", "", inddd, currentTokenSet]);
        steps.push(["", st2, "", "", inddd, currentTokenSet]);
    }
    createTokenVisualization(tokens, currentTokenSet);
    part = st3 + "\n" + st4;
    steps.push(["", part, "", "", inddd, currentTokenSet]);
    
    for (let i = 0; i < tokens.length; i++) {
        inddd++;
        let c = tokens[i];
        
        part = st5 + ` " ${c} "\n`;
        
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
            result += c;
            part = part + st7;
            steps.push([c, part, result, "", inddd, currentTokenSet]);
        }
        else if (c === '(') {
            st.push(c);
            part = part + st6;
            steps.push([c, part, result, "PUSH", inddd, currentTokenSet]);
        }
        else if (c === ')') {
            part = part + st9;
            steps.push([c, part, result, "", inddd, currentTokenSet]);
            
            while (st.length > 0 && st[st.length - 1] !== '(') {
                part = `POP TOP OF STACK  " ${st[st.length-1]} " `;
                steps.push([st[st.length-1], part, result+st[st.length-1], "POP", inddd, currentTokenSet]);
                result += st.pop();
            }
            st.pop();
            steps.push([c, `POP "(" from the stack!`, result, "POP", inddd, currentTokenSet]);
        }
        else {
            if (st.length == 0) {
                part = part + "\n" + `PUSH the current operator into the stack as the stack is empty`;
            }
            else {
                steps.push(["", part, result, "", inddd, currentTokenSet]);
                while (st.length > 0 && prec(c) <= prec(st[st.length - 1])) {
                    part = `The precedence of current operator " ${c} " is less than or equal to TOP OF STACK " ${st[st.length-1]} "\nSo POP TOP OF STACK`;
                    result += st.pop();
                    steps.push([result[result.length-1], part, result, "POP", inddd, currentTokenSet]);
                }
                if (st.length === 0) {
                    part = `The stack is empty. So PUSH current operator " ${c} " into the stack.`;
                }
                else {
                    part = `The precedence of the current operator " ${c} " is higher than the precedence of the operator on top of the stack " ${st[st.length - 1]} "\n So PUSH " ${c} " onto the stack.`;
                }
            }
            st.push(c);
            steps.push([c, part, result, "PUSH", inddd, currentTokenSet]);
        }
    }
    
    part = st11;
    steps.push(["", part, result, "", inddd, currentTokenSet]);
    
    while (st.length > 0) {
        steps.push([st[st.length-1], part, result+st[st.length-1], "POP", inddd, currentTokenSet]);
        result += st.pop();
    }

    if (toType === "prefix") {
        part = `Reverse the output Expression`;
        steps.push(["", part, result.split("").reverse().join(""), "", inddd, currentTokenSet]);
        return result.split("").reverse().join("");
    }
    
    steps.push(["", `The FINAL ${toType} expression is ${result}`, result, "", inddd, currentTokenSet]);
    return result;
}

function getInfix(tokens, fromType) {
    createTokenVisualization(tokens, currentTokenSet);
    tokenSets[currentTokenSet] = tokens;
    
    s = [];
    let part = "";
    
    if (fromType === "prefix") {
        steps.push(["", p1, "", "", inddd, currentTokenSet]);
        tokens = tokens.reverse();
        part = `The reversed expression is : ${tokens.join("")}`;
        steps.push(["", part, "", "", inddd, currentTokenSet]);
        currentTokenSet++;
        tokenSets[currentTokenSet] = tokens;
        createTokenVisualization(tokens, currentTokenSet);
    }
    
    for (let i = 0; i < tokens.length; i++) {
        let c = tokens[i];
        inddd++;
        part = p2 + `"${c}"` + "\n";
        
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
            s.push(c);
            part = part + p3;
            steps.push([c, part, "", "PUSH", inddd, currentTokenSet]);
        }
        else {
            part = part + p4 + "\n";
            steps.push([c, part, "", "", inddd, currentTokenSet]);
            
            if (s.length < 2) {
                return `Invalid ${fromType} expression`;
            }
            
            let op1 = s.pop();
            let op2 = s.pop();

            if (fromType === "prefix") {
                let sub = op1;
                steps.push([op1, part, sub, "POP", inddd, currentTokenSet]);

                sub = op1 + "   " + op2;
                steps.push([op2, part, sub, "POP", inddd, currentTokenSet]);

                sub = op1 + c + op2;
                steps.push(["", part, sub, "", inddd, currentTokenSet]);

                s.push(`(${op1}${c}${op2})`);
                part = `PUSH " ${sub} " onto the STACK`;
                steps.push([sub, part, sub, "PUSH", inddd, currentTokenSet]);
            } else {
                let sub = op1;
                steps.push([op1, part, sub, "POP", inddd, currentTokenSet]);

                sub = op2 + "   " + op1;
                steps.push([op2, part, sub, "POP", inddd, currentTokenSet]);

                sub = op2 + c + op1;
                steps.push(["", part, sub, "", inddd, currentTokenSet]);

                s.push(`(${op2}${c}${op1})`);
                part = `PUSH " ${sub} " onto the STACK`;
                steps.push([sub, part, sub, "PUSH", inddd, currentTokenSet]);
            }
        }
    }
    
    return s.length === 1 ? s[0] : "Invalid expression";
}

// Stack visualization functions
function pushToStack(stack, value) {
    let newElement = document.createElement("div");
    newElement.classList.add("stack-item");
    newElement.textContent = value;
    newElement.style.transform = "translateY(-75px)";
    stack.appendChild(newElement);
    stack.style.height = `${stack.children.length * 50 + 20}px`;
    setTimeout(() => {
        newElement.style.transform = "translateY(0)";
    }, 50);
}

function popFromStack(stack) {
    if (stack.children.length > -1) {
        let element = stack.lastElementChild;
        element.style.transform = "translateY(-75px)";
        setTimeout(() => {
            stack.removeChild(element);
            stack.style.height = `${stack.children.length * 50 + 20}px`;
        }, 200);
    }
}

function performOperation(ind, flag) {
    let operation = steps[ind];
    let des = operation[1];
    let out = operation[2];
    let char = operation[0];
    let action = operation[3];
    let index = operation[4];
    let tokenSetIndex = operation[5];
    
    if (tokenSets[tokenSetIndex] && currentTokenSet !== tokenSetIndex) {
        createTokenVisualization(tokenSets[tokenSetIndex], tokenSetIndex);
    }
    
    highlightCurrentToken(index);
    
    if(flag === 0){
        ind++;
        operation = steps[ind];
        char = operation[0];
        action = operation[3];
    }

    let resultText = out;
    let explanationText = des;
    
    if (flag === 1) {
        if (action === "PUSH") {
            pushToStack(document.getElementById("stack"), char);
        } else if (action === "POP") {
            popFromStack(document.getElementById("stack"));
        }
    } else {
        if (action === "PUSH") {
            popFromStack(document.getElementById("stack"));
        } else if (action === "POP") {
            pushToStack(document.getElementById("stack"), char);
        }
    }

    document.getElementById("step-description").innerText = explanationText;
    document.getElementById("output").innerText = resultText;
}

function previousStep() {
    if (currentStep > 0 && !isProcessing) {
        isProcessing = true;
        currentStep--;
        performOperation(currentStep, 0);
        disableButtons();
        setTimeout(() => {
            isProcessing = false;
            enableButtons();
            if (currentStep <= 0) {
                document.getElementById("prevBtn").disabled = true;
            }
            document.getElementById("nextBtn").disabled = false;
        }, 500);
    }
}

function nextStep() {
    if (hide_flag === 0){
        document.getElementById("element-container").style.visibility = "visible";
        hide_flag = 1;
    }
    
    if (currentStep < steps.length - 1 && !isProcessing) {
        isProcessing = true;
        currentStep++;
        performOperation(currentStep, 1);
        disableButtons();
        setTimeout(() => {
            isProcessing = false;
            enableButtons();
            if (currentStep >= steps.length - 1) {
                document.getElementById("nextBtn").disabled = true;
            }
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

// Event Listeners
document.querySelector('.start-button').addEventListener('click', () => {
    document.getElementById("step-description").innerText = "";
    document.getElementById("output").innerText = "";
    document.getElementById("element-container").style.visibility = "hidden";
    hide_flag = 0;

    // Disable both buttons initially
    document.getElementById("nextBtn").disabled = true;
    document.getElementById("prevBtn").disabled = true;

    tokenElements = [];
    currentTokenIndex = -1;
    currentTokenSet = 0;
    tokenSets = [];
    inddd = -1;
    steps = [];
    currentStep = -1;
    isProcessing = false; 

    document.getElementById("stack").innerHTML = "";
    let expression = document.getElementById('expression').value;
    const fromType = document.getElementById('from').value;
    const toType = document.getElementById('to').value;
    
    expression = expression.replace(/\s+/g, "");

    const validationResult = isValidExpression(expression, fromType);
    if (validationResult === true) {
        // Disable buttons if from and to types are same
        if (fromType === toType) {
            alert("Cannot convert to the same expression type. Please select different types.");
            document.getElementById("nextBtn").disabled = true;
            document.getElementById("prevBtn").disabled = true;
            return;
        }
        
        let tokens = expression.split('');
        let output = "";
        
        // Store initial token set
        tokenSets[currentTokenSet] = tokens;
        
        if (fromType === "infix") {
            if (toType === "infix") {
                output = expression;
            }
            else {
                output = infixTo(tokens, toType);
            }
        }
        else if (toType === "infix") {
            output = getInfix(tokens, fromType);
        }
        else {
            part = `FIRST convert the expression into INFIX`;
            steps.push(["", part, "", "", inddd, currentTokenSet]);
           
            let preORpos_to_in = getInfix(tokens, fromType);
            inddd = -1;

            
            part = `We successfully converted the given ${fromType} into INFIX\n`;
            part = part + `Now convert the INFIX expression ${preORpos_to_in} into required ${toType}`;
            steps.push([s[s.length-1], part, preORpos_to_in, "POP", inddd, currentTokenSet]);

            tokens = preORpos_to_in.match(/[a-zA-Z]+|[+\-^*/()]/g);
            currentTokenSet++;
            tokenSets[currentTokenSet] = tokens;
            output = infixTo(tokens, toType);
        }   

        console.log(output);
        document.getElementById("step-description").innerText = "";
        document.getElementById("output").innerText = output;
        // Only enable next button if there are steps to go through
        document.getElementById("nextBtn").disabled = steps.length === 0;
        // Keep prev button disabled initially
        document.getElementById("prevBtn").disabled = true;
    } else {
        alert(validationResult);
    }    
});

// Initialize button states on page load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("nextBtn").disabled = true;
    document.getElementById("prevBtn").disabled = true;
});