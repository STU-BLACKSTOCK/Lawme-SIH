document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const lawid = document.getElementById('lawid').value;
    const pin = document.getElementById('pin').value;
    
    // Regular expression for pin validation
    const pinRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!pinRegex.test(pin)) {
        alert('PIN must be at least 8 characters long and include at least one letter, one number, and one special character.');
        return;
    }

    if (lawid && pin) {
        fetch('validate_login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `lawid=${encodeURIComponent(lawid)}&pin=${encodeURIComponent(pin)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Login successful!');
                window.location.href = 'home.html'; // Redirect to the home page
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    } else {
        alert('Please enter LAWID and PIN.');
    }
});
