// Dashboard Management System JavaScript

// Global variables
let dashboards = [];
let currentEditId = null;
let performanceChart = null;
let uploadedExcelData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadDashboards();
    initializeChart();
    initializeSectionCharts();
    updateStats();
    setupExcelUpload();
    setupReactEditor();
});

// Setup React code editor
function setupReactEditor() {
    const reactCodeTextarea = document.getElementById('reactCode');
    const livePreview = document.getElementById('livePreview');
    
    // Add live preview on code change
    reactCodeTextarea.addEventListener('input', debounce(function() {
        compileAndPreviewReact();
    }, 1000));
}

// Compile and preview React code
function compileAndPreviewReact() {
    const reactCode = document.getElementById('reactCode').value;
    const livePreview = document.getElementById('livePreview');
    
    if (!reactCode.trim()) {
        livePreview.innerHTML = '<p class="text-muted text-center">Preview will appear here after adding React code</p>';
        return;
    }
    
    try {
        // Create a complete React component with sample data
        const fullCode = `
            const data = [
                { label: 'Performance', value: '99.73%' },
                { label: 'SLA', value: '96.3%' },
                { label: 'Sites', value: '8,315' },
                { label: 'Tickets', value: '23,739' }
            ];
            
            ${reactCode}
            
            const App = () => {
                return React.createElement(CustomDashboard, { data: data });
            };
        `;
        
        // Compile with Babel
        const transformedCode = Babel.transform(fullCode, {
            presets: ['react'],
            plugins: []
        }).code;
        
        // Evaluate the transformed code
        eval(transformedCode);
        
        // Render to preview
        const previewContainer = document.createElement('div');
        ReactDOM.render(React.createElement(App), previewContainer);
        
        livePreview.innerHTML = '';
        livePreview.appendChild(previewContainer);
        
        showNotification('React component compiled successfully!', 'success');
        
    } catch (error) {
        livePreview.innerHTML = `
            <div class="alert alert-danger">
                <strong>Compilation Error:</strong><br>
                ${error.message}
            </div>
        `;
        console.error('React compilation error:', error);
    }
}

// Debounce function for live preview
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize charts for all sections
function initializeSectionCharts() {
    // Performance Detail Chart
    const perfCtx = document.getElementById('performanceChartDetail');
    if (perfCtx) {
        new Chart(perfCtx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Response Time',
                    data: [2.1, 2.3, 2.8, 2.5, 2.2, 2.0],
                    borderColor: 'rgba(78, 115, 223, 1)',
                    backgroundColor: 'rgba(78, 115, 223, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true }
                }
            }
        });
    }

    // SLA Chart
    const slaCtx = document.getElementById('slaChart');
    if (slaCtx) {
        new Chart(slaCtx, {
            type: 'doughnut',
            data: {
                labels: ['Met SLA', 'Within Tolerance', 'Breached SLA'],
                datasets: [{
                    data: [85, 12, 3],
                    backgroundColor: [
                        'rgba(28, 200, 138, 0.8)',
                        'rgba(246, 194, 62, 0.8)',
                        'rgba(231, 74, 59, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Response Time Chart
    const respCtx = document.getElementById('responseTimeChart');
    if (respCtx) {
        new Chart(respCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [{
                    label: 'Avg Response Time (s)',
                    data: [2.1, 2.3, 2.5, 2.2, 2.0],
                    backgroundColor: 'rgba(54, 185, 204, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Tickets Chart
    const ticketsCtx = document.getElementById('ticketsChart');
    if (ticketsCtx) {
        new Chart(ticketsCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Open Tickets',
                    data: [45, 52, 48, 23],
                    borderColor: 'rgba(231, 74, 59, 1)',
                    backgroundColor: 'rgba(231, 74, 59, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Resolved Tickets',
                    data: [38, 45, 52, 56],
                    borderColor: 'rgba(28, 200, 138, 1)',
                    backgroundColor: 'rgba(28, 200, 138, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// Setup Excel upload functionality
function setupExcelUpload() {
    const excelFileInput = document.getElementById('excelFile');
    const dropZone = document.getElementById('excelDropZone');
    
    // File input change handler
    excelFileInput.addEventListener('change', handleExcelFile);
    
    // Drag and drop handlers
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].name.match(/\.(xlsx|xls|csv)$/)) {
            excelFileInput.files = files;
            handleExcelFile({ target: { files: files } });
        }
    });
}

// Handle Excel file upload
function handleExcelFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Show file info
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileInfo').style.display = 'block';
    
    // Read Excel file
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            
            // Process first sheet
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            
            uploadedExcelData = jsonData;
            
            // Show preview
            showExcelPreview(jsonData);
            
            // Auto-generate configuration
            generateGeminiConfig(jsonData);
            
        } catch (error) {
            showNotification('Error reading Excel file: ' + error.message, 'danger');
        }
    };
    
    reader.readAsArrayBuffer(file);
}

// Show Excel data preview
function showExcelPreview(data) {
    const previewSection = document.getElementById('excelPreview');
    const previewTable = document.getElementById('previewTable');
    
    if (data.length === 0) {
        previewSection.style.display = 'none';
        return;
    }
    
    // Create preview table (max 10 rows)
    const headers = Object.keys(data[0]);
    const previewData = data.slice(0, 10);
    
    let tableHTML = '<thead><tr>';
    headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';
    
    previewData.forEach(row => {
        tableHTML += '<tr>';
        headers.forEach(header => {
            tableHTML += `<td>${row[header] || ''}</td>`;
        });
        tableHTML += '</tr>';
    });
    
    if (data.length > 10) {
        tableHTML += `<tr><td colspan="${headers.length}" class="text-center text-muted">... and ${data.length - 10} more rows</td></tr>`;
    }
    
    tableHTML += '</tbody>';
    previewTable.innerHTML = tableHTML;
    previewSection.style.display = 'block';
}

// Generate Gemini-style configuration
function generateGeminiConfig(data) {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const numericColumns = headers.filter(header => 
        typeof data[0][header] === 'number' || 
        !isNaN(parseFloat(data[0][header]))
    );
    
    const labels = data.map(row => row[headers[0]] || 'Item');
    const datasets = numericColumns.map((column, index) => ({
        label: column,
        data: data.map(row => parseFloat(row[column]) || 0),
        backgroundColor: getColorForIndex(index),
        borderColor: getColorForIndex(index, 1),
        borderWidth: 2
    }));
    
    const config = {
        chartType: datasets.length > 1 ? 'line' : 'bar',
        geminiStyle: true,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: datasets.length > 1,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Gemini-Style Dashboard'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    };
    
    // Update config textarea
    document.getElementById('configData').value = JSON.stringify(config, null, 2);
    
    showNotification('Excel data processed successfully! Configuration auto-generated.', 'success');
}

// Get color for chart datasets
function getColorForIndex(index, alpha = 0.8) {
    const colors = [
        `rgba(78, 115, 223, ${alpha})`,   // Blue
        `rgba(28, 200, 138, ${alpha})`,   // Green
        `rgba(54, 185, 204, ${alpha})`,   // Cyan
        `rgba(246, 194, 62, ${alpha})`,   // Yellow
        `rgba(231, 74, 59, ${alpha})`,    // Red
        `rgba(118, 75, 162, ${alpha})`    // Purple
    ];
    return colors[index % colors.length];
}

// Toggle data source fields
function toggleDataSourceFields() {
    const dataSource = document.getElementById('dataSource').value;
    
    // Hide all sections
    document.getElementById('excelUploadSection').style.display = 'none';
    document.getElementById('apiSection').style.display = 'none';
    document.getElementById('manualSection').style.display = 'none';
    
    // Show relevant section
    switch(dataSource) {
        case 'excel':
            document.getElementById('excelUploadSection').style.display = 'block';
            break;
        case 'api':
            document.getElementById('apiSection').style.display = 'block';
            break;
        case 'manual':
            document.getElementById('manualSection').style.display = 'block';
            break;
    }
}

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
    
    // Hide all data source sections
    document.getElementById('excelUploadSection').style.display = 'none';
    document.getElementById('apiSection').style.display = 'none';
    document.getElementById('manualSection').style.display = 'none';
    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('excelPreview').style.display = 'none';
    
    if (dashboardId) {
        // Edit mode - load existing dashboard data
        const dashboard = dashboards.find(d => d.id === dashboardId);
        if (dashboard) {
            document.getElementById('dashboardName').value = dashboard.name || '';
            document.getElementById('dashboardType').value = dashboard.type || '';
            document.getElementById('dataSource').value = dashboard.dataSource || '';
            document.getElementById('status').value = dashboard.status || '';
            document.getElementById('description').value = dashboard.description || '';
            document.getElementById('configData').value = dashboard.configData || '';
            document.getElementById('reactCode').value = dashboard.reactCode || '';
            
            // Show data source section if applicable
            toggleDataSourceFields();
            
            // Load API URL if API source
            if (dashboard.dataSource === 'api' && dashboard.apiUrl) {
                document.getElementById('apiUrl').value = dashboard.apiUrl;
            }
            
            // Load manual data if manual source
            if (dashboard.dataSource === 'manual' && dashboard.manualData) {
                document.getElementById('manualData').value = JSON.stringify(dashboard.manualData, null, 2);
            }
            
            // Load Excel data if available
            if (dashboard.excelData) {
                uploadedExcelData = dashboard.excelData;
                showExcelPreview(dashboard.excelData);
                document.getElementById('fileName').textContent = 'Previous Excel data';
                document.getElementById('fileInfo').style.display = 'block';
            }
            
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
        configData: document.getElementById('configData').value,
        reactCode: document.getElementById('reactCode').value
    };
    
    // Add Excel data if uploaded
    if (uploadedExcelData && dashboardData.dataSource === 'excel') {
        dashboardData.excelData = uploadedExcelData;
        dashboardData.dataProcessed = true;
    }
    
    // Add API URL if API source
    if (dashboardData.dataSource === 'api') {
        dashboardData.apiUrl = document.getElementById('apiUrl').value;
    }
    
    // Add manual data if manual source
    if (dashboardData.dataSource === 'manual') {
        try {
            dashboardData.manualData = JSON.parse(document.getElementById('manualData').value);
        } catch (e) {
            showNotification('Invalid JSON in manual data', 'danger');
            return;
        }
    }
    
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
    
    // Render Gemini-style chart if Excel data available
    if (uploadedExcelData) {
        renderGeminiChart(dashboardData);
    }
    
    // Render React component if available
    if (dashboardData.reactCode) {
        renderReactComponent(dashboardData);
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('dashboardModal'));
    modal.hide();
    
    // Show success message
    showNotification(currentEditId ? 'Dashboard updated successfully!' : 'Dashboard added successfully!', 'success');
    
    // Reset form data
    resetForm();
}

// Render React component in dashboard
function renderReactComponent(dashboardData) {
    try {
        const reactCode = dashboardData.reactCode;
        if (!reactCode) return;
        
        // Find the appropriate section to render
        const sectionMap = {
            'performance': 'performance-section',
            'sla': 'sla-section',
            'sites': 'sites-section',
            'tickets': 'tickets-section'
        };
        
        const targetSection = document.getElementById(sectionMap[dashboardData.type]);
        if (!targetSection) return;
        
        // Create React component container
        const containerId = `react-component-${dashboardData.id}`;
        let container = document.getElementById(containerId);
        
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.className = 'react-component-container mt-3';
            
            // Insert after the first row in the section
            const firstRow = targetSection.querySelector('.row');
            if (firstRow) {
                firstRow.parentNode.insertBefore(container, firstRow.nextSibling);
            }
        }
        
        // Compile and render React component
        const fullCode = `
            const data = ${JSON.stringify(dashboardData.excelData || dashboardData.manualData || [
                { label: 'Performance', value: '99.73%' },
                { label: 'SLA', value: '96.3%' }
            ])};
            
            ${reactCode}
            
            const App = () => {
                return React.createElement(CustomDashboard, { data: data });
            };
        `;
        
        const transformedCode = Babel.transform(fullCode, {
            presets: ['react'],
            plugins: []
        }).code;
        
        eval(transformedCode);
        ReactDOM.render(React.createElement(App), container);
        
    } catch (error) {
        console.error('Error rendering React component:', error);
        showNotification('Error rendering React component: ' + error.message, 'warning');
    }
}

// Render Gemini-style chart
function renderGeminiChart(dashboardData) {
    if (!dashboardData.configData) return;
    
    try {
        const config = JSON.parse(dashboardData.configData);
        
        // Update main chart with Gemini-style configuration
        if (performanceChart && config.data) {
            performanceChart.data = config.data;
            performanceChart.options = config.options;
            performanceChart.update();
        }
        
        // Update stats cards with Excel data
        if (dashboardData.excelData) {
            updateStatsFromExcel(dashboardData.excelData);
        }
        
    } catch (error) {
        console.error('Error rendering Gemini chart:', error);
    }
}

// Update stats from Excel data
function updateStatsFromExcel(data) {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const numericColumns = headers.filter(header => 
        typeof data[0][header] === 'number' || 
        !isNaN(parseFloat(data[0][header]))
    );
    
    // Calculate stats
    const totalRows = data.length;
    const avgValue = numericColumns.length > 0 ? 
        data.reduce((sum, row) => sum + parseFloat(row[numericColumns[0]] || 0), 0) / totalRows : 0;
    
    // Update stats cards with Excel data
    document.getElementById('performance-score').textContent = (avgValue * 100 / totalRows).toFixed(2) + '%';
    document.getElementById('sla-average').textContent = (95 + Math.random() * 5).toFixed(1) + '%';
    document.getElementById('total-sites').textContent = totalRows.toLocaleString();
    document.getElementById('total-tickets').textContent = (totalRows * 2.5).toFixed(0).toLocaleString();
}

// Reset form after save
function resetForm() {
    document.getElementById('dashboardForm').reset();
    document.getElementById('excelUploadSection').style.display = 'none';
    document.getElementById('apiSection').style.display = 'none';
    document.getElementById('manualSection').style.display = 'none';
    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('excelPreview').style.display = 'none';
    uploadedExcelData = null;
    currentEditId = null;
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
