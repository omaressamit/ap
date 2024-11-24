
// Function to fetch data from the backend
async function fetchData(endpoint) {
    try {
        const response = await fetch(`http://localhost:5000/api/${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Could not fetch ${endpoint}:`, error);
    }
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

// Function to generate receipt
async function generateReceipt(event) {
    event.preventDefault();
    const personId = document.getElementById('person').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    try {
        const response = await fetch('http://localhost:5000/api/transactions/receipt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ personId, startDate, endDate }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const receiptData = await response.json();
        displayReceipt(receiptData);
    } catch (error) {
        console.error('Error generating receipt:', error);
        alert('حدث خطأ أثناء إنشاء الفاتورة');
    }
}

// Function to display receipt
function displayReceipt(receiptData) {
    const receiptContainer = document.getElementById('receiptContainer');
    receiptContainer.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">فاتورة</h2>
        <p><strong>اسم الشخص:</strong> ${receiptData.personName}</p>
        <p><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
        <table class="w-full mt-4">
            <thead>
                <tr>
                    <th class="border px-4 py-2">التاريخ</th>
                    <th class="border px-4 py-2">النوع</th>
                    <th class="border px-4 py-2">المبلغ</th>
                    <th class="border px-4 py-2">الوصف</th>
                </tr>
            </thead>
            <tbody>
                ${receiptData.transactions.map(transaction => `
                    <tr>
                        <td class="border px-4 py-2">${new Date(transaction.date).toLocaleDateString('ar-SA')}</td>
                        <td class="border px-4 py-2">${transaction.type === 'revenue' ? 'إيراد' : 'مصروف'}</td>
                        <td class="border px-4 py-2">${transaction.amount} جنيه</td>
                        <td class="border px-4 py-2">${transaction.description}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <p class="mt-4"><strong>الإجمالي:</strong> ${receiptData.total} جنيه</p>
    `;
    receiptContainer.style.display = 'block';
    window.print();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadPeople();
    document.getElementById('printForm').addEventListener('submit', generateReceipt);
});
