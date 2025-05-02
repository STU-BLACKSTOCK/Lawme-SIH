<?php
// Database configuration
$servername = "localhost";
$username = "root"; // Your database username
$password = ""; // Your database password
$dbname = "reminders_db"; // Your database name

// Create a connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle the form data
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $update = $_POST['update'];
    $time = $_POST['time'];
    $date = $_POST['date'];
    $place = $_POST['place'];

    // Insert the reminder into the database
    $sql = "INSERT INTO reminders (update_text, reminder_time, reminder_date, reminder_place, status) 
            VALUES ('$update', '$time', '$date', '$place', 'Pending')";

    if ($conn->query($sql) === TRUE) {
        echo "Reminder added successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>
