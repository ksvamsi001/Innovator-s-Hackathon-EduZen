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

document.addEventListener('DOMContentLoaded', function () {
    const deleteForms = document.querySelectorAll('.delete-form');

    deleteForms.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission

            Swal.fire({
                title: 'Are you sure?',
                text: 'You won\'t be able to revert this!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit(); // Submit the form if confirmed
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    console.log('Delete canceled');
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Select all elements with class 'percentage-text'
    var percentageElements = document.querySelectorAll('.percentage-text');

    // Loop through each element and update its percentage using the 'updatePercentage' function
    percentageElements.forEach(function (element) {
        // Extract the rank value from the element's text content
        var rankString = element.textContent.trim(); // Trim to remove any leading or trailing spaces
        var rank = parseFloat(rankString);

        // Call the 'updatePercentage' function to update the element
        updatePercentage(rank, element.parentElement);
    });
});

function updatePercentage(rank, circleContainer) {
    var percentageText = circleContainer.querySelector('.percentage-text');
    var circle = circleContainer.querySelector('circle');

    // Validate the input to be between 0 and 100
    if (isNaN(rank) || rank < 0 || rank > 100) {
        return;
    }

    // Determine color based on percentage range
    var color = getColorByPercentage(rank);

    // Apply the background color with animation
    circle.style.stroke = color;

    // Calculate the dash array to represent the percentage
    var dashArray = (Math.PI * 2 * 60 * rank) / 100;
    circle.style.strokeDasharray = dashArray + ' ' + (Math.PI * 2 * 60);

    // Update the text content with rank
    percentageText.textContent = rank + '%';
}

function getColorByPercentage(percentage) {
    if (percentage >= 0 && percentage <= 30) {
        return 'red';
    } else if (percentage > 30 && percentage <= 60) {
        return 'orange';
    } else if (percentage > 60 && percentage <= 85) {
        return 'yellow';
    } else if (percentage > 85 && percentage <= 100) {
        return 'green';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const addUserButton = document.querySelector('.add-user .add');

    addUserButton.addEventListener('click', function () {
        // Define HTML content for the SweetAlert modal
        const modalContent = `
            <form action="/faculty/add-student" method="POST" id="user-form">
                <div>
                    <label for="name">Name:</label><br>
                    <input type="text" id="name" name="name">
                    <div id="name-error" class="error"></div>
                </div>
                <div>
                    <label for="regno">Register No:</label><br>
                    <input type="text" id="regno" name="regno">
                    <div id="regno-error" class="error"></div>
                </div>
                <div>
                    <label for="dept">Department:</label><br>
                    <input type="text" id="dept" name="dept">
                    <div id="dept-error" class="error"></div>
                </div>
                <div>
                    <label for="password">Password:</label><br>
                    <input type="password" id="password" name="password">
                    <div id="password-error" class="error"></div>
                </div>
            </form>
        `;

        // Open SweetAlert modal with custom content
        Swal.fire({
            title: 'Add Student',
            html: modalContent,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                // Retrieve values from the modal fields
                const name = document.getElementById('name').value;
                const regno = document.getElementById('regno').value;
                const dept = document.getElementById('dept').value;
                const password = document.getElementById('password').value;

                // Validation
                let isValid = true;

                // Name validation
                const nameField = document.getElementById('name');
                const nameError = document.getElementById('name-error');
                if (name.trim() === '') {
                    nameError.innerText = 'Name is required';
                    nameField.classList.add('error-border');
                    isValid = false;
                } else if (/\d/.test(name)) { // Check if name contains digits
                    nameError.innerText = 'Name cannot contain numbers';
                    nameField.classList.add('error-border');
                    isValid = false;
                } else {
                    nameError.innerText = '';
                    nameField.classList.remove('error-border');
                }

                // Registration number validation
                const regnoField = document.getElementById('regno');
                const regnoError = document.getElementById('regno-error');
                const regnoRegex = /^\d{8}$/; // Updated regex to match exactly 8 numeric characters
                if (!regnoRegex.test(regno)) {
                    regnoError.innerText = 'Invalid register number ';
                    regnoField.classList.add('error-border');
                    isValid = false;
                } else {
                    regnoError.innerText = '';
                    regnoField.classList.remove('error-border');
                }

                // Department validation
                const deptField = document.getElementById('dept');
                const deptError = document.getElementById('dept-error');
                if (dept.trim() === '') {
                    deptError.innerText = 'Department is required';
                    deptField.classList.add('error-border');
                    isValid = false;
                } else if (/\d/.test(dept)) { // Check if department contains digits
                    deptError.innerText = 'Department cannot contain numbers';
                    deptField.classList.add('error-border');
                    isValid = false;
                } else {
                    deptError.innerText = '';
                    deptField.classList.remove('error-border');
                }

               
const passwordField = document.getElementById('password');
const passwordError = document.getElementById('password-error');
const passwords = passwordField.value.trim(); // Trim to remove leading and trailing spaces

if (passwords === '') {
    passwordError.innerText = 'Password is required';
    passwordField.classList.add('error-border');
    isValid = false;
} else {
    passwordError.innerText = '';
    passwordField.classList.remove('error-border');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
if (!passwordRegex.test(passwords)) {
    let errorMessages = [];

    if (!/(?=.*[a-z])/.test(passwords)) {
        errorMessages.push('Password must contain atleast 1 lowercase');
    } else if (!/(?=.*[A-Z])/.test(passwords)) {
        errorMessages.push('Password must contain atleast 1 uppercase');
    } else if (!/(?=.*\d)/.test(passwords)) {
        errorMessages.push('Password must contain atleast 1 digit');
    } else if (!/(?=.*[!@#$%^&*])/.test(passwords)) {
        errorMessages.push('Password must contain atleast 1 special character');
    } else if (passwords.length < 8) {
        errorMessages.push('Password must be at least 8 characters long');
    }

    passwordError.innerText = errorMessages.join('\n');
    passwordField.classList.add('error-border');
    isValid = false;
}
}
if (isValid) {
    const form = document.getElementById('user-form');
    form.submit();
}
return isValid ? { name, email, dept, password } : false;
            }
        });
    });
});
