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
    const personSelect = document.getElementById('personSelect');
    if (people && personSelect) {
        personSelect.innerHTML = '<option value="">اختر شخصًا</option>';
        people.forEach(person => {
            const option = document.createElement('option');
            option.value = person._id;
            option.textContent = person.name;
            personSelect.appendChild(option);
        });
    } else {
        console.error('Failed to load people or personSelect not found');
    }
}

// Function to generate receipt
function generateReceipt() {
    const personSelect = document.getElementById('personSelect');
    const amountInput = document.getElementById('amountInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const receiptTypeSelect = document.getElementById('receiptTypeSelect');
    const receiptContent = document.getElementById('receiptContent');
    const printButton = document.getElementById('printButton');

    if (!personSelect || !amountInput || !descriptionInput || !receiptTypeSelect || !receiptContent || !printButton) {
        console.error('One or more required elements not found');
        return;
    }

    const personName = personSelect.options[personSelect.selectedIndex].text;
    const amount = amountInput.value;
    const description = descriptionInput.value;
    const receiptType = receiptTypeSelect.value;

    receiptContent.innerHTML = `
        <div class="bg-white text-black p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 class="text-2xl font-bold mb-4 text-center">${receiptType === 'income' ? 'إيصال استلام' : 'إيصال صرف'}</h2>
            <p class="mb-2"><strong>الاسم:</strong> ${personName}</p>
            <p class="mb-2"><strong>المبلغ:</strong> ${amount} جنيه</p>
            <p class="mb-2"><strong>الوصف:</strong> ${description}</p>
            <p class="mb-4"><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-EG')}</p>
            <div class="flex justify-between">
                <div>
                    <p class="mb-2">توقيع المستلم</p>
                    <div class="w-32 h-16 border-b border-black"></div>
                </div>
                <div>
                    <p class="mb-2">توقيع المسؤول</p>
                    <div class="w-32 h-16 border-b border-black"></div>
                </div>
            </div>
        </div>
    `;

    // Show the print button
    printButton.classList.remove('hidden');
}

// Function to print the receipt
function printReceipt() {
    const receiptContent = document.getElementById('receiptContent');
    if (!receiptContent) {
        console.error('Receipt content not found');
        return;
    }
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Receipt</title>');
    printWindow.document.write('<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">');
    printWindow.document.write('</head><body>');
    printWindow.document.write(receiptContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// Initialize the page
function initializePage() {
    loadPeople();
    const generateButton = document.getElementById('generateButton');
    const printButton = document.getElementById('printButton');
    
    if (generateButton) {
        generateButton.addEventListener('click', generateReceipt);
    } else {
        console.error('Generate button not found');
    }
    
    if (printButton) {
        printButton.addEventListener('click', printReceipt);
    } else {
        console.error('Print button not found');
    }
}

// Load people when the page loads
document.addEventListener('DOMContentLoaded', initializePage);
