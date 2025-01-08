class ClinicRecord {
    constructor(studentId, studentName, consultation, medicines) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.consultation = consultation;
        this.medicines = medicines;
        this.datetime = new Date().toLocaleString();
        this.id = Date.now().toString();
        this.status = Math.random() > 0.5 ? 'Active' : 'Pending';
    }
}

class ClinicManagementSystem {
    constructor() {
        this.records = JSON.parse(localStorage.getItem('clinicRecords')) || [];
        this.form = document.getElementById('clinic-form');
        this.recordsContainer = document.getElementById('records-container');
        this.searchInput = document.getElementById('searchInput');
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toast-message');

        this.initializeEventListeners();
        this.displayRecords();
    }

    showToast(message) {
        this.toastMessage.textContent = message;
        this.toast.classList.add('show');
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addRecord();
        });

        this.searchInput.addEventListener('input', () => {
            this.displayRecords();
        });

        // Add hover effect to nav links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-2px)';
            });
            link.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0)';
            });
        });
    }

    addRecord() {
        const studentId = document.getElementById('studentId').value;
        const studentName = document.getElementById('studentName').value;
        const consultation = document.getElementById('consultation').value;
        const medicines = document.getElementById('medicines').value;

        const record = new ClinicRecord(studentId, studentName, consultation, medicines);
        this.records.unshift(record);
        this.saveRecords();
        this.displayRecords();
        this.form.reset();
        this.showToast('Record added successfully!');
    }

    deleteRecord(id) {
        this.records = this.records.filter(record => record.id !== id);
        this.saveRecords();
        this.displayRecords();
        this.showToast('Record deleted successfully!');
    }

    saveRecords() {
        localStorage.setItem('clinicRecords', JSON.stringify(this.records));
    }

    displayRecords() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filteredRecords = this.records.filter(record => 
            record.studentId.toLowerCase().includes(searchTerm) ||
            record.studentName.toLowerCase().includes(searchTerm)
        );

        this.recordsContainer.innerHTML = filteredRecords.map(record => `
            <div class="record-card">
                <button class="delete-btn" onclick="clinicSystem.deleteRecord('${record.id}')">
                    <i class="fas fa-trash"></i>
                </button>
                <h3>
                    <i class="fas fa-user-circle"></i>
                    ${record.studentName} 
                    <small>(ID: ${record.studentId})</small>
                    <span class="status-badge ${record.status.toLowerCase() === 'active' ? 'status-active' : 'status-pending'}">
                        ${record.status}
                    </span>
                </h3>
                <p>
                    <i class="fas fa-clock"></i>
                    <strong>Date & Time:</strong> ${record.datetime}
                </p>
                <p>
                    <i class="fas fa-stethoscope"></i>
                    <strong>Consultation:</strong> ${record.consultation}
                </p>
                <p>
                    <i class="fas fa-pills"></i>
                    <strong>Prescribed Medicines:</strong> ${record.medicines}
                </p>
                <div class="record-actions" style="margin-top: 10px;">
                    <button onclick="clinicSystem.editRecord('${record.id}')" style="background-color: var(--success)">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="clinicSystem.printRecord('${record.id}')" style="background-color: var(--secondary); margin-left: 10px;">
                        <i class="fas fa-print"></i> Print
                    </button>
                </div>
            </div>
        `).join('');
    }

    editRecord(id) {
        const record = this.records.find(r => r.id === id);
        if (record) {
            document.getElementById('studentId').value = record.studentId;
            document.getElementById('studentName').value = record.studentName;
            document.getElementById('consultation').value = record.consultation;
            document.getElementById('medicines').value = record.medicines;
            
            // Scroll to form
            document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
            
            // Remove the old record
            this.deleteRecord(id);
            this.showToast('Record loaded for editing');
        }
    }

    printRecord(id) {
        const record = this.records.find(r => r.id === id);
        if (record) {
            const printWindow = window.open('', '', 'width=800,height=600');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Medical Record - ${record.studentName}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .content { margin-bottom: 15px; }
                        .footer { margin-top: 50px; text-align: center; }
                        @media print {
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>School Clinic Medical Record</h1>
                        <p>Generated on: ${new Date().toLocaleString()}</p>
                    </div>
                    <div class="content">
                        <h2>Student Information</h2>
                        <p><strong>Name:</strong> ${record.studentName}</p>
                        <p><strong>ID:</strong> ${record.studentId}</p>
                        <p><strong>Visit Date:</strong> ${record.datetime}</p>
                        
                        <h2>Medical Details</h2>
                        <p><strong>Consultation Notes:</strong></p>
                        <p>${record.consultation}</p>
                        
                        <h2>Prescription</h2>
                        <p>${record.medicines}</p>
                    </div>
                    <div class="footer">
                        <p>School Clinic Management System</p>
                    </div>
                    <div class="no-print" style="text-align: center; margin-top: 20px;">
                        <button onclick="window.print()">Print Record</button>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            this.showToast('Print window opened');
        }
    }

    // Add animation when scrolling records into view
    animateRecords() {
        const records = document.querySelectorAll('.record-card');
        records.forEach((record, index) => {
            record.style.animationDelay = `${index * 0.1}s`;
        });
    }
}

// Initialize the system
const clinicSystem = new ClinicManagementSystem();

// Add smooth scrolling to nav links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('href');
        document.querySelector(sectionId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save record
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (document.activeElement.tagName !== 'INPUT' && 
            document.activeElement.tagName !== 'TEXTAREA') {
            document.querySelector('form button[type="submit"]').click();
        }
    }
    
    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

// Add responsive sidebar toggle for mobile
const toggleSidebar = () => {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active');
};