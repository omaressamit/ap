
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>الإعدادات - إدارة الخزينة</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Cairo', 'Arial', 'sans-serif'],
                    },
                    backgroundColor: {
                        'dark': '#1a1a1a',
                    },
                    textColor: {
                        'light': '#e0e0e0',
                    },
                },
            },
        }
    </script>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
    </style>
    <script src="logout.js"></script>
</head>
<body class="bg-dark text-light">
<div class="container">
<div class="row">
    <div class="flex h-screen">
        <!-- Sidebar -->
        <aside class="w-64 bg-gray-800 shadow-md">
            <div class="p-4">
                <h1 class="text-2xl font-bold text-light">شركة الشريف</h1>
            </div>
            <nav class="mt-4">
                <a href="index.html" class="block py-2 px-4 text-light hover:bg-gray-700">
                    <i class="fas fa-tachometer-alt ml-3"></i><span class="ml-3">لوحة التحكم</span>
                </a>
                <a href="people.html" class="block py-2 px-4 text-light hover:bg-gray-700">
                    <i class="fas fa-users ml-3"></i><span class="ml-3">الأشخاص</span>
                </a>
                <a href="transactions.html" class="block py-2 px-4 text-light hover:bg-gray-700">
                    <i class="fas fa-exchange-alt ml-3"></i><span class="ml-3">المعاملات المالية</span>
                </a>
                <a href="treasury.html" class="block py-2 px-4 text-light hover:bg-gray-700">
                    <i class="fas fa-money-bill-wave ml-3"></i><span class="ml-3">حركة الخزينة</span>
                </a>
                <a href="receipts.html" class="block py-2 px-4 text-light hover:bg-gray-700">
                    <i class="fas fa-receipt ml-3"></i><span class="ml-3">طباعة الفواتير</span>
                </a>
                <a href="settings.html" class="block py-2 px-4 text-light bg-gray-700">
                    <i class="fas fa-cog ml-3"></i><span class="ml-3">الإعدادات</span>
                </a>
                <a href="#" onclick="logout()" class="block py-2 px-4 text-light hover:bg-gray-700">
                    <i class="fas fa-sign-out-alt ml-3"></i><span class="ml-3">تسجيل الخروج</span>
                </a>
            </nav>
        </aside>

        <!-- Main content -->
        <main class="flex-1 p-8 bg-dark">
            <h2 class="text-3xl font-bold text-light mb-4">الإعدادات</h2>
            <div class="bg-gray-800 p-4 rounded shadow">
                <h3 class="text-xl font-semibold text-light mb-4">إعدادات الخزينة</h3>
                <form id="settingsForm" class="space-y-4">
                    <div>
                        <label for="initialBalance" class="block text-sm font-medium text-light">الرصيد الابتدائي</label>
                        <input type="number" id="initialBalance" name="initialBalance" required class="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-700 text-white">
                    </div>
                    <div>
                        <label for="companyName" class="block text-sm font-medium text-light">اسم الشركة</label>
                        <input type="text" id="companyName" name="companyName" required class="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-700 text-white">
                    </div>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        حفظ الإعدادات
                    </button>
                </form>
            </div>
            <div class="mt-8 bg-gray-800 p-4 rounded shadow">
                <h3 class="text-xl font-semibold text-light mb-4">إدارة البيانات</h3>
                <div class="space-y-4">
                    <button id="backupData" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        نسخ احتياطي للبيانات
                    </button>
                    <button id="restoreData" class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                        استعادة البيانات
                    </button>
                    <button id="resetBalances" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        تصفير الأرصدة
                    </button>
                </div>
            </div>
        </main>
    </div>
    <script src="settings.js"></script>
</div>
</div>
<footer class="text-light text-center py-2 text-xs">
    ENG-OMAR ESSAM
</footer>
</body>
</html>
