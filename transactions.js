
// Configure the base URL for API calls
const API_BASE_URL = 'https://elshreef.netlify.app/api';

// Function to fetch data from the backend
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Could not fetch ${endpoint}:`, error);
        throw error;
    }
}

// Function to add a new transaction
async function addTransaction(event) {
    event.preventDefault();
    const person = document.getElementById('person').value;
    const type = document.getElementById('type').value;
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;

    try {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ person, type, amount, description }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Transaction added:', result);
        document.getElementById('addTransactionForm').reset();
        loadTransactions();
    } catch (error) {
        console.error('Error adding transaction:', error);
    }
}

// Function to format date to Gregorian (DD/MM/YYYY)
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Function to load and display transactions
async function loadTransactions() {
    const transactions = await fetchData('transactions');
    const tableBody = document.querySelector('#transactionsTable tbody');
    tableBody.innerHTML = '';

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-light">${transaction.person.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm ${
                    transaction.type === 'revenue' ? 'text-green-400' : 
                    transaction.type === 'expense' ? 'text-red-400' : 'text-yellow-400'
                }">${
                    transaction.type === 'revenue' ? 'إيراد' : 
                    transaction.type === 'expense' ? 'مصروف' : 'ايراد علي سبيل الأمانة'
                }</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-light">${transaction.amount} جنيه</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-light">${transaction.description}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-light">${formatDate(transaction.date)}</div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to load people for the dropdown
async function loadPeople() {
    const people = await fetchData('people');
    const personSelect = document.getElementById('person');
    personSelect.innerHTML = '<option value="">اختر شخصًا</option>';
    people.forEach(person => {
        const option = document.createElement('option');
        option.value = person._id;
        option.textContent = person.name;
        personSelect.appendChild(option);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadTransactions();
    loadPeople();
    document.getElementById('addTransactionForm').addEventListener('submit', addTransaction);
});
