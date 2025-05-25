function calculateEMF() {
    // Get the values from the input fields
    const numTurns = document.getElementById("turns").value; // Number of turns (N)
    const magFieldInitial = document.getElementById("fluxChangeInitial").value; // Initial magnetic field (B₁)
    const magFieldFinal = document.getElementById("fluxChangeFinal").value; // Final magnetic field (B₂)
    const coilArea = document.getElementById("coilArea").value; // Coil area (A)
    const timeInterval = document.getElementById("timeInterval").value; // Time interval (Δt)

    // Calculate the initial and final magnetic flux
    const fluxInitial = magFieldInitial * coilArea; // Φ₁ = B₁ * A
    const fluxFinal = magFieldFinal * coilArea; // Φ₂ = B₂ * A

    // Change in magnetic flux (ΔΦ)
    const deltaFlux = fluxFinal - fluxInitial;

    // Calculate the induced EMF using Faraday's Law of Induction
    const emf = -(numTurns * deltaFlux) / timeInterval;

    // Display the result in the page
    document.getElementById("emfValue").textContent = emf.toFixed(2) + " V";
}
