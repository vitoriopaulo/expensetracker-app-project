window.onerror = function (message, source, lineno, colno, error) {
    console.error("Global Error:", {
        message,
        source,
        lineno,
        colno,
        error,
    });
};





let _currentMonthIndex = new Date().getMonth();
Object.defineProperty(window, 'currentMonthIndex', {
    get() {
        return _currentMonthIndex;
    },
    set(value) {
        console.trace(`currentMonthIndex updated to: ${value}`);
        _currentMonthIndex = value;
    }
});



// Reset local storage for testing
localStorage.removeItem('user');
console.log("Local storage has been reset for testing.");



localStorage.clear();
console.log("Local storage has been reset for testing.");



// Boilerplate expenses
const defaultExpenses = [
    { name: "Rent", amount: 0 },
    { name: "Condo Fee", amount: 0 },
    { name: "Property Tax", amount: 0 },
    { name: "Groceries", amount: 0 },
    { name: "Utilities", amount: 0 },
    { name: "Health Plan", amount: 0 },
    { name: "Medicines", amount: 0 },
    { name: "Doctors Appointments", amount: 0 },
    { name: "Psychotherapy", amount: 0 },
    { name: "Gym Membership", amount: 0 },
    { name: "Fitness Classes", amount: 0 },
    { name: "Dining Out", amount: 0 },
    { name: "Movies and Events", amount: 0 },
    { name: "Hobbies", amount: 0 },
    { name: "Travel Expenses", amount: 0 },
    { name: "Personal Care", amount: 0 },
    { name: "Education", amount: 0 },
    { name: "Miscellaneous", amount: 0 }
];

// Global variables
let expensePieChart;
let currentBudget = 0; // Tracks the set budget
let totalExpenses = 0; // Tracks the total expenses
let currentMonthExpenses = getCurrentMonthExpenses();
let monthlyBudget = 0;





function updateCurrentMonthExpenses() {
    currentMonthExpenses = getCurrentMonthExpenses();
    console.log("Updated Current Month Expenses:", currentMonthExpenses);
}






function getCurrentMonthExpenses() {
    const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let currentMonthData = allExpenses.find(exp => exp.month === currentMonthIndex);

    // Initialize current month data if not found
    if (!currentMonthData) {
        currentMonthData = {
            month: currentMonthIndex,
            data: defaultExpenses.map(exp => ({ ...exp }))
        };
        allExpenses.push(currentMonthData);
        localStorage.setItem('expenses', JSON.stringify(allExpenses));
    }

    // Debugging log: Verify the data being returned
    console.log("Current Month Expenses:", currentMonthData.data);

    return currentMonthData.data;
}


    




function saveExpenses() {
    const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const updatedExpenses = Array.from(document.querySelectorAll('#expense-list li')).map((item, index) => {
        const amountText = item.querySelector('span').textContent;
        const amount = parseFloat(amountText.replace('$', ''));
        return { ...defaultExpenses[index], amount, month: currentMonthIndex };
    });

    const filteredExpenses = allExpenses.filter(exp => exp.month !== currentMonthIndex);
    localStorage.setItem('expenses', JSON.stringify([...filteredExpenses, { month: currentMonthIndex, data: updatedExpenses }]));

    console.log("Expenses Saved for Current Month:", updatedExpenses);
    showFeedbackPopup("Expenses saved successfully!");
    updateCurrentMonthExpenses(); // Refresh global variable
    checkBudgetAlerts();
}






    // Add the checkBudgetAlerts function here
    function checkBudgetAlerts() {
        const totalExpenses = getCurrentMonthExpenses().reduce((sum, expense) => sum + expense.amount, 0);
        const usagePercentage = (totalExpenses / monthlyBudget) * 100;
    
        console.log(`checkBudgetAlerts: Total Expenses: ${totalExpenses}, Budget: ${monthlyBudget}, Usage Percentage: ${usagePercentage.toFixed(2)}%`);
    
        if (usagePercentage >= 80 && usagePercentage < 100) {
            console.log("Budget warning triggered for usage >= 80% and < 100%.");
            showWarningModal("Warning: You've used 80% of your budget.", usagePercentage);
        } else if (usagePercentage >= 100) {
            console.log("Critical alert triggered for usage >= 100%.");
            showWarningModal("Critical Alert: You've reached or exceeded your budget!", usagePercentage);
        } else {
            console.log("No alerts triggered. Budget usage is within safe limits.");
        }
    }
    
    
    
    



    document.getElementById('save-expenses').addEventListener('click', function () {
        const totalExpenses = getCurrentMonthExpenses().reduce((sum, expense) => sum + expense.amount, 0);
        const usagePercentage = (totalExpenses / monthlyBudget) * 100;
    
        console.log(`Budget Usage: ${usagePercentage.toFixed(2)}%`);
        checkBudgetAlerts();
        updateBudgetProgress();
    });
    
    


    function showWarningModal(message, usagePercentage) {
        const modal = document.getElementById('warning-modal');
        const messageElement = document.getElementById('warning-message');
        const progressBar = modal.querySelector('.progress-bar');
    
        console.log("showWarningModal called with:", { message, usagePercentage });
    
        if (!modal || !messageElement || !progressBar) {
            console.error("showWarningModal: Required elements are missing.");
            return;
        }
    
        // Update the message text
        messageElement.textContent = message;
    
        // Style the progress bar dynamically
        const barWidth = `${Math.min(usagePercentage, 100)}%`;
        progressBar.style.width = barWidth;
    
        if (usagePercentage >= 100) {
            progressBar.style.backgroundColor = 'red';
            console.log("Progress bar color set to red for critical alert.");
        } else if (usagePercentage >= 80) {
            progressBar.style.backgroundColor = 'yellow';
            console.log("Progress bar color set to yellow for warning.");
        } else {
            progressBar.style.backgroundColor = 'green';
            console.log("Progress bar color set to green for safe usage.");
        }
    
        // Show the modal
        modal.style.display = 'block';
    
        // Close modal on OK button click
        document.getElementById('warning-ok-button').onclick = () => {
            modal.style.display = 'none';
            console.log("Modal closed via OK button.");
        };
    
        // Close modal on outside click
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                console.log("Modal closed via outside click.");
            }
        };
    }
    
    
    
    
    
    


function initializeMonthlyCalendar() {
    displayCurrentMonth();
}




// Handle Sign Up
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    console.log("Entered email during Sign Up:", email); // Debugging log for email
    console.log("Entered username during Sign Up:", username); // Debugging log for username

    if (!email || !username || !password) {
        showFeedbackPopup("All fields are required. Please fill out the form.");
        return;
    }

    if (password !== confirmPassword) {
        showFeedbackPopup("Passwords do not match. Try again!");
        return;
    }

    // Encrypt the password
    const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret-key').toString();

    // Save the user data
    const userData = { email, username, password: encryptedPassword };
    localStorage.setItem('user', JSON.stringify(userData));

    console.log("User data saved after Sign Up:", userData); // Debugging log for saved data
    showFeedbackPopup("Sign Up successful!");
    resetSignupForm();
});




// Handle Log In
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const loginEmail = document.getElementById('login-email').value.trim();
    const loginPassword = document.getElementById('login-password').value.trim();

    console.log("Entered email during Log In:", loginEmail); // Debugging log for login email

    if (!loginEmail || !loginPassword) {
        showFeedbackPopup("Please enter your email and password.");
        return;
    }

    // Retrieve user data from local storage
    const storedData = localStorage.getItem('user');
    if (!storedData) {
        showFeedbackPopup("No user data found. Please Sign Up first.");
        console.error("No user data in local storage.");
        return;
    }

    const user = JSON.parse(storedData);
    console.log("Stored user data during Log In:", user); // Debugging log for stored data

    // Compare email
    if (user.email !== loginEmail) {
        showFeedbackPopup("Email not found or mismatch. Please try again.");
        console.error(`Login failed: Entered email (${loginEmail}) does not match stored email (${user.email}).`);
        return;
    }

    // Decrypt and compare password
    const decryptedPassword = CryptoJS.AES.decrypt(user.password, 'secret-key').toString(CryptoJS.enc.Utf8);
    console.log("Decrypted password during Log In:", decryptedPassword);

    if (decryptedPassword !== loginPassword) {
        showFeedbackPopup("Invalid password. Please try again.");
        console.error(`Login failed: Entered password (${loginPassword}) does not match decrypted password (${decryptedPassword}).`);
        return;
    }

    // Successful login
    showFeedbackPopup("Successfully logged in!");

    setTimeout(() => {
        const authSection = document.getElementById('auth-section');
        const expenseSection = document.getElementById('expense-section');

        if (authSection && expenseSection) {
            authSection.style.display = 'none';
            expenseSection.style.display = 'block';
        } else {
            console.error("Auth or Expense section not found in the DOM.");
        }

        // Initialize or update UI components
        initializeMonthlyCalendar();
        displayBudget();
        displayExpenses();

        if (typeof renderExpenseChart === 'function') {
            renderExpenseChart();
        } else {
            console.warn("renderExpenseChart function is not defined.");
        }

        if (typeof updateBudgetProgress === 'function') {
            updateBudgetProgress();
        } else {
            console.warn("updateBudgetProgress function is not defined.");
        }
    }, 2000);
}); // <-- Correctly closed the addEventListener function here



// Utility Functions
function toggleModal(modalId, isVisible) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`toggleModal: Modal with ID "${modalId}" not found.`);
        return;
    }

    modal.style.display = isVisible ? 'block' : 'none'; // Show or hide modal
}





// Handle SAVE button click
document.getElementById('save-expenses').addEventListener('click', function () {
    const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    
    currentMonthExpenses = Array.from(document.querySelectorAll('#expense-list li')).map((item, index) => {
        const amountText = item.querySelector('span').textContent;
        const amount = parseFloat(amountText.replace('$', ''));
        return { ...defaultExpenses[index], amount, month: currentMonthIndex };
    });

    const filteredExpenses = allExpenses.filter(exp => exp.month !== currentMonthIndex);

    localStorage.setItem('expenses', JSON.stringify([...filteredExpenses, { month: currentMonthIndex, data: currentMonthExpenses }]));

    console.log("Expenses Saved for Current Month:", currentMonthExpenses); // Debug
    showFeedbackPopup("Expenses saved successfully!");
    checkBudgetAlerts();
});








// Handle Logout
document.getElementById('logout-button').addEventListener('click', function () {
    showFeedbackPopup("Logged out successfully!");
    setTimeout(() => {
        document.getElementById('expense-section').style.display = 'none';
        document.getElementById('auth-section').style.display = 'block';

        // Optionally, reset or reinitialize global variables if needed
        currentMonthIndex = new Date().getMonth();
        initializeMonthlyCalendar();
    }, 2000);
});




document.getElementById('export-button').addEventListener('click', () => {
    toggleModal('export-modal', true);
});

document.querySelector('#export-modal .close').addEventListener('click', () => {
    toggleModal('export-modal', false);
});

window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('export-modal')) {
        toggleModal('export-modal', false);
    }
});





// Function to show feedback popup with progress bar
// Function to show feedback popup with progress bar
function showFeedbackPopup(message) {
    const popup = document.getElementById('feedback-popup');
    if (!popup) {
        console.error("Feedback popup element not found.");
        return;
    }

    popup.innerHTML = `${message} <div class='progress-bar'></div>`;
    popup.style.display = 'block';
    popup.style.opacity = '1';

    const progressBar = popup.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = '0';
        progressBar.style.transition = 'width 4s linear';

        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 10);

        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => {
                popup.style.display = 'none';
            }, 500);
        }, 4000);
    }
}




function ensureBudgetTriangle() {
    const triangle = document.getElementById('budget-triangle');
    if (!triangle) {
        console.error("#budget-triangle element is missing in the DOM.");
        return;
    }

    // Show the triangle if a monthly budget is set, otherwise hide it
    if (monthlyBudget > 0) {
        triangle.style.display = 'block'; // Show triangle
        console.log("#budget-triangle is displayed.");
    } else {
        triangle.style.display = 'none'; // Hide triangle
        console.log("#budget-triangle is hidden because monthlyBudget is not set.");
    }
}






function updateBudgetProgress() {
    try {
        const progressBar = document.getElementById('budget-progress-bar');
        if (!progressBar) {
            console.error("updateBudgetProgress: Progress bar element not found in the DOM.");
            return;
        }

        const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const usagePercentage = (totalExpenses / monthlyBudget) * 100;

        console.log("updateBudgetProgress: Total Expenses:", totalExpenses, "Budget:", monthlyBudget, "Usage:", usagePercentage);

        progressBar.style.width = `${Math.min(usagePercentage, 100)}%`;
        if (usagePercentage < 80) {
            progressBar.style.backgroundColor = 'green';
        } else if (usagePercentage < 100) {
            progressBar.style.backgroundColor = 'yellow';
        } else {
            progressBar.style.backgroundColor = 'red';
        }
    } catch (error) {
        console.error("Error in updateBudgetProgress:", error.message, error.stack);
    }
}





// Function to reset the Sign Up form
function resetSignupForm() {
    document.getElementById('signup-form').reset();
}




// Define the months array if not already present
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Function to update to the next month
function updateToNextMonth() {
    currentMonthIndex = (currentMonthIndex + 1) % 12;
    console.log(`Navigated to next month: ${months[currentMonthIndex]}`);
    displayCurrentMonth();
    const currentExpenses = getCurrentMonthExpenses();
    displayExpenses();
    displayBudget();
    updatePieChart(currentExpenses);
    updateBudgetProgress();
}


function updateToPreviousMonth() {
    currentMonthIndex = (currentMonthIndex - 1 + 12) % 12;
    console.log(`Navigated to previous month: ${months[currentMonthIndex]}`);
    displayCurrentMonth();
    const currentExpenses = getCurrentMonthExpenses();
    displayExpenses();
    displayBudget();
    updatePieChart(currentExpenses);
    updateBudgetProgress();
}



// Function to display the current month
function displayCurrentMonth() {
    const currentMonthElement = document.getElementById('current-month');
    if (currentMonthElement) {
        currentMonthElement.textContent = months[currentMonthIndex]; // Update the displayed month
        console.log(`Displaying current month: ${months[currentMonthIndex]}`); // Debugging log
    } else {
        console.error("Current month element not found in the DOM.");
    }

    displayExpenses(); // Update the expenses for the new month
    renderExpenseChart(); // Update the chart for the new month
}

function initializeMonthlyCalendar() {
    displayCurrentMonth(); // Ensure this function is called to render the calendar
}





function initializeCalendarNavigation() {
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');

    // Remove existing listeners to avoid duplication
    prevBtn.replaceWith(prevBtn.cloneNode(true));
    nextBtn.replaceWith(nextBtn.cloneNode(true));

    // Attach event listeners
    document.getElementById('prev-month').addEventListener('click', updateToPreviousMonth);
    document.getElementById('next-month').addEventListener('click', updateToNextMonth);
}



// Call this function once when the app initializes
initializeCalendarNavigation();







// Function to display the current month
function displayCurrentMonth() {
    document.getElementById('current-month').textContent = months[currentMonthIndex];
    console.log("Displaying current month:", months[currentMonthIndex]); // Debug log

    displayExpenses();
    renderExpenseChart();
}







// Function to display the budget
function displayBudget() {
    const budgetDisplay = document.getElementById('budget-display');
    const budgetValue = document.getElementById('budget-value');
    const triangle = document.getElementById('budget-triangle');

    if (!budgetDisplay || !budgetValue || !triangle) {
        console.error("displayBudget: Missing DOM elements for budget display.");
        return;
    }

    if (monthlyBudget > 0) {
        budgetDisplay.style.display = 'block'; // Show budget section
        budgetValue.textContent = `$${monthlyBudget.toFixed(2)}`;
        triangle.style.display = 'block'; // Show the triangle
    } else {
        budgetDisplay.style.display = 'none'; // Hide budget section
    }
}







// Function to open budget modal
document.querySelector('.budget-triangle').addEventListener('click', function () {
    toggleModal('budget-modal', true);
});

// Handle OK button in the budget modal
document.getElementById('budget-ok-button').addEventListener('click', function () {
    const budgetInput = parseFloat(document.getElementById('budget-input').value);

    if (!isNaN(budgetInput) && budgetInput > 0) {
        monthlyBudget = budgetInput;
        console.log(`Budget set to: ${monthlyBudget}`);
        updateBudgetProgress();
        toggleModal('budget-modal', false);
    } else {
        console.error("Invalid budget input.");
    }
});





function displayBudget() {
    try {
        const budgetDisplay = document.getElementById('budget-display');
        const budgetValue = document.getElementById('budget-value');

        if (!budgetDisplay || !budgetValue) {
            console.error("Budget display elements not found in the DOM.");
            return;
        }

        budgetDisplay.style.display = 'block';
        budgetValue.textContent = `$${monthlyBudget.toFixed(2)}`;
    } catch (error) {
        console.error("Error in displayBudget:", error);
    }
}








// Handle close modal via X button
document.querySelector('#budget-modal .close').addEventListener('click', function () {
    toggleModal('budget-modal', false);
});

// Close modal when clicking outside
window.addEventListener('click', function (event) {
    if (event.target === document.getElementById('budget-modal')) {
        toggleModal('budget-modal', false);
    }
});






document.getElementById('budget-ok-button').addEventListener('click', () => {
    try {
        const budgetInput = parseFloat(document.getElementById('budget-input').value);

        if (!isNaN(budgetInput) && budgetInput > 0) {
            monthlyBudget = budgetInput;
            localStorage.setItem('monthlyBudget', monthlyBudget); // Save to local storage
            displayBudget();
            updateBudgetProgress();
            toggleModal('budget-modal', false);
            showFeedbackPopup("Monthly budget successfully set!");
        } else {
            showFeedbackPopup("Please enter a valid budget amount!");
        }
    } catch (error) {
        console.error("Error in budget submission:", error);
    }
});




document.getElementById('budget-triangle').addEventListener('click', () => {
    toggleModal('budget-modal', true);
    console.log("#budget-triangle clicked: Budget modal opened.");
});






// Fetch current month's expenses
function getCurrentMonthExpenses() {
    const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let currentMonthData = allExpenses.find(exp => exp.month === currentMonthIndex);

    if (!currentMonthData) {
        currentMonthData = {
            month: currentMonthIndex,
            data: defaultExpenses.map(exp => ({ ...exp }))
        };
        allExpenses.push(currentMonthData);
        localStorage.setItem('expenses', JSON.stringify(allExpenses));
    }

    return currentMonthData.data;
}

// Update an expense and save changes
function updateExpense(index, updatedExpense) {
    if (!currentMonthExpenses || index < 0 || index >= currentMonthExpenses.length) {
        console.error("Invalid expense index or currentMonthExpenses not initialized.");
        return;
    }

    // Update the expense
    currentMonthExpenses[index] = updatedExpense;

    // Save to local storage
    const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const currentMonthData = allExpenses.find(exp => exp.month === currentMonthIndex);

    if (currentMonthData) {
        currentMonthData.data = currentMonthExpenses;
        localStorage.setItem('expenses', JSON.stringify(allExpenses));
        console.log("Expense updated successfully:", updatedExpense);
    } else {
        console.error("Current month data not found in local storage.");
    }

    // Refresh UI
    displayExpenses();
    updateBudgetProgress();
    renderExpenseChart(); // Ensure the chart is updated
}


// Display updated expenses in the UI
function displayExpenses() {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';

    currentMonthExpenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.textContent = `${expense.name}: `;
        const amountSpan = document.createElement('span');
        amountSpan.textContent = `$${expense.amount.toFixed(2)}`;
        li.appendChild(amountSpan);

        const triangle = document.createElement('div');
        triangle.className = 'triangle';
        triangle.onclick = () => openUpdateModal(expense, index);
        li.appendChild(triangle);

        expenseList.appendChild(li);
    });

    const totalAmount = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.getElementById('total-amount').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
    updateBudgetProgress();
}






    // Update total amount
    currentMonthExpenses = getCurrentMonthExpenses();
    const totalAmount = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
    document.getElementById('total-amount').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
    function displayExpenses() {
        const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        let currentMonthData = allExpenses.find(exp => exp.month === currentMonthIndex);
    
        // Initialize current month data if not found
        if (!currentMonthData) {
            currentMonthData = {
                month: currentMonthIndex,
                data: defaultExpenses.map(exp => ({ ...exp })),
            };
            allExpenses.push(currentMonthData);
            localStorage.setItem('expenses', JSON.stringify(allExpenses));
        }
        function saveExpenses() {
            const allExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
            const updatedExpenses = Array.from(document.querySelectorAll('#expense-list li')).map((item, index) => {
                const amountText = item.querySelector('span').textContent;
                const amount = parseFloat(amountText.replace('$', ''));
                return { ...defaultExpenses[index], amount, month: currentMonthIndex };
            });
        
            const filteredExpenses = allExpenses.filter(exp => exp.month !== currentMonthIndex);
            localStorage.setItem('expenses', JSON.stringify([...filteredExpenses, { month: currentMonthIndex, data: updatedExpenses }]));
        
            console.log("Expenses Saved for Current Month:", updatedExpenses);
            showFeedbackPopup("Expenses saved successfully!");
            updateCurrentMonthExpenses(); // Refresh global variable
            checkBudgetAlerts();
        }
        
        const expenseList = document.getElementById('expense-list');
        expenseList.innerHTML = ''; // Clear the list
    
        currentMonthData.data.forEach((expense, index) => {
            const li = document.createElement('li');
            li.textContent = `${expense.name}: `;
    
            const amountSpan = document.createElement('span');
            amountSpan.textContent = `$${expense.amount.toFixed(2)}`;
            li.appendChild(amountSpan);
    
            const triangle = document.createElement('div');
            triangle.className = 'triangle';
            triangle.onclick = () => openUpdateModal(expense, index);
            li.appendChild(triangle);
    
            expenseList.appendChild(li);
        });
    
        // Update total amount
        const totalAmount = currentMonthData.data.reduce((total, expense) => total + expense.amount, 0);
        document.getElementById('total-amount').textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
    }
    



    document.getElementById('export-pdf').addEventListener('click', () => {
        const canvas = document.getElementById('expense-pie-chart');
        if (!canvas) {
            console.error("Pie chart canvas not found.");
            return;
        }
    
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            console.error("jsPDF library is not loaded.");
            return;
        }
    
        const pdf = new jsPDF();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, 40, 180, 160);
        pdf.save('expense-chart.pdf');
        console.log("Pie chart exported as PDF.");
    });
    
    
    
    

    


    
    document.getElementById('export-csv').addEventListener('click', () => {
    currentMonthExpenses = getCurrentMonthExpenses();
    console.log("Exporting to CSV. Current month expenses:", currentMonthExpenses); // Debug log

    if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
        console.error("No data available for export."); // Error log
        showFeedbackPopup("No data to export for this month!");
        return;
    }

    const csvContent = "data:text/csv;charset=utf-8," +
        currentMonthExpenses.map(e => `${e.name},${e.amount}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'monthly-expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showFeedbackPopup("Data exported as CSV successfully!");
    document.getElementById('export-modal').style.display = 'none';
});

    
    
    



    
    document.getElementById('export-ods').addEventListener('click', () => {
        currentMonthExpenses = getCurrentMonthExpenses();
        if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
            console.error("No data available for export.");
            showFeedbackPopup("No data to export for this month!");
            return;
        }
    
        const odsContent = `Name\tAmount\n` +
            currentMonthExpenses.map(e => `${e.name}\t${e.amount}`).join("\n");
        const blob = new Blob([odsContent], { type: 'application/vnd.oasis.opendocument.spreadsheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'monthly-expenses.ods';
        link.click();
    
        showFeedbackPopup("Data exported as ODS successfully!");
        document.getElementById('export-modal').style.display = 'none';
    });    
    
    
    document.getElementById('export-modal').style.display = 'none';






    function exportData() {
        const currentMonthData = expenses.find(exp => exp.month === currentMonthIndex);
        if (!currentMonthData || !currentMonthData.data.length) {
            console.error("No data available for export."); // Debugging log for missing data
            showFeedbackPopup('No data to export for this month!'); 
            return; // This is valid only inside a function
        }
    
        // Proceed with data export logic here...
    }

    
    



    function renderExpenseChart() {
        const ctx = document.getElementById('expense-pie-chart').getContext('2d');
        
        if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
            console.warn("No valid data to render the chart.");
            return;
        }
    
        const labels = currentMonthExpenses.map(exp => exp.name);
        const data = currentMonthExpenses.map(exp => exp.amount);
    
        // Destroy existing chart to prevent overlap
        if (expensePieChart) {
            expensePieChart.destroy();
        }
    
        expensePieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6347'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }
    
    
    



    // Chart Functions
    function updatePieChart(expenses) {
        const chartCanvas = document.getElementById('expense-pie-chart');
    
        if (window.expenseChart) {
            // Destroy the existing chart to avoid overlaps
            window.expenseChart.destroy();
            console.log("Pie chart destroyed.");
        }
    
        if (expenses.length === 0) {
            // If no expenses, clear the chart
            const ctx = chartCanvas.getContext('2d');
            ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
            console.log("Pie chart cleared for empty expenses.");
            return;
        }
    
        const expenseLabels = expenses.map(exp => exp.name);
        const expenseAmounts = expenses.map(exp => exp.amount);
    
        window.expenseChart = new Chart(chartCanvas, {
            type: 'pie',
            data: {
                labels: expenseLabels,
                datasets: [{
                    data: expenseAmounts,
                    backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'], // Example colors
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                },
            }
        });
    
        console.log("Pie chart updated:", { labels: expenseLabels, data: expenseAmounts });
    }
    

    
    
    



// Export Data as CSV
document.getElementById('export-csv').addEventListener('click', () => {
    currentMonthExpenses = getCurrentMonthExpenses();
    console.log("Exporting to CSV. Current month expenses:", currentMonthExpenses); // Debug log

    if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
        console.error("No data available for export."); // Error log
        showFeedbackPopup("No data to export for this month!");
        return;
    }

    const csvContent = "data:text/csv;charset=utf-8," +
        currentMonthExpenses.map(e => `${e.name},${e.amount}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'monthly-expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showFeedbackPopup("Data exported as CSV successfully!");
    document.getElementById('export-modal').style.display = 'none';
});



// Export Data as ODS
document.getElementById('export-ods').addEventListener('click', () => {
    currentMonthExpenses = getCurrentMonthExpenses();
    console.log("Exporting to ODS. Current month expenses:", currentMonthExpenses); // Debug log

    if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
        console.error("No data available for export."); // Error log
        showFeedbackPopup("No data to export for this month!");
        return;
    }

    const odsContent = `Name\tAmount\n` +
        currentMonthExpenses.map(e => `${e.name}\t${e.amount}`).join("\n");
    const blob = new Blob([odsContent], { type: 'application/vnd.oasis.opendocument.spreadsheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'monthly-expenses.ods';
    link.click();

    showFeedbackPopup("Data exported as ODS successfully!");
    document.getElementById('export-modal').style.display = 'none';
});


// Export Pie Chart as PDF
document.getElementById('export-pdf').addEventListener('click', () => {
    currentMonthExpenses = getCurrentMonthExpenses();
    console.log("Exporting to PDF. Current month expenses:", currentMonthExpenses); // Debug log

    if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
        console.error("No data available for export."); // Error log
        showFeedbackPopup("No data to export for this month!");
        return;
    }

    const canvas = document.getElementById('expense-pie-chart');
    const pdf = new jsPDF();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, 40, 180, 160);
    pdf.save('expense-chart.pdf');
    showFeedbackPopup("Pie Chart exported as PDF successfully!");
    document.getElementById('export-modal').style.display = 'none';
});






document.getElementById('export-pdf').addEventListener('click', () => {
    console.log("Export PDF button clicked."); // Debugging log
    exportPieChartAsPDF();
});


document.getElementById('export-csv').addEventListener('click', () => {
    console.log("Export CSV button clicked."); // Debugging log
    exportDataAsCSV();
});

document.getElementById('export-ods').addEventListener('click', () => {
    console.log("Export ODS button clicked."); // Debugging log
    exportDataAsODS();
});






function exportPieChartAsPDF() {
    // Ensure the canvas element exists
    const canvas = document.getElementById('expense-pie-chart');
    if (!canvas) {
        console.error("Pie chart canvas not found."); // Debugging log
        showFeedbackPopup("Pie chart not found. Cannot export as PDF.");
        return;
    }

    // Import jsPDF if necessary (in case it's not globally available)
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        console.error("jsPDF library is not loaded."); // Debugging log
        showFeedbackPopup("Failed to load PDF library. Please try again.");
        return;
    }

    // Generate PDF
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 15, 40, 180, 160);
    pdf.save('expense-chart.pdf');

    // Feedback for successful export
    showFeedbackPopup("Pie Chart exported as PDF successfully!");
    document.getElementById('export-modal').style.display = 'none';
}






function exportDataAsCSV() {
    if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
        console.error("No data available for export.");
        showFeedbackPopup("No data to export for this month!");
        return;
    }

    const csvContent = "data:text/csv;charset=utf-8," +
        currentMonthExpenses.map(exp => `${exp.name},${exp.amount}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'monthly-expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showFeedbackPopup("Data exported as CSV successfully!");
}








function exportDataAsODS() {
    currentMonthExpenses = getCurrentMonthExpenses();

    console.log("Exporting data as ODS for current month:", currentMonthExpenses); // Debugging log

    if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
        console.error("No data available for export."); // Debugging log
        showFeedbackPopup("No data to export for this month!");
        return;
    }

    const odsContent = `Name\tAmount\n` +
        currentMonthExpenses.map(exp => `${exp.name}\t${exp.amount}`).join("\n");

    console.log("ODS Content:", odsContent); // Debugging log

    const blob = new Blob([odsContent], { type: 'application/vnd.oasis.opendocument.spreadsheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'monthly-expenses.ods';
    link.click();

    showFeedbackPopup("Data exported as ODS successfully!");
    console.log("Data exported as ODS."); // Debugging log
}



function validateAndRenderChart() {
    const currentMonthExpenses = getCurrentMonthExpenses();

    if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
        console.warn("No valid expenses to display in the chart."); // Debugging log
        return; // Exit early if no data is available
    }

    const labels = currentMonthExpenses.map(exp => exp.name);
    const data = currentMonthExpenses.map(exp => exp.amount);

    console.log("Labels for Pie Chart:", labels); // Debug
    console.log("Data for Pie Chart:", data); // Debug

    if (expensePieChart) {
        expensePieChart.destroy();
    }

    expensePieChart = new Chart(document.getElementById('expense-pie-chart').getContext('2d'), {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6347'
                ]
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}




// Open modal for updating expense
function openUpdateModal(expense, index) {
    const modal = document.getElementById('update-modal');
    if (!modal) {
        console.error("Update modal not found in the DOM.");
        return;
    }

    modal.style.display = 'block';

    const updateAmountInput = document.getElementById('update-amount');
    if (updateAmountInput) {
        updateAmountInput.value = ''; // Clear input field
    }

    document.getElementById('add-amount').onclick = function () {
        const amountToAdd = parseFloat(updateAmountInput.value);
        if (!isNaN(amountToAdd)) {
            expense.amount += amountToAdd;
            updateExpense(index, expense);
            showFeedbackPopup("Amount successfully added!");
            modal.style.display = 'none';
        } else {
            console.error("Invalid amount entered.");
        }
    };

    document.getElementById('subtract-amount').onclick = function () {
        const amountToSubtract = parseFloat(updateAmountInput.value);
        if (!isNaN(amountToSubtract)) {
            expense.amount -= amountToSubtract;
            updateExpense(index, expense);
            showFeedbackPopup("Amount successfully subtracted!");
            modal.style.display = 'none';
        } else {
            console.error("Invalid amount entered.");
        }
    };

    document.getElementById('reset-amount').onclick = function () {
        expense.amount = 0; // Reset the amount
        updateExpense(index, expense);
        showFeedbackPopup("Amount successfully reset!");
        modal.style.display = 'none';
    };

    document.getElementById('enter-new-amount').onclick = function () {
        const newAmount = parseFloat(updateAmountInput.value);
        if (!isNaN(newAmount)) {
            expense.amount = newAmount; // Set the new amount
            updateExpense(index, expense);
            showFeedbackPopup("New amount successfully entered!");
            modal.style.display = 'none';
        } else {
            console.error("Invalid amount entered.");
        }
    };
}




document.getElementById('export-button').addEventListener('click', () => {
    const modal = document.getElementById('export-modal');
    modal.style.display = 'block';
    console.log("Export modal opened"); // Debug
});

// Close modal
document.querySelector('#export-modal .close').addEventListener('click', () => {
    document.getElementById('export-modal').style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('export-modal')) {
        document.getElementById('export-modal').style.display = 'none';
    }
});





// Initialize the app
initializeMonthlyCalendar();



document.getElementById('next-month').addEventListener('click', updateToNextMonth);
document.getElementById('prev-month').addEventListener('click', updateToPreviousMonth);







function initializeApp() {
    // Add event listener to the budget triangle
    const triangle = document.getElementById('budget-triangle');
    if (triangle) {
        triangle.addEventListener('click', () => {
            toggleModal('budget-modal', true); // Open the budget modal
            console.log("#budget-triangle clicked: Budget modal opened.");
        });
    } else {
        console.error("initializeApp: #budget-triangle element not found in the DOM.");
    }

    if (!localStorage.getItem('expenses')) {
        localStorage.setItem('expenses', JSON.stringify([]));
        console.log("Expenses initialized in local storage.");
    }

    monthlyBudget = parseFloat(localStorage.getItem('monthlyBudget')) || 0;
    currentBudget = 0;
    totalExpenses = 0;

    console.log("Initializing app...");
    initializeMonthlyCalendar();
    initializeCalendarNavigation();
    updateCurrentMonthExpenses();
    displayBudget(); // Ensure the budget display is updated
    updateBudgetProgress(); // Refresh the progress bar

}



initializeApp(); // Ensure this call is not inside another block


try {
    initializeApp(); // Main app initialization
} catch (error) {
    console.error("An unexpected error occurred during app initialization:", error);
}

