function calculateEMF() {
    // Get the values from the input fields
    const numTurns = document.getElementById("num-turns").value; // Number of turns (N)
    const magFieldInitial = document.getElementById("mag-field-initial").value; // Initial magnetic field (T)
    const magFieldFinal = document.getElementById("mag-field-final").value; // Final magnetic field (T)
    const coilArea = document.getElementById("coil-area").value; // Coil area (m²)
    const timeInterval = document.getElementById("time-interval").value; // Time interval (s)

    // Calculate the initial and final magnetic flux
    const fluxInitial = magFieldInitial * coilArea; // Φ_initial = B_initial * A
    const fluxFinal = magFieldFinal * coilArea; // Φ_final = B_final * A

    // Change in magnetic flux (ΔΦ)
    const deltaFlux = fluxFinal - fluxInitial;

    // Calculate the induced EMF using Faraday's Law
    const emf = -(numTurns * deltaFlux) / timeInterval;

    // Display the result in the span with id 'calculated-EMF'
    document.getElementById("calculated-EMF").textContent = emf.toFixed(2);
}
