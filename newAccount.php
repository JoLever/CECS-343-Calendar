<?php
/*
This php file connects to the database to create a new student calendar.
*/
$fName = $_POST['fName'];
$lName = $_POST['lName'];
$inputid = $_POST['stdid'];
$inputpass = $_POST['psw'];
$host="sql3.freemysqlhosting.net"; // Host name 
$username="sql3148485"; // Mysql username 
$password="B5Pw7Qz4Q3"; // Mysql password 
$db_name="sql3148485"; // Database name 
$tbl_name="members"; // Table name

$link = mysqli_connect("$host", "$username", "$password", "$db_name");//links to the database

if (!$link) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}

$query = "INSERT INTO `members` VALUES ('$inputid', '$fName', '$lName', '$inputpass')";//this inserts the user's first name, last name, student ID, and password.

if($link->query($query) === TRUE){//if it links to the database and writes successfully it will redirect back to the homepage.
    echo "Account successfully created!";
     header("Location: calendar.html");
}
else{
    echo "Error has occurred: " . $query . "<br>" . $link->error;//If an error occurs it will print out the error thrown.
}

mysqli_close($link);
?>