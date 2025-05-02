function openPopup() {
    document.getElementById("popupForm").style.display = "flex";
}

function closePopup() {
    document.getElementById("popupForm").style.display = "none";
}

function openCaseDetailPopup(caseData) {
    const caseDetailContent = `
        <p><strong>Case Number:</strong> ${caseData.caseNumber}</p>
        <p><strong>Description:</strong> ${caseData.caseDescription}</p>
        ${caseData.documentPath ? <a href="${caseData.documentPath}" target="_blank">View Document</a> : ''}
        ${caseData.imagePath ? <a href="${caseData.imagePath}" target="_blank">View Image</a> : ''}
        <button onclick="deleteCase('${caseData._id}')">Delete</button>
    `;
    document.getElementById('case-detail-content').innerHTML = caseDetailContent;
    document.getElementById('caseDetailPopup').style.display = 'flex';
}

function closeCaseDetailPopup() {
    document.getElementById("caseDetailPopup").style.display = "none";
}

// Submit case form
document.getElementById('caseForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('caseNumber', document.getElementById('case-number').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('documents', document.getElementById('documents').files[0]);
    formData.append('images', document.getElementById('images').files[0]);

    fetch('/add-case', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
    .then(data => {
        alert('Case submitted successfully');
        closePopup();  // Close popup on success
        loadCases();   // Reload the cases list
    })
    .catch(error => console.error('Error:', error));
});
// Function to load cases
function loadCases() {
    fetch('/cases')
    .then(response => response.json())
    .then(cases => {
        const pendingCasesList = document.getElementById('pending-cases-list');
        const solvedCasesList = document.getElementById('solved-cases-list');
        
        pendingCasesList.innerHTML = '';
        solvedCasesList.innerHTML = '';

        cases.forEach(caseData => {
            const caseElement = document.createElement('div');
            caseElement.className = 'case';
            caseElement.innerHTML = `
                <p><strong>Case Number:</strong> ${caseData.caseName}</p>
                <p><strong>Description:</strong> ${caseData.caseDescription}</p>
            `;
            caseElement.onclick = function() {
                openCaseDetailPopup(caseData);
            };

            if (caseData.caseStatus === 'pending') {
                pendingCasesList.appendChild(caseElement);
            } else if (caseData.caseStatus === 'solved') {
                solvedCasesList.appendChild(caseElement);
            }
        });

        updateEmptyMessages();
    })
    .catch(error => console.error('Error fetching cases:', error));
}

// Function to open case details popup
function openCaseDetailPopup(caseData) {
    const caseDetailContent = `
        <p><strong>Case Number:</strong> ${caseData.caseName}</p>
        <p><strong>Description:</strong> ${caseData.caseDescription}</p>
        ${caseData.caseFile ? <a href="/uploads/documents/${caseData.caseFile}" target="_blank">View Document</a> : ''}
        ${caseData.caseImage ? <img src="/uploads/images/${caseData.caseImage}" width="100" /> : ''}
        <button onclick="markAsSolved('${caseData._id}')">Mark as Solved</button>
        <button onclick="deleteCase('${caseData._id}')">Delete</button>
    `;
    document.getElementById('case-detail-content').innerHTML = caseDetailContent;
    document.getElementById('caseDetailPopup').style.display = 'flex';
}

// Function to mark a case as solved
function markAsSolved(caseId) {
    fetch(`/mark-as-solved/${caseId}`, {
        method: 'PUT',
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadCases();
        closeCaseDetailPopup();
    })
    .catch(error => console.error('Error:', error));
}

// Function to delete a case
function deleteCase(caseId) {
    fetch(`/delete-case/${caseId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadCases();
        closeCaseDetailPopup();
    })
    .catch(error => console.error('Error:', error));
}

// Close the popup
function closeCaseDetailPopup() {
    document.getElementById('caseDetailPopup').style.display = 'none';
}

// Load cases when the page loads
document.addEventListener('DOMContentLoaded', loadCases);