<?php
$inputid = $_POST['stdid']; //This links the variable $inputid to the student ID on the login page.
$inputpass = $_POST['psw']; //This links the variable $inputpass to the password on the login page.
$host="sql3.freemysqlhosting.net"; // Host name 
$username="sql3147385"; // Mysql username 
$password="jKtLIsWblp"; // Mysql password 
$db_name="sql3147385"; // Database name 
$tbl_name="members"; // Table name 

$link = mysqli_connect("$host", "$username", "$password", "$db_name");

if (!$link) { //This prints out the errors given if the connection to the mysql database fails
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}
//These are the sql statements that compare the user input to the data in the mysql database.
$query = "SELECT * FROM `members` WHERE `id` = '$inputid'";
$querypass = "SELECT * FROM `members` WHERE `password` = '$inputpass'";

$result = mysqli_query($link,$query);

$resultpass = mysqli_query($link,$querypass);

$row = mysqli_fetch_array($result,MYSQLI_BOTH);
$rowpass = mysqli_fetch_array($resultpass,MYSQLI_ASSOC);

$serveruser = $row["id"];
$serverpass = $row["password"];

if($serveruser&&$serverpass){
    if(!$result){
        die("Username or password in invalid");
    }
    mysqli_close($link);
    if($inputpass == $serverpass){
        header("Location: CalendarPage.html");
    }
    else{
        echo "Student ID or password not found please go back and try again.";
    }
}


?>