
function checkNumber() {

    // Generate a random integer between 1 and 100
    let randomNumber = Math.floor(Math.random() * 100) + 1;

    // Display the generated number
    document.getElementById("number").innerHTML =
        "Generated Number: " + randomNumber;

    // Check even or odd
    if (randomNumber % 2 === 0) {
        document.getElementById("result").innerHTML =
            "The number is EVEN";
    } else {
        document.getElementById("result").innerHTML =
            "The number is ODD";
    }
}
