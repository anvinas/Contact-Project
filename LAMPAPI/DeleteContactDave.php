<?php

/**
 * delete_user.php
 *
 * This script deletes a user from the database based on the provided user_id.
 * It expects data to be sent via a POST request.
 *
 * IMPORTANT:
 * 1. Replace placeholder database credentials with your actual credentials.
 * 2. Ensure you have a database table (e.g., 'users') with an 'id' column
 * that uniquely identifies users.
 * 3. This script uses MySQLi with prepared statements to prevent SQL injection.
 * 4. For a real-world application, you would add more robust error handling,
 * input validation, and user authentication/authorization (e.g., ensuring
 * the person making the request has permission to delete the user).
 */

// --- Database Configuration ---
$servername = "localhost"; // Replace with your database server name (e.g., "127.0.0.1")
$username = "your_username";   // Replace with your database username
$password = "your_password";   // Replace with your database password
$dbname = "your_database";     // Replace with your database name
$tableName = "users";          // The name of your users table

// --- Response Array ---
$response = array(
    'status' => 'error',
    'message' => 'An unexpected error occurred.'
);

// --- Check if the request method is POST ---
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- Get POST data ---
    // Ensure user_id is provided and is an integer
    $userId = isset($_POST['user_id']) ? filter_var(trim($_POST['user_id']), FILTER_VALIDATE_INT) : null;

    // --- Basic Validation ---
    if ($userId === false || $userId === null) { // filter_var returns false on failure, null if not set
        $response['message'] = "Valid User ID is required.";
    } else {
        // --- Create database connection ---
        $conn = new mysqli($servername, $username, $password, $dbname);

        // Check connection
        if ($conn->connect_error) {
            // Log error to server log instead of exposing details to client in production
            error_log("Connection failed: " . $conn->connect_error);
            $response['message'] = "Database connection failed. Please try again later.";
        } else {
            // --- Prepare SQL statement ---
            // SQL query to delete a user by their ID
            $sql = "DELETE FROM " . $tableName . " WHERE id = ?";

            // --- Prepare and bind ---
            $stmt = $conn->prepare($sql);

            if ($stmt) {
                // 'i' specifies the variable type is integer
                $stmt->bind_param("i", $userId);

                // --- Execute the statement ---
                if ($stmt->execute()) {
                    if ($stmt->affected_rows > 0) {
                        $response['status'] = 'success';
                        $response['message'] = 'User deleted successfully.';
                    } else {
                        // Query executed, but no rows were deleted.
                        // This usually means the user ID was not found.
                        $response['status'] = 'info';
                        $response['message'] = 'No user found with the provided ID, or user was already deleted.';
                    }
                } else {
                    // Log error to server log
                    error_log("Error executing statement: " . $stmt->error);
                    $response['message'] = "Error deleting user: " . $stmt->error; // Provide a generic error in production
                }
                $stmt->close();
            } else {
                // Log error to server log
                error_log("Error preparing statement: " . $conn->error);
                $response['message'] = "Error preparing database query.";
            }
            $conn->close();
        }
    }
} else {
    $response['message'] = "Invalid request method. Please use POST.";
}

// --- Send JSON response ---
header('Content-Type: application/json');
echo json_encode($response);
exit();

?>
