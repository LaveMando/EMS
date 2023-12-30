// Function to load content based on the clicked link
function loadContent(linkId) {
    fetch(`/${linkId}.html`) // Assuming you have HTML files named home.html, employee_management.html, employees_on_leave.html
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
        })
        .catch(error => console.error('Error fetching content:', error));
}

// Event listeners for each link
document.getElementById('home').addEventListener('click', function() {
    loadContent('home');
});

document.getElementById('employee-management').addEventListener('click', function() {
    loadContent('employee_management');
});

document.getElementById('employees-on-leave').addEventListener('click', function() {
    loadContent('employees_on_leave');
});
