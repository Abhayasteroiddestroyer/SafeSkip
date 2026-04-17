function calculateSkip() {
    const subject = document.getElementById('subject').value || "this subject";
    const criteria = parseFloat(document.getElementById('criteria').value) / 100;
    const attended = parseInt(document.getElementById('attended').value);
    const total = parseInt(document.getElementById('total').value);
    const resultDiv = document.getElementById('result');

    if (isNaN(attended) || isNaN(total) || total === 0) {
        alert("Please enter valid numbers");
        return;
    }

    const currentPerc = (attended / total) * 100;
    resultDiv.style.display = "block";

    if (currentPerc < (criteria * 100)) {
        // Calculate how many more they need to attend
        let moreNeeded = 0;
        let tempAttended = attended;
        let tempTotal = total;
        while ((tempAttended / tempTotal) < criteria) {
            tempAttended++;
            tempTotal++;
            moreNeeded++;
        }
        resultDiv.innerHTML = `<h3>Attendance: ${currentPerc.toFixed(1)}%</h3>
                               <p style="color: #ef4444;">Warning! You cannot skip. Attend the next <strong>${moreNeeded}</strong> classes to reach ${criteria * 100}%.</p>`;
    } else {
        // Calculate safe skips
        let safeSkips = 0;
        let tempTotal = total;
        while ((attended / (tempTotal + 1)) >= criteria) {
            tempTotal++;
            safeSkips++;
        }
        resultDiv.innerHTML = `<h3>Attendance: ${currentPerc.toFixed(1)}%</h3>
                               <p style="color: #4ade80;">You are safe! You can skip <strong>${safeSkips}</strong> more classes for ${subject}.</p>`;
    }
}
