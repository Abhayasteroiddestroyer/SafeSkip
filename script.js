function calculateHolidays(totalClasses, criteria) {
    // Basic logic: If you have 100 classes and need 75%, you can miss 25.
    return Math.floor(totalClasses * (1 - (criteria / 100)));
}

function addSubject() {
    const name = prompt("Enter Subject Name:");
    const classesPerWeek = prompt("Classes per week?");
    const criteria = document.getElementById('criteria').value;
    const months = document.getElementById('duration').value;
    
    // Simple estimation: Weeks in month (4) * Months * Classes/Week
    const estimatedTotal = classesPerWeek * 4 * months;
    const allowed = calculateHolidays(estimatedTotal, criteria);

    const container = document.getElementById('subject-cards');
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = `
        <h3>${name}</h3>
        <p>Total Estimated Classes: ${estimatedTotal}</p>
        <div class="holiday-count">${allowed}</div>
        <p>Holidays allowed without detention</p>
    `;
    container.appendChild(card);
}
const dropArea = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");

// Handle File Selection
fileInput.addEventListener("change", function() {
    handleFile(this.files[0]);
});

// Drag & Drop Listeners
dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("active");
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
});

dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files[0]);
});

function handleFile(file) {
    if (file.type !== "text/csv") {
        alert("Please upload a CSV file!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        displayCSV(text);
    };
    reader.readAsText(file);
}

function displayCSV(data) {
    const rows = data.split("\n");
    let tableHtml = "<table>";
    
    rows.forEach((row, index) => {
        const columns = row.split(",");
        tableHtml += "<tr>";
        columns.forEach(col => {
            tableHtml += index === 0 ? `<th>${col}</th>` : `<td>${col}</td>`;
        });
        tableHtml += "</tr>";
    });
    
    tableHtml += "</table>";
    document.getElementById("table-container").innerHTML = tableHtml;
    document.getElementById("file-preview").style.display = "block";
}
let customHolidays = [];

function addHoliday() {
    const date = prompt("Enter Holiday Date (YYYY-MM-DD):");
    if (date) {
        customHolidays.push(date);
        document.getElementById('holiday-list').innerHTML += `<span>[${date}] </span>`;
    }
}

document.getElementById('image-input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById('status').innerText = "Scanning Timetable...";
    
    // Tesseract OCR
    const { data: { text } } = await Tesseract.recognize(file, 'eng');
    document.getElementById('status').innerText = "Scan Complete. Please confirm.";
    
    // Extract unique words longer than 3 chars as potential subjects
    const potentialSubjects = [...new Set(text.match(/\b[A-Za-z]{4,}\b/g))];
    showConfirmation(potentialSubjects);
});

function showConfirmation(subjects) {
    const list = document.getElementById('subject-confirm-list');
    list.innerHTML = "";
    subjects.forEach(sub => {
        list.innerHTML += `
            <div class="subject-item">
                <input type="text" value="${sub}" class="sub-name">
                <input type="number" value="3" class="weekly-freq" title="Classes per week">
            </div>`;
    });
    document.getElementById('result-panel').style.display = "block";
}

document.getElementById('calculate-btn').addEventListener('click', () => {
    const start = new Date(document.getElementById('start-month').value);
    const end = new Date(document.getElementById('end-month').value + "-31");
    const criteria = parseInt(document.getElementById('criteria').value);
    const offDays = Array.from(document.querySelectorAll('.days-selector input:checked')).map(i => parseInt(i.value));

    // Calculate total working days in range
    let workingDaysCount = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = d.getDay();
        const dateStr = d.toISOString().split('T')[0];
        if (!offDays.includes(day) && !customHolidays.includes(dateStr)) {
            workingDaysCount++;
        }
    }

    // Display final "Safe Skips"
    document.querySelectorAll('.subject-item').forEach(item => {
        const name = item.querySelector('.sub-name').value;
        const freq = parseInt(item.querySelector('.weekly-freq').value);
        
        // Estimate total classes (Weeks * Freq)
        const totalClasses = Math.floor((workingDaysCount / 7) * freq);
        const allowedSkips = Math.floor(totalClasses * (1 - (criteria / 100)));
        
        item.innerHTML = `<span>${name}</span> <span class="skips">${allowedSkips} Skips Allowed</span>`;
    });
});
