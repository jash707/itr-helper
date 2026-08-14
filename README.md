# 🧾 ITR-2 Helper — Copy-Ready Portal Field Guide Generator

An automated client-side data processing engine built with **Vite, React, TypeScript, and Material UI** for salaried individuals filing Indian Income Tax Return 2 (**ITR-2**).

It parses financial documents (Groww Capital Gains XLSX, Bank Statements, Form 16 Part B, and Past Year ITR JSON) to generate a **Copy-Ready Portal Field Guide** with one-click `[COPY]` buttons for every field on the `incometax.gov.in` portal.

---

## ⚡ Key Features

- **📋 7 Copy-Ready ITR-2 Portal Tabs**:
  1. **Tax & Refund Summary**: Computes tax liability u/s 111A, 112A, slab rates, 87A rebate, 4% Cess, and Net Refund / Tax Payable u/s 140A.
  2. **Schedule S (Salary)**: Sections 17(1), 17(2), 17(3), Section 10 exempt allowances, Section 16 deductions (Standard Deduction, Professional Tax).
  3. **Schedule HP (House Property)**: Self-occupied home loan interest u/s 24b (up to ₹2 Lakhs) and let-out property rental income.
  4. **Schedule CG (Capital Gains)**: Short-Term (111A), Long-Term (112A), and **Item E 5-Quarterly Accrual Breakdown**.
  5. **Schedule 112A (ISIN LTCG)**: Scrip-wise table with ISIN, Name, Qty, Sale Price, Cost, and Jan 31, 2018 FMV grandfathering.
  6. **Schedule OS (Other Sources)**: Savings Interest, Dividend Income (with 5 quarterly buckets), and FD/RD Interest.
  7. **Schedule VI-A (Deductions)**: Sections 80C, 80CCD(1B), 80CCD(2), 80D, 80TTA with Old vs New Tax Regime enforcement.

- **🔄 Schedule BFLA & Schedule CFL (Loss Set-Off Engine)**:
  - Carried forward LTCL is set off *only* against current LTCG.
  - Carried forward STCL is set off against STCG first, then remaining against LTCG.
  - Unabsorbed losses to carry forward to subsequent Assessment Years are tracked automatically.
  - **Option 1 Auto-Extraction**: Upload your previous year's filed return `.json` to automatically extract brought-forward losses.

- **📑 Complete Filing Guidance Page**:
  - Interactive step-by-step portal manual, document download guide (Groww, NetBanking, HR portals), tax rates breakdown, and AIS / Form 26AS verification tips.

- **📥 Report Export**:
  - Export your complete computed field guide as a structured **Markdown Report (`.md`)** or **JSON File (`.json`)** for offline recordkeeping.

---

## 🛠️ Supported File Formats

| Document Type | Supported Formats | Auto-Extracted Data |
| :--- | :--- | :--- |
| **Groww Capital Gains** | `.xlsx` | STCG, LTCG, Trades, ISINs, Cost, FMV 31-Jan-2018, Dividends |
| **Bank Statement / Cert** | `.pdf`, `.xlsx`, `.csv` | Savings Interest, FD/RD Interest, Bank TDS |
| **Form 16 Part B** | `.pdf` | Salary 17(1), 17(2), 17(3), Sec 10 Allowances, Sec 16 Deductions, Chapter VI-A Deductions, Salary TDS, Employer TAN |
| **Past Year ITR** | `.json` | Carried Forward STCL & LTCL from Schedule CFL |

---

## 🚀 Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Vanilla CSS + Material UI (MUI v6) matching minimalist aesthetic
- **Excel Parser**: SheetJS (`xlsx`)
- **PDF Parser**: Mozilla `pdfjs-dist`
- **CSV Parser**: PapaParse (`papaparse`)
- **Icons**: MUI Icons + Lucide React

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+ and `npm`

### Installation & Local Run

1. Clone or navigate to the project folder:
   ```bash
   cd itr-helper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📖 How to Use

1. **Launch App**: Open the app and stay on the **Generator** view.
2. **Upload Files or Try Demo**:
   - Upload your **Groww XLSX**, **Bank Statement**, **Form 16 PDF**, and optional **Past ITR JSON**.
   - Or click **"Use Sample Data"** to immediately test all 7 tabs with pre-loaded mock data.
3. **Copy Values to Portal**:
   - Log in to `incometax.gov.in` → e-File → Income Tax Return → Select Assessment Year → ITR-2.
   - Click the **`[COPY]`** button next to any number in ITR-2 Helper and paste directly into the portal text field.
4. **Cross-Check AIS**: Use the **Filing Guide** tab to review AIS cross-verification steps before final submission.

---

## 📜 Tax Rates Summary

- **Short-Term Capital Gains (111A)**: Taxed @ **20%**
- **Long-Term Capital Gains (112A)**: Taxed @ **12.5%** on gains exceeding exemption threshold.
- **Default Tax Regime**: **New Tax Regime** (Section 115BAC).
- **Health & Education Cess**: **4%** on total tax after rebate.

---

## 📄 License

MIT License. Created for salaried individuals filing Indian Income Tax Return 2.
