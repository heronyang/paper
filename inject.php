<?php

error_reporting(-1);
ini_set('display_errors', 'On');

$con=mysqli_connect("localhost", "anony", "Id4832II6JHo7", "test_db");
// Check connection
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$result = mysqli_query($con,"SELECT * FROM students WHERE name=" + $_GET['name']);

echo $_GET['name'];
echo "<table border='1'>
    <tr>
    <th>Score 1</th>
    <th>Score 2</th>
    </tr>";

while($row = mysqli_fetch_array($result)) {
    echo "<tr>";
    echo "<td>" . $row['s1'] . "</td>";
    echo "<td>" . $row['s2'] . "</td>";
    echo "</tr>";
}

echo "</table>";

mysqli_close($con);
?>
