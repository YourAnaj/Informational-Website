function calculatePeakEMF() {
    const N = parseFloat(document.getElementById("turns").value);
    const B = parseFloat(document.getElementById("magneticField").value);
    const A = parseFloat(document.getElementById("coilArea").value);
    const f = parseFloat(document.getElementById("frequency").value);

    if (!N || !B || !A || !f) {
        document.getElementById("result").textContent = "Please enter all values!";
        return;
    }

    const ω = 2 * Math.PI * f;
    const EMFpeak = N * B * A * ω;

    document.getElementById("result").textContent = "Peak EMF: " + EMFpeak.toFixed(2) + " V";
}
