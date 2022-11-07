const fromNumber = document.querySelector('#from')
const toNumber = document.querySelector('#to')
const amountField = document.querySelector('#amount')
const checkbox = document.querySelector('#unique')
const button = document.querySelector('.randomizer__button')
const output = document.querySelector('.randomizer__output')

const fontSize = parseInt(getComputedStyle(output).fontSize)


button.addEventListener('click', getValues)

//Checks the correctness of data (from and to) input
function processInput(event){
    let userInput = event.target.value
    let isNegative = false

    userInput = userInput.split('').filter((item, index) => {
        if(item == '-' && index == 0){
            isNegative = true
            return true   
        }
        if(index == 1 && isNegative) return /[1-9]/.test(item)
        if(index == 0 && userInput.length > 1) return /[1-9]/.test(item)
        return /[0-9]/.test(item)
    }).join('')
    event.target.value = (userInput[0] == '-')? userInput.slice(0, 11) : userInput.slice(0, 10)
}

//Checks the correctness of data (amount) input (max amount - 100)
function processAmountInput(event){
    let userInput = event.target.value

    userInput = userInput.split('').filter((item, index) => {
        if(item == '0' && index == 0) return false
        return /[0-9]/.test(item)
    }).join('')
    event.target.value = (parseInt(userInput) > 100)? 100 : userInput 
}

//Getting data from the input, processing and normalizing it
function getValues(){
    let from = (fromNumber.value != '')? parseInt(fromNumber.value) : 0
    let to = (toNumber.value != '')? parseInt(toNumber.value) : 3
    //Replacing values if "from" is greater than "to" or values are equal
    if(from == to) to += 1
    if(from > to){
        let temp = from;
        from = to;
        to = temp;
    }

    toNumber.value = to
    fromNumber.value = from

    let amount = (amountField.value != '')? parseInt(amountField.value) : 1
    let result;
    //The number of unique numbers cannot exceed the result of subtracting 
    //"from" and "to" increased by 1
    if(checkbox.checked){
        let difference = to - from + 1
        amount = (amount > difference)? difference : amount
        amountField.value = amount
        result = calcUniqueRandomNum(from, to, amount)
    }else{
        amountField.value = amount
        result = calcRandomNum(from, to, amount)
    }

    showNumbers(result)
}

//Gets the given amount of random numbers
function calcRandomNum(from, to, amount){
    let randomNumbers = []
    for(let i = 0; i < amount; i++){
        randomNumbers[i] = getRandomNumber(from, to)
    }
    return randomNumbers
}

//Gets the given amount of unique random numbers
function calcUniqueRandomNum(from, to, amount){
    let randomSet = new Set()
    while(randomSet.size < amount){
        randomSet.add(getRandomNumber(from, to))
    }
    return Array.from(randomSet);
}

//Function for getting a random number
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Show random numbers
function showNumbers(arr){
    let numbersCount = arr.length
    let currentFontSize = fontSize - (fontSize * numbersCount * (0.0046 + (1/numbersCount/10)))
    output.style.fontSize = currentFontSize + 'px'
    output.innerHTML = arr.join(' ')
}