# 🌞 Daylight Health – Patient CSV Uploader
This is a Next.js application built for front-desk team. It enables easy uploading, validation, editing, and syncing of patient data from a CSV file.

Deployed on: [Cloudflare Workers](https://daylight-health.tsundar.workers.dev/)

## 🚀 Features Implemented
- ✅ **CSV Upload and Parsing** with validation
- ✅ **Editable Table** to modify CSV data
- ✅ **Detection of unexpected columns** with UI highlighting
- ✅ **Graceful error handling** for:
  - Empty/malformed files
  - File size > 5MB
  - Unexpected column headers
  - Network errors during sync
- ✅ **CRM Sync simulation** via POST `/api/sync` endpoint
- ✅ **Cloudflare Workers Deployment** using `@opennextjs/cloudflare`

---

## 📦 Tech Stack

- **Framework**: Next.js 15+
- **UI Libraries**: HTML + CSS Modules
- **CSV Parsing**: [PapaParse](https://www.papaparse.com/)
- **Notifications**: [react-hot-toast](https://react-hot-toast.com/)
- **Cloud Hosting**: Cloudflare Workers via `@opennextjs/cloudflare`

---
Install Dependency : npm install

Install required packages: 
npm install @opennextjs/cloudflare --save
npm install wrangler --save-dev

ensure wrangler.toml exist in project root

ensure these scripts exist in your package.json:
"scripts": {
  "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
}

Run development server : npm run dev

Deploy: npm run deploy


