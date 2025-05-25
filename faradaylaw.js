function calculateEMF() {
    // Get input values
    const N = parseFloat(document.getElementById("num-turns").value);
    const B = parseFloat(document.getElementById("mag-field").value);
    const A = parseFloat(document.getElementById("coil-area").value);
    const t = parseFloat(document.getElementById("time-interval").value);

    // Ensure inputs are valid numbers
    if (isNaN(N) || isNaN(B) || isNaN(A) || isNaN(t)) {
        document.getElementById("calculated-EMF").textContent = "Invalid input!";
        return;
    }

    // Calculate magnetic flux change rate (dΦ/dt)
    const fluxChangeRate = B * A / t;

    // Calculate induced EMF using Faraday's law
    const EMF = -N * fluxChangeRate;

    // Update the EMF result and color
    const emfElement = document.getElementById("calculated-EMF");
    emfElement.textContent = EMF.toFixed(4);  // Set the EMF value with 4 decimal places

    // Change the color based on the EMF value
    if (EMF < 0) {
        emfElement.classList.remove("positive");
        emfElement.classList.add("negative");
    } else {
        emfElement.classList.remove("negative");
        emfElement.classList.add("positive");
    }
}

// Disable non-numeric input in the fields
document.querySelectorAll('.input-field').forEach(input => {
    input.addEventListener('input', function (event) {
        if (isNaN(event.target.value)) {
            event.target.setCustomValidity("Please enter a valid number");
        } else {
            event.target.setCustomValidity("");
        }
    });
});