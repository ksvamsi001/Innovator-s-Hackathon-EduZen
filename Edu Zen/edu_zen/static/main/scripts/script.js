document.getElementById("loginForm").addEventListener("submit", function (event) {
    var regno = document.getElementById("regno").value;
    var password = document.getElementById("password").value;
    var regnoError = document.getElementById("regError");
    var passwordError = document.getElementById("passwordError");

    // Reset previous error messages
    regnoError.innerHTML = "";
    passwordError.innerHTML = "";

    // Registration number validation
    if (regno.trim() === "") {
        regnoError.innerHTML = "Register number is required.";
        document.getElementById("regno").classList.add("error");
        event.preventDefault();
    } else if (!regno.match(/^\d{8}$/)) {
        regnoError.innerHTML = "Enter a valid register number";
        document.getElementById("regno").classList.add("error");
        event.preventDefault();
    } else {
        document.getElementById("regno").classList.remove("error");
    }

    // Password validation
    if (password.trim() === "") {
        passwordError.innerHTML = "Password is required.";
        document.getElementById("password").classList.add("error");
        event.preventDefault();
    } else {
        document.getElementById("password").classList.remove("error");

        // Check for at least 1 uppercase letter
        if (!password.match(/[A-Z]/)) {
            passwordError.innerHTML = "Enter at least 1 uppercase letter.";
            document.getElementById("password").classList.add("error");
            event.preventDefault();
            return; // Stop further validation
        }

        // Check for at least 1 lowercase letter
        if (!password.match(/[a-z]/)) {
            passwordError.innerHTML = "Enter at least 1 lowercase letter.";
            document.getElementById("password").classList.add("error");
            event.preventDefault();
            return; // Stop further validation
        }

        // Check for at least 1 digit
        if (!password.match(/\d/)) {
            passwordError.innerHTML = "Enter at least 1 digit.";
            document.getElementById("password").classList.add("error");
            event.preventDefault();
            return; // Stop further validation
        }

        // Check for at least 1 symbol or special character
        if (!password.match(/[!@#$%^&*(),.?":{}|<>]/)) {
            passwordError.innerHTML = "Enter at least 1 special character.";
            document.getElementById("password").classList.add("error");
            event.preventDefault();
            return; // Stop further validation
        }

        // Check for at least 8 characters long
        if (password.length < 8) {
            passwordError.innerHTML = "Enter at least 8 characters long.";
            document.getElementById("password").classList.add("error");
            event.preventDefault();
            return; // Stop further validation
        }

        // If all requirements are met
        passwordError.innerHTML = ""; // Clear error message
    }
});

const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');

togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
    this.classList.toggle('fa-eye');
});