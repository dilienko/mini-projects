//"database" of questions
let questions = [
    {
        text: "Що з переліченого є літальним апаратом?",
        answers: ['Альфаплан', 'Бетаплан', 'Гамаплан', 'Дельтаплан'],
        correctAnswer: 'Дельтаплан'
    },
    {
        text: "Бюджетну авіакомпанію також називають...",
        answers: ['Лоукост', 'Лоуфаст', 'Сейфкеш', 'Смолкост'],
        correctAnswer: 'Лоукост'
    },
    {
        text: "Головна й найбільша річка Єгипту це",
        answers: ['Дніпро', 'Амазонка', 'Ніл', 'Дніпро'],
        correctAnswer: 'Ніл'
    },
    {
        text: "Який основний компонент гуакамоле?",
        answers: ['Кокос', 'Авокадо', 'Томат', 'Огірок'],
        correctAnswer: 'Авокадо'
    },
    {
        text: "Як називається спортивне змагання між ковбоями?",
        answers: ['Конкур', 'Торада', 'Родео', 'Корида'],
        correctAnswer: 'Родео'
    },
    {
        text: "Як в давньогрецькій міфології звали богинь помсти",
        answers: ['Харити', 'Плеяди', 'Гіади', 'Еринії'],
        correctAnswer: 'Еринії'
    },
    {
        text: "Яка країна має найбільшу кількість часових поясів?",
        answers: ['Китай', 'Франція', 'США', 'Бразилія'],
        correctAnswer: 'Франція'
    },
    {
        text: "Який динозавр вмів літати?",
        answers: ['Птерозавр', 'Бронтозавтр', 'Стегозавр', 'Брахіозавр'],
        correctAnswer: 'Птерозавр'
    },
    {
        text: "Яка комаха порушила роботу раннього суперкомп'ютера і зумовила появу терміну 'комп'ютерний баг'?",
        answers: ['Муха', 'Тарган', 'Міль', 'Сонечко'],
        correctAnswer: 'Міль'
    },
    {
        text: "Скільки мільйонів кілометрів приблизно складає відстань від Землі до Сонця?",
        answers: ['570', '1093', '89', '150'],
        correctAnswer: '150'
    },
    {
        text: "Яскравим представником раціоналістичної школи філософського мислення є",
        answers: ['Бекон', 'Авенаріус', 'Ніцше', 'Декарт'],
        correctAnswer: 'Декарт'
    },
    {
        text: "Веном та інші симбіонти з коміксів Marvel родом з планети",
        answers: ['Клінтар', 'Асгард', 'Титан', 'Мораг'],
        correctAnswer: 'Клінтар'
    },
    {
        text: "Який французький король був одружений на доньці Ярослава Мудрого?",
        answers: ['Філіп I', 'Роберт II', 'Генріх I', 'Людовік IV'],
        correctAnswer: 'Генріх I'
    },
    {
        text: "Як називається удар в гольфі, коли м'яч летить правіше цілі",
        answers: ['Патт', 'Пуш', 'Пул', 'Пітч'],
        correctAnswer: 'Пуш'
    },
    {
        text: "Яка одиниця виміру названа на честь італійського дворянина",
        answers: ['Паскаль', 'Ом', 'Вольт', 'Герц'],
        correctAnswer: 'Вольт'
    },
]

//Initialization of the main elements of the page
const questionField = document.querySelector('.millionaire__question-text')
const answersField = document.querySelector('.millionaire__answers')
const answerButton = document.querySelectorAll('.millionaire__answer-text')

const timer = document.querySelector('.millionaire__timer')
const gains = document.querySelectorAll('.millionaire__sum')
const gainsMobile = document.querySelector('.millionaire-prize-mobile')

const hints = document.querySelector('.millionaire__hints')
const hintsMobile = document.querySelector('.millionaire__hints-mobile')
const fiftyFifty = document.querySelectorAll('.fifty-fifty')
const friendHelp = document.querySelectorAll('.friend-help')

const closeModalBtn = document.querySelector('#start-modal-btn')
const intermModal = document.querySelector('#after-round-modal')
const intermModalText = intermModal.querySelector('.modal-main')
const intermModalBtns = intermModal.querySelector('.modal-footer')
const finishModal = document.querySelector('#finish-modal')
const finishModalText = finishModal.querySelector('.modal-main')
const finishModalBtn = finishModal.querySelector('.button-cancel')

//Add all event listeners
hints.addEventListener('click', hintsPressed)
hintsMobile.addEventListener('click', hintsPressed)
answersField.addEventListener('click', checkAnswer)
closeModalBtn.addEventListener('click', () => {
    document.querySelector('#start-modal').style.display = 'none'
    startNewRound()
})
intermModalBtns.addEventListener('click', processIntermModal)
finishModalBtn.addEventListener('click', processFinishModal)

let totalGain = 0;
let round = 0;
let friendAnswer;
let timerid;

//Launches a new round of games
function startNewRound(){
    showQuestion()
    showAnswers()
    startRound()
}

//Displays the question on the page
function showQuestion(){
    questionField.innerHTML = questions[round].text
}

//Displays the question on the page
function showAnswers(){
    for (let i = 0;  i < answerButton.length;  i++) {
        answerButton[i].innerHTML = questions[round].answers[i]  
    }
}

//Handles usage of hints
function hintsPressed(event){
    if(!timerid) return
    if(event.target.classList.contains('fifty-fifty')){
        useFiftyFifty()
    }else if(event.target.classList.contains('friend-help')){
        useFriendHelp()
    }
}

//Handles using 50/50 hint
function useFiftyFifty(){
    let correctAnswer = questions[round].correctAnswer
    let allAnswers = questions[round].answers.filter(item => item != correctAnswer)
    let randomAnswer = allAnswers[getRandomNumber(0, 2)]
    
    for (let i = 0;  i < answerButton.length;  i++) {
        let currenAnswer = answerButton[i].innerHTML
        if(currenAnswer != correctAnswer && currenAnswer != randomAnswer){
            answerButton[i].innerHTML = ''
        }  
    }
    for(let item of fiftyFifty) item.style.display = 'none'
}

//Handles using 'Friend Help' hint
function useFriendHelp(){
    //user can use hint after 50/50. Thats why we need to check which answer on screen
    let answerOnScreen = [];
    for (let i = 0;  i < answerButton.length;  i++) {
        let currenAnswer = answerButton[i].innerHTML
        if(currenAnswer != '') answerOnScreen.push(currenAnswer)  
    }
    let randomAnswer = answerOnScreen[getRandomNumber(0, answerOnScreen.length - 1)]
    for(let answer of answerButton) {
        if(answer.innerHTML == randomAnswer){
           answer.style.color = 'magenta' 
           friendAnswer = answer
        } 
    }
    for(let item of friendHelp) item.style.display = 'none'
}

//Get random number
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//Initializes the timer at the start of the round
function startRound(){
    let seconds = 60
    timer.innerHTML = seconds
    timerid = setInterval(() => {
        seconds--
        timer.innerHTML = seconds
        if(seconds == 0){
            countGain('timeout')
            showFinishModal('timeout')
            timerid = clearInterval(timerid)  
        } 
    }, 1000)
}

//Checks the answer and stops the timer
function checkAnswer(event){
    let currentClick = event.target
    if(!currentClick.classList.contains('millionaire__answer-text') || !timerid) return
    let answer = currentClick.innerHTML
    timerid = clearInterval(timerid)
    //Removes "Friend help" hint highlighting if it has been used
    if(friendAnswer){
        friendAnswer.style.color = ''
        friendAnswer = null
    }
    currentClick.style.color = 'orange'
    if(answer == questions[round].correctAnswer){
        processAnswer(currentClick, 'green', 1200, showModal)
    }else{
        processAnswer(currentClick, 'red', 1200, showFinishModal)
    } 
}

//Chooses further actions depending on the correctness of the answer
async function processAnswer(elem, color, time, response){
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            elem.style.color = color
            countGain(color)
            setTimeout(resolve, 1500)
        }, time)
    })
    elem.style.color = ''
    round++
    if(color == 'red') elem = 'mistake'
    response(elem)
}

//Count user`s gain
function countGain(color){
    if(color == 'green'){
        totalGain = gains[round].innerHTML.slice(1)
        showGain()
    }else{
        totalGain = 0
        if(round > 4 && round <= 9) totalGain = 1000
        if(round > 9) totalGain = 32000
        hideGain()
    }
}

//Displays gain on the screen
function showGain(){
    gains[round].style.backgroundColor = '#b66e11'
    gainsMobile.innerHTML = "$" + totalGain
    if(round != 0) gains[round-1].style.backgroundColor = ''
}

//Hides gain from the screen
function hideGain(){
    if(round != 0) gains[round-1].style.backgroundColor = ''
    gainsMobile.innerHTML = "$" + totalGain
    if(totalGain == 1000) gains[4].style.backgroundColor = '#b66e11'
    if(totalGain == 32000) gains[9].style.backgroundColor = '#b66e11'
}

//Show intermediate modal
function showModal(){
    if(round < 15){
        intermModalText.innerHTML = `Ви обрали правильну відповідь і виграли $${totalGain}. Ви можете забрати ваш виграш і завершити гру або продовжити грати та позмагатися за суму ${gains[round].innerHTML}`
        intermModal.style.display = 'block'  
    }else{
        showFinishModal('win')
    }
    
}

//Handles clicks on intermediate modals
function processIntermModal(event){
    let currentClick = event.target
    if(currentClick.classList.contains('button-accept')){
        intermModal.style.display = 'none'
        startNewRound()
    }else if(currentClick.classList.contains('button-cancel')){
        intermModal.style.display = 'none'
        showFinishModal('userDecision')
    }
}

//Shows the final modal
function showFinishModal(cause){
    if(cause == 'userDecision'){
        finishModalText.innerHTML = `Дякуємо за гру! Ваш виграш склав $${totalGain}`
    }else if(cause == 'mistake'){
        finishModalText.innerHTML = `На жаль, ви обрали неправильну відповідь. Ваш виграш склав $${totalGain}. Сподіваємося, наступного разу удача буде на вашому боці!`
    }else if(cause == 'win'){
        finishModalText.innerHTML = `Вітаємо&#127881; Ви стали переможцем гри "Хто хоче стати мільйонером?" та виграли $1000000. Дякуємо за гру!`
    }else if(cause == 'timeout'){
        finishModalText.innerHTML = `На жаль, час на відповідь вичерпався. Ваш виграш склав $${totalGain}. Сподіваємося, наступного разу удача буде на вашому боці!`
    }
    finishModal.style.display = 'block'
}

//Changes the display of the page after the game is over
function processFinishModal(){
    questionField.innerHTML = 'Чекаємо на ваше повернення!'
    hints.style.visibility = 'hidden'
    answersField.style.visibility = 'hidden'
    document.querySelector('.millionaire__center-line').style.visibility = 'hidden'
    document.querySelector('.millionaire__prize').style.visibility = 'hidden'
    finishModal.style.backgroundColor = 'rgba(0,0,0,0.95)'
    setTimeout(() => finishModal.style.display = 'none', 200)
}
