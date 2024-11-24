
// Function to fetch data from the backend
async function fetchData(endpoint, params = {}) {
    const url = new URL(`http://localhost:5000/api/${endpoint}`);
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

// Function to load and display all transactions
async function loadTransactions(searchPerson = '') {
    try {
        const transactions = await fetchData('transactions', searchPerson ? { person: searchPerson } : {});
        displayTransactions(transactions);
    } catch (error) {
        console.error('Error loading transactions:', error);
        alert('Failed to load transactions. Please try again.');
    }
}

// Function to delete a transaction
async function deleteTransaction(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/transactions/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        console.log('Transaction deleted:', id);
        loadTransactions();
    } catch (error) {
        console.error('Error deleting transaction:', error);
        alert(`Failed to delete transaction. Error: ${error.message}`);
    }
}

// Function to display transactions in separate tables for each person
function displayTransactions(transactions) {
    const tablesContainer = document.getElementById('treasuryTables');
    tablesContainer.innerHTML = '';

    if (transactions.length === 0) {
        tablesContainer.innerHTML = '<p class="text-light">No transactions found.</p>';
        return;
    }

    // Group transactions by person
    const transactionsByPerson = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.person._id]) {
            acc[transaction.person._id] = [];
        }
        acc[transaction.person._id].push(transaction);
        return acc;
    }, {});

    // Create a table for each person
    for (const personId in transactionsByPerson) {
        const personTransactions = transactionsByPerson[personId];
        const personName = personTransactions[0].person.name;

        const tableHTML = `
            <div class="bg-gray-800 p-4 rounded shadow">
                <h3 class="text-xl font-semibold text-light mb-4">${personName}</h3>
                <table class="min-w-full divide-y divide-gray-700">
                    <thead class="bg-gray-700">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-light uppercase tracking-wider">التاريخ</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-light uppercase tracking-wider">النوع</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-light uppercase tracking-wider">المبلغ</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-light uppercase tracking-wider">الوصف</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-light uppercase tracking-wider">حذف</th>
                        </tr>
                    </thead>
                    <tbody class="bg-gray-800 divide-y divide-gray-700">
                        ${personTransactions.map(transaction => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-light">${new Date(transaction.date).toLocaleDateString('ar-EG')}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm ${
                                        transaction.type === 'revenue' ? 'text-green-500' : 
                                        transaction.type === 'expense' ? 'text-red-500' : 'text-yellow-500'
                                    }">
                                        ${
                                            transaction.type === 'revenue' ? 'ايراد' : 
                                            transaction.type === 'expense' ? 'مصروف' : 'ايراد علي سبيل الأمانة'
                                        }
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-light">${transaction.amount}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-light">${transaction.description}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <button onclick="deleteTransaction('${transaction._id}')" class="text-red-500 hover:text-red-700">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        tablesContainer.innerHTML += tableHTML;
    }
}

// Event listener for search form
document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchPerson = document.getElementById('searchPerson').value;
    await loadTransactions(searchPerson);
});

// Load all transactions when the page loads
document.addEventListener('DOMContentLoaded', () => loadTransactions());
