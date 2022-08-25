const questionText = document.querySelector(".question__text");
const answersContainer = document.querySelector(".question__answers");
const scoring = document.querySelector(".popup__score");
const startingScreen = document.querySelector(".game__start");
const questionScreen = document.querySelector(".question");
const popupWindow = document.querySelector(".popup");
const confirmButton = document.querySelector(".popup__confirm");
const declineButton = document.querySelector(".popup__decline");
const popAnswer = document.querySelector(".popup__answer");
const previousScore = document.querySelector(".game__previous");
const startBtn = document.querySelectorAll(".game__button");
const timerScore = document.querySelector(".question__timer");

let correct = "";
let score = 0;
let questionsCount = 0;
let currentCategory = "";

let timer = 30;
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


const updateDisplay = (scr, ques) => {
    scoring.innerText = `Your score is: ${scr} / ${ques}`
}

updateTimer = () => {
    timerScore.innerHTML = timer;
}

// get question from the API
const getQuestion = async () => {
    const response = await fetch(currentCategory);
    const data = await response.json();
    return data.results[0];
}

// update question
const updateQuestion = async () => {
    isAnswered = false;
    questionsCount += 1;
    timer = 30;
    updateTimer();
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

    
    setTimeout(() => {
        let intervalID = setInterval(() => {
          if (timer === 0) {
            isAnswered = true;
            popAnswer.textContent = `Correct answer: ${correct}`
            updateDisplay(score, questionsCount);
            popupWindow.classList.remove("hidden");
            clearInterval(intervalID);
          } else {
            timer -= 1;
            updateTimer();
            if (isAnswered) {
                clearInterval(intervalID);
            }
          }
        }, 1000);
      }, 0);
}

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
            popAnswer.textContent = `Correct answer: ${correct}`
        }
        updateDisplay(score, questionsCount);
        popupWindow.classList.remove("hidden");
        isAnswered = true;
    }
});


confirmButton.addEventListener("click", () => {
    popAnswer.textContent = "";
    popupWindow.classList.add("hidden");
    updateQuestion();
});

declineButton.addEventListener("click", () => {
    previousScore.textContent = `Your last score was: ${score} / ${questionsCount}`
    score = 0;
    questionsCount = 0;
    popAnswer.textContent = "";
    popupWindow.classList.add("hidden");
    questionScreen.classList.add("hidden");
    startingScreen.classList.remove("hidden");
})
