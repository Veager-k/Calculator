/*
    input:
    input ends with operator
    operator1
*/

//functions for mathematical operations
function add(op1, op2){
    return op1 + op2;
}
function subtract(op1, op2){
    return op1 - op2;
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
        displayIndex++;
        displayArray[displayIndex] = ""; //prepares array element for next input

        orderOfOperations.push(e.target.innerText);
        prevWasOperator = true;
    }
    console.log(displayArray);
    console.log(orderOfOperations);
}