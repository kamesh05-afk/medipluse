# 💊 MediPulse — Smart Medicine Reminder, PWA & Wellness Companion

*Developed by Kamesh*

A complete client-side healthcare web application featuring **Patient Login & Profile Setup**, **Automated Medication Inventory Stock Tracking**, **Persistent Audible Beep Alerts**, **PWA Desktop/Home Screen Shortcut Support**, and a **Daily Step Pedometer**.

---

## 🌟 What's New & Core Capabilities

### 1. 🚪 Patient Registration & Login Gate (Before Entering)
- **Mandatory Profile Setup**: Before entering the application, users are prompted with a secure sign-in portal:
  - **Full Name**
  - **Age**
  - **Gender**
  - **Blood Group**
  - **Residential Address & City**
  - **Phone Number**
  - **Emergency Caregiver Name & Phone**
  - **Known Drug Allergies**
- **⚡ Quick Demo Fill**: One-click test button to instantly pre-fill realistic patient information.
- **Log Out / Switch Account**: Convenient button in the sidebar footer to switch patient profiles at any time.

### 2. 📲 Add to Shortcut / Progressive Web App (PWA)
- **Direct Shortcut Install**:
  - Click the **"+ Add to Shortcut"** button in the header.
  - On Chrome / Edge (Windows/Mac): Prompts to install MediPulse directly onto your **Desktop & Taskbar** with a dedicated app window.
  - On Mobile (Android/iOS): Adds an app icon directly to your **Phone Home Screen**.
- **Offline & Standalone**: Powered by a Service Worker (`sw.js`) and Web Manifest (`manifest.json`) with high-resolution app icons (`icon-192.png` and `icon-512.png`).

### 3. 🚨 Persistent Audible BEEP Alarm & Background Notifications
- **Urgent Medical Beep Sound**:
  - Uses the HTML5 Web Audio API to produce an urgent, hospital-grade multi-frequency beep sequence (`880Hz -> 880Hz -> 1175Hz`).
  - **Continuous Loop**: If you forget to take your medicine, the beep alarm loops every 3.5 seconds until you click **"Take Dose (Stop Beep)"**, **"Snooze"**, or **"Silence"**.
- **When You Come Out of the Website**:
  - **Desktop / OS Notifications**: Fires Windows / Android notifications even when the browser is minimized or you are on another website.
  - **Flashing Browser Title**: The tab title blinks `🚨 (BEEP) TAKE METFORMIN!` to alert you in other tabs.
  - **Voice Synthesizer**: Speaks aloud: *"Attention [Your Name]! You forgot to take your scheduled medicine. It is time to take your dose now."*
- **🔊 Test Buttons**: Click **"Test Beep Alarm"** on the dashboard or schedule tab to hear the medical beep alert instantly.

### 4. 📦 Stock & Inventory Tracking
- **Automated Decrement**: Confirming a dose immediately reduces the pill stock count.
- **Days Left Calculator**: Calculates remaining days of supply based on daily intake.
- **Low Stock & Out of Stock Warnings**: Visual alerts and one-click pharmacy refill order generator.

### 5. 👟 Daily Step Tracker & Pedometer
- **Live Walking Simulator**: Simulates walking cadence (~110 steps/min) with an animated avatar.
- **Pedometer Metrics**: Steps, Kilometers, Calories burned, and Active minutes with a circular progress ring.
- **7-Day History Chart**: Dynamic SVG chart tracking weekly activity.
- **Mobile Accelerometer**: Detects real physical footsteps on smartphones.

### 6. 🩺 Health Vitals & Hydration
- **8-Glass Water Tracker**: Clickable glasses (250 ml each) for optimal medicine absorption.
- **Blood Pressure, Heart Rate & Blood Sugar**: Categorizes BP into clinical ranges.
- **Printable Doctor / Rx Report**: Formatted clinical medication sheet ready to print or export to PDF (`Ctrl + P`).

---

## 🚀 How to Run

1. Open **[index.html](file:///c:/Users/user/Documents/smart-med-reminder/index.html)** in any modern web browser (Google Chrome, Microsoft Edge, Firefox, or Safari).
2. Enter your Name, Address, Age, and Contact info on the welcome screen (or click **"⚡ Quick Demo Fill"**).
3. Click **"Sign In & Enter MediPulse"**.
4. Click **"+ Add to Shortcut"** in the top-right header to install the app on your desktop or phone home screen.
5. Click **"🔊 Test Beep Alarm"** to test the urgent reminder sound.

