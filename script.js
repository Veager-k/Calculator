/*   
    remove dependency on innerText?
    auto close open brackets??
    trig function, rad and grad
    maybe dont round result? or make it optional
    error signs
*/

//functions for mathematical operations
function add(a, b){
    return parseFloat(a) + parseFloat(b);
}
function subtract(op1, op2){
    return op1 - op2;
}
function multiply(op1, op2){
    return op1 * op2;
}
function divide(op1, op2){
    return op1 / op2;
}
function factorial(op1){
    let result = 1;
    if(op1<0) console.log("negative factorial");
    while(op1>1){
        result *= op1;
        op1--;
    }
    return result;
}
function negation(op1){
    return -op1;
}


function backspace(){
    if(display.innerText.slice(-1)==="("){
        bracketPriority -= 5;
        display.innerText = display.innerText.slice(0, -1);
        return 0;
    }
    if(display.innerText.slice(-1)===")"){
        bracketPriority += 5;
        display.innerText = display.innerText.slice(0, -1);
        return 0;
    }
    if(display.innerText.slice(-1)===".") hasDot = false;
    if(isNaN(displayArray[displayIndex])){
        orderOfOperations.pop();
        prevWasOperator = false;
    }
    displayArray[displayIndex] = displayArray[displayIndex].slice(0, -1);
    if(displayArray[displayIndex]===""){
        displayArray.pop();
        displayIndex--;
        if(isNaN(displayArray[displayIndex])) prevWasOperator = true;
    }
    display.innerText = display.innerText.slice(0, -1);
}
function clear(){
    displayArray = [""];
    displayIndex = -1;
    orderOfOperations = [];
    prevWasOperator = true;
    hasDot = false;
    bracketPriority = 0;
    display.innerText = "";
}

const display = document.querySelector(".cal-display");
const buttons = document.querySelectorAll(".button");
buttons.forEach((button) => button.addEventListener("click", (e) => addInput(e)));

let displayArray = [""]; //array which tracks whole input
let displayIndex = -1;
let orderOfOperations = []; //array which tracks operators and later orders them based on priority

let bracketPriority = 0;
let hasDot = false;
let prevWasOperator = true;

function addInput(e){
    let operator = e.target.innerText;
    if(e.target.dataset.type === "num"){
        if(display.innerText.slice(-1)===")") document.getElementById("button*").click();
        if(isNaN(displayArray[displayIndex])){// checks if previous input was not a number
            displayIndex++;
            displayArray[displayIndex] = "";
            hasDot = false;
        }
        display.innerText += operator;
        displayArray[displayIndex] += operator;
        prevWasOperator = false;
    }

    else if(e.target.dataset.type === "operator"){ // operators which work with 2 operands
        if(prevWasOperator){
            if(operator==="-") operator = "n";
            else{
            console.log("Two operators in a row")
            return 0;
            }
        }
        if(displayArray[displayIndex]==="n"){
            console.log("two negations in a row")
            return 0;
        }

        display.innerText += e.target.innerText;
        displayIndex++;
        displayArray[displayIndex] = operator;

        let operatorPriority;
        switch(operator){
            case "+": operatorPriority= 1 + bracketPriority; break;
            case "-": operatorPriority= 1 + bracketPriority; break;
            case "*": operatorPriority= 2 + bracketPriority; break;
            case "/": operatorPriority= 2 + bracketPriority; break;
            case "n": operatorPriority= 3 + bracketPriority; break;
            case "!": operatorPriority= 5 + bracketPriority; break;
        }
        let operatorObject = {
            symbol: operator,
            index: displayIndex,
            priority: operatorPriority,
        }
        orderOfOperations.push(operatorObject);
        if(e.target.dataset.operators === "2") prevWasOperator = true;
        hasDot = false;
    }
    else if(operator === "("){
        if(!prevWasOperator) document.getElementById("button*").click(); 
        if(displayArray[displayIndex] === "-"){
            displayIndex++;
            displayArray[displayIndex] = "";
        }
        display.innerText += operator;
        bracketPriority += 5;
    }
    else if(operator === ")"){
        if(prevWasOperator) return 0;
        if(bracketPriority > 0){
            display.innerText += e.target.innerText;
            bracketPriority -= 5;
        }
    }
    else if(operator === "."){
        if(hasDot) return 0;
        if(prevWasOperator || display.innerText.slice(-1)) document.getElementById("button0").click();
        displayArray[displayIndex] += operator;
        display.innerText += operator;
        hasDot = true;
    }
    else if(operator === "backspace") backspace();
    else if(operator === "clear") clear();
    else if(operator === "=") calculate();

    console.log(displayArray);
    console.table(orderOfOperations);
}


function calculate(){
    if(prevWasOperator){
        console.log("Last input is an operator2");
        return 0;
    }
    if(bracketPriority !=0){
        console.log("Missing closing bracket");
        return 0;
    }
        orderOfOperations.sort((a, b) => b.priority-a.priority);
    let result;
    while(orderOfOperations.length>0){
        let indexAdjust = 0;
        switch(orderOfOperations[0].symbol){
            // does the maths and replaces the operators and operands with the result of the calcualtion
            case "+":{
                result = add(displayArray[orderOfOperations[0].index-1], displayArray[orderOfOperations[0].index+1]);
                displayArray.splice(orderOfOperations[0].index-1, 3, result.toString());
                indexAdjust = 2;
                break;
            }
            case "-":{ result = subtract(displayArray[orderOfOperations[0].index-1], displayArray[orderOfOperations[0].index+1]);
                displayArray.splice(orderOfOperations[0].index-1, 3, result.toString());
                indexAdjust = 2;
                break;
            }
            case "*":{ result = multiply(displayArray[orderOfOperations[0].index-1], displayArray[orderOfOperations[0].index+1]);
                displayArray.splice(orderOfOperations[0].index-1, 3, result.toString());
                indexAdjust = 2;
                break;
            }    
            case "/":{ result = divide(displayArray[orderOfOperations[0].index-1], displayArray[orderOfOperations[0].index+1]);
                displayArray.splice(orderOfOperations[0].index-1, 3, result.toString());
                indexAdjust = 2;
                break;
            }
            case "!":{ result = factorial(displayArray[orderOfOperations[0].index-1]);
                displayArray.splice(orderOfOperations[0].index-1, 2, result.toString());
                indexAdjust = 1;
                break;
            }
            case "n":{
                result = negation(displayArray[orderOfOperations[0].index+1]);
                displayArray.splice(orderOfOperations[0].index, 2, result.toString());
                indexAdjust = 1;
            }
            default: console.log("none of them?");
        }
        //the displayArray was shortened so this updates the indeces in orderOfOperations
        for(let i=1;i<orderOfOperations.length;i++){
            if(orderOfOperations[0].index<orderOfOperations[i].index) orderOfOperations[i].index-=indexAdjust; 
        }
        orderOfOperations.shift();
        console.log(displayArray);
        console.table(orderOfOperations);
    }
    //result = Math.round(result*1000)/1000;
    if(result%1 !== 0) hasDot = true;
    display.innerText = result;
    displayIndex = 0;
    prevWasOperator = false;
}
