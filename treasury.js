// Function to fetch data from the backend
async function fetchData(endpoint, params = {}) {
    const url = new URL(`/api/${endpoint}`, window.location.origin);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Could not fetch ${endpoint}:`, error);
        throw error;
    }
}

// Function to load transactions
async function loadTransactions() {
    try {
        const transactions = await fetchData('transactions');
        displayTransactions(transactions);
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// Function to display transactions in separate tables for each person
function displayTransactions(transactions) {
    const tablesContainer = document.getElementById('treasuryTables');
    tablesContainer.innerHTML = '';

    const personTransactions = {};

    transactions.forEach(transaction => {
        const personName = transaction.person ? transaction.person.name : 'غير محدد';
        if (!personTransactions[personName]) {
            personTransactions[personName] = [];
        }
        personTransactions[personName].push(transaction);
    });

    for (const [personName, personTrans] of Object.entries(personTransactions)) {
        const table = document.createElement('table');
        table.className = 'w-full mb-8 bg-gray-800';
        table.innerHTML = `
            <thead>
                <tr>
                    <th colspan="4" class="py-2 px-4 bg-gray-700 text-left">${personName}</th>
                </tr>
                <tr>
                    <th class="py-2 px-4 text-left">التاريخ</th>
                    <th class="py-2 px-4 text-left">النوع</th>
                    <th class="py-2 px-4 text-left">المبلغ</th>
                    <th class="py-2 px-4 text-left">الوصف</th>
                </tr>
            </thead>
            <tbody>
                ${personTrans.map(transaction => `
                    <tr>
                        <td class="py-2 px-4">${formatDate(transaction.date)}</td>
                        <td class="py-2 px-4">${transaction.type === 'income' ? 'دخل' : 'مصروف'}</td>
                        <td class="py-2 px-4">${transaction.amount} جنيه</td>
                        <td class="py-2 px-4">${transaction.description}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        tablesContainer.appendChild(table);
    }
}

// Function to format date to Gregorian (DD/MM/YYYY)
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Load transactions when the page loads
document.addEventListener('DOMContentLoaded', loadTransactions);
