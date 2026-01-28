// DOM Elements, references to HTML elements
const startScreen = document.getElementById("start-screen")
const quizScreen = document.getElementById("quiz-screen")
const resultScreen = document.getElementById("result-screen")

const startButton = document.getElementById("start-btn")

const questionText = document.getElementById("question-text")
const answersContainer = document.getElementById("answers-container")

const currentQuestionSpan = document.getElementById("current-question")
const totalQuestionsSpan = document.getElementById("total-questions")

const scoreSpan = document.getElementById("score")
const finalScoreSpan = document.getElementById("final-score")
const maxScoreSpan = document.getElementById("max-score")

const resultMessage = document.getElementById("result-message")
const restartButton = document.getElementById("restart-btn")

const progressBar = document.getElementById("progress")
const answerImage = document.getElementById("answer-image")

const nextBtn = document.getElementById("next-btn")

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = array[i]
    array[i] = array[j]
    array[j] = tmp
  }
  return array
}

const quizQuestions = [
  {
    question: "What is the capital city of Australia?",
    correctImage: "images/img1.webp",
    answers: [
      { text: "Sydney", correct: false },
      { text: "Melbourne", correct: false },
      { text: "Canberra", correct: true },
      { text: "Perth", correct: false },
    ],
  },
  {
    question: "Which river is the longest in the world?",
    correctImage: "images/img2.webp",
    answers: [
      { text: "Amazon", correct: false },
      { text: "Yangtze", correct: false },
      { text: "Nile", correct: true },
      { text: "Mississippi", correct: false },
    ],
  },
  {
    question: "On which continent is Egypt located?",
    correctImage: "images/img3.webp",
    answers: [
      { text: "Asia", correct: false },
      { text: "Europe", correct: false },
      { text: "Africa", correct: true },
      { text: "South America", correct: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    correctImage: "images/img4.webp",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
      { text: "Arctic Ocean", correct: false },
    ],
  },
  {
    question: "Which country has the largest population in the world?",
    correctImage: "images/img5.webp",
    answers: [
      { text: "China", correct: false },
      { text: "USA", correct: false },
      { text: "India", correct: true },
      { text: "Russia", correct: false },
    ],
  },
  {
    question: "What mountain range separates Europe and Asia?",
    correctImage: "images/img6.webp",
    answers: [
      { text: "Alps", correct: false },
      { text: "Carpathians", correct: false },
      { text: "Ural Mountains", correct: true },
      { text: "Himalayas", correct: false },
    ],
  },
  {
    question: "What is the capital of Canada?",
    correctImage: "images/img7.webp",
    answers: [
      { text: "Toronto", correct: false },
      { text: "Vancouver", correct: false },
      { text: "Ottawa", correct: true },
      { text: "Montreal", correct: false },
    ],
  },
  {
    question: "Which desert is the largest hot desert in the world?",
    correctImage: "images/img8.webp",
    answers: [
      { text: "Gobi", correct: false },
      { text: "Kalahari", correct: false },
      { text: "Sahara Desert", correct: true },
      { text: "Atacama", correct: false },
    ],
  },
  {
    question: "Through which city does the River Thames flow?",
    correctImage: "images/img9.webp",
    answers: [
      { text: "Oxford", correct: false },
      { text: "Manchester", correct: false },
      { text: "London", correct: true },
      { text: "Bristol", correct: false },
    ],
  },
  {
    question: "What is the smallest country in the world by area?",
    correctImage: "images/img10.webp",
    answers: [
      { text: "Monaco", correct: false },
      { text: "San Marino", correct: false },
      { text: "Vatican City", correct: true },
      { text: "Liechtenstein", correct: false },
    ],
  },
  {
    question: "Which continent has the most countries?",
    correctImage: "images/img11.webp",
    answers: [
      { text: "Asia", correct: false },
      { text: "Europe", correct: false },
      { text: "Africa", correct: true },
      { text: "South America", correct: false },
    ],
  },
  {
    question: "What is the capital of Japan?",
    correctImage: "images/img12.webp",
    answers: [
      { text: "Kyoto", correct: false },
      { text: "Osaka", correct: false },
      { text: "Tokyo", correct: true },
      { text: "Hiroshima", correct: false },
    ],
  },
  {
    question: "Which sea lies between Europe and Africa?",
    correctImage: "images/img13.webp",
    answers: [
      { text: "Black Sea", correct: false },
      { text: "Red Sea", correct: false },
      { text: "Mediterranean Sea", correct: true },
      { text: "Baltic Sea", correct: false },
    ],
  },
  {
    question: "What country has the longest coastline in the world?",
    correctImage: "images/img14.webp",
    answers: [
      { text: "Russia", correct: false },
      { text: "Australia", correct: false },
      { text: "Canada", correct: true },
      { text: "USA", correct: false },
    ],
  },
  {
    question: "What is the highest mountain in the world?",
    correctImage: "images/img15.webp",
    answers: [
      { text: "K2", correct: false },
      { text: "Kangchenjunga", correct: false },
      { text: "Mount Everest", correct: true },
      { text: "Lhotse", correct: false },
    ],
  },
  {
    question: "Which country is known as the Land of a Thousand Lakes?",
    correctImage: "images/img16.webp",
    answers: [
      { text: "Norway", correct: false },
      { text: "Sweden", correct: false },
      { text: "Finland", correct: true },
      { text: "Canada", correct: false },
    ],
  },
  {
    question: "What is the capital city of Brazil?",
    correctImage: "images/img17.webp",
    answers: [
      { text: "Rio de Janeiro", correct: false },
      { text: "São Paulo", correct: false },
      { text: "Brasília", correct: true },
      { text: "Salvador", correct: false },
    ],
  },
  {
    question: "Which US state is the largest by area?",
    correctImage: "images/img18.webp",
    answers: [
      { text: "Texas", correct: false },
      { text: "California", correct: false },
      { text: "Alaska", correct: true },
      { text: "Montana", correct: false },
    ],
  },
  {
    question: "In which country would you find Machu Picchu?",
    correctImage: "images/img19.webp",
    answers: [
      { text: "Bolivia", correct: false },
      { text: "Chile", correct: false },
      { text: "Peru", correct: true },
      { text: "Ecuador", correct: false },
    ],
  },
  {
    question:
      "What is the name of the imaginary line that divides Earth into Northern and Southern Hemispheres?",
    correctImage: "images/img20.webp",
    answers: [
      { text: "Prime Meridian", correct: false },
      { text: "Tropic of Cancer", correct: false },
      { text: "Equator", correct: true },
      { text: "Arctic Circle", correct: false },
    ],
  },
  {
    question: "Which continent is the coldest on Earth?",
    correctImage: "images/img21.webp",
    answers: [
      { text: "Europe", correct: false },
      { text: "Asia", correct: false },
      { text: "Antarctica", correct: true },
      { text: "North America", correct: false },
    ],
  },
  {
    question: "What river flows through Paris?",
    correctImage: "images/img22.webp",
    answers: [
      { text: "Rhine", correct: false },
      { text: "Danube", correct: false },
      { text: "Seine", correct: true },
      { text: "Loire", correct: false },
    ],
  },
  {
    question: "Which country has coastline on both the Atlantic and Indian Oceans?",
    correctImage: "images/img23.webp",
    answers: [
      { text: "Mozambique", correct: false },
      { text: "Kenya", correct: false },
      { text: "South Africa", correct: true },
      { text: "Durban", correct: false },
    ],
  },
  {
    question: "Which country does Mount Fuji belong to?",
    correctImage: "images/img24.webp",
    answers: [
      { text: "China", correct: false },
      { text: "South Korea", correct: false },
      { text: "Japan", correct: true },
      { text: "Thailand", correct: false },
    ],
  },
  {
    question: "What is the largest island in the world?",
    correctImage: "images/img25.webp",
    answers: [
      { text: "Australia", correct: false },
      { text: "Borneo", correct: false },
      { text: "Greenland", correct: true },
      { text: "Madagascar", correct: false },
    ],
  },
  {
    question: "Which European country has the most volcanoes?",
    correctImage: "images/img26.webp",
    answers: [
      { text: "Italy", correct: false },
      { text: "Greece", correct: false },
      { text: "Iceland", correct: true },
      { text: "Spain", correct: false },
    ],
  },
  {
    question: "What is the capital of Norway?",
    correctImage: "images/img27.webp",
    answers: [
      { text: "Bergen", correct: false },
      { text: "Trondheim", correct: false },
      { text: "Oslo", correct: true },
      { text: "Stavanger", correct: false },
    ],
  },
  {
    question: "Which ocean lies on the east coast of the United States?",
    correctImage: "images/img28.webp",
    answers: [
      { text: "Pacific Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Atlantic Ocean", correct: true },
      { text: "Arctic Ocean", correct: false },
    ],
  },
  {
    question:
      "Which country is the largest island nation in the world (consisting of over 17,000 islands)?",
    correctImage: "images/img29.webp",
    answers: [
      { text: "Japan", correct: false },
      { text: "Madagascar", correct: false },
      { text: "Indonesia", correct: true },
      { text: "Kazakhstan", correct: false },
    ],
  },
  {
    question: "What is the capital city of Argentina?",
    correctImage: "images/img30.webp",
    answers: [
      { text: "Córdoba", correct: false },
      { text: "Rosario", correct: false },
      { text: "Buenos Aires", correct: true },
      { text: "Mendoza", correct: false },
    ],
  },
]

// QUIZ STATE VARS
let currentQuestionIndex = 0
let score = 0
let answersDisabled = false

totalQuestionsSpan.textContent = quizQuestions.length
maxScoreSpan.textContent = quizQuestions.length

startButton.addEventListener("click", startQuiz)
restartButton.addEventListener("click", restartQuiz)

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++

  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion()
  } else {
    showResults()
  }
})

function startQuiz() {
  currentQuestionIndex = 0
  score = 0
  scoreSpan.textContent = "0"

  startScreen.classList.remove("active")
  quizScreen.classList.add("active")

  showQuestion()
}

function resetAnswerUI() {
  answersDisabled = false
  answersContainer.classList.remove("answers-disabled")

  answerImage.style.display = "none"
  answerImage.src = ""

  nextBtn.disabled = true
}

function showQuestion() {
  resetAnswerUI()

  const currentQuestion = quizQuestions[currentQuestionIndex]

  currentQuestionSpan.textContent = String(currentQuestionIndex + 1)

  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100
  progressBar.style.width = progressPercent + "%"

  questionText.textContent = currentQuestion.question

  answersContainer.innerHTML = ""

  const shuffledAnswers = shuffleArray([...currentQuestion.answers])

  for (const answer of shuffledAnswers) {
    const button = document.createElement("button")
    button.type = "button"
    button.textContent = answer.text
    button.classList.add("answer-btn")
    button.dataset.correct = answer.correct ? "true" : "false"

    // pointerup is much more reliable than click on Android WebView
    button.addEventListener("pointerup", onAnswerTap, { passive: false })



    answersContainer.appendChild(button)
  }
}

function onAnswerTap(event) {
  // stop double fire from pointerup plus click


  if (answersDisabled) return

  const selectedButton = event.currentTarget
  if (!selectedButton || !selectedButton.classList.contains("answer-btn")) return

  answersDisabled = true
  answersContainer.classList.add("answers-disabled")
  nextBtn.disabled = false

  const isCorrect = selectedButton.dataset.correct === "true"

  // clear old classes just in case
  const buttons = Array.from(answersContainer.querySelectorAll(".answer-btn"))
  for (const btn of buttons) {
    btn.classList.remove("correct")
    btn.classList.remove("incorrect")
  }

  // paint result
  for (const btn of buttons) {
    if (btn.dataset.correct === "true") {
      btn.classList.add("correct")
    } else if (btn === selectedButton) {
      btn.classList.add("incorrect")
    }
  }

  // update score exactly once
  if (isCorrect) {
    score += 1
    scoreSpan.textContent = String(score)
  }

  // show image after UI paint, helps Android repaint timing
  const currentQuestion = quizQuestions[currentQuestionIndex]
  if (currentQuestion.correctImage) {
    answerImage.style.display = "block"

    // force a layout read, nudges some Android WebViews to repaint
    void answerImage.offsetHeight

    requestAnimationFrame(() => {
      answerImage.src = currentQuestion.correctImage
    })
  }
}

function showResults() {
  quizScreen.classList.remove("active")
  resultScreen.classList.add("active")

  finalScoreSpan.textContent = String(score)

  const percentage = (score / quizQuestions.length) * 100

  if (percentage === 100) {
    resultMessage.textContent = "Perfect! You're a genius!"
  } else if (percentage >= 80) {
    resultMessage.textContent = "Great job! You know your stuff!"
  } else if (percentage >= 60) {
    resultMessage.textContent = "Good effort! Keep learning!"
  } else if (percentage >= 40) {
    resultMessage.textContent = "Not bad! Try again to improve!"
  } else {
    resultMessage.textContent = "Keep studying! You'll get better!"
  }
}

function restartQuiz() {
  resultScreen.classList.remove("active")
  startQuiz()
}

window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  if (!splash) return;

  const MIN_MS = 1500;
  const FADE_MS = 400;

  setTimeout(() => {
    splash.classList.add("is-hiding");

    setTimeout(() => {
      splash.classList.add("is-hidden");
    }, FADE_MS);

  }, MIN_MS);
});

