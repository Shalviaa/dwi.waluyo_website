# 📊 Dashboard Management System

Sistem dashboard management lengkap dengan CRUD functionality untuk mengelola multiple dashboard tipe Gemini-style. Bisa dihost di GitHub Pages atau domain Anda sendiri.

## 🚀 Fitur Utama

### 📈 Dashboard Types
- **Performance Dashboard** - Metrics KPI dan performance indicators
- **SLA Metrics** - Service Level Agreement tracking
- **Sites Management** - Monitoring lokasi/sites
- **Tickets System** - Management ticket dan issues
- **Custom Dashboard** - Konfigurasi dashboard custom

### 🛠️ CRUD Operations
- ✅ **Create** - Tambah dashboard baru dengan konfigurasi lengkap
- ✅ **Read** - View dashboard dengan visualisasi real-time
- ✅ **Update** - Edit konfigurasi dan data dashboard
- ✅ **Delete** - Hapus dashboard yang tidak diperlukan

### 🎨 UI/UX Features
- **Responsive Design** - Mobile-friendly layout
- **Interactive Charts** - Chart.js untuk visualisasi data
- **Real-time Updates** - Auto-refresh setiap 30 detik
- **Data Persistence** - LocalStorage untuk data storage
- **Import/Export** - Backup dan restore dashboard data

## 📁 Struktur Project
```
├── index.html          # Main dashboard interface
├── style.css           # Custom styling
├── app.js              # JavaScript functionality
├── README.md           # Documentation
└── .gitignore          # Git ignore file
```

## 🚀 Quick Start

### 1. Clone/Download Project
```bash
git clone [repository-url]
cd github_dwi
```

### 2. Buka di Browser
```bash
# Double click index.html atau
open index.html
```

### 3. Deploy ke GitHub Pages
1. Push ke GitHub repository
2. Settings → Pages
3. Source: Deploy from branch → Main → /root
4. Access di `https://username.github.io/repo-name`

## 📖 Panduan Penggunaan

### Menambah Dashboard Baru
1. Klik tombol **"Add Dashboard"** (biru) di Overview
2. Atau klik **"Add New Dashboard"** (hijau) di Management section
3. Isi form:
   - **Dashboard Name** - Nama unik untuk dashboard
   - **Type** - Pilih tipe dashboard (Performance, SLA, Sites, Tickets, Custom)
   - **Data Source** - Excel, API, Database, atau Manual Input
   - **Status** - Active, Inactive, atau Maintenance
   - **Description** - Deskripsi dashboard
   - **Configuration** - JSON config untuk chart settings

### Mengedit Dashboard
1. Go ke **Management** section
2. Klik icon **edit (✏️)** di table Actions
3. Update form fields
4. Klik **Save Dashboard**

### Menghapus Dashboard
1. Go ke **Management** section
2. Klik icon **trash (🗑️)** di table Actions
3. Confirm deletion

### Navigasi Section
- **Overview** - Main dashboard dengan stats cards
- **Performance** - Performance metrics detail
- **SLA Metrics** - Service Level Agreement data
- **Sites** - Location/site management
- **Tickets** - Ticket tracking system
- **Settings** - Configuration dan preferences

## 🎯 Konfigurasi Dashboard

### JSON Configuration Format
```json
{
  "chartType": "bar",
  "metrics": ["speed", "reliability", "uptime"],
  "refreshInterval": 30,
  "dataSource": {
    "type": "excel",
    "file": "data.xlsx",
    "sheet": "Sheet1"
  }
}
```

### Chart Types Available
- `bar` - Bar chart untuk perbandingan
- `line` - Line chart untuk trends
- `pie` - Pie chart untuk proportions
- `doughnut` - Doughnut chart
- `radar` - Radar chart untuk multi-metrics

## 📊 Data Sources

### Excel File Integration
- Support .xlsx, .xls, .csv
- Auto-parse columns dan rows
- Dynamic chart generation

### API Integration
- RESTful API endpoints
- JSON data format
- Auto-refresh capability

### Manual Input
- Manual data entry
- Custom metrics definition
- Real-time updates

## 🎨 Customization

### Styling
Edit `style.css` untuk:
- Color themes
- Layout adjustments
- Responsive breakpoints
- Animation effects

### Functionality
Edit `app.js` untuk:
- Business logic
- Data processing
- Chart configurations
- Storage management

## ⌨️ Keyboard Shortcuts
- `Ctrl/Cmd + N` - New dashboard
- `Ctrl/Cmd + E` - Export data
- `Esc` - Close modal

## 📱 Responsive Design
- **Desktop** - Full sidebar navigation
- **Tablet** - Collapsible sidebar
- **Mobile** - Bottom navigation

## 🔒 Data Security
- **LocalStorage** - Client-side storage
- **No server required** - Pure frontend
- **Data encryption** - Optional implementation

## 🚀 Deployment Options

### GitHub Pages (Recommended)
```bash
git add .
git commit -m "Deploy dashboard system"
git push origin main
```

### Netlify
1. Connect GitHub repository
2. Build command: `echo "No build required"`
3. Publish directory: `.`

### Vercel
1. Import GitHub repository
2. Framework preset: Other
3. Build settings: Default

### Custom Domain
1. Buy domain
2. Configure DNS
3. Update CNAME records
4. SSL certificate auto-generated

## 🔄 Data Backup

### Export Data
- Click Export button atau `Ctrl+E`
- Download JSON file
- Save ke cloud storage

### Import Data
- Click Import button
- Select JSON file
- Auto-merge dengan existing data

## 🐛 Troubleshooting

### Common Issues
1. **Dashboard tidak muncul** - Refresh browser
2. **Data tidak tersimpan** - Check LocalStorage permissions
3. **Chart tidak render** - Check Chart.js CDN connection
4. **Modal tidak buka** - Check Bootstrap CSS/JS loading

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📈 Performance Optimization
- Lazy loading untuk charts
- Debounced search/filter
- Optimized CSS animations
- Minimal external dependencies

## 🤝 Contributing
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License
MIT License - Free untuk commercial dan personal use

---

## 🆘 Support

Butuh bantu? Hubungi:
- 📧 Email: [your-email@example.com]
- 💬 Discord: [server-invite]
- 🐛 Issues: [GitHub Issues]

**Made with ❤️ untuk dashboard management needs Anda**
