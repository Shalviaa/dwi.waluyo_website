// Dashboard Management System JavaScript

// Global variables
let dashboards = [];
let currentEditId = null;
let performanceChart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadDashboards();
    initializeChart();
    updateStats();
});

// Load dashboards from localStorage
function loadDashboards() {
    const savedDashboards = localStorage.getItem('dashboards');
    if (savedDashboards) {
        dashboards = JSON.parse(savedDashboards);
    } else {
        // Initialize with sample data
        dashboards = [
            {
                id: 1,
                name: 'Performance Dashboard',
                type: 'performance',
                dataSource: 'excel',
                status: 'active',
                description: 'Main performance metrics dashboard',
                configData: '{"chartType": "bar", "metrics": ["speed", "reliability", "uptime"]}',
                created: new Date().toISOString()
            },
            {
                id: 2,
                name: 'SLA Metrics',
                type: 'sla',
                dataSource: 'api',
                status: 'active',
                description: 'Service Level Agreement tracking',
                configData: '{"chartType": "line", "metrics": ["response_time", "resolution_time"]}',
                created: new Date().toISOString()
            }
        ];
        saveDashboards();
    }
    renderDashboardList();
    renderDashboardTable();
}

// Save dashboards to localStorage
function saveDashboards() {
    localStorage.setItem('dashboards', JSON.stringify(dashboards));
}

// Show different sections
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.style.display = 'none';
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    const sectionElement = document.getElementById(section + '-section');
    if (sectionElement) {
        sectionElement.style.display = 'block';
    }
    
    // Add active class to clicked nav link
    event.target.classList.add('active');
}

// Show add/edit modal
function showAddModal(dashboardId = null) {
    currentEditId = dashboardId;
    const modal = new bootstrap.Modal(document.getElementById('dashboardModal'));
    const form = document.getElementById('dashboardForm');
    const modalTitle = document.getElementById('modalTitle');
    
    // Reset form
    form.reset();
    
    if (dashboardId) {
        // Edit mode
        const dashboard = dashboards.find(d => d.id === dashboardId);
        if (dashboard) {
            document.getElementById('dashboardName').value = dashboard.name;
            document.getElementById('dashboardType').value = dashboard.type;
            document.getElementById('dataSource').value = dashboard.dataSource;
            document.getElementById('status').value = dashboard.status;
            document.getElementById('description').value = dashboard.description;
            document.getElementById('configData').value = dashboard.configData;
            modalTitle.textContent = 'Edit Dashboard';
        }
    } else {
        // Add mode
        modalTitle.textContent = 'Add New Dashboard';
    }
    
    modal.show();
}

// Save dashboard
function saveDashboard() {
    const form = document.getElementById('dashboardForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const dashboardData = {
        name: document.getElementById('dashboardName').value,
        type: document.getElementById('dashboardType').value,
        dataSource: document.getElementById('dataSource').value,
        status: document.getElementById('status').value,
        description: document.getElementById('description').value,
        configData: document.getElementById('configData').value
    };
    
    if (currentEditId) {
        // Update existing dashboard
        const index = dashboards.findIndex(d => d.id === currentEditId);
        if (index !== -1) {
            dashboards[index] = { ...dashboards[index], ...dashboardData };
        }
    } else {
        // Add new dashboard
        const newDashboard = {
            id: Date.now(),
            ...dashboardData,
            created: new Date().toISOString()
        };
        dashboards.push(newDashboard);
    }
    
    saveDashboards();
    renderDashboardList();
    renderDashboardTable();
    updateStats();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('dashboardModal'));
    modal.hide();
    
    // Show success message
    showNotification(currentEditId ? 'Dashboard updated successfully!' : 'Dashboard added successfully!', 'success');
}

// Delete dashboard
function deleteDashboard(dashboardId) {
    if (confirm('Are you sure you want to delete this dashboard?')) {
        dashboards = dashboards.filter(d => d.id !== dashboardId);
        saveDashboards();
        renderDashboardList();
        renderDashboardTable();
        updateStats();
        showNotification('Dashboard deleted successfully!', 'success');
    }
}

// Render dashboard list in sidebar
function renderDashboardList() {
    const listContainer = document.getElementById('dashboard-list');
    const activeDashboards = dashboards.filter(d => d.status === 'active');
    
    if (activeDashboards.length === 0) {
        listContainer.innerHTML = '<p class="text-muted">No active dashboards</p>';
        return;
    }
    
    listContainer.innerHTML = activeDashboards.map(dashboard => `
        <div class="dashboard-item">
            <h6>${dashboard.name}</h6>
            <p><small>Type: ${dashboard.type} | Source: ${dashboard.dataSource}</small></p>
        </div>
    `).join('');
}

// Render dashboard table
function renderDashboardTable() {
    const tableBody = document.getElementById('dashboardTableBody');
    
    if (dashboards.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No dashboards found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = dashboards.map(dashboard => `
        <tr>
            <td>${dashboard.id}</td>
            <td>${dashboard.name}</td>
            <td><span class="badge bg-info">${dashboard.type}</span></td>
            <td>${dashboard.dataSource}</td>
            <td><span class="badge status-${dashboard.status}">${dashboard.status}</span></td>
            <td>${new Date(dashboard.created).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="showAddModal(${dashboard.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteDashboard(${dashboard.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Initialize performance chart
function initializeChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Dendy', 'Regional A', 'Regional B', 'Regional C', 'Regional D', 'Regional E'],
            datasets: [{
                label: 'Efisiensi Operasional (%)',
                data: [99.73, 98.5, 97.2, 96.8, 95.4, 94.1],
                backgroundColor: [
                    'rgba(78, 115, 223, 0.8)',
                    'rgba(28, 200, 138, 0.8)',
                    'rgba(54, 185, 204, 0.8)',
                    'rgba(246, 194, 62, 0.8)',
                    'rgba(231, 74, 59, 0.8)',
                    'rgba(118, 75, 162, 0.8)'
                ],
                borderColor: [
                    'rgba(78, 115, 223, 1)',
                    'rgba(28, 200, 138, 1)',
                    'rgba(54, 185, 204, 1)',
                    'rgba(246, 194, 62, 1)',
                    'rgba(231, 74, 59, 1)',
                    'rgba(118, 75, 162, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
                        }
                    }
                }
            }
        }
    });
}

// Update statistics
function updateStats() {
    const activeCount = dashboards.filter(d => d.status === 'active').length;
    const totalCount = dashboards.length;
    
    // Update stats with some calculated values
    document.getElementById('performance-score').textContent = (95 + Math.random() * 5).toFixed(2) + '%';
    document.getElementById('sla-average').textContent = (92 + Math.random() * 8).toFixed(1) + '%';
    document.getElementById('total-sites').textContent = (8000 + Math.floor(Math.random() * 1000)).toLocaleString();
    document.getElementById('total-tickets').textContent = (20000 + Math.floor(Math.random() * 5000)).toLocaleString();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Export dashboard data
function exportDashboardData() {
    const dataStr = JSON.stringify(dashboards, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'dashboards_' + new Date().toISOString().slice(0,10) + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Dashboard data exported successfully!', 'success');
}

// Import dashboard data
function importDashboardData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (Array.isArray(importedData)) {
                dashboards = importedData;
                saveDashboards();
                renderDashboardList();
                renderDashboardTable();
                updateStats();
                showNotification('Dashboard data imported successfully!', 'success');
            } else {
                showNotification('Invalid file format!', 'danger');
            }
        } catch (error) {
            showNotification('Error importing file: ' + error.message, 'danger');
        }
    };
    reader.readAsText(file);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + N: New dashboard
    if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        showAddModal();
    }
    
    // Ctrl/Cmd + E: Export data
    if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        exportDashboardData();
    }
});

// Auto-refresh data every 30 seconds
setInterval(function() {
    updateStats();
    console.log('Dashboard data refreshed');
}, 30000);
