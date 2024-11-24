
// Function to fetch data from the backend
async function fetchData(endpoint) {
    try {
        const response = await fetch(`https://elshreef.netlify.app/api/${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Could not fetch ${endpoint}:`, error);
    }
}

// Function to add a new person
async function addPerson(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const jobTitle = document.getElementById('jobTitle').value;

    try {
        const response = await fetch('https://elshreef.netlify.app/api/people', {
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
    } catch (error) {
        console.error('Error adding person:', error);
    }
}

// Function to delete a person
async function deletePerson(id) {
    try {
        const response = await fetch(`https://elshreef.netlify.app/api/people/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'delete' }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        console.log('Person deleted:', id);
        loadPeople();
    } catch (error) {
        console.error('Error deleting person:', error);
        alert(`Failed to delete person. Error: ${error.message}`);
    }
}

// Function to load people
async function loadPeople() {
    const peopleTable = document.getElementById('peopleTable').getElementsByTagName('tbody')[0];
    peopleTable.innerHTML = '';

    const people = await fetchData('people');

    people.forEach(person => {
        const row = peopleTable.insertRow();
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-light">${person.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-light">${person.jobTitle}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-light">
                <button onclick="deletePerson('${person._id}')" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    });
}

// Event listeners
document.getElementById('addPersonForm').addEventListener('submit', addPerson);
document.addEventListener('DOMContentLoaded', loadPeople);
