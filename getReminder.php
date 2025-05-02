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

// Fetch the reminders
$sql = "SELECT * FROM reminders ORDER BY reminder_date, reminder_time";
$result = $conn->query($sql);

$reminders = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $reminders[] = $row;
    }
}

echo json_encode($reminders);

$conn->close();
?>
