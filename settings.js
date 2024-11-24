
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

// Function to load settings
async function loadSettings() {
    const settings = await fetchData('settings');
    if (settings) {
        document.getElementById('initialBalance').value = settings.initialBalance;
        document.getElementById('companyName').value = settings.companyName;
    }
}

// Function to save settings
async function saveSettings(event) {
    event.preventDefault();
    const initialBalance = document.getElementById('initialBalance').value;
    const companyName = document.getElementById('companyName').value;

    try {
        const response = await fetch('http://localhost:5000/api/settings', {
            method: 'PUT',
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
        const response = await fetch('http://localhost:5000/api/backup', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'treasury_backup.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert('تم إنشاء نسخة احتياطية بنجاح');
    } catch (error) {
        console.error('Error backing up data:', error);
        alert('حدث خطأ أثناء إنشاء النسخة الاحتياطية');
    }
}

// Function to restore data
async function restoreData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('backup', file);

        try {
            const response = await fetch('http://localhost:5000/api/restore', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Data restored:', result);
            alert('تم استعادة البيانات بنجاح');
            loadSettings();
        } catch (error) {
            console.error('Error restoring data:', error);
            alert('حدث خطأ أثناء استعادة البيانات');
        }
    };
    input.click();
}

// Function to reset balances
async function resetBalances() {
    if (confirm('هل أنت متأكد من أنك تريد تصفير جميع الأرصدة؟ هذا الإجراء لا يمكن التراجع عنه.')) {
        try {
            const response = await fetch('http://localhost:5000/api/settings/reset-balances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const result = await response.json();
            console.log('Balances reset:', result);
            alert('تم تصفير الأرصدة بنجاح');
            // Reload the settings and update the UI
            await loadSettings();
            // You might want to update other parts of the UI that display balance information
            // For example, you could call a function to update the dashboard:
            // await updateDashboard();
        } catch (error) {
            console.error('Error resetting balances:', error);
            alert(`حدث خطأ أثناء تصفير الأرصدة: ${error.message}`);
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    document.getElementById('settingsForm').addEventListener('submit', saveSettings);
    document.getElementById('backupData').addEventListener('click', backupData);
    document.getElementById('restoreData').addEventListener('click', restoreData);
    document.getElementById('resetBalances').addEventListener('click', resetBalances);
});
