// Function to fetch data from the backend
async function fetchData(endpoint) {
    const url = new URL(`/api/${endpoint}`, window.location.origin);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Could not fetch ${endpoint}:`, error);
        return null;
    }
}

// Function to load people
async function loadPeople() {
    const people = await fetchData('people');
    if (people) {
        displayPeople(people);
    } else {
        showMessage('Failed to load people', 'error');
    }
}

// Function to display people
function displayPeople(people) {
    const peopleList = document.getElementById('peopleList');
    peopleList.innerHTML = '';

    people.forEach(person => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-light">${person.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-light">${person.jobTitle}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-light text-center">
                <button onclick="deletePerson('${person._id}')" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </td>
        `;
        peopleList.appendChild(row);
    });
}

// Function to add a new person
async function addPerson(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const jobTitle = document.getElementById('jobTitle').value;

    try {
        const response = await fetch('/api/people', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, jobTitle }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Person added:', result);
        document.getElementById('addPersonForm').reset();
        loadPeople();
        showMessage('تمت إضافة الشخص بنجاح', 'success');
    } catch (error) {
        console.error('Error adding person:', error);
        showMessage('حدث خطأ أثناء إضافة الشخص', 'error');
    }
}

// Function to delete a person
async function deletePerson(id) {
    if (confirm('هل أنت متأكد من حذف هذا الشخص؟')) {
        try {
            const response = await fetch(`/api/people/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Person deleted:', id);
            loadPeople();
            showMessage('تم حذف الشخص بنجاح', 'success');
        } catch (error) {
            console.error('Error deleting person:', error);
            showMessage('حدث خطأ أثناء حذف الشخص', 'error');
        }
    }
}

// Function to show messages
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `p-4 rounded-md ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white mb-4`;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Initialize the page
function initializePage() {
    loadPeople();
    const addPersonForm = document.getElementById('addPersonForm');
    if (addPersonForm) {
        addPersonForm.addEventListener('submit', addPerson);
    } else {
        console.error('Add person form not found');
    }
}

// Load people when the page loads
document.addEventListener('DOMContentLoaded', initializePage);
