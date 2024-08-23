function resizeTextarea() {
    const textarea = document.getElementById("paragraph");
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}

function removeAllOccurrences(arr, value) {
    return arr.filter(item => item !== value);
}

function send_mcq() {
    const questionElement = document.querySelector('.question1');
    const questionValue = questionElement.value.trim();

    const pairs = document.querySelectorAll('.pair');

    const allOptionsArrays = [];
    const correctOptions = [];

    pairs.forEach(pair => {
        const inputField = pair.querySelector('input[type="text"]');
        const checkbox = pair.querySelector('input[type="checkbox"]');

        if (inputField && checkbox) {
            const optionArray = [inputField.value.trim(), checkbox.checked];
            allOptionsArrays.push(optionArray);

            if (checkbox.checked) {
                correctOptions.push(inputField.value.trim());
            }
        }
    });

    if (questionValue.length === 0) {
        Swal.fire("Give question");
    } else if (removeAllOccurrences(allOptionsArrays.map(option => option[0]), "").length < 4) {
        Swal.fire("Give at least 4 options");
    } else if (removeAllOccurrences(correctOptions, "").length === 0) { 
        if (allOptionsArrays.map(option => option[0]).includes("")) {
            Swal.fire("Can't select an empty option");
        } else {
            Swal.fire("Select at least one valid option");
        }   
    } else if (correctOptions.includes("")) {
        Swal.fire("Selected options should not be empty");
    } else {
        const mcq_ques = {
            question: questionValue,
            all_options: allOptionsArrays.map(option => option[0]), 
            crct_options: correctOptions,
            type:"mcq"
        };

        fetch('/faculty/receive-mcq', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mcq_ques)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Question added successfully") {
                Swal.fire("Question added successfully");

                const extraPairs = document.querySelectorAll('.extra');
                extraPairs.forEach(extraPair => {
                    extraPair.remove();
                });

                questionElement.value = '';
                pairs.forEach(pair => {
                    const inputField = pair.querySelector('input[type="text"]');
                    const checkbox = pair.querySelector('input[type="checkbox"]');
                    if (inputField) {
                        inputField.value = '';
                    }
                    if (checkbox) {
                        checkbox.checked = false;
                    }
                });
            } else {
                Swal.fire("Failed to add question");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire("Error occurred while adding question");
        });
    }
}


// Function to remove all occurrences of a value in an array
function removeAllOccurrences(arr, value) {
    return arr.filter(item => item !== value);
}

// Function to add a new option
function addOption() {
    const pairs = document.querySelectorAll('.pair');
    const allOptionsArrays = [];
    pairs.forEach(pair => {
        const inputField = pair.querySelector('input[type="text"]');
        const checkbox = pair.querySelector('input[type="checkbox"]');
        if (inputField && checkbox) {
            const optionArray = [inputField.value.trim(), checkbox.checked];
            allOptionsArrays.push(optionArray);
        }
    });

    // if (removeAllOccurrences(allOptionsArrays.map(option => option[0]), "").length < 4) {
    //     Swal.fire("Fill 4 options first");
    // }
        const pairContainer = document.querySelector('.mcq-content');
        const pair = document.createElement('div');
        pair.classList.add('pair', 'extra');
        pair.innerHTML = `
            <input type="checkbox" class="checkbox">
            <input type="text" class="answer">
            <form class="delete-form" action="#">
                <div class="btn-group">
                    <button type="submit" class="btn text-light del" data-toggle="modal">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                </div>
            </form>
        `;
        pairContainer.appendChild(pair);

        // Add event listener to the new delete button
        const deleteForm = pair.querySelector('.delete-form');
        deleteForm.addEventListener('submit', function(event) {
            event.preventDefault();
            pair.remove();
        });
    }

// Function to add event listeners to all existing delete buttons
function addDeleteListeners() {
    const deleteForms = document.querySelectorAll('.delete-form');
    deleteForms.forEach(deleteForm => {
        deleteForm.addEventListener('submit', function(event) {
            event.preventDefault();
            deleteForm.closest('.pair').remove();
        });
    });
}

// Call the function to add event listeners to all existing delete buttons
addDeleteListeners();




function send_para() {
    const questionElement = document.querySelector('.questions');
    const questionValue = questionElement.value.trim();

    const answerElement = document.querySelector('.paragraph');
    const answerValue = answerElement.value.trim();

    if (questionValue.length === 0) {
        Swal.fire("Give Question");
    } else if (answerValue.length === 0) {
        Swal.fire("Give Answer");
    } else {
        const textarea_ques = {
            question: questionValue,
            crct_answer: answerValue,
            type: "para"
        };


        fetch('/faculty/receive-para', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(textarea_ques)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Question added successfully") {
                Swal.fire("Question added successfully");

                questionElement.value = '';
                answerElement.value = '';
            } else {
                Swal.fire("Failed to add question");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire("Error occurred while adding question");
        });
    }
}


function send_choose() {
    const questionElement = document.querySelector('.question2');
    const questionValue = questionElement.value.trim();

    const pairs = document.querySelectorAll('.pair');

    const allOptionsArrays = [];
    let correctOption = '';

    pairs.forEach(pair => {
        const inputField = pair.querySelector('input[type="text"]');
        const radioButton = pair.querySelector('input[type="radio"]');

        
        if (inputField && radioButton) {
            
            const optionArray = [inputField.value.trim(), radioButton.checked];
            allOptionsArrays.push(optionArray);

            
            if (radioButton.checked) {
                correctOption = inputField.value.trim();
            }
        }
    });

    if (questionValue.length === 0) {
        Swal.fire("Give question");
    } else if (removeAllOccurrences(allOptionsArrays.map(option => option[0]), "").length < 4) {
        Swal.fire("Give at least 4 options");
    } else if (correctOption == "") {
        if (allOptionsArrays.map(option => option[0]).includes("")) {
            Swal.fire("Can't select an empty option");
        } else {
            Swal.fire("Select any one valid option");
        }  
    } else {
        
        const radio_ques = {
            question: questionValue,
            all_options: allOptionsArrays.map(option => option[0]), 
            crct_option: correctOption ? correctOption : "" ,
            type:"choose"
        };


        
        fetch('/faculty/receive-choose', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(radio_ques)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Question added successfully") {
                
                Swal.fire("Question added successfully");

                
                questionElement.value = '';
                pairs.forEach(pair => {
                    const inputField = pair.querySelector('input[type="text"]');
                    const radioButton = pair.querySelector('input[type="radio"]');
                    if (inputField) {
                        inputField.value = '';
                    }
                    if (radioButton) {
                        radioButton.checked = false;
                    }
                });

                
                document.querySelectorAll('.pair.extra').forEach(extraPair => extraPair.remove());
            } else {
                Swal.fire("Failed to add question");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire("Error occurred while adding question");
        });
    }
}


function addChoose() {
    const pairs = document.querySelectorAll('.pair');
    const allOptionsArrays = [];
    pairs.forEach(pair => {
        const inputField = pair.querySelector('input[type="text"]');
        const radioButton = pair.querySelector('input[type="radio"]');
        if (inputField && radioButton) {
            const optionArray = [inputField.value.trim(), radioButton.checked];
            allOptionsArrays.push(optionArray);
        }
    });

    // if (removeAllOccurrences(allOptionsArrays.map(option => option[0]), "").length < 4) {
    //     Swal.fire("Fill 4 options first");
    // } 
        const pairContainer = document.querySelector('.choose-content');
        const pair = document.createElement('div');
        pair.classList.add('pair', 'extra'); 
        pair.innerHTML = `
            <input type="radio" name="option" class="checkbox">
            <input type="text" class="answer"><br>
        `;
        pairContainer.appendChild(pair);
    }


document.addEventListener("DOMContentLoaded", () => {
    const starsContainers = document.querySelectorAll(".stars");
    starsContainers.forEach(starsContainer => {
    const stars = starsContainer.querySelectorAll("i");
        stars.forEach((star, index1) => {
            star.addEventListener("click", () => {
                const rating = parseInt(starsContainer.getAttribute("data-rating"));
                stars.forEach((star, index2) => {
                    index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
                });
                starsContainer.setAttribute("data-rating", index1 + 1);
            });
        });
    });
});

function send_rating() {
    const question = document.querySelector('.question.question3').value.trim();
    const options = document.querySelectorAll('.rating-box');
    const answers = {};
    const ratings = [];
    const stararray = [];

    options.forEach(option => {
        const optionText = option.querySelector('.option').value.trim();
        const stars = option.querySelectorAll('.fa-solid.fa-star.active');
        const rating = stars.length; 
        if (optionText) {
            answers[optionText] = rating;
            ratings.push(optionText);
            stararray.push(rating);
        }
    });

    if (question.length === 0) {
        Swal.fire("Give question");
    } else if (removeAllOccurrences(ratings, "").length < 4) {
        Swal.fire("Give at least 4 options");
    } else if (stararray.includes(0)) {
        Swal.fire("Rate all options");
    } else {
        const formattedData = {
            question: question,
            all_options: ratings,
            rated_options: answers,
            type:"rating"
        };

            
        fetch('/faculty/receive-rating', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formattedData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Question added successfully") {
                
                Swal.fire("Question added successfully");

                
                document.querySelector('.question.question3').value = '';
                options.forEach(option => {
                    option.querySelector('.option').value = '';
                    option.querySelectorAll('.fa-solid.fa-star').forEach(star => star.classList.remove('active'));
                });

                
                document.querySelectorAll('.rating-box.extra').forEach(extraBox => extraBox.remove());
            } else {
                Swal.fire("Failed to add question");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire("Error occurred while adding question");
        });
    }
}

// Function to add event listeners to all existing delete buttons for Rating
function addRatingDeleteListeners() {
    const deleteForms = document.querySelectorAll('.rating-option .delete-form');
    deleteForms.forEach(deleteForm => {
        deleteForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Find the parent .rating-box and remove it
            deleteForm.closest('.rating-box').remove();
        });
    });
}

// Call the function to add event listeners to all existing delete buttons for Rating
addRatingDeleteListeners();

// Function to add a new rating option
function addRatingOption() {
    const ratingOption = document.querySelector('.rating-option');
    const options = ratingOption.querySelectorAll('.rating-box');

    // Check if all current options are filled
    // if (options.length < 4 || Array.from(options).some(option => option.querySelector('.option').value.trim() === "")) {
    //     Swal.fire("Fill 4 options first");
    // } 
        const newOption = document.createElement('div');
        newOption.classList.add('rating-box', 'extra'); 
        newOption.innerHTML = `
            <div class="stars" data-rating="${options.length + 1}">
                <div class="left-ques">
                    <input type="text" class="option" placeholder="New Option">
                </div>
                <div class="right-ques">
                    <i class="fa-solid fa-star" data-index="0"></i>
                    <i class="fa-solid fa-star" data-index="1"></i>
                    <i class="fa-solid fa-star" data-index="2"></i>
                    <i class="fa-solid fa-star" data-index="3"></i>
                    <i class="fa-solid fa-star" data-index="4"></i>
                </div>
                <form class="delete-form" action="#">
                    <div class="btn-group">
                        <button type="submit" class="btn text-light del" data-toggle="modal">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Event listener for stars
        const stars = newOption.querySelectorAll('.right-ques .fa-solid.fa-star');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const index = parseInt(star.dataset.index);
                const selectedStars = newOption.querySelectorAll('.right-ques .fa-solid.fa-star');
                selectedStars.forEach((s, i) => {
                    if (i <= index) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });

        // Event listener for delete button
        const deleteForm = newOption.querySelector('.delete-form');
        deleteForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Find the parent .rating-box and remove it
            deleteForm.closest('.rating-box').remove();
        });

        ratingOption.appendChild(newOption);
    }

// Function to handle sending Rating question data (placeholder)
function sendRating() {
    // Implement your logic for handling Rating questions
}

// Function to remove all occurrences of a value in an array
function removeAllOccurrences(arr, value) {
    return arr.filter(item => item !== value);
}

// Function to handle adding new options dynamically
function addOptions() {
    const options = document.querySelectorAll('.rating-box');
    const ratings = [];

    options.forEach(option => {
        const optionText = option.querySelector('.option').value.trim();
        ratings.push(optionText);
    });

    // if (removeAllOccurrences(ratings, "").length < 4) {
    //     Swal.fire("Fill 4 options first");
    // } 

    addRatingOption();
}

// Call the function to add event listeners to all existing delete buttons for Rating
addRatingDeleteListeners();



// Function to add event listeners to all existing delete buttons for Choose (pair) options
function addChooseDeleteListeners() {
    const deleteForms = document.querySelectorAll('#default .delete-form');
    deleteForms.forEach(deleteForm => {
        deleteForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Find the parent .pair and remove it
            deleteForm.closest('.pair').remove();
        });
    });
}

// Call the function to add event listeners to all existing delete buttons for Choose (pair) options
addChooseDeleteListeners();

// Function to add a new Choose (pair) option
function addChooseOption() {
    const chooseContent = document.querySelector('#default .choose-content');
    const pairs = chooseContent.querySelectorAll('.pair');

    // Check if all current options are filled
    // if (pairs.length < 4 || Array.from(pairs).some(pair => pair.querySelector('.answer').value.trim() === "")) {
    //     Swal.fire("Fill 4 options first");
    // } 
        const newPair = document.createElement('div');
        newPair.classList.add('pair', 'extra'); 
        newPair.innerHTML = `
            <input type="radio" name="option" class="checkbox">
            <input type="text" class="answer">
            <form class="delete-form" action="#">
                <div class="btn-group">
                    <button type="submit" class="btn text-light del" data-toggle="modal">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                </div>
            </form>
        `;

        // Event listener for delete button
        const deleteForm = newPair.querySelector('.delete-form');
        deleteForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Find the parent .pair and remove it
            deleteForm.closest('.pair').remove();
        });

        chooseContent.appendChild(newPair);
    }

// Function to handle sending Choose question data (placeholder)
function sendChoose() {
    // Implement your logic for handling Choose questions
}

// Function to handle adding new options dynamically for Choose questions
function addChoose() {
    const pairs = document.querySelectorAll('#default .pair');
    const answers = [];

    pairs.forEach(pair => {
        const answerText = pair.querySelector('.answer').value.trim();
        answers.push(answerText);
    });

    // if (answers.length < 4) {
    //     Swal.fire("Fill 4 options first");
    // } 
        addChooseOption();
    
}

// Call the function to add event listeners to all existing delete buttons for Choose (pair) options
addChooseDeleteListeners();
