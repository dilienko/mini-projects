
const screen = document.querySelector('.calculator__output')
const buttons = document.querySelector('.calculator__buttons')

//operator symbols
let [addiction, subtraction, multiplication, division] = String.fromCodePoint(43, 45, 215, 247).split('');

let currentUserInput = []
let totalUserInput = []
let operatorPrevious = false
let singChanged = false
let equalPrevious = false
let numberAmount = 0;

buttons.addEventListener('click', processClick)


//Selects an action depending on the pressed button
function processClick (event) {
    let currentButton = event.target
    let buttonType = currentButton.classList[1];

    switch(buttonType){
        case 'button_operator':
            operatorPressed(currentButton)
            break
        
        case 'button_equal':
            equalPressed()
            break
        
        case 'button_number':
            numberPressed(currentButton)
            break
        
        case 'button_point':
            if(equalPrevious) addToCurrentList()
            let point = (currentUserInput.length != 0) ? '.' : ['0', '.']
            if(!currentUserInput.includes('.')) currentUserInput.push(...point)
            break
        case 'button_del-all':
            if(equalPrevious) equalPrevious = false
            currentUserInput = []
            totalUserInput = []
            break
        case 'button_del':
            if(equalPrevious) addToCurrentList() 
            currentUserInput.pop()
            break
        
        case 'button_sign':
            singChanged = true
            if(equalPrevious) addToCurrentList()
            if(!operatorPrevious) signPressed()
            break
    }

    updateScreen(buttonType)
    //Counting digits in a number (limit - 10 digits)
    numberAmount = currentUserInput.filter(item => !isNaN(parseInt(item))).length
}

//Show output on screen
function updateScreen(button){
    if(button == 'button_equal'){
        if(!isNaN(totalUserInput)){
            screen.textContent = totalUserInput[0]  
        }else{
            screen.textContent ='ERROR'
            totalUserInput = []
            currentUserInput = []
            equalPrevious = false
        }
        
    }else{
        screen.textContent = currentUserInput.join('')
    }
}

//Clears the previous result if the user after = enter numbers
function clearData(){
    totalUserInput = []
    equalPrevious = false
}

//Adds the previous result to the current input if the user after = enters +,-,*,/,% or .
function addToCurrentList(){
    currentUserInput = String(totalUserInput[0]).split('')
    totalUserInput = []
    equalPrevious = false
}

//Handles pressing a number
function numberPressed(currentButton){
    if(operatorPrevious){
        currentUserInput = []
        operatorPrevious = false
    }
    if(equalPrevious) clearData() 
    if(singChanged) signPressed()
    //limit of digits is 10
    if(numberAmount >= 10) return
    currentUserInput.push(currentButton.innerHTML)
    //Trims unnecessary leading zeros
    if(currentUserInput[0] == '0' && currentUserInput[1] != '.' &&
    currentUserInput.length >= 2) currentUserInput.shift()
}

//Handles pressing a operator
function operatorPressed(button){
    if(equalPrevious){
        addToCurrentList()
    }
    //check for empty value
    isEmpty = currentUserInput.length == 0 
    || (currentUserInput.length == 1 && currentUserInput[0] == subtraction)
    if(operatorPrevious){
        if(totalUserInput[totalUserInput.length -1] == '%' ) {
            totalUserInput.push(button.innerHTML)
        }else{
            totalUserInput[totalUserInput.length - 1] = button.innerHTML
        }
    } else if(isEmpty){
        if(totalUserInput.length == 0) return
    }else {
        totalUserInput.push(currentUserInput.join(''))
        totalUserInput.push(button.innerHTML)
    }
    operatorPrevious = true
}


//Hadling the pressed key to change the sign
function signPressed(){
    if(currentUserInput[0] != subtraction) currentUserInput.unshift(subtraction)
    else currentUserInput = currentUserInput.slice(1)
    singChanged = false
}



//Hadling the pressed equal key
function equalPressed(){
    if(!operatorPrevious){
       let lastInput = currentUserInput.join('')
        if (!isNaN(parseFloat(lastInput))) {
            totalUserInput.push(lastInput)
        } 
    }
    currentUserInput = []
    equalPrevious = true
    calculate(totalUserInput)
}


// The main function for calculating the entered expression
function calculate(arr){
    normalizeData(arr)
    let operatorCounter = arr.filter(item => isNaN(parseInt(item))).length
    for(let i = 0; i < operatorCounter; i++){
        if(arr.includes(multiplication)){
            multiply(arr)
        }else if(arr.includes(division)){
            divide(arr)
        }else if(arr.includes(addiction)){
            add(arr)
        }else if(arr.includes(subtraction)){
            subtract(arr)
        }
    }
    normalizeResult(arr)
    
}

//Converts the result to exponential form if the number of digits is greater than 10
function normalizeResult(arr){
    let result = String(arr[0])
    let length = result.length
    if(result[0] == '-') length -= 1
    if(length < 10) return
    arr[0] = Number(arr[0]).toExponential(5)
}

//Subtracts one number from another
function subtract(arr){
    let index = arr.indexOf(subtraction)
    let firstNum = Number(arr[index-1])
    let elem = arr[index+1]
    //checking for the presence of a percent sign in a number
    let secondNum =  Number(elem) 
    || firstNum * Number(elem.slice(0, elem.length-1))/100
    let result = parseFloat((firstNum - secondNum).toFixed(5))
    arr.splice(index - 1, 3, result)
}

//Adds one number to another
function add(arr){
    let index = arr.indexOf(addiction)
    let firstNum = Number(arr[index-1])
    let elem = arr[index+1]
    //checking for the presence of a percent sign in a number
    let secondNum =  Number(elem) 
    || firstNum * Number(elem.slice(0, elem.length-1))/100
    let result = parseFloat((firstNum + secondNum).toFixed(5))
    arr.splice(index - 1, 3, result)
}

//Divide one number by another 
function divide(arr){
    let index = arr.indexOf(division)
    let firstNum = Number(arr[index-1])
    let elem = arr[index+1]
    //checking for the presence of a percent sign in a number
    let secondNum =  Number(elem) || Number(elem.slice(0, elem.length-1))/100
    if(secondNum == 0) secondNum = 'error'
    let result = parseFloat((firstNum / secondNum).toFixed(5))
    if(secondNum == 'error') {
        arr = [NaN]
        return
    }
    arr.splice(index - 1, 3, result)
}


//Multiplies one number by another 
function multiply(arr){
    let index = arr.indexOf(multiplication)
    let firstNum = Number(arr[index-1])
    let elem = arr[index+1]
    //checking for the presence of a percent sign in a number
    let secondNum =  Number(elem) || Number(elem.slice(0, elem.length-1))/100
    let result = parseFloat((firstNum * secondNum).toFixed(5))
    arr.splice(index - 1, 3, result)
}


/*
    Removes unnecessary operators at the ends of the array.
    Adds a percent sign to the number 
*/
function normalizeData(arr){
    let operators = [addiction, subtraction, multiplication, division]
    if(operators.includes((arr[0]))) arr.shift()
    if(operators.includes(arr[arr.length - 1])) arr.pop()

    while(arr.indexOf('%') != -1){
        let index = arr.indexOf('%')
        arr[index-1] += '%'
        arr.splice(index, 1)
    }
    if(String(arr[0]).includes('%')) arr[0] = parseFloat(arr[0])/100
}
