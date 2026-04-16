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
