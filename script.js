// DOM Elements – references to HTML elements

const startScreen =
  document.getElementById("start-screen"); /* start screen container */
const quizScreen =
  document.getElementById("quiz-screen"); /* quiz screen container */
const resultScreen =
  document.getElementById("result-screen"); /* result screen container */

const startButton =
  document.getElementById("start-btn"); /* start quiz button */

const questionText =
  document.getElementById(
    "question-text",
  ); /* element showing the question text */
const answersContainer =
  document.getElementById(
    "answers-container",
  ); /* container for answer buttons */

const currentQuestionSpan =
  document.getElementById("current-question"); /* current question number */
const totalQuestionsSpan =
  document.getElementById("total-questions"); /* total number of questions */

const scoreSpan =
  document.getElementById("score"); /* live score during the quiz */
const finalScoreSpan =
  document.getElementById("final-score"); /* score shown on result screen */
const maxScoreSpan =
  document.getElementById("max-score"); /* maximum possible score */

const resultMessage =
  document.getElementById("result-message"); /* text message on result screen */
const restartButton =
  document.getElementById("restart-btn"); /* restart quiz button */

const progressBar =
  document.getElementById("progress"); /* progress bar element */
const answerImage =
  document.getElementById(
    "answer-image",
  ); /* image shown after selecting an answer */

const nextBtn = document.getElementById("next-btn"); /* next question button */

nextBtn.addEventListener("click", () => {   /* runs code when the Next button is clicked */

  currentQuestionIndex++;                  /* moves to the next question */

  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion();                        /* shows the next question */
  } else {
    showResults();                         /* shows the results screen when quiz ends */
  }
});

function shuffleArray(array) {
  // function used to shuffle quiz questions or answer options

  for (let i = array.length - 1; i > 0; i--) {
    // goes from the last question/answer to the beginning

    const j = Math.floor(Math.random() * (i + 1));
    // picks a random question/answer index

    [array[i], array[j]] = [array[j], array[i]];
    // swaps two questions/answers so their order changes
  }
}

const quizQuestions = [
  // array that stores all quiz questions

  {
    question: "What is the capital city of Australia?",
    // the question text shown to the user

    correctImage: "images/img1.webp",
    // image displayed after selecting an answer (used for learning)

    answers: [
      // list of possible answers for this question

      { text: "Sydney", correct: false },
      // answer option, marked as incorrect

      { text: "Melbourne", correct: false },
      // answer option, marked as incorrect

      { text: "Canberra", correct: true },
      // correct answer for this question

      { text: "Perth", correct: false },
      // answer option, marked as incorrect
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
    question: "Which country is the largest island nation in the world (consisting of over 17,000 islands)?",
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
];

// QUIZ STATE VARS
let currentQuestionIndex = 0;
 // tracks which quiz question is currently shown

let score = 0;
 // stores the number of correct answers

let answersDisabled = false;
 // prevents clicking multiple answers for one question


totalQuestionsSpan.textContent = quizQuestions.length;
 // displays total number of questions in the quiz UI

maxScoreSpan.textContent = quizQuestions.length;
 // shows the maximum possible score on the result screen


// event listeners
startButton.addEventListener("click", startQuiz);
 // starts the quiz when the Start button is clicked

restartButton.addEventListener("click", restartQuiz);
 // restarts the quiz when Restart is clicked


function startQuiz() {
  // runs when the quiz starts

  currentQuestionIndex = 0;
  // resets the quiz to the first question

  score = 0;
  // resets the score

  scoreSpan.textContent = 0;
  // updates score display in the UI

  startScreen.classList.remove("active");
  // hides the start screen

  quizScreen.classList.add("active");
  // shows the quiz screen

  showQuestion();
  // loads and displays the first quiz question
}


function showQuestion() {
  nextBtn.disabled = true; // disables the Next button until the user selects an answer

  // reset state
  answersDisabled = false;// allows clicking answers again for the new question

  answersContainer.classList.remove("answers-disabled"); 
// re-enables hover and clicking on answers for the new question


  answerImage.style.display = "none"; // hides the learning image from the previous question

  answerImage.src = ""; // clears the image source so the old image is removed

  const currentQuestion = quizQuestions[currentQuestionIndex];
  // gets the current question object based on the index

  shuffleArray(currentQuestion.answers);
  // randomizes the order of answers for this question

  currentQuestionSpan.textContent = currentQuestionIndex + 1;
  // updates the UI to show the current question number

  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  // calculates quiz progress as a percentage

  progressBar.style.width = progressPercent + "%";
  // visually updates the progress bar width

  questionText.textContent = currentQuestion.question;
  // displays the question text on the page

  answersContainer.innerHTML = "";
  // removes answer buttons from the previous question

  currentQuestion.answers.forEach((answer) => {
    // loops through all answers of the current question

    const button = document.createElement("button");
    // creates a new button for an answer

    button.textContent = answer.text;
    // sets the answer text on the button

    button.classList.add("answer-btn");
    // applies quiz answer styling to the button


    // what is dataset? it's a property of the button element that allows you to store custom data
button.dataset.correct = answer.correct;
 // stores whether this answer is correct or not inside the button

button.addEventListener("click", selectAnswer);
 // runs the selectAnswer function when this answer is clicked

answersContainer.appendChild(button);
 // adds the answer button to the page so the user can see and click it

  });
}

function selectAnswer(event) {
  // runs when the user clicks an answer

  nextBtn.disabled = false;
  // enables the Next button so the user can move to the next question

  if (answersDisabled) return;
  // stops the function if an answer was already selected

 answersDisabled = true; 
// Marks that an answer has already been selected, prevents selecting another one

answersContainer.classList.add("answers-disabled"); 
// Adds a CSS class to the answers container to disable hover and clicks on all answer buttons
// This makes the selected answer stay highlighted (green/red) and allows hover only on the Next button


 const selectedButton = event.target.closest(".answer-btn");

 if (!selectedButton) return;


  const isCorrect = selectedButton.dataset.correct === "true";
  // checks if the selected answer is correct (stored in data-correct)

  Array.from(answersContainer.children).forEach((button) => {
    // loops through all answer buttons for this question

    if (button.dataset.correct === "true") {
      button.classList.add("correct");
      // highlights the correct answer in green
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
      // highlights the clicked wrong answer in red
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];
    // gets the current quiz question data

    if (currentQuestion.correctImage) {
      answerImage.src = currentQuestion.correctImage;
      // sets the learning image for this question

      answerImage.style.display = "block";
      // shows the image after an answer is selected
    }
  });

 if (isCorrect) {
  // checks if the selected answer is correct

  score++;
  // increases the quiz score by 1

  scoreSpan.textContent = score;
  // updates the score display on the screen
}


  // setTimeout(() => {
  //   currentQuestionIndex++;

  //   if (currentQuestionIndex < quizQuestions.length) {
  //     showQuestion();
  //   } else {
  //     showResults();
  //   }
  // }, 1000);
}

function showResults() {
  // shows the result screen at the end of the quiz

  quizScreen.classList.remove("active");
  // hides the quiz screen

  resultScreen.classList.add("active");
  // shows the result screen

  finalScoreSpan.textContent = score;
  // displays the final score to the user

  const percentage = (score / quizQuestions.length) * 100;
  // calculates the quiz success percentage

  if (percentage === 100) {
    resultMessage.textContent = "Perfect! You're a genius!";
    // message for a perfect score
  } else if (percentage >= 80) {
    resultMessage.textContent = "Great job! You know your stuff!";
    // message for very high score
  } else if (percentage >= 60) {
    resultMessage.textContent = "Good effort! Keep learning!";
    // message for average score
  } else if (percentage >= 40) {
    resultMessage.textContent = "Not bad! Try again to improve!";
    // message for low-average score
  } else {
    resultMessage.textContent = "Keep studying! You'll get better!";
    // message for very low score
  }
}


function restartQuiz() {
  // runs when the user clicks the Restart button

  resultScreen.classList.remove("active");
  // hides the result screen

  startQuiz();
  // starts the quiz again from the beginning
}
