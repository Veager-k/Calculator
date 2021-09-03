/*   
    auto close open brackets??
    error signs
    percentage?
*/
function sine(op1){
    if(!isRad) op1*=3.14159/180; 
    return Math.sin(op1);
}
function cosine(op1){
    if(!isRad) op1*=3.14159/180; 
    return Math.cos(op1);
}
function tangent(op1){
    if(!isRad) op1*=3.14159/180; 
    return Math.tan(op1);
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

function backspace(){
    if(display.innerText.slice(-1)==="("){
        bracketPriority -= 10;
        display.innerText = display.innerText.slice(0, -1);
        return 0;
    }
    if(display.innerText.slice(-1)===")"){
    bracketPriority += 10;
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
let isRad = true;

function addInput(e){
    let operator = e.target.value;
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
            else if(operator === "s" || operator === "c" || operator === "t"){
                if(displayArray[displayIndex] ==="s" || displayArray[displayIndex]==="c" || displayArray[displayIndex]==="t"){
                    console.log("Two operators in a row")
                    return 0;
                }
            }
            else{
                console.log("Two operators in a row")
                return 0;
            }
        }
        else if(operator ==="s" || operator ==="c" || operator ==="t") document.getElementById("button*").click();

        if(displayArray[displayIndex]==="n"){
            console.log("two negations in a row")
            return 0;
        }

        display.innerText += operator;
        displayIndex++;
        displayArray[displayIndex] = operator;

        let operatorPriority;
        switch(operator){
            case "+": operatorPriority= 1 + bracketPriority; break;
            case "-": operatorPriority= 1 + bracketPriority; break;
            case "*": operatorPriority= 2 + bracketPriority; break;
            case "/": operatorPriority= 2 + bracketPriority; break;
            case "n": operatorPriority= 3 + bracketPriority; break;
            case "^": operatorPriority= 4 + bracketPriority; break;
            case "√": operatorPriority= 4 + bracketPriority; break;
            case "s": operatorPriority= 5 + bracketPriority; break;
            case "c": operatorPriority= 5 + bracketPriority; break;
            case "t": operatorPriority= 5 + bracketPriority; break;
            case "!": operatorPriority= 6 + bracketPriority; break;
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
        bracketPriority += 10;
    }
    else if(operator === ")"){
        if(prevWasOperator) return 0;
        if(bracketPriority > 0){
            display.innerText += operator;
            bracketPriority -= 10;
        }
    }
    else if(operator === "."){
        if(hasDot) return 0;
        if(prevWasOperator || display.innerText.slice(-1) === ")") document.getElementById("button0").click();
        displayArray[displayIndex] += operator;
        display.innerText += operator;
        hasDot = true;
    }
    else if(operator === "x^2"){
        if(prevWasOperator) return 0;
        document.getElementById("button^").click();
        document.getElementById("button2").click();
    }
    else if(operator === "2√x"){
        if(!prevWasOperator) return 0;
        document.getElementById("button2").click();
        document.getElementById("button√").click();
    }
    else if(operator === "Deg/Rad"){
        if(isRad){
            isRad = false;
            console.log("set to degrees");
            e.target.classList.add("degButton");
        }
        else{
            isRad = true;
            console.log("set to radians");
            e.target.classList.remove("degButton");
        }
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
            case "+":{
                result = parseFloat(displayArray[orderOfOperations[0].index-1]) + parseFloat(displayArray[orderOfOperations[0].index+1]);
                displayArray.splice(orderOfOperations[0].index-1, 3, result.toString());
                indexAdjust = 2;
                break;
            }
            case "-":{
                result = displayArray[orderOfOperations[0].index-1] - displayArray[orderOfOperations[0].index+1];
                displayArray.splice(orderOfOperations[0].index-1, 3, result.toString());
                indexAdjust = 2;
                break;
            }
            case "*":{
                result = displayArray[orderOfOperations[0].index-1] * displayArray[orderOfOperations[0].index+1];
                displayArray.splice(orderOfOperations[0].index-1, 3, result.toString());
                indexAdjust = 2;
                break;
            }    
            case "/":{
                result = displayArray[orderOfOperations[0].index-1] / displayArray[orderOfOperations[0].index+1];
                displayArray.splice(orderOfOperations[0].index-1, 3, result.toString());
                indexAdjust = 2;
                break;
            }
            case "!":{
                result = factorial(displayArray[orderOfOperations[0].index-1]);
                displayArray.splice(orderOfOperations[0].index-1, 2, result.toString());
                indexAdjust = 1;
                break;
            }
            case "n":{
                result = -displayArray[orderOfOperations[0].index+1];
                displayArray.splice(orderOfOperations[0].index, 2, result.toString());
                indexAdjust = 1;
                break;
            }
            case "s":{
                result = sine(displayArray[orderOfOperations[0].index+1]);
                displayArray.splice(orderOfOperations[0].index, 2, result.toString());
                indexAdjust = 1;
                break;
            }
            case "c":{
                result = cosine(displayArray[orderOfOperations[0].index+1]);
                displayArray.splice(orderOfOperations[0].index, 2, result.toString());
                indexAdjust = 1;
                break;
            }
            case "t":{
                result = tangent(displayArray[orderOfOperations[0].index+1]);
                displayArray.splice(orderOfOperations[0].index, 2, result.toString());
                indexAdjust = 1;
                break;
            }
            case "^":{
                result = displayArray[orderOfOperations[0].index-1]**displayArray[orderOfOperations[0].index+1];
                displayArray.splice(orderOfOperations[0].index-1, 3, result.toString());
                indexAdjust = 2;
                break;
            }
            case "√":{
                result = displayArray[orderOfOperations[0].index+1]**(1/displayArray[orderOfOperations[0].index-1]);
                displayArray.splice(orderOfOperations[0].index-1, 3, result.toString());
                indexAdjust = 2;
                break;
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
