let customHolidays = [];

// 1. Holiday Logic
function addHoliday() {
    const date = prompt("Enter Holiday Date (YYYY-MM-DD):");
    if (date) {
        customHolidays.push(date);
        document.getElementById('holiday-list').innerHTML += `<span style="margin-right:10px; color:#58a6ff;">[${date}]</span>`;
    }
}

// 2. OCR Logic
const imageInput = document.getElementById('image-input');
const proceedBtn = document.getElementById('proceed-ocr-btn');
const statusText = document.getElementById('status');

// Show the "Proceed" button once a file is selected
imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        statusText.innerText = "File selected. Click Proceed to scan.";
        proceedBtn.style.display = "block";
    }
});

// Run OCR when "Proceed" is clicked
proceedBtn.addEventListener('click', async () => {
    const file = imageInput.files[0];
    if (!file) return;

    proceedBtn.disabled = true;
    statusText.innerText = "🔍 Scanning Timetable... please wait.";
    
    try {
        const { data: { text } } = await Tesseract.recognize(file, 'eng');
        const potentialSubjects ={4,}\b/g))];
        
        if (potentialSubjects.length > 0) {
            statusText.innerText = "✅ Scan Complete!";
            proceedBtn.style.display = "none";
            showConfirmation(potentialSubjects); 
        } else {
            statusText.innerText = "❌ No text found. Try a clearer photo.";
            proceedBtn.disabled = false;
        }
    } catch (error) {
        statusText.innerText = "Error scanning image.";
        proceedBtn.disabled = false;
    }
});

// 3. Confirmation UI
function showConfirmation(subjects) {
    const list = document.getElementById('subject-confirm-list');
    list.innerHTML = "";
    subjects.forEach(sub => {
        list.innerHTML += `
            <div class="subject-item" style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <input type="text" value="${sub}" class="sub-name">
                <input type="number" value="3" class="weekly-freq" style="width:60px;" title="Classes per week">
            </div>`;
    });
    document.getElementById('result-panel').style.display = "block";
}

// 4. Final Calculation
document.getElementById('calculate-btn').addEventListener('click', () => {
    const start = new Date(document.getElementById('start-month').value);
    const end = new Date(document.getElementById('end-month').value + "-31");
    const criteria = parseInt(document.getElementById('criteria').value);
    const offDays = Array.from(document.querySelectorAll('.days-selector input:checked')).map(i => parseInt(i.value));

    let workingDaysCount = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = d.getDay();
        const dateStr = d.toISOString().split('T')[0];
        if (!offDays.includes(day) && !customHolidays.includes(dateStr)) {
            workingDaysCount++;
        }
    }

    document.querySelectorAll('.subject-item').forEach(item => {
        const name = item.querySelector('.sub-name').value;
        const freq = parseInt(item.querySelector('.weekly-freq').value);
        const totalClasses = Math.floor((workingDaysCount / 7) * freq);
        const allowedSkips = Math.floor(totalClasses * (1 - (criteria / 100)));
        
        item.innerHTML = `<span>${name}</span> <span class="skips" style="color:#3fb950; font-weight:bold;">${allowedSkips} Skips Allowed</span>`;
    });
});
