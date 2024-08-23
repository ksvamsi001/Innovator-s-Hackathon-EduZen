const ques = document.getElementById("ques").innerText.replace(/'/g, '"');
const questions = JSON.parse(ques);
document.getElementById("ques").remove();
var mcq_questions = [];
var para_questions = [];
var rating_questions = [];
var choose_questions = [];
let idCounter = 1;

var currentQuestion = 1;
let mcqResponses = {};
let textareaResponses = {};
let starRatingResponses = {};
let radioButtonResponses = {};
let answers = [];

questions.forEach(function(question) {
  if (question.type === "mcq") {
    mcq_questions.push(question);
  } else if (question.type === "para") {
    question.type = 'textarea';
    para_questions.push(question);
  }else if (question.type === "rating") {
    ratings = question.all_options;
    delete question.all_options;
    question.ratings = ratings;
    rating_questions.push(question);
  }else if (question.type === "choose") {
    question.type = 'radio';
    choose_questions.push(question);
  }
});
mcq_questions.forEach(question => {
  question.id = idCounter++;
});

para_questions.forEach(question => {
  question.id = idCounter++;
});

rating_questions.forEach(question => {
  question.id = idCounter++;
});

choose_questions.forEach(question => {
  question.id = idCounter++;
});


const shuffledMcqQuestions = shuffleArray(mcq_questions);
const shuffledTextareaQuestions = shuffleArray(para_questions);
const shuffledStarRatingQuestions = shuffleArray(rating_questions);
const shuffledRadioButtonQuestions = shuffleArray(choose_questions);
 
const shuffledQuestions = shuffledMcqQuestions.concat(
  shuffledTextareaQuestions,
  shuffledStarRatingQuestions,
  shuffledRadioButtonQuestions
);


var totalQuestions = shuffledQuestions.length;
const questionsContainer = document.getElementById("questionsContainer");
shuffledQuestions.forEach((question, index) => {
  const questionHTML = createQuestionHTML(question, index);
  questionsContainer.appendChild(questionHTML);
});


window.onload = function () {
    createQuestionButtons();
    showQuestion(currentQuestion);
    star_operate();
  };



  function star_operate(){
    const starsContainers = document.querySelectorAll(".stars");
    starsContainers.forEach((starsContainer) => {
        const stars = starsContainer.querySelectorAll("i");
    
        stars.forEach((star, index1) => {
            star.addEventListener("click", () => {
            const rating = parseInt(starsContainer.getAttribute("data-rating"));
    
            stars.forEach((star, index2) => {
                index1 >= index2
                ? star.classList.add("active")
                : star.classList.remove("active");
            });
    
            starsContainer.setAttribute("data-rating", index1 + 1);
            });
        });
        });
    }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

function hideAllQuestions() {
    for (var i = 1; i <= totalQuestions; i++) {
      document.getElementById("questionText" + i).style.display = "none";
    }
  }

function showQuestion(questionNumber) {
  if (questionNumber >= 1 && questionNumber <= totalQuestions) {
    document.getElementById("questionText" + currentQuestion).style.display =
      "none";
    currentQuestion = questionNumber;
    document.getElementById("questionText" + currentQuestion).style.display =
      "block";

    if (currentQuestion === 1) {
      document.getElementById("previousBtn").style.display = "none";
    } else {
      document.getElementById("previousBtn").style.display = "block";
    }

    document.getElementById("questionNo").innerText =
      "Question No: " + currentQuestion;
  }
}

function nextQuestion() {
  showQuestion(currentQuestion + 1);
}

function previousQuestion() {
  showQuestion(currentQuestion - 1);
}

function showQuestion(questionIndex) {
  questionNumber = shuffledQuestions[questionIndex].id;

  if (questionNumber >= 1 && questionNumber <= totalQuestions) {
    hideAllQuestions();

    document.getElementById("questionText" + questionNumber).style.display =
      "block";

    currentQuestion = questionNumber;

    if (currentQuestion === 1) {
      document.getElementById("previousBtn").style.display = "none";
    } else {
      document.getElementById("previousBtn").style.display = "block";
    }

    if (currentQuestion === totalQuestions) {
      document.getElementById("nextBtn").style.display = "none";
      document.getElementById("submitButton").style.display = "block";
    } else {
      document.getElementById("nextBtn").style.display = "block";
      document.getElementById("submitButton").style.display = "none";
    }

    document.getElementById("questionNo").innerText =
      "Question No: " + currentQuestion;
  }
}

function showLoadingScreen() {
  document.getElementById("loadingScreen").style.display = "flex";
}

// Hide loading screen
function hideLoadingScreen() {
  document.getElementById("loadingScreen").style.display = "none";
}



function isQuizComplete() {
  // Implement this function to check if all questions are answered
  // This function should return true if all questions are answered, otherwise false
  const questionDivs = document.querySelectorAll('[id^="questionText"]');
  for (let i = 0; i < questionDivs.length; i++) {
    const questionDiv = questionDivs[i];
    const isAnswered = checkIfQuestionAnswered(questionDiv);
    if (!isAnswered) {
      return false;
    }
  }
  return true;
}

function checkIfQuestionAnswered(questionDiv) {
  const inputs = questionDiv.querySelectorAll('input[type="checkbox"], input[type="radio"]');
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      return true;
    }
  }
  
  const textarea = questionDiv.querySelector("textarea");
  if (textarea && textarea.value.trim() !== "") {
    return true;
  }
  
  const stars = questionDiv.querySelectorAll(".fa-star.active");
  if (stars.length > 0) {
    return true;
  }
  
  return false;
}

function submitQuiz() {
  if (isQuizComplete()) {
    getResponses(); // Ensure this populates the `answers` object correctly
    Swal.fire({
      title: "Are you sure?",
      text: "Once submitted, you will not be able to change your answers!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!"
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(JSON.stringify(answers));
        send_ans();
      }
    });
  } else {
    Swal.fire({
      title: "Incomplete Quiz",
      text: "Please answer all the questions before submitting.",
      icon: "warning",
      confirmButtonText: "OK"
    });
  }
}

function send_ans() {
  showLoadingScreen();
  fetch('/student/submit-survey', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(answers)
})
.then(response => {
    hideLoadingScreen();
    return response.json().then(data => ({ status: response.status, body: data }));
})
.then(({ status, body }) => {
    if (status === 200) {
        Swal.fire(
            'Submitted!',
            'Your exam has been submitted successfully.',
            'success'
        ).then(() => {
            window.location.href = '/student/result'; 
        });
    } else {
        let errorMessage = body.error || 'An unexpected error occurred.';
        let redirectUrl = '/student/result';

        if (status === 401) {
            redirectUrl = '/';
        }

        Swal.fire(
            'Error!',
            errorMessage,
            'error'
        ).then(() => {
            window.location.href = redirectUrl;
        });
    }
})
.catch(error => {
    hideLoadingScreen();
    console.error('Error submitting quiz:', error);
    let errorMessage = 'An unexpected error occurred.';
    let redirectUrl = '/student/result';

    if (error.response && error.response.data) {
        errorMessage = error.response.data.error;
        if (error.response.status === 401) {
            redirectUrl = '/';
        }
    }

    Swal.fire(
        'Error!',
        errorMessage,
        'error'
    ).then(() => {
        window.location.href = redirectUrl;
    });
});
  
}

document
  .getElementById("exit-link")
  .addEventListener("click", function (event) {
    event.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to exit?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, exit"
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/student/student-logout";
      } else {
        Swal.fire({
          icon: "error",
          title: "Logout canceled",
          text: "You are still logged in."
        });
      }
    });
  });

function showQuestion(questionNumber) {
  if (questionNumber >= 1 && questionNumber <= totalQuestions) {
    hideAllQuestions();

    document.getElementById("questionText" + questionNumber).style.display =
      "block";

    currentQuestion = questionNumber;

    document.getElementById("previousBtn").style.display = "none";
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("submitButton").style.display = "none";

    if (currentQuestion === 1) {
      document.getElementById("nextBtn").style.display = "block";
    } else if (currentQuestion === totalQuestions) {
      document.getElementById("previousBtn").style.display = "block";
      document.getElementById("submitButton").style.display = "block";
    } else {
      document.getElementById("previousBtn").style.display = "block";
      document.getElementById("nextBtn").style.display = "block";
    }

    document.getElementById("questionNo").innerText =
      "Question No: " + currentQuestion;
  }
}

function markQuestion() {
  var questionButton = document.querySelector(
    `#questionButtons button:nth-child(${currentQuestion})`
  );
  questionButton.classList.toggle("marked");
}


function handleSelection(id, question, questionId, option, state) {
  let existingAnswer = answers.find((answer) => answer.ques_id === id);

  if (!existingAnswer) {
    existingAnswer = {
      ques_id: id, 
      ques_type: "mcq",
      ques: question,
      ans: []
    };
    answers.push(existingAnswer);
  }

  if (state) {
    if (!existingAnswer.ans.includes(option)) {
      existingAnswer.ans.push(option);
    }
  } else {
    const index = existingAnswer.ans.indexOf(option);
    if (index !== -1) {
      existingAnswer.ans.splice(index, 1);
    }
  }
}

function handleTextareaInput(id, question, questionId, ans) {
  const answer = ans.trim();
  textareaResponses["ques_id"] = id;
  textareaResponses["ques_type"] = "para";
  textareaResponses["ques"] = question;
  textareaResponses["ans"] = answer;
}

function handleStarRating(id, question, option, questionId, rating) {
  const starsDiv = document.querySelector(`#questionText${questionId} .stars`);
  const starIcons = starsDiv.querySelectorAll("i");

  starIcons.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("selected");
    } else {
      star.classList.remove("selected");
    }
  });
  starRatingResponses["ques_id"] = id;
  starRatingResponses["ques_type"] = "rating";
  starRatingResponses["ques"] = question;
  if (!starRatingResponses["ans"]) {
    starRatingResponses["ans"] = {};
  }
  starRatingResponses["ans"][option] = rating;
}

function handleRadioButton(id, question, questionId, option) {
  radioButtonResponses["ques_id"] = id;
  radioButtonResponses["ques_type"] = "choose";
  radioButtonResponses["ques"] = question;
  radioButtonResponses["ans"] = option;
}

function nextQuestion1() {
  getResponses();
}

function previousQuestion1() {
  getResponses();
}

function getResponses() {
  if (mcqResponses.ans) {
    flag = true;
    for (let i = 0; i < answers.length; i++) {
      if (mcqResponses["ques_id"] == answers[i]["ques_id"]) {
        answers[i]["ans"] = answers[i]["ans"].concat(mcqResponses.ans);
        flag = false;
      }
    }
    if (flag) {
      answers.push(mcqResponses);
    }
    mcqResponses = {};
  }

  if (textareaResponses.ans) {
    flag = true;
    for (let i = 0; i < answers.length; i++) {
      if (textareaResponses["ques_id"] == answers[i]["ques_id"]) {
        answers[i]["ans"] = textareaResponses.ans;
        flag = false;
      }
    }
    if (flag) {
      answers.push(textareaResponses);
    }
    textareaResponses = {};
  }

  if (starRatingResponses.ans) {
    flag = true;
    for (let i = 0; i < answers.length; i++) {
      if (starRatingResponses["ques_id"] == answers[i]["ques_id"]) {
        answers[i]["ans"] = {
          ...answers[i]["ans"],
          ...starRatingResponses.ans
        };
        flag = false;
      }
    }
    if (flag) {
      answers.push(starRatingResponses);
    }
    starRatingResponses = {};
  }

  if (radioButtonResponses.ans) {
    flag = true;
    for (let i = 0; i < answers.length; i++) {
      if (radioButtonResponses["ques_id"] == answers[i]["ques_id"]) {
        answers[i]["ans"] = radioButtonResponses.ans;
        flag = false;
      }
    }
    if (flag) {
      answers.push(radioButtonResponses);
    }
    radioButtonResponses = {};
  }
}

function createQuestionHTML(question, index) {
  const questionDiv = document.createElement("div");
  questionDiv.id = `questionText${index + 1}`;
  const questionTitle = document.createElement("h3");
  questionTitle.textContent = question.question;
  questionDiv.appendChild(questionTitle);

  const handleInputChange = () => {
    const button = document.getElementById(`buttonQuestion${index + 1}`);
    const isAnswered = isQuestionAnswered(question);
    if (isAnswered) {
      button.style.backgroundColor = "green";
      button.style.color = "white";
    } else {
      button.style.backgroundColor = "";
      button.style.color = "";
    }
  };

  const isQuestionAnswered = (question) => {
    const questionDiv = document.getElementById(`questionText${index + 1}`);
    if (question.all_options) {
      const inputs = questionDiv.querySelectorAll(
        'input[type="checkbox"], input[type="radio"]'
      );
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
          return true;
        }
      }
    } else if (question.type === "textarea") {
      const textarea = questionDiv.querySelector("textarea");
      if (textarea.value.trim() !== "") {
        return true;
      }
    } else if (question.ratings) {
      const ratingBoxes = questionDiv.querySelectorAll(".rating-box");
      let allRated = true;
      ratingBoxes.forEach((ratingBox) => {
        const stars = ratingBox.querySelectorAll(".fa-star.active");
        if (stars.length === 0) {
          allRated = false;
        }
      });
      return allRated;
    }
    return false;
  };

  if (question.all_options) {
    const type = question.type === "radio" ? "radio" : "checkbox";
    question.all_options.forEach((option, index) => {
      const input = document.createElement("input");
      input.type = type;
      input.id = `option${question.id}-${index}`;
      input.name = `question${question.id}`;
      input.value = option;

      if (type === "radio") {
        input.addEventListener("change", () => {
          handleRadioButton(question._id, question.question, question.id, option);
          handleInputChange();
        });
      } else {
        input.addEventListener("change", () => {
          handleSelection(question._id, question.question, question.id, option, input.checked);
          handleInputChange();
        });
      }

      const label = document.createElement("label");
      label.setAttribute("for", input.id);
      label.textContent = option;

      const optionDiv = document.createElement("div");
      optionDiv.appendChild(input);
      optionDiv.appendChild(label);

      questionDiv.appendChild(optionDiv);
    });
  } else if (question.type === "textarea") {
    const textarea = document.createElement("textarea");
    textarea.addEventListener("input", () => {
      handleTextareaInput(question._id, question.question, question.id, textarea.value);
      handleInputChange();
    });
    questionDiv.appendChild(textarea);
  } else if (question.ratings) {
    question.ratings.forEach((rating, index) => {
      const ratingBox = document.createElement("div");
      ratingBox.classList.add("rating-box");

      const starsDiv = document.createElement("div");
      starsDiv.classList.add("stars");
      starsDiv.dataset.rating = index + 1;

      const leftQues = document.createElement("div");
      leftQues.classList.add("left-ques");
      leftQues.innerHTML = `<h4>${rating}</h4>`;

      const rightQues = document.createElement("div");
      rightQues.classList.add("right-ques");

      for (let i = 0; i < 5; i++) {
        const starIcon = document.createElement("i");
        starIcon.classList.add("fa-solid", "fa-star");
        starIcon.dataset.rating = i + 1;
        starIcon.addEventListener("click", () => {
          handleStarRating(question._id, question.question, rating, question.id, i + 1);
          starIcon.classList.add('active');
          handleInputChange();
        });
        rightQues.appendChild(starIcon);
      }

      starsDiv.appendChild(leftQues);
      starsDiv.appendChild(rightQues);
      ratingBox.appendChild(starsDiv);
      questionDiv.appendChild(ratingBox);
    });
  }

  return questionDiv;
}


function createQuestionButtons() {
  const questionButtonsDiv = document.getElementById("questionButtons");
  shuffledQuestions.forEach((question, index) => {
    const button = document.createElement("button");
    button.innerText = `${index + 1}`;
    button.id = `buttonQuestion${index + 1}`;
    button.onclick = () => showQuestion(index + 1);
    questionButtonsDiv.appendChild(button);
  });
}
