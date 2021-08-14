/*
    input:
    input ends with operator
    operator1
    operator as first input
    bracket between number and factorial function
*/

//functions for mathematical operations
function add(a, b){
    return parseInt(a) + parseInt(b);
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

const display = document.querySelector(".cal-display");
const buttons = document.querySelectorAll(".button");
buttons.forEach((button) => button.addEventListener("click", (e) => addInput(e)));

let displayArray = [""]; //array which tracks whole input
let displayIndex = 0;
let orderOfOperations = []; //array which tracks operators and later orders them based on priority

let prevWasOperator = false;
function addInput(e){
    // checks input type and adds to display
    if(e.target.dataset.type === "num"){
        display.innerText += e.target.innerText;
        displayArray[displayIndex] += e.target.innerText;
        prevWasOperator = false;
    }
    else if(e.target.dataset.type === "operator2"){
        if(prevWasOperator){
            console.log("Two operators in a row")
            return 0;
        }

        display.innerText += e.target.innerText;
        displayIndex++;
        displayArray[displayIndex] = e.target.innerText;

        let operatorPriority;
        switch(e.target.innerText){
            case "+": operatorPriority=1; break;
            case "-": operatorPriority=1; break;
            case "*": operatorPriority=2; break;
            case "/": operatorPriority=2; break;
        }
        let operatorObject = {
            symbol: e.target.innerText,
            index: displayIndex,
            priority: operatorPriority,
        }
        orderOfOperations.push(operatorObject);

        displayIndex++;
        displayArray[displayIndex] = ""; //prepares array element for next input
        prevWasOperator = true;
    }
    else if(e.target.innerText === "="){
        calculate();
    }
    console.log(displayArray);
    console.table(orderOfOperations);
}

function calculate(){
    orderOfOperations.sort((a, b) => b.priority-a.priority);
    let result;
    while(orderOfOperations.length>0){
        switch(orderOfOperations[0].symbol){
            // does the maths and replaces the operators and operands with the result of the calcualtion
            case "+":{
                result = add(displayArray[orderOfOperations[0].index-1], displayArray[orderOfOperations[0].index+1]);
                displayArray.splice(orderOfOperations[0].index-1, 3, result);
                break;
            }
            case "-":{ result = subtract(displayArray[orderOfOperations[0].index-1], displayArray[orderOfOperations[0].index+1]);
                displayArray.splice(orderOfOperations[0].index-1, 3, result);
                break;
            }
            case "*":{ result = multiply(displayArray[orderOfOperations[0].index-1], displayArray[orderOfOperations[0].index+1]);
                displayArray.splice(orderOfOperations[0].index-1, 3, result);
                break;
            }    
            case "/":{ result = divide(displayArray[orderOfOperations[0].index-1], displayArray[orderOfOperations[0].index+1]);
                displayArray.splice(orderOfOperations[0].index-1, 3, result);
                break;
            }       
            default: console.log("none of them?");
        }
        //the displayArray was shortened so this updates the indeces in orderOfOperations
        for(let i=1;i<orderOfOperations.length;i++){
            if(orderOfOperations[0].index<orderOfOperations[i].index) orderOfOperations[i].index-=2; 
        }
        orderOfOperations.shift();
    }
    display.innerText = result;
}
