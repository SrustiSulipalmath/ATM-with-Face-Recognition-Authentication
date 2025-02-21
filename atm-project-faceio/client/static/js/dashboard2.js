// dashboard.js (Modified with MediaPipe Face Detection)

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
  
    try {
        // Fetch user data
        const response = await fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
  
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const userData = await response.json();
        populateUserData(userData);
        initializeBalance(userData.balance);
    } catch (error) {
        console.error('Error:', error);
        logout();
    }
  });
  
  function populateUserData(user) {
    document.getElementById('userPhoto').src = user.faceImage || '/static/images/default-avatar.jpg';
    document.getElementById('userName').textContent = `Name: ${user.name}`;
    document.getElementById('userEmail').textContent = `Email: ${user.email}`;
    document.getElementById('userPhone').textContent = `Phone: ${user.phone}`;
    document.getElementById('userAccount').textContent = `Account #: ${user.account}`;
    document.getElementById('balance').textContent = user.balance;
  }
  
  let currentBalance = 0;
  function initializeBalance(balance) {
    currentBalance = parseFloat(balance);
  }
  
  // Transaction Functions
  async function updateBalance(amount, isDeposit) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/api/transaction/update-balance', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: parseFloat(amount),
                type: isDeposit ? 'deposit' : 'withdraw'
            })
        });
  
        if (!response.ok) throw new Error('Transaction failed');
        
        const result = await response.json();
        currentBalance = result.newBalance;
        document.getElementById('balance').textContent = currentBalance.toFixed(2);
        return true;
    } catch (error) {
        console.error('Transaction error:', error);
        return false;
    }
  }
  
  async function withdraw() {
    const amount = parseFloat(prompt("Enter withdrawal amount:"));
    if (isNaN(amount) || amount <= 0) {
        alert("Invalid amount");
        return;
    }
  
    if (amount > currentBalance) {
        alert("Insufficient funds");
        return;
    }
  
    if (await updateBalance(amount, false)) {
        alert(`Successfully withdrew $${amount.toFixed(2)}`);
    } else {
        alert("Withdrawal failed");
    }
  }
  
  async function deposit() {
    const amount = parseFloat(prompt("Enter deposit amount:"));
    if (isNaN(amount) || amount <= 0) {
        alert("Invalid amount");
        return;
    }
  
    if (await updateBalance(amount, true)) {
        alert(`Successfully deposited $${amount.toFixed(2)}`);
    } else {
        alert("Deposit failed");
    }
  }
  
  function viewTransactions() {
    window.location.href = '/transactions.html';
  }
  
  // Account Management
  function showEditModal(type) {
    const titles = {
        'username': 'Change Username',
        'email': 'Change Email Address',
        'phone': 'Change Phone Number'
    };
  
    document.getElementById('modalTitle').textContent = titles[type];
    document.getElementById('modalContent').innerHTML = `
        <div class="modal-input-group">
            <label>Current ${type.charAt(0).toUpperCase() + type.slice(1)}:</label>
            <input type="text" id="currentValue" class="modal-input" disabled>
        </div>
        <div class="modal-input-group">
            <label>New ${type.charAt(0).toUpperCase() + type.slice(1)}:</label>
            <input type="${type === 'email' ? 'email' : 'text'}" 
                   id="newValue" 
                   class="modal-input"
                   ${type === 'phone' ? 'pattern="\\d{10}" maxlength="10"' : ''}>
        </div>
        <div class="verify-section">
            <label>Verify with Current PIN:</label>
            <input type="password" id="verifyPin" class="modal-input" 
                   pattern="\\d{4}" maxlength="4" required>
        </div>
        <button class="btn" onclick="submitAccountChange('${type}')">Update</button>
    `;
  
    document.getElementById('currentValue').value = 
        document.getElementById(`user${type.charAt(0).toUpperCase() + type.slice(1)}`)
            .textContent.split(': ')[1];
  
    document.getElementById('accountModal').style.display = 'block';
  }
  
  async function submitAccountChange(type) {
    const token = localStorage.getItem('token');
    const newValue = document.getElementById('newValue').value;
    const verifyPin = document.getElementById('verifyPin').value;
  
    if (!newValue || !verifyPin) {
        alert('Please fill all fields');
        return;
    }
  
    try {
        const response = await fetch(`/api/auth/update-${type}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                newValue: newValue,
                pin: verifyPin
            })
        });
  
        const result = await response.json();
        
        if (response.ok) {
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} updated!`);
            closeModal('accountModal');
            location.reload();
        } else {
            alert(result.error || 'Update failed');
        }
    } catch (error) {
        console.error('Update error:', error);
        alert('Update failed');
    }
  }
  
  function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
  }
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  }
  
  // Remove FaceIO and add MediaPipe placeholder function for future face recognition
  async function resetFace() {
    alert("Face recognition using MediaPipe will be implemented soon!");
  }
  
  document.getElementById('resetFaceBtn').addEventListener('click', resetFace);
  