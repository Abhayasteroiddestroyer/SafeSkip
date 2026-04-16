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
