const questionText = document.querySelector(".question__text h2");
const answersContainer = document.querySelector(".question__answers")
const scoring = document.querySelector(".score");
const startingScreen = document.querySelector(".start-game");
const questionScreen = document.querySelector(".question")
const popupWindow = document.querySelector(".popup")
const confirmButton = document.querySelector(".confirm");
const declineButton = document.querySelector(".decline");
const popAnswer = document.querySelector(".correct-answer")
const previousScore = document.querySelector(".previous")

let correct = "";
let score = 0;
let questionsCount = 0;

const updateDisplay = (scr, ques) => {
    scoring.innerText = `Your score is: ${scr} / ${ques}`
}

// get question from the API
const getQuestion = async () => {
    const response = await fetch("https://opentdb.com/api.php?amount=1");
    const data = await response.json();
    return data.results[0];
}

// update question
const updateQuestion = async () => {
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
}

const startBtn = document.querySelector("button");

startBtn.addEventListener("click", () => {
    startingScreen.classList.add("hidden");
    questionScreen.classList.remove("hidden")
    updateQuestion();
});

answersContainer.addEventListener("click", e => {
    if(e.target.innerText == correct) {
        e.target.classList.add("correct");
        score += 1;
    } else {
        console.log(e.target)
        e.target.classList.add("wrong");
        popAnswer.textContent = `Correct answer: ${correct}`
    }
    console.log(correct)
    updateDisplay(score, questionsCount);
    popupWindow.classList.remove("hidden");
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