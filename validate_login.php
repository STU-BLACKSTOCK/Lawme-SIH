<?php
$servername = "localhost"; // Your database server name
$username = "root"; // Your database username
$password = ""; // Your database password
$dbname = "your_database_name"; // Your database name

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the POST data
$lawid = $_POST['lawid'];
$pin = $_POST['pin'];

// Prepare and bind
$stmt = $conn->prepare("SELECT * FROM users WHERE lawid = ? AND pin = ?");
$stmt->bind_param("ss", $lawid, $pin);

// Execute the statement
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid LAWID or PIN.']);
}

// Close the connection
$stmt->close();
$conn->close();
?>
