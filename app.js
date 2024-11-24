
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

// Function to update dashboard
async function updateDashboard() {
    const transactions = await fetchData('transactions');
    const settings = await fetchData('settings');

    if (transactions && settings) {
        let totalRevenue = 0;
        let totalExpenses = 0;

        transactions.forEach(transaction => {
            if (transaction.type === 'revenue') {
                totalRevenue += transaction.amount;
            } else if (transaction.type === 'expense') {
                totalExpenses += transaction.amount;
            }
        });

        const balance = settings.initialBalance + totalRevenue - totalExpenses;

        document.querySelector('.text-green-400').textContent = `${totalRevenue.toFixed(2)} جنيه`;
        document.querySelector('.text-red-400').textContent = `${totalExpenses.toFixed(2)} جنيه`;
        document.querySelector('.text-blue-400').textContent = `${balance.toFixed(2)} جنيه`;
    }
}

// Call updateDashboard when the page loads
document.addEventListener('DOMContentLoaded', updateDashboard);
