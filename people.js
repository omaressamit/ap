// Function to fetch data from the backend
async function fetchData(endpoint) {
    try {
        const response = await fetch(`/api/${endpoint}`);
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
    } catch (error) {
        console.error('Error adding person:', error);
    }
}

// Function to delete a person
async function deletePerson(id) {
    try {
        const response = await fetch(`/api/people/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Person deleted:', id);
        loadPeople();
    } catch (error) {
        console.error('Error deleting person:', error);
    }
}

// Function to load and display all people
async function loadPeople() {
    try {
        const people = await fetchData('people');
        displayPeople(people);
    } catch (error) {
        console.error('Error loading people:', error);
    }
}

// Function to display people
function displayPeople(people) {
    const peopleList = document.getElementById('peopleList');
    if (!peopleList) {
        console.error('Element with id "peopleList" not found');
        return;
    }
    peopleList.innerHTML = '';

    people.forEach(person => {
        const li = document.createElement('li');
        li.className = 'mb-2';
        li.innerHTML = `
            <span>${person.name} - ${person.jobTitle}</span>
            <button onclick="deletePerson('${person._id}')" class="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">حذف</button>
        `;
        peopleList.appendChild(li);
    });
}

// Initialize the page
function initializePage() {
    const addPersonForm = document.getElementById('addPersonForm');
    if (addPersonForm) {
        addPersonForm.addEventListener('submit', addPerson);
    } else {
        console.error('Element with id "addPersonForm" not found');
    }
    loadPeople();
}

// Load people when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializePage);
