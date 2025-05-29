<?php

/**
 * modify_user.php
 *
 * This script updates a user's information (first name, last name, email, phone number)
 * in a database. It expects data to be sent via a POST request.
 *
 * IMPORTANT:
 * 1. Replace placeholder database credentials with your actual credentials.
 * 2. Ensure you have a database table (e.g., 'users') with columns like
 * id (INT, PRIMARY KEY, AUTO_INCREMENT), first_name (VARCHAR), last_name (VARCHAR),
 * email (VARCHAR), phone_number (VARCHAR).
 * 3. This script uses MySQLi with prepared statements to prevent SQL injection.
 * 4. For a real-world application, you would add more robust error handling,
 * input validation, and user authentication/authorization.
 */

// --- Database Configuration ---
$servername = "localhost"; // Replace with your database server name (e.g., "127.0.0.1")
$username = "your_username";   // Replace with your database username
$password = "your_password";   // Replace with your database password
$dbname = "your_database";     // Replace with your database name
$tableName = "users";          // The name of your users table

// --- Response Array ---
// We'll use this to send a JSON response back (useful for AJAX calls)
$response = array(
    'status' => 'error',
    'message' => 'An unexpected error occurred.'
);

// --- Check if the request method is POST ---
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- Get POST data ---
    // It's good practice to sanitize or validate inputs, though this example focuses on the update logic.
    $userId = isset($_POST['user_id']) ? trim($_POST['user_id']) : null;
    $firstName = isset($_POST['first_name']) ? trim($_POST['first_name']) : null;
    $lastName = isset($_POST['last_name']) ? trim($_POST['last_name']) : null;
    $email = isset($_POST['email']) ? trim($_POST['email']) : null;
    $phoneNumber = isset($_POST['phone_number']) ? trim($_POST['phone_number']) : null;

    // --- Basic Validation ---
    if (empty($userId)) {
        $response['message'] = "User ID is required.";
    } elseif (empty($firstName) && empty($lastName) && empty($email) && empty($phoneNumber)) {
        $response['message'] = "At least one field (first name, last name, email, or phone number) must be provided to update.";
    } elseif (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = "Invalid email format.";
    } else {
        // --- Create database connection ---
        $conn = new mysqli($servername, $username, $password, $dbname);

        // Check connection
        if ($conn->connect_error) {
            // Log error to server log instead of exposing details to client in production
            error_log("Connection failed: " . $conn->connect_error);
            $response['message'] = "Database connection failed. Please try again later.";
        } else {
            // --- Build the SQL query dynamically based on provided fields ---
            $fieldsToUpdate = [];
            $params = [];
            $types = ""; // For bind_param type string

            if (!empty($firstName)) {
                $fieldsToUpdate[] = "first_name = ?";
                $params[] = $firstName;
                $types .= "s";
            }
            if (!empty($lastName)) {
                $fieldsToUpdate[] = "last_name = ?";
                $params[] = $lastName;
                $types .= "s";
            }
            if (!empty($email)) {
                $fieldsToUpdate[] = "email = ?";
                $params[] = $email;
                $types .= "s";
            }
            if (!empty($phoneNumber)) {
                $fieldsToUpdate[] = "phone_number = ?";
                $params[] = $phoneNumber;
                $types .= "s";
            }

            if (count($fieldsToUpdate) > 0) {
                $params[] = $userId; // Add user_id for the WHERE clause
                $types .= "i";       // 'i' for integer user_id

                $sql = "UPDATE " . $tableName . " SET " . implode(", ", $fieldsToUpdate) . " WHERE id = ?";

                // --- Prepare and bind ---
                $stmt = $conn->prepare($sql);

                if ($stmt) {
                    // Dynamically bind parameters
                    // The spread operator (...) unpacks the $params array into individual arguments
                    $stmt->bind_param($types, ...$params);

                    // --- Execute the statement ---
                    if ($stmt->execute()) {
                        if ($stmt->affected_rows > 0) {
                            $response['status'] = 'success';
                            $response['message'] = 'User details updated successfully.';
                        } else {
                            // Query executed, but no rows were changed.
                            // This could mean the user ID was not found, or the new data was the same as the old data.
                            $response['status'] = 'info';
                            $response['message'] = 'No changes were made. User not found or data is the same.';
                        }
                    } else {
                        // Log error to server log
                        error_log("Error executing statement: " . $stmt->error);
                        $response['message'] = "Error updating user: " . $stmt->error; // Provide a generic error in production
                    }
                    $stmt->close();
                } else {
                    // Log error to server log
                    error_log("Error preparing statement: " . $conn->error);
                    $response['message'] = "Error preparing database query.";
                }
            } else {
                // This case should have been caught by the earlier validation,
                // but it's good to have a fallback.
                $response['message'] = "No fields provided for update.";
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
