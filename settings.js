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

// Function to load settings
async function loadSettings() {
    const settings = await fetchData('settings');
    if (settings) {
        document.getElementById('initialBalance').value = settings.initialBalance || 0;
        document.getElementById('companyName').value = settings.companyName || '';
    } else {
        console.error('Failed to load settings');
    }
}

// Function to save settings
async function saveSettings(event) {
    event.preventDefault();
    const initialBalance = document.getElementById('initialBalance').value;
    const companyName = document.getElementById('companyName').value;

    try {
        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ initialBalance, companyName }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Settings saved:', result);
        alert('تم حفظ الإعدادات بنجاح');
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('حدث خطأ أثناء حفظ الإعدادات');
    }
}

// Function to backup data
async function backupData() {
    try {
        const response = await fetch('/api/backup', { method: 'POST' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Backup created:', result);
        alert('تم إنشاء نسخة احتياطية بنجاح');
    } catch (error) {
        console.error('Error creating backup:', error);
        alert('حدث خطأ أثناء إنشاء النسخة الاحتياطية');
    }
}

// Function to restore data
async function restoreData() {
    if (confirm('هل أنت متأكد من استعادة البيانات؟ سيتم استبدال جميع البيانات الحالية.')) {
        try {
            const response = await fetch('/api/restore', { method: 'POST' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log('Data restored:', result);
            alert('تم استعادة البيانات بنجاح');
            location.reload(); // Reload the page to reflect restored data
        } catch (error) {
            console.error('Error restoring data:', error);
            alert('حدث خطأ أثناء استعادة البيانات');
        }
    }
}

// Function to reset balances
async function resetBalances() {
    if (confirm('هل أنت متأكد من تصفير جميع الأرصدة؟ لا يمكن التراجع عن هذا الإجراء.')) {
        try {
            const response = await fetch('/api/reset-balances', { method: 'POST' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log('Balances reset:', result);
            alert('تم تصفير الأرصدة بنجاح');
            loadSettings(); // Reload settings to reflect the changes
        } catch (error) {
            console.error('Error resetting balances:', error);
            alert('حدث خطأ أثناء تصفير الأرصدة');
        }
    }
}

// Initialize the page
function initializePage() {
    loadSettings();
    const settingsForm = document.getElementById('settingsForm');
    const backupButton = document.getElementById('backupData');
    const restoreButton = document.getElementById('restoreData');
    const resetBalancesButton = document.getElementById('resetBalances');
    
    if (settingsForm) {
        settingsForm.addEventListener('submit', saveSettings);
    } else {
        console.error('Settings form not found');
    }
    
    if (backupButton) {
        backupButton.addEventListener('click', backupData);
    } else {
        console.error('Backup button not found');
    }
    
    if (restoreButton) {
        restoreButton.addEventListener('click', restoreData);
    } else {
        console.error('Restore button not found');
    }
    
    if (resetBalancesButton) {
        resetBalancesButton.addEventListener('click', resetBalances);
    } else {
        console.error('Reset balances button not found');
    }
}

// Load settings when the page loads
document.addEventListener('DOMContentLoaded', initializePage);
