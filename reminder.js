// Sample case data
const cases = [
    { update: "Case A", time: "10:00 AM", date: "2024-09-10", place: "Court 1", status: "Pending" },
    { update: "Case B", time: "11:30 AM", date: "2024-09-11", place: "Court 2", status: "Solved" },
    { update: "Case C", time: "01:00 PM", date: "2024-09-12", place: "Court 3", status: "Pending" }
];

function loadCases() {
    const caseList = document.getElementById('case-list');
    caseList.innerHTML = ''; // Clear existing cases
    cases.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)); // Sort by date and time

    cases.forEach((caseItem, index) => {
        const caseRow = document.createElement('div');
        caseRow.classList.add('case-row');

        caseRow.innerHTML = `
            <div>${caseItem.update}</div>
            <div>${caseItem.time}</div>
            <div>${caseItem.place}</div>
            <div>${caseItem.status}</div>
        `;

        const detailsDropdown = document.createElement('div');
        detailsDropdown.className = 'case-row-details';
        detailsDropdown.innerHTML = `
            <button onclick="markAsCompleted(${index})">Completed</button>
            <button onclick="removeReminder(${index})">Remove</button>
        `;

        caseRow.appendChild(detailsDropdown);
        caseRow.onclick = function () {
            detailsDropdown.style.display = detailsDropdown.style.display === 'none' ? 'flex' : 'none';
        };

        caseList.appendChild(caseRow);
    });
}

// Popup handling
function openAddReminderPopup() {
    document.getElementById("addReminderPopup").style.display = "flex";
}

function closeAddReminderPopup() {
    document.getElementById("addReminderPopup").style.display = "none";
}

// Add reminder function
function addReminder() {
    const update = document.getElementById("reminder-update").value;
    const time = document.getElementById("reminder-time").value;
    const date = document.getElementById("reminder-date").value;
    const place = document.getElementById("reminder-place").value;

    if (update && time && date && place) {
        cases.push({ update, time, date, place, status: "Pending" });
        loadCases();
        closeAddReminderPopup();
        alert("Reminder added successfully!");
    } else {
        alert("Please fill in all fields.");
    }
}

// Mark reminder as completed
function markAsCompleted(index) {
    cases[index].status = "Completed";
    loadCases();
}

// Remove reminder
function removeReminder(index) {
    cases.splice(index, 1);
    loadCases();
}

// Notification check for reminders
function checkReminders() {
    const now = new Date();
    cases.forEach(caseItem => {
        const reminderTime = new Date(`${caseItem.date}T${caseItem.time}`);
        if (caseItem.status === "Pending" && now >= reminderTime) {
            // Show a browser notification
            if (Notification.permission === "granted") {
                new Notification(`Reminder: ${caseItem.update}`, {
                    body: `At ${caseItem.time}, ${caseItem.place}`,
                    icon: "logo.png" // Path to your notification icon
                });
            } else {
                console.warn("Notification permission not granted.");
            }

            // Mark the case as "Completed" after notifying
            caseItem.status = "Completed";
            loadCases(); // Update the UI to reflect the status change
        }
    });
}

// Request notification permission from the user on page load
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Check reminders every minute
setInterval(checkReminders, 60000);

// Load cases on page load
document.addEventListener('DOMContentLoaded', loadCases);

// Load cases from the database using AJAX
function loadCases() {
    const caseList = document.getElementById('case-list');
    caseList.innerHTML = ''; // Clear existing cases

    // Fetch cases from the database using AJAX
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "getReminders.php", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const reminders = JSON.parse(xhr.responseText);
            reminders.forEach((caseItem, index) => {
                const caseRow = document.createElement('div');
                caseRow.classList.add('case-row');

                caseRow.innerHTML = `
                    <div>${caseItem.update_text}</div>
                    <div>${caseItem.reminder_time}</div>
                    <div>${caseItem.reminder_place}</div>
                    <div>${caseItem.status}</div>
                `;

                const detailsDropdown = document.createElement('div');
                detailsDropdown.className = 'case-row-details';
                detailsDropdown.innerHTML = `
                    <button onclick="markAsCompleted(${index})">Completed</button>
                    <button onclick="removeReminder(${index})">Remove</button>
                `;

                caseRow.appendChild(detailsDropdown);
                caseRow.onclick = function () {
                    detailsDropdown.style.display = detailsDropdown.style.display === 'none' ? 'flex' : 'none';
                };

                caseList.appendChild(caseRow);
            });
        } else {
            console.error("Error fetching reminders.");
        }
    };
    xhr.send();
}
