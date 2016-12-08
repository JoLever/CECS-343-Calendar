<?php
$fName = $_POST['fName'];
$lName = $_POST['lName'];
$inputid = $_POST['stdid'];
$inputpass = $_POST['psw'];
$host="sql3.freemysqlhosting.net"; // Host name 
$username="sql3147385"; // Mysql username 
$password="jKtLIsWblp"; // Mysql password 
$db_name="sql3147385"; // Database name 
$tbl_name="members"; // Table name 

$link = mysqli_connect("$host", "$username", "$password", "$db_name");

if (!$link) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}

$query = "INSERT INTO `members` VALUES ('$inputid', '$fName', '$lName', '$inputpass')";

if($link->query($query) === TRUE){
    echo "Account successfully created!";
     header("Location: calendar.html");
}
else{
    echo "Error has occurred: " . $query . "<br>" . $link->error;
}

mysqli_close($link);
?>