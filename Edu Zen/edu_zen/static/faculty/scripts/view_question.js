
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