let customHolidays = [];

// 1. Holiday Logic
function addHoliday() {
    const date = prompt("Enter Holiday Date (YYYY-MM-DD):");
    if (date) {
        customHolidays.push(date);
        const list = document.getElementById('holiday-list');
        if(list) list.innerHTML += `<span style="margin-right:10px; color:#58a6ff;">[${date}]</span>`;
    }
}

// 2. OCR Logic setup
const imageInput = document.getElementById('image-input');
const proceedBtn = document.getElementById('proceed-ocr-btn');
const statusText = document.getElementById('status');

// Show the "Proceed" button once a file is selected
if (imageInput) {
    imageInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            statusText.innerText = "File selected. Click Proceed to scan.";
            proceedBtn.style.display = "block";
        }
    });
}

// Run OCR when "Proceed" is clicked
if (proceedBtn) {
    proceedBtn.addEventListener('click', async () => {
        const files = imageInput.files;
        if (!files || files.length === 0) return;

        proceedBtn.disabled = true;
        statusText.innerText = "🔍 Scanning Timetable... please wait.";
        
        try {
            // Using Tesseract directly from the global window object
            const result = await Tesseract.recognize(files[0], 'eng');
            const text = result.data.text;
            
            // Clean up text: find unique words longer than 3 characters
            const potentialSubjects ={4,}/g))];
            
            if (potentialSubjects && potentialSubjects.length > 0) {
                statusText.innerText = "✅ Scan Complete!";
                proceedBtn.style.display = "none";
                showConfirmation(potentialSubjects); 
            } else {
                statusText.innerText = "❌ No text found. Try a clearer photo.";
                proceedBtn.disabled = false;
            }
        } catch (error) {
            console.error(error);
            statusText.innerText = "Error scanning image. Check console.";
            proceedBtn.disabled = false;
        }
    });
}

// 3. Confirmation UI
function showConfirmation(subjects) {
    const list = document.getElementById('subject-confirm-list');
    const resultPanel = document.getElementById('result-panel');
    if (!list || !resultPanel) return;

    list.innerHTML = "";
    subjects.forEach(sub => {
        list.innerHTML += `
            <div class="subject-item" style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <input type="text" value="${sub}" class="sub-name" style="width:70%;">
                <input type="number" value="3" class="weekly-freq" style="width:60px;" title="Classes per week">
            </div>`;
    });
    resultPanel.style.display = "block";
}

// 4. Final Calculation
const calcBtn = document.getElementById('calculate-btn');
if (calcBtn) {
    calcBtn.addEventListener('click', () => {
        const startVal = document.getElementById('start-month').value;
        const endVal = document.getElementById('end-month').value;
        const criteria = parseInt(document.getElementById('criteria').value) || 75;
        
        if(!startVal || !endVal) {
            alert("Please select start and end months");
            return;
        }

        const start = new Date(startVal);
        const end = new Date(endVal + "-31");
        const offDays = Array.from(document.querySelectorAll('.days-selector input:checked')).map(i => parseInt(i.value));

        let workingDaysCount = 0;
        let tempDate = new Date(start);
        while (tempDate <= end) {
            const day = tempDate.getDay();
            const dateStr = tempDate.toISOString().split('T')[0];
            if (!offDays.includes(day) && !customHolidays.includes(dateStr)) {
                workingDaysCount++;
            }
            tempDate.setDate(tempDate.getDate() + 1);
        }

        document.querySelectorAll('.subject-item').forEach(item => {
            const nameInput = item.querySelector('.sub-name');
            const freqInput = item.querySelector('.weekly-freq');
            
            const name = nameInput.value;
            const freq = parseInt(freqInput.value) || 0;
            const totalClasses = Math.floor((workingDaysCount / 7) * freq);
            const allowedSkips = Math.floor(totalClasses * (1 - (criteria / 100)));
            
            item.innerHTML = `<span style="color:white;">${name}</span> <span class="skips" style="color:#3fb950; font-weight:bold;">${allowedSkips} Skips Allowed</span>`;
        });
    });
}
