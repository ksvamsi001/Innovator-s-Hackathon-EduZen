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
    const reAttemptForm = document.querySelector('.re-attempt-form');
    const exitButton = document.querySelector('.exit');

    reAttemptForm.addEventListener('submit', function (event) {
        event.preventDefault();
        Swal.fire({
            title: "Are you sure?",
            text: "This action will redirect you to another page.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.isConfirmed) {
                reAttemptForm.submit();
            }
        });
    });

    exitButton.addEventListener('click', function () {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to exit and logout?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, exit!'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "/student/student-logout";
            }
        });
    });
});


