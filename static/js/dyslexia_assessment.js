// static/js/dyslexia_assessment.js

document.getElementById('userId').addEventListener('blur', function() {
    const userId = this.value;

    fetch(`/get_username/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('username').value = data.username;
            } else {
                document.getElementById('username').value = ''; // Clear if user not found
                alert(data.message); // Display error message
            }
        })
        .catch(error => {
            console.error('Error fetching username:', error);
        });
});
    