// starting screen
const startingScreen = document.querySelector(".game__start");
const startBtn = document.querySelectorAll(".game__button");
const previousScore = document.querySelector(".game__previous");

// question screen
const questionScreen = document.querySelector(".question");
const questionText = document.querySelector(".question__text");
const answersContainer = document.querySelector(".question__answers");
const timerScore = document.querySelector(".question__timer");
const scoreOnScreen = document.querySelector(".question__score");

// popup 
const popupWindow = document.querySelector(".popup");
const popAnswer = document.querySelector(".popup__answer");
const popupScore = document.querySelector(".popup__score");
const confirmButton = document.querySelector(".popup__confirm");
const declineButton = document.querySelector(".popup__decline");


let correct = "";
let score = 0;
let questionsCount = 0;
let currentCategory = "";

let timer = 0;
let isAnswered = false;

const general = "https://opentdb.com/api.php?amount=1&category=9";
const sports = "https://opentdb.com/api.php?amount=1&category=21";
const games = "https://opentdb.com/api.php?amount=1&category=15";
const music = "https://opentdb.com/api.php?amount=1&category=12";
const films = "https://opentdb.com/api.php?amount=1&category=11";
const everything = "https://opentdb.com/api.php?amount=1";

const categoryChoice = (category) => {
    switch (category) {
        case "general":
            currentCategory = general;
            break;
        case "sports":
            currentCategory = sports;
            break;
        case "games":
            currentCategory = games;
            break;
        case "music":
            currentCategory = music;
            break;
        case "films":
            currentCategory = films;
            break;
        case "everything":
            currentCategory = everything;
            break;
    }
}

const updateTimer = () => {
    timerScore.innerHTML = timer;
}

const displayPopup = () => {
    isAnswered = true;
    popAnswer.textContent = `Correct answer: ${correct}`
    popupScore.innerText = `Your score is: ${score} / ${questionsCount}`
    popupWindow.classList.remove("hidden");
}

const setTimer = () => {
    timer = 15;
    timerScore.removeAttribute("style", "color: red");
    updateTimer();
    let intervalID = setInterval(() => {
        if (timer === 0 || isAnswered) {
            displayPopup();
            clearInterval(intervalID);
        } else {
            if (timer <=6) {
                timerScore.setAttribute("style", "color: red");
            }
            timer -= 1;
            updateTimer();
        }
    }, 1000);
}

// get question from the API
const getQuestion = async () => {
    const response = await fetch(currentCategory);
    const data = await response.json();
    return data.results[0];
}

const updateQuestion = async () => {
    scoreOnScreen.innerText = `${score} / ${questionsCount}`;
    isAnswered = false;
    questionsCount += 1;

    answersContainer.innerHTML = ""
    const data = await getQuestion();
    questionText.innerHTML = data.question;

    correct = data.correct_answer;
    const answers = data.incorrect_answers;
    answers.push(correct);
    answers.sort();

    answers.forEach(answer => {
        answersContainer.innerHTML += `
        <button class="question__answer">${answer}</button>`
    });

    setTimer();
}


// event listeners
startBtn.forEach(btn => {
    btn.addEventListener("click", e => {
        startingScreen.classList.add("hidden");
        questionScreen.classList.remove("hidden")
        categoryChoice(e.target.value);
        updateQuestion();
    });
})

answersContainer.addEventListener("click", e => {
    if(e.target.tagName == "BUTTON" && !isAnswered) {
        if(e.target.innerText == correct) {
            e.target.classList.add("correct");
            score += 1;
        } else{
            e.target.classList.add("wrong");
        }
        displayPopup();
    }
});


confirmButton.addEventListener("click", () => {
    popupWindow.classList.add("hidden");
    updateQuestion();
});

declineButton.addEventListener("click", () => {
    previousScore.textContent = `Your last score was: ${score} / ${questionsCount}`
    score = 0;
    questionsCount = 0;
    popupWindow.classList.add("hidden");
    questionScreen.classList.add("hidden");
    startingScreen.classList.remove("hidden");
})
