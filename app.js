/**
 * MediPulse - Smart Medicine Reminder, Inventory & Activity Tracker
 * Single-Page Application & PWA Engine
 */

(function () {
  'use strict';

  // Helper date function
  function getTodayDateString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  // =========================================================================
  // Default Healthcare Datasets
  // =========================================================================
  const DEFAULT_MEDICATIONS = [
    {
      id: 'med-1',
      name: 'Metformin',
      dosage: '500 mg',
      form: 'Tablet',
      food: 'After Food',
      category: 'Diabetes',
      time: '08:00', // Morning
      stock: 24,
      threshold: 6,
      color: '#2563eb', // Blue
      takenToday: true,
      lastTakenDate: getTodayDateString(),
      instructions: 'Take with a full glass of water. Do not crush or chew.'
    },
    {
      id: 'med-2',
      name: 'Lisinopril',
      dosage: '10 mg',
      form: 'Tablet',
      food: 'With Food',
      category: 'Blood Pressure',
      time: '09:00', // Morning
      stock: 4, // Intentionally low to show low-stock reminder!
      threshold: 5,
      color: '#f59e0b', // Amber
      takenToday: false,
      lastTakenDate: null,
      instructions: 'Monitor blood pressure regularly. Avoid potassium supplements.'
    },
    {
      id: 'med-3',
      name: 'Vitamin D3 & Calcium',
      dosage: '1000 IU',
      form: 'Capsule',
      food: 'After Food',
      category: 'Vitamin',
      time: '13:00', // Afternoon Lunch
      stock: 42,
      threshold: 10,
      color: '#10b981', // Green
      takenToday: false,
      lastTakenDate: null,
      instructions: 'Take after your largest meal of the day for best absorption.'
    },
    {
      id: 'med-4',
      name: 'Atorvastatin',
      dosage: '20 mg',
      form: 'Tablet',
      food: 'After Food',
      category: 'Blood Pressure',
      time: '21:00', // Night Bedtime
      stock: 19,
      threshold: 5,
      color: '#8b5cf6', // Purple
      takenToday: false,
      lastTakenDate: null,
      instructions: 'Take in the evening. Avoid grapefruit juice while on this medication.'
    }
  ];

  const DEFAULT_ACTIVITY = {
    steps: 6840,
    goal: 10000,
    history: [
      { day: 'Mon', steps: 8420, date: 'Nov 14' },
      { day: 'Tue', steps: 10250, date: 'Nov 15' },
      { day: 'Wed', steps: 7600, date: 'Nov 16' },
      { day: 'Thu', steps: 9100, date: 'Nov 17' },
      { day: 'Fri', steps: 11400, date: 'Nov 18' },
      { day: 'Sat', steps: 6500, date: 'Nov 19' },
      { day: 'Today', steps: 6840, date: 'Nov 20' }
    ]
  };

  const DEFAULT_VITALS = {
    bpSys: 122,
    bpDia: 78,
    heartRate: 72,
    bloodSugar: 96,
    history: [
      { timestamp: 'Today, 08:30 AM', bp: '122/78', hr: 72, sugar: 96, status: 'Normal' },
      { timestamp: 'Yesterday, 08:15 AM', bp: '126/82', hr: 75, sugar: 102, status: 'Slightly Elevated' }
    ]
  };

  const DEFAULT_WATER = {
    glasses: 5,
    maxGlasses: 8
  };

  // =========================================================================
  // State Storage Management
  // =========================================================================
  const state = {
    user: JSON.parse(localStorage.getItem('medipulse_user')) || null,
    medications: JSON.parse(localStorage.getItem('medipulse_meds')) || DEFAULT_MEDICATIONS,
    activity: JSON.parse(localStorage.getItem('medipulse_activity')) || DEFAULT_ACTIVITY,
    vitals: JSON.parse(localStorage.getItem('medipulse_vitals')) || DEFAULT_VITALS,
    water: JSON.parse(localStorage.getItem('medipulse_water')) || DEFAULT_WATER,
    settings: JSON.parse(localStorage.getItem('medipulse_settings')) || {
      soundEnabled: true,
      voiceEnabled: true,
      darkMode: false,
      seniorMode: false
    },
    activeTab: 'dashboard',
    activeAlarmMedId: null,
    beepIntervalId: null,
    titleBlinkIntervalId: null,
    originalTitle: document.title,
    walkingSimulatorActive: false,
    walkingIntervalId: null,
    currentUpcomingMed: null,
    deferredInstallPrompt: null
  };

  function saveState() {
    if (state.user) {
      localStorage.setItem('medipulse_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('medipulse_user');
    }
    localStorage.setItem('medipulse_meds', JSON.stringify(state.medications));
    localStorage.setItem('medipulse_activity', JSON.stringify(state.activity));
    localStorage.setItem('medipulse_vitals', JSON.stringify(state.vitals));
    localStorage.setItem('medipulse_water', JSON.stringify(state.water));
    localStorage.setItem('medipulse_settings', JSON.stringify(state.settings));
  }

  // =========================================================================
  // Audio & Beep Sound Synthesizer Engine (Web Audio API)
  // =========================================================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  /**
   * Urgent Medical Alert Beep Pattern
   * Loud, sharp, multi-frequency alert tone (880Hz -> 880Hz -> 1175Hz)
   * Designed to wake or alert user even if in background.
   */
  function playUrgentMedicalBeep() {
    if (!state.settings.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;

      // Beep 1 (A5: 880 Hz)
      playTone(880, now, 0.14, 'square');
      // Beep 2 (A5: 880 Hz)
      playTone(880, now + 0.18, 0.14, 'square');
      // Beep 3 High Alert (D6: 1175 Hz)
      playTone(1175, now + 0.36, 0.28, 'sawtooth');
    } catch (e) {
      console.warn('Urgent beep error:', e);
    }
  }

  function playTone(freq, startTime, duration, type = 'sine') {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.4, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Dual-tone gentle chime
  function playGentleChime() {
    if (!state.settings.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      playTone(659.25, now, 0.6, 'sine');
      playTone(830.61, now + 0.2, 0.7, 'sine');
      playTone(987.77, now + 0.4, 0.9, 'sine');
    } catch (e) {
      console.warn('Gentle chime error:', e);
    }
  }

  // Web Speech Synthesis Voice Reminder
  function speakReminder(text) {
    if (!state.settings.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  // Desktop Web Notification
  function sendDesktopNotification(title, body) {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: 'icon-192.png',
          badge: 'icon-192.png',
          tag: 'medipulse-dose-alarm',
          renotify: true,
          requireInteraction: true
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch (e) {
        console.warn('Notification display failed:', e);
      }
    }
  }

  // =========================================================================
  // DOM Elements Selection
  // =========================================================================
  const dom = {
    // Auth Gate
    authGateScreen: document.getElementById('auth-gate-screen'),
    formPatientAuth: document.getElementById('form-patient-auth'),
    mainAppContainer: document.getElementById('main-app-container'),
    btnQuickFillDemo: document.getElementById('btn-quick-fill-demo'),

    // Nav & Layout
    sidebar: document.getElementById('sidebar'),
    menuToggle: document.getElementById('menu-toggle'),
    navItems: document.querySelectorAll('.nav-item'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    currentViewTitle: document.getElementById('current-view-title'),
    currentDateDisplay: document.getElementById('current-date-display'),
    liveTimeText: document.getElementById('live-time-text'),

    // Top buttons
    btnInstallShortcut: document.getElementById('btn-install-shortcut'),
    btnToggleSound: document.getElementById('btn-toggle-sound'),
    btnToggleVoice: document.getElementById('btn-toggle-voice'),
    btnToggleSenior: document.getElementById('btn-toggle-senior'),
    btnToggleTheme: document.getElementById('btn-toggle-theme'),
    btnOpenAddMed: document.getElementById('btn-open-add-med'),

    // Sidebar Patient Info
    userProfileName: document.getElementById('user-profile-name'),
    userProfileMeta: document.getElementById('user-profile-meta'),
    userProfileAddress: document.getElementById('user-profile-address'),
    avatarInitials: document.getElementById('avatar-initials'),

    // Badges
    badgeDueCount: document.getElementById('badge-due-count'),
    badgeLowStock: document.getElementById('badge-low-stock'),

    // Dashboard Stats
    dashAdherence: document.getElementById('dash-stat-adherence'),
    dashDosesTaken: document.getElementById('dash-stat-doses-taken'),
    dashDosesRemaining: document.getElementById('dash-doses-remaining-text'),
    dashSteps: document.getElementById('dash-stat-steps'),
    dashStepPercent: document.getElementById('dash-step-percent'),
    dashLowStock: document.getElementById('dash-stat-low-stock'),
    dashStockSummary: document.getElementById('dash-stock-summary'),
    dashStreakCount: document.getElementById('dash-streak-count'),

    // Hero Dose Banner
    heroDoseCard: document.getElementById('hero-dose-card'),
    heroMedName: document.getElementById('hero-med-name'),
    heroMedDosage: document.getElementById('hero-med-dosage'),
    heroMedTime: document.getElementById('hero-med-time'),
    heroMedFood: document.getElementById('hero-med-food'),
    heroMedStock: document.getElementById('hero-med-stock'),
    heroCountdownTimer: document.getElementById('hero-countdown-timer'),
    btnHeroTake: document.getElementById('btn-hero-take'),
    btnHeroSnooze: document.getElementById('btn-hero-snooze'),
    btnHeroSkip: document.getElementById('btn-hero-skip'),
    btnTestUrgentBeep: document.getElementById('btn-test-urgent-beep'),
    btnTestUrgentBeepSchedule: document.getElementById('btn-test-urgent-beep-schedule'),

    // Dash Mini Pedometer
    dashCircleProgress: document.getElementById('dash-circle-progress'),
    dashMiniStepText: document.getElementById('dash-mini-step-text'),
    dashMiniStepGoal: document.getElementById('dash-mini-step-goal'),
    dashStepDist: document.getElementById('dash-step-dist'),
    dashStepCal: document.getElementById('dash-step-cal'),
    dashStepTime: document.getElementById('dash-step-time'),

    // Dash Lists
    dashTimelinePreview: document.getElementById('dash-med-timeline-preview'),
    dashStockPreview: document.getElementById('dash-stock-list-preview'),

    // Schedule Tab
    fullScheduleContainer: document.getElementById('full-schedule-container'),
    btnTestAlarm: document.getElementById('btn-test-alarm'),

    // Inventory Tab
    stockAlertBannerContainer: document.getElementById('stock-alert-banner-container'),
    stockGridContainer: document.getElementById('stock-grid-container'),
    btnExportRefillList: document.getElementById('btn-export-refill-list'),

    // Activity Tab
    heroPedProgress: document.getElementById('hero-ped-progress'),
    pedTotalSteps: document.getElementById('ped-total-steps'),
    pedGoalLabel: document.getElementById('ped-goal-label'),
    pedGoalStatus: document.getElementById('ped-goal-status'),
    pedMetricDist: document.getElementById('ped-metric-dist'),
    pedMetricCal: document.getElementById('ped-metric-cal'),
    pedMetricActiveTime: document.getElementById('ped-metric-active-time'),
    btnToggleWalkingSim: document.getElementById('btn-toggle-walking-sim'),
    walkerAvatar: document.getElementById('walker-avatar'),
    simStatusTitle: document.getElementById('sim-status-title'),
    simStatusDesc: document.getElementById('sim-status-desc'),
    stepChartContainer: document.getElementById('step-chart-container'),
    weeklyAvgSteps: document.getElementById('weekly-avg-steps'),
    btnEditStepGoal: document.getElementById('btn-edit-step-goal'),
    btnManualAddSteps: document.getElementById('btn-manual-add-steps'),

    // Vitals Tab
    waterGlassesContainer: document.getElementById('water-glasses-container'),
    waterIntakeLabel: document.getElementById('water-intake-label'),
    btnWaterPlus: document.getElementById('btn-water-plus'),
    btnWaterMinus: document.getElementById('btn-water-minus'),
    btnWaterReset: document.getElementById('btn-water-reset'),
    vitalBpVal: document.getElementById('vital-bp-val'),
    vitalHrVal: document.getElementById('vital-hr-val'),
    vitalSugarVal: document.getElementById('vital-sugar-val'),
    vitalsStatusTag: document.getElementById('vitals-status-tag'),
    vitalsHistoryList: document.getElementById('vitals-history-list'),
    btnOpenLogVitals: document.getElementById('btn-open-log-vitals'),

    // Doctor Summary Tab
    docPrescriptionTable: document.getElementById('doc-prescription-table'),
    docTableBody: document.getElementById('doc-table-body'),
    icePatientName: document.getElementById('ice-patient-name'),
    iceBloodGroup: document.getElementById('ice-blood-group'),
    iceAddress: document.getElementById('ice-address'),
    iceAllergies: document.getElementById('ice-allergies'),
    icePhysician: document.getElementById('ice-physician'),
    iceContact: document.getElementById('ice-contact'),
    btnEditEmergencyCard: document.getElementById('btn-edit-emergency-card'),

    // Modals
    modalShortcutGuide: document.getElementById('modal-shortcut-guide'),
    btnTriggerPwaPrompt: document.getElementById('btn-trigger-pwa-prompt'),
    modalAddMedicine: document.getElementById('modal-add-medicine'),
    modalRefillStock: document.getElementById('modal-refill-stock'),
    modalLogSteps: document.getElementById('modal-log-steps'),
    modalLogVitals: document.getElementById('modal-log-vitals'),
    modalEditIce: document.getElementById('modal-edit-ice'),

    // Alarm Overlay
    alarmToast: document.getElementById('alarm-toast'),
    alarmToastTitle: document.getElementById('alarm-toast-title'),
    alarmToastTime: document.getElementById('alarm-toast-time'),
    alarmToastMed: document.getElementById('alarm-toast-med'),
    alarmToastInstructions: document.getElementById('alarm-toast-instructions'),
    btnAlarmTake: document.getElementById('btn-alarm-take'),
    btnAlarmSnooze: document.getElementById('btn-alarm-snooze')
  };

  // =========================================================================
  // Patient Registration & Login Handling
  // =========================================================================
  function checkAuth() {
    if (!state.user) {
      if (dom.authGateScreen) dom.authGateScreen.style.display = 'flex';
      if (dom.mainAppContainer) dom.mainAppContainer.style.display = 'none';
    } else {
      if (dom.authGateScreen) dom.authGateScreen.style.display = 'none';
      if (dom.mainAppContainer) dom.mainAppContainer.style.display = 'flex';
      renderAllViews();
    }
  }

  function handleAuthLogin(e) {
    e.preventDefault();
    const name = document.getElementById('auth-name').value.trim();
    const age = parseInt(document.getElementById('auth-age').value, 10);
    const gender = document.getElementById('auth-gender').value;
    const bloodGroup = document.getElementById('auth-blood').value;
    const address = document.getElementById('auth-address').value.trim();
    const phone = document.getElementById('auth-phone').value.trim();
    const ice = document.getElementById('auth-ice').value.trim();
    const allergies = document.getElementById('auth-allergies').value.trim() || 'None known';

    state.user = {
      name,
      age,
      gender,
      bloodGroup,
      address,
      phone,
      ice,
      allergies,
      physician: 'Dr. Sarah Adams (+1 555-0199)'
    };

    saveState();

    // Request notification permission right on first sign in
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Play welcome chime
    playGentleChime();
    speakReminder(`Welcome ${name}. Your smart medicine reminder and stock tracker is now active.`);

    checkAuth();
  }

  function handleLogout() {
    if (confirm('Are you sure you want to log out and switch patient account?')) {
      state.user = null;
      saveState();
      checkAuth();
    }
  }

  function quickFillDemo() {
    document.getElementById('auth-name').value = 'John Smith';
    document.getElementById('auth-age').value = '58';
    document.getElementById('auth-gender').value = 'Male';
    document.getElementById('auth-blood').value = 'O+';
    document.getElementById('auth-address').value = '742 Evergreen Terrace, Springfield';
    document.getElementById('auth-phone').value = '+1 555-0142';
    document.getElementById('auth-ice').value = 'Mary Smith (Wife) - +1 555-0199';
    document.getElementById('auth-allergies').value = 'Penicillin, Peanuts';
  }

  // =========================================================================
  // Progressive Web App (PWA) & Add to Shortcut
  // =========================================================================
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => console.log('MediPulse Service Worker registered:', reg.scope))
          .catch((err) => console.log('Service Worker registration failed:', err));
      });
    }

    // Catch PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.deferredInstallPrompt = e;
      if (dom.btnInstallShortcut) {
        dom.btnInstallShortcut.style.display = 'inline-flex';
      }
    });

    window.addEventListener('appinstalled', () => {
      state.deferredInstallPrompt = null;
      alert('🎉 MediPulse was successfully added to your device shortcut!');
    });
  }

  function triggerInstallShortcut() {
    if (state.deferredInstallPrompt) {
      state.deferredInstallPrompt.prompt();
      state.deferredInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted PWA installation');
        }
        state.deferredInstallPrompt = null;
      });
    } else {
      openModal('modal-shortcut-guide');
    }
  }

  // =========================================================================
  // Navigation & View Switching
  // =========================================================================
  function switchTab(tabId) {
    state.activeTab = tabId;

    dom.navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    dom.tabPanes.forEach(pane => {
      pane.classList.remove('active');
    });

    const targetPane = document.getElementById(`view-${tabId}`);
    if (targetPane) {
      targetPane.classList.add('active');
    }

    const titles = {
      dashboard: 'Dashboard Overview',
      schedule: "Today's Medication Schedule",
      inventory: 'Medicine Stock & Inventory',
      activity: 'Daily Steps & Walking Tracker',
      vitals: 'Health Vitals & Hydration Log',
      'doctor-summary': 'Doctor & Pharmacy Clinical Summary'
    };
    if (dom.currentViewTitle) {
      dom.currentViewTitle.textContent = titles[tabId] || 'Health Companion';
    }

    renderAllViews();

    if (window.innerWidth <= 768 && dom.sidebar.classList.contains('open')) {
      dom.sidebar.classList.remove('open');
    }
  }

  // =========================================================================
  // Time, Clock, and Real-Time Reminder Countdown
  // =========================================================================
  function updateClockAndCountdown() {
    const now = new Date();

    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    if (dom.liveTimeText) {
      dom.liveTimeText.textContent = now.toLocaleTimeString([], timeOptions);
    }

    const dateOptions = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    if (dom.currentDateDisplay) {
      dom.currentDateDisplay.textContent = now.toLocaleDateString([], dateOptions);
    }

    findAndDisplayNextDose(now);
  }

  function parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  function findAndDisplayNextDose(now) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentSeconds = now.getSeconds();

    const untakenMeds = state.medications.filter(m => !m.takenToday);

    if (untakenMeds.length === 0) {
      if (dom.heroMedName) dom.heroMedName.textContent = '🎉 All Doses Completed for Today!';
      if (dom.heroMedDosage) dom.heroMedDosage.textContent = 'Great adherence!';
      if (dom.heroMedTime) dom.heroMedTime.textContent = 'Next dose tomorrow morning';
      if (dom.heroMedFood) dom.heroMedFood.textContent = 'Stay hydrated & rested';
      if (dom.heroMedStock) dom.heroMedStock.textContent = 'Stock verified';
      if (dom.heroCountdownTimer) dom.heroCountdownTimer.textContent = 'DONE';
      if (dom.heroDoseCard) dom.heroDoseCard.style.background = 'linear-gradient(135deg, #047857, #10b981)';
      state.currentUpcomingMed = null;
      return;
    }

    const sorted = [...untakenMeds].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

    let targetMed = sorted.find(m => parseTimeToMinutes(m.time) >= currentMinutes);
    let isOverdue = false;

    if (!targetMed) {
      targetMed = sorted[0];
      isOverdue = true;
    }

    state.currentUpcomingMed = targetMed;

    if (dom.heroMedName) dom.heroMedName.textContent = `${targetMed.name} (${targetMed.dosage})`;
    if (dom.heroMedDosage) dom.heroMedDosage.textContent = `Form: ${targetMed.form}`;
    if (dom.heroMedTime) dom.heroMedTime.textContent = `Scheduled: ${formatTime12Hour(targetMed.time)}`;
    if (dom.heroMedFood) dom.heroMedFood.textContent = `Instruction: ${targetMed.food}`;
    if (dom.heroMedStock) dom.heroMedStock.textContent = `Remaining: ${targetMed.stock} pills`;

    const targetMinutes = parseTimeToMinutes(targetMed.time);
    let diffMinutes = targetMinutes - currentMinutes;

    if (diffMinutes === 0) {
      // DUE RIGHT NOW!
      if (dom.heroCountdownTimer) dom.heroCountdownTimer.textContent = 'DUE NOW!';
      if (dom.heroDoseCard) dom.heroDoseCard.style.background = 'linear-gradient(135deg, #b45309, #ef4444)';

      // Trigger beep alarm if not currently sounding for this med
      if (state.activeAlarmMedId !== targetMed.id) {
        triggerDoseAlarm(targetMed);
      }
    } else if (diffMinutes < 0) {
      // Overdue dose
      const minsPast = Math.abs(diffMinutes);
      if (dom.heroCountdownTimer) dom.heroCountdownTimer.textContent = `${minsPast}m OVERDUE`;
      if (dom.heroDoseCard) dom.heroDoseCard.style.background = 'linear-gradient(135deg, #991b1b, #ef4444)';

      // Overdue dose also sounds urgent beep reminder
      if (state.activeAlarmMedId !== targetMed.id && minsPast <= 60) {
        triggerDoseAlarm(targetMed);
      }
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      const secs = 59 - currentSeconds;
      const formatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      if (dom.heroCountdownTimer) dom.heroCountdownTimer.textContent = formatted;
      if (dom.heroDoseCard) dom.heroDoseCard.style.background = 'linear-gradient(135deg, #1e3a8a, #2563eb)';
    }
  }

  function formatTime12Hour(time24) {
    if (!time24) return '';
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
  }

  // =========================================================================
  // Alarm & Persistent Beep Alert Engine
  // =========================================================================
  function triggerDoseAlarm(med, isTest = false) {
    state.activeAlarmMedId = med.id;

    if (dom.alarmToast) {
      dom.alarmToast.classList.add('active');
    }
    if (dom.alarmToastMed) {
      dom.alarmToastMed.textContent = `${med.name} (${med.dosage})`;
    }
    if (dom.alarmToastTime) {
      dom.alarmToastTime.textContent = `Scheduled for ${formatTime12Hour(med.time)} • ${med.category}`;
    }
    if (dom.alarmToastInstructions) {
      dom.alarmToastInstructions.innerHTML = `<strong>${med.food}</strong>: ${med.instructions || 'Take with water.'}<br>Remaining in stock: <strong>${med.stock} pills</strong>`;
    }

    // Play immediate urgent medical beep
    playUrgentMedicalBeep();

    // Start recurring urgent beep every 3.5 seconds until taken/snoozed/silenced
    if (state.beepIntervalId) clearInterval(state.beepIntervalId);
    state.beepIntervalId = setInterval(() => {
      playUrgentMedicalBeep();
    }, 3500);

    // Flashing browser tab title for visibility in other tabs
    startTitleBlinker(med.name);

    // Send OS / Windows desktop notification
    sendDesktopNotification(
      `🚨 MEDICINE ALERT: ${med.name} (${med.dosage})`,
      `Time to take your scheduled dose: ${med.food}. Available stock: ${med.stock} pills remaining.`
    );

    // Speech synthesis announcement
    const patientName = state.user ? state.user.name : 'Patient';
    const voiceMsg = `Attention ${patientName}. You forgot to take your scheduled medicine. It is time to take your ${med.name}, ${med.dosage}, ${med.food}. Current stock is ${med.stock} doses.`;
    speakReminder(voiceMsg);

    // Actions
    if (dom.btnAlarmTake) {
      dom.btnAlarmTake.onclick = () => {
        takeMedicine(med.id);
        dismissAlarm();
      };
    }
    if (dom.btnAlarmSnooze) {
      dom.btnAlarmSnooze.onclick = () => {
        snoozeMedicine(med.id, 10);
        dismissAlarm();
      };
    }
  }

  function startTitleBlinker(medName) {
    if (state.titleBlinkIntervalId) clearInterval(state.titleBlinkIntervalId);
    let isBlink = false;
    state.titleBlinkIntervalId = setInterval(() => {
      document.title = isBlink ? `🚨 (BEEP) TAKE ${medName.toUpperCase()}!` : `💊 MEDICINE DUE NOW - MediPulse`;
      isBlink = !isBlink;
    }, 1000);
  }

  function stopTitleBlinker() {
    if (state.titleBlinkIntervalId) {
      clearInterval(state.titleBlinkIntervalId);
      state.titleBlinkIntervalId = null;
    }
    document.title = state.originalTitle;
  }

  function dismissAlarm() {
    state.activeAlarmMedId = null;
    if (state.beepIntervalId) {
      clearInterval(state.beepIntervalId);
      state.beepIntervalId = null;
    }
    stopTitleBlinker();
    if (dom.alarmToast) {
      dom.alarmToast.classList.remove('active');
    }
  }

  // =========================================================================
  // Medicine Actions: Take, Snooze, Skip, Add, Refill, Delete
  // =========================================================================
  function takeMedicine(medId) {
    const med = state.medications.find(m => m.id === medId);
    if (!med) return;

    if (med.stock <= 0) {
      alert(`⚠️ Cannot record dose: ${med.name} is OUT OF STOCK (0 pills left). Please refill your prescription immediately.`);
      openRefillModal(med.id);
      return;
    }

    // Mark as taken
    med.takenToday = true;
    med.lastTakenDate = getTodayDateString();

    // Auto-decrement stock!
    med.stock = Math.max(0, med.stock - 1);

    dismissAlarm();
    saveState();
    renderAllViews();

    // Confirmation chime
    playGentleChime();

    // Check low stock threshold alert
    if (med.stock <= med.threshold) {
      setTimeout(() => {
        alert(`⚠️ Low Stock Alert: Only ${med.stock} pill(s) of ${med.name} remaining! We recommend refilling your stock soon.`);
      }, 500);
    }
  }

  function snoozeMedicine(medId, minutes) {
    const med = state.medications.find(m => m.id === medId);
    if (!med) return;

    dismissAlarm();

    const now = new Date();
    const futureTime = new Date(now.getTime() + minutes * 60000);
    const h = String(futureTime.getHours()).padStart(2, '0');
    const m = String(futureTime.getMinutes()).padStart(2, '0');
    med.time = `${h}:${m}`;

    saveState();
    renderAllViews();
    alert(`⏰ Snoozed ${med.name} for ${minutes} minutes. New alert at ${formatTime12Hour(med.time)}.`);
  }

  function skipMedicine(medId) {
    const med = state.medications.find(m => m.id === medId);
    if (!med) return;

    if (confirm(`Are you sure you want to skip today's dose of ${med.name}?`)) {
      dismissAlarm();
      med.takenToday = true;
      saveState();
      renderAllViews();
    }
  }

  function deleteMedicine(medId) {
    const med = state.medications.find(m => m.id === medId);
    if (!med) return;

    if (confirm(`Are you sure you want to remove "${med.name}" from your medication schedule?`)) {
      state.medications = state.medications.filter(m => m.id !== medId);
      saveState();
      renderAllViews();
    }
  }

  // =========================================================================
  // Modal Handlers
  // =========================================================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
    }
  }

  function openAddMedicineModal(editId = null) {
    const form = document.getElementById('form-add-medicine');
    if (!form) return;

    form.reset();
    document.getElementById('med-edit-id').value = editId || '';
    const modalTitle = document.getElementById('modal-med-title');

    if (editId) {
      const med = state.medications.find(m => m.id === editId);
      if (med) {
        if (modalTitle) modalTitle.textContent = 'Edit Medication';
        document.getElementById('input-med-name').value = med.name;
        document.getElementById('input-med-dosage').value = med.dosage;
        document.getElementById('input-med-form').value = med.form;
        document.getElementById('input-med-food').value = med.food;
        document.getElementById('input-med-category').value = med.category;
        document.getElementById('input-med-time').value = med.time;
        document.getElementById('input-med-stock').value = med.stock;
        document.getElementById('input-med-threshold').value = med.threshold;
      }
    } else {
      if (modalTitle) modalTitle.textContent = 'Add New Medication';
    }

    openModal('modal-add-medicine');
  }

  function handleSaveMedicine(e) {
    e.preventDefault();
    const editId = document.getElementById('med-edit-id').value;
    const name = document.getElementById('input-med-name').value.trim();
    const dosage = document.getElementById('input-med-dosage').value.trim();
    const form = document.getElementById('input-med-form').value;
    const food = document.getElementById('input-med-food').value;
    const category = document.getElementById('input-med-category').value;
    const time = document.getElementById('input-med-time').value;
    const stock = parseInt(document.getElementById('input-med-stock').value, 10) || 0;
    const threshold = parseInt(document.getElementById('input-med-threshold').value, 10) || 5;

    const colorRadios = document.getElementsByName('med-color');
    let color = '#2563eb';
    for (const r of colorRadios) {
      if (r.checked) {
        color = r.value;
        break;
      }
    }

    if (editId) {
      const med = state.medications.find(m => m.id === editId);
      if (med) {
        med.name = name;
        med.dosage = dosage;
        med.form = form;
        med.food = food;
        med.category = category;
        med.time = time;
        med.stock = stock;
        med.threshold = threshold;
        med.color = color;
      }
    } else {
      const newMed = {
        id: 'med-' + Date.now(),
        name,
        dosage,
        form,
        food,
        category,
        time,
        stock,
        threshold,
        color,
        takenToday: false,
        lastTakenDate: null,
        instructions: `Take as prescribed: ${food}.`
      };
      state.medications.push(newMed);
    }

    saveState();
    closeModal('modal-add-medicine');
    renderAllViews();
  }

  function openRefillModal(medId) {
    const med = state.medications.find(m => m.id === medId);
    if (!med) return;

    document.getElementById('refill-med-id').value = med.id;
    document.getElementById('refill-modal-med-title').innerHTML = `Refilling <strong>${med.name}</strong> (${med.dosage})<br>Current stock: <strong>${med.stock} pills</strong>`;
    document.getElementById('input-refill-quantity').value = 30;

    openModal('modal-refill-stock');
  }

  function handleSaveRefill(e) {
    e.preventDefault();
    const medId = document.getElementById('refill-med-id').value;
    const qty = parseInt(document.getElementById('input-refill-quantity').value, 10) || 0;

    const med = state.medications.find(m => m.id === medId);
    if (med && qty > 0) {
      med.stock += qty;
      saveState();
      closeModal('modal-refill-stock');
      renderAllViews();
      alert(`✅ Successfully added ${qty} pills to ${med.name}. New total stock: ${med.stock} pills.`);
    }
  }

  // =========================================================================
  // Step & Walking Tracker Engine
  // =========================================================================
  function calculateMetrics(steps) {
    const distKm = (steps * 0.00078).toFixed(2);
    const distMiles = (steps * 0.00048).toFixed(2);
    const calories = Math.round(steps * 0.04);
    const activeMinutes = Math.round(steps / 100);
    const percent = Math.min(100, Math.round((steps / state.activity.goal) * 100));

    return { distKm, distMiles, calories, activeMinutes, percent };
  }

  function addSteps(count) {
    state.activity.steps += count;
    const todayHist = state.activity.history.find(h => h.day === 'Today');
    if (todayHist) {
      todayHist.steps = state.activity.steps;
    }

    saveState();
    renderActivityView();
    renderDashboardView();
  }

  function handleSaveCustomSteps(e) {
    e.preventDefault();
    const count = parseInt(document.getElementById('input-custom-steps').value, 10) || 0;
    const newGoal = parseInt(document.getElementById('input-step-goal').value, 10);

    if (newGoal && newGoal >= 1000) {
      state.activity.goal = newGoal;
    }

    if (count > 0) {
      addSteps(count);
    } else {
      saveState();
      renderActivityView();
      renderDashboardView();
    }

    closeModal('modal-log-steps');
  }

  function toggleWalkingSimulator() {
    state.walkingSimulatorActive = !state.walkingSimulatorActive;

    if (state.walkingSimulatorActive) {
      if (dom.btnToggleWalkingSim) {
        dom.btnToggleWalkingSim.className = 'btn btn-outline';
        dom.btnToggleWalkingSim.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
          </svg>
          <span>Stop Walking Mode</span>
        `;
      }
      if (dom.walkerAvatar) {
        dom.walkerAvatar.classList.add('walking');
      }
      if (dom.simStatusTitle) {
        dom.simStatusTitle.textContent = 'Active Walk in Progress! 🏃';
      }
      if (dom.simStatusDesc) {
        dom.simStatusDesc.textContent = 'Simulating real-time walking cadence (~110 steps/min). Keeping your heart strong!';
      }

      state.walkingIntervalId = setInterval(() => {
        addSteps(2);
      }, 1000);
    } else {
      clearInterval(state.walkingIntervalId);
      state.walkingIntervalId = null;

      if (dom.btnToggleWalkingSim) {
        dom.btnToggleWalkingSim.className = 'btn btn-success';
        dom.btnToggleWalkingSim.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Start Walking Mode</span>
        `;
      }
      if (dom.walkerAvatar) {
        dom.walkerAvatar.classList.remove('walking');
      }
      if (dom.simStatusTitle) {
        dom.simStatusTitle.textContent = 'Live Walk Pedometer Simulator';
      }
      if (dom.simStatusDesc) {
        dom.simStatusDesc.textContent = 'Turn on during your walk to log steps automatically in real-time.';
      }
    }
  }

  // =========================================================================
  // Hydration & Vitals Management
  // =========================================================================
  function renderWaterTracker() {
    if (!dom.waterGlassesContainer) return;
    dom.waterGlassesContainer.innerHTML = '';

    const { glasses, maxGlasses } = state.water;

    for (let i = 1; i <= maxGlasses; i++) {
      const isFilled = i <= glasses;
      const glassEl = document.createElement('div');
      glassEl.className = `glass-item ${isFilled ? 'filled' : ''}`;
      glassEl.title = `Glass ${i} (250 ml)`;
      glassEl.innerHTML = `<div class="glass-fill"></div>`;

      glassEl.onclick = () => {
        state.water.glasses = i;
        saveState();
        renderWaterTracker();
      };

      dom.waterGlassesContainer.appendChild(glassEl);
    }

    const totalMl = glasses * 250;
    if (dom.waterIntakeLabel) {
      dom.waterIntakeLabel.textContent = `${glasses} / ${maxGlasses} Glasses (${totalMl} ml)`;
    }
  }

  function handleSaveVitals(e) {
    e.preventDefault();
    const sys = parseInt(document.getElementById('input-bp-sys').value, 10);
    const dia = parseInt(document.getElementById('input-bp-dia').value, 10);
    const hr = parseInt(document.getElementById('input-vitals-hr').value, 10);
    const sugar = parseInt(document.getElementById('input-vitals-sugar').value, 10) || 95;

    state.vitals.bpSys = sys;
    state.vitals.bpDia = dia;
    state.vitals.heartRate = hr;
    state.vitals.bloodSugar = sugar;

    let status = 'Normal';
    if (sys >= 140 || dia >= 90) status = 'Stage 2 Hypertension';
    else if (sys >= 130 || dia >= 80) status = 'Stage 1 Hypertension';
    else if (sys >= 120 && dia < 80) status = 'Elevated BP';

    state.vitals.history.unshift({
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bp: `${sys}/${dia}`,
      hr,
      sugar,
      status
    });

    if (state.vitals.history.length > 5) state.vitals.history.pop();

    saveState();
    closeModal('modal-log-vitals');
    renderVitalsView();
  }

  function handleSaveIce(e) {
    e.preventDefault();
    if (!state.user) return;
    state.user.name = document.getElementById('input-ice-name').value.trim();
    state.user.bloodGroup = document.getElementById('input-ice-blood').value.trim();
    state.user.address = document.getElementById('input-ice-address').value.trim();
    state.user.allergies = document.getElementById('input-ice-allergies').value.trim();
    state.user.physician = document.getElementById('input-ice-physician').value.trim();
    state.user.ice = document.getElementById('input-ice-contact').value.trim();

    saveState();
    closeModal('modal-edit-ice');
    renderDoctorView();
    renderSidebarPatient();
  }

  // =========================================================================
  // Rendering Views
  // =========================================================================
  function renderAllViews() {
    renderSidebarBadges();
    renderSidebarPatient();
    renderDashboardView();
    renderScheduleView();
    renderInventoryView();
    renderActivityView();
    renderVitalsView();
    renderDoctorView();
  }

  function renderSidebarBadges() {
    const untakenCount = state.medications.filter(m => !m.takenToday).length;
    if (dom.badgeDueCount) {
      dom.badgeDueCount.textContent = untakenCount;
      dom.badgeDueCount.style.display = untakenCount > 0 ? 'inline-block' : 'none';
    }

    const lowStockCount = state.medications.filter(m => m.stock <= m.threshold).length;
    if (dom.badgeLowStock) {
      dom.badgeLowStock.textContent = lowStockCount;
      dom.badgeLowStock.style.display = lowStockCount > 0 ? 'inline-block' : 'none';
    }
  }

  function renderSidebarPatient() {
    if (!state.user) return;
    if (dom.userProfileName) dom.userProfileName.textContent = state.user.name;
    if (dom.userProfileMeta) dom.userProfileMeta.textContent = `Age: ${state.user.age} • Blood: ${state.user.bloodGroup}`;
    if (dom.userProfileAddress) dom.userProfileAddress.textContent = `📍 ${state.user.address}`;
    if (dom.avatarInitials) {
      const parts = state.user.name.split(' ');
      const initials = parts.map(p => p[0]).join('').substring(0, 2).toUpperCase();
      dom.avatarInitials.textContent = initials || 'JS';
    }
  }

  // Render Dashboard
  function renderDashboardView() {
    const totalMeds = state.medications.length;
    const takenMeds = state.medications.filter(m => m.takenToday).length;
    const adherenceRate = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 100;
    const lowStockCount = state.medications.filter(m => m.stock <= m.threshold).length;

    if (dom.dashAdherence) dom.dashAdherence.textContent = `${adherenceRate}%`;
    if (dom.dashDosesTaken) dom.dashDosesTaken.textContent = `${takenMeds} / ${totalMeds}`;
    if (dom.dashDosesRemaining) dom.dashDosesRemaining.textContent = `${totalMeds - takenMeds} doses remaining`;
    if (dom.dashLowStock) dom.dashLowStock.textContent = lowStockCount;
    if (dom.dashStockSummary) {
      dom.dashStockSummary.textContent = lowStockCount > 0
        ? `⚠️ ${lowStockCount} medication(s) need refill!`
        : 'All stocks adequate';
    }

    const metrics = calculateMetrics(state.activity.steps);
    if (dom.dashSteps) dom.dashSteps.textContent = state.activity.steps.toLocaleString();
    if (dom.dashStepPercent) dom.dashStepPercent.textContent = `${metrics.percent}% of ${state.activity.goal.toLocaleString()} goal`;
    if (dom.dashMiniStepText) dom.dashMiniStepText.textContent = state.activity.steps.toLocaleString();
    if (dom.dashMiniStepGoal) dom.dashMiniStepGoal.textContent = `Goal: ${state.activity.goal.toLocaleString()}`;
    if (dom.dashStepDist) dom.dashStepDist.textContent = `${metrics.distKm} km`;
    if (dom.dashStepCal) dom.dashStepCal.textContent = `${metrics.calories} kcal`;
    if (dom.dashStepTime) dom.dashStepTime.textContent = `${metrics.activeMinutes} min`;

    if (dom.dashCircleProgress) {
      dom.dashCircleProgress.setAttribute('stroke-dasharray', `${metrics.percent}, 100`);
    }

    if (state.currentUpcomingMed) {
      const med = state.currentUpcomingMed;
      if (dom.btnHeroTake) {
        dom.btnHeroTake.onclick = () => takeMedicine(med.id);
      }
      if (dom.btnHeroSnooze) {
        dom.btnHeroSnooze.onclick = () => snoozeMedicine(med.id, 10);
      }
      if (dom.btnHeroSkip) {
        dom.btnHeroSkip.onclick = () => skipMedicine(med.id);
      }
    }

    renderDashboardChecklist();
    renderDashboardStockPreview();
  }

  function renderDashboardChecklist() {
    if (!dom.dashTimelinePreview) return;
    dom.dashTimelinePreview.innerHTML = '';

    if (state.medications.length === 0) {
      dom.dashTimelinePreview.innerHTML = '<p style="color: var(--text-muted); padding: 10px;">No medications added yet.</p>';
      return;
    }

    const sorted = [...state.medications].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

    sorted.forEach(med => {
      const card = document.createElement('div');
      card.className = `med-card ${med.takenToday ? 'is-taken' : 'is-due'}`;
      card.innerHTML = `
        <div class="med-main-info">
          <div class="med-icon-pill" style="background-color: ${med.color}20; color: ${med.color};">
            ${med.form === 'Syrup' ? '🧴' : med.form === 'Drops' ? '💧' : '💊'}
          </div>
          <div class="med-details">
            <h4>${med.name} (${med.dosage})</h4>
            <div class="med-meta-tags">
              <span class="meta-chip">⏰ ${formatTime12Hour(med.time)}</span>
              <span class="meta-chip">🍽️ ${med.food}</span>
              <span class="meta-chip">📦 Stock: ${med.stock}</span>
            </div>
          </div>
        </div>
        <div class="med-actions">
          ${med.takenToday
            ? `<span class="badge" style="background-color: var(--success-light); color: var(--success-dark); font-size: 0.8rem; font-weight: 700; padding: 6px 12px; border-radius: var(--radius-full);">✓ Taken</span>`
            : `<button class="btn btn-sm btn-primary" onclick="app.takeMedicine('${med.id}')">Take Dose</button>`
          }
        </div>
      `;
      dom.dashTimelinePreview.appendChild(card);
    });
  }

  function renderDashboardStockPreview() {
    if (!dom.dashStockPreview) return;
    dom.dashStockPreview.innerHTML = '';

    state.medications.forEach(med => {
      const estDays = Math.max(0, Math.floor(med.stock / 1));
      const isLow = med.stock <= med.threshold;
      const isCritical = med.stock === 0;

      let fillClass = 'healthy';
      if (isCritical) fillClass = 'danger';
      else if (isLow) fillClass = 'warning';

      const percent = Math.min(100, Math.round((med.stock / 60) * 100));

      const item = document.createElement('div');
      item.style.marginBottom = '14px';
      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: 0.85rem;">
          <strong style="color: var(--text-primary);">${med.name}</strong>
          <span>
            <strong style="color: ${isCritical ? 'var(--danger)' : isLow ? 'var(--warning)' : 'var(--text-primary)'};">${med.stock} pills</strong> left
            (${estDays} days)
          </span>
        </div>
        <div class="stock-bar-track">
          <div class="stock-bar-fill ${fillClass}" style="width: ${percent}%;"></div>
        </div>
      `;
      dom.dashStockPreview.appendChild(item);
    });
  }

  // Render Schedule View
  function renderScheduleView() {
    if (!dom.fullScheduleContainer) return;
    dom.fullScheduleContainer.innerHTML = '';

    if (state.medications.length === 0) {
      dom.fullScheduleContainer.innerHTML = `
        <div class="card" style="text-align: center; padding: 40px;">
          <p style="color: var(--text-muted); margin-bottom: 16px;">No medications found in your schedule.</p>
          <button class="btn btn-primary" onclick="app.openAddMedicineModal()">+ Add Your First Medicine</button>
        </div>
      `;
      return;
    }

    const groups = {
      'Morning (Breakfast & Early)': [],
      'Afternoon (Lunch & Midday)': [],
      'Evening (Dinner)': [],
      'Bedtime (Night)': []
    };

    state.medications.forEach(med => {
      const minutes = parseTimeToMinutes(med.time);
      if (minutes < 720) groups['Morning (Breakfast & Early)'].push(med);
      else if (minutes < 1020) groups['Afternoon (Lunch & Midday)'].push(med);
      else if (minutes < 1200) groups['Evening (Dinner)'].push(med);
      else groups['Bedtime (Night)'].push(med);
    });

    for (const [groupTitle, meds] of Object.entries(groups)) {
      if (meds.length === 0) continue;

      const groupEl = document.createElement('div');
      groupEl.className = 'timeline-group';
      groupEl.innerHTML = `<div class="timeline-header">🕒 ${groupTitle}</div>`;

      meds.forEach(med => {
        const card = document.createElement('div');
        card.className = `med-card ${med.takenToday ? 'is-taken' : 'is-due'}`;

        const isLow = med.stock <= med.threshold;
        const stockBadge = isLow
          ? `<span class="stock-indicator-badge badge-low-stock">⚠️ Low Stock: ${med.stock} left</span>`
          : `<span class="stock-indicator-badge badge-in-stock">✓ In Stock (${med.stock})</span>`;

        card.innerHTML = `
          <div class="med-main-info">
            <div class="med-icon-pill" style="background-color: ${med.color}20; color: ${med.color};">
              ${med.form === 'Syrup' ? '🧴' : med.form === 'Drops' ? '💧' : '💊'}
            </div>
            <div class="med-details">
              <h4>${med.name} <span style="font-weight: 500; font-size: 0.88rem; color: var(--text-muted);">(${med.dosage})</span></h4>
              <div class="med-meta-tags">
                <span class="meta-chip">⏰ Time: <strong>${formatTime12Hour(med.time)}</strong></span>
                <span class="meta-chip">🍽️ ${med.food}</span>
                <span class="meta-chip">🏷️ ${med.category}</span>
                ${stockBadge}
              </div>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">
                💡 ${med.instructions}
              </p>
            </div>
          </div>
          <div class="med-actions">
            ${med.takenToday
              ? `<span class="badge" style="background-color: var(--success-light); color: var(--success-dark); font-size: 0.85rem; font-weight: 700; padding: 6px 14px; border-radius: var(--radius-full);">✓ Taken Today</span>`
              : `<button class="btn btn-success" onclick="app.takeMedicine('${med.id}')">Take Dose</button>
                 <button class="btn btn-outline" onclick="app.snoozeMedicine('${med.id}', 10)">Snooze</button>
                 <button class="btn btn-outline" onclick="app.skipMedicine('${med.id}')">Skip</button>`
            }
            <button class="icon-btn" onclick="app.openAddMedicineModal('${med.id}')" title="Edit Medication">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
              </svg>
            </button>
            <button class="icon-btn" onclick="app.deleteMedicine('${med.id}')" title="Delete Medication">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        `;
        groupEl.appendChild(card);
      });

      dom.fullScheduleContainer.appendChild(groupEl);
    }
  }

  // Render Inventory View
  function renderInventoryView() {
    if (!dom.stockGridContainer) return;
    dom.stockGridContainer.innerHTML = '';
    if (dom.stockAlertBannerContainer) dom.stockAlertBannerContainer.innerHTML = '';

    const lowStockMeds = state.medications.filter(m => m.stock <= m.threshold);

    if (lowStockMeds.length > 0 && dom.stockAlertBannerContainer) {
      const banner = document.createElement('div');
      banner.className = 'card';
      banner.style.borderLeft = '6px solid var(--warning)';
      banner.style.marginBottom = '20px';
      banner.style.backgroundColor = 'var(--warning-light)';
      banner.style.color = 'var(--warning-dark)';
      banner.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <h4 style="font-weight: 800; font-size: 1.05rem;">⚠️ Attention: ${lowStockMeds.length} Medication(s) Running Low</h4>
            <p style="font-size: 0.85rem; margin-top: 2px;">
              ${lowStockMeds.map(m => `<strong>${m.name}</strong> (${m.stock} left)`).join(', ')} need refilling to avoid missing doses.
            </p>
          </div>
          <button class="btn btn-primary" onclick="app.exportRefillList()">Order Refill List</button>
        </div>
      `;
      dom.stockAlertBannerContainer.appendChild(banner);
    }

    state.medications.forEach(med => {
      const isCritical = med.stock <= 0;
      const isLow = med.stock <= med.threshold;
      const daysLeft = Math.max(0, Math.floor(med.stock / 1));
      const percent = Math.min(100, Math.round((med.stock / 60) * 100));

      let barClass = 'healthy';
      let statusBadge = '<span class="stock-indicator-badge badge-in-stock">In Stock</span>';

      if (isCritical) {
        barClass = 'danger';
        statusBadge = '<span class="stock-indicator-badge badge-out-stock">Out of Stock!</span>';
      } else if (isLow) {
        barClass = 'warning';
        statusBadge = '<span class="stock-indicator-badge badge-low-stock">Low Stock - Refill</span>';
      }

      const card = document.createElement('div');
      card.className = `stock-card ${isCritical ? 'critical' : ''}`;
      card.innerHTML = `
        <div>
          <div class="stock-card-top">
            <div>
              <h4 style="font-size: 1.15rem; font-weight: 700;">${med.name}</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted);">${med.dosage} • ${med.form} • ${med.category}</p>
            </div>
            ${statusBadge}
          </div>

          <div class="stock-progress-wrap">
            <div class="stock-numbers">
              <span>Available Stock: <strong>${med.stock} pills</strong></span>
              <span>Low Alert: <strong>${med.threshold} pills</strong></span>
            </div>
            <div class="stock-bar-track">
              <div class="stock-bar-fill ${barClass}" style="width: ${percent}%;"></div>
            </div>
          </div>

          <div class="days-left-pill" style="background-color: var(--bg-subtle);">
            📅 Estimated supply: <strong>${daysLeft} days remaining</strong>
          </div>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 16px;">
          <button class="btn btn-primary" style="flex: 1;" onclick="app.openRefillModal('${med.id}')">
            + Quick Refill
          </button>
          <button class="btn btn-outline btn-sm" onclick="app.openAddMedicineModal('${med.id}')">
            Edit
          </button>
        </div>
      `;
      dom.stockGridContainer.appendChild(card);
    });
  }

  // Render Activity / Pedometer View
  function renderActivityView() {
    const metrics = calculateMetrics(state.activity.steps);

    if (dom.pedTotalSteps) dom.pedTotalSteps.textContent = state.activity.steps.toLocaleString();
    if (dom.pedGoalLabel) dom.pedGoalLabel.textContent = `Goal: ${state.activity.goal.toLocaleString()} steps`;
    if (dom.pedMetricDist) dom.pedMetricDist.textContent = metrics.distKm;
    if (dom.pedMetricCal) dom.pedMetricCal.textContent = metrics.calories.toLocaleString();
    if (dom.pedMetricActiveTime) dom.pedMetricActiveTime.textContent = metrics.activeMinutes;

    if (dom.heroPedProgress) {
      dom.heroPedProgress.setAttribute('stroke-dasharray', `${metrics.percent}, 100`);
    }

    if (dom.pedGoalStatus) {
      if (metrics.percent >= 100) {
        dom.pedGoalStatus.textContent = '🎉 Goal Achieved! Fantastic Work!';
        dom.pedGoalStatus.style.color = 'var(--success)';
      } else {
        const remaining = state.activity.goal - state.activity.steps;
        dom.pedGoalStatus.textContent = `${remaining.toLocaleString()} steps left to reach daily goal`;
        dom.pedGoalStatus.style.color = 'var(--primary)';
      }
    }

    const totalWeekly = state.activity.history.reduce((acc, curr) => acc + curr.steps, 0);
    const avg = Math.round(totalWeekly / state.activity.history.length);
    if (dom.weeklyAvgSteps) dom.weeklyAvgSteps.textContent = avg.toLocaleString();

    renderStepChart();
  }

  function renderStepChart() {
    if (!dom.stepChartContainer) return;
    const history = state.activity.history;
    const maxVal = Math.max(state.activity.goal * 1.2, ...history.map(h => h.steps));

    const width = 640;
    const height = 200;
    const padX = 40;
    const padY = 30;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;
    const barWidth = Math.floor(chartW / history.length) - 16;

    let barsSvg = '';
    history.forEach((item, index) => {
      const x = padX + index * (chartW / history.length) + 8;
      const barH = (item.steps / maxVal) * chartH;
      const y = height - padY - barH;
      const isGoalMet = item.steps >= state.activity.goal;
      const barColor = isGoalMet ? '#10b981' : '#3b82f6';

      barsSvg += `
        <g class="chart-bar-group" style="cursor: pointer;">
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="6" fill="${barColor}">
            <title>${item.day} (${item.date}): ${item.steps.toLocaleString()} steps</title>
          </rect>
          <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="10" font-weight="700" fill="var(--text-secondary)">
            ${Math.round(item.steps / 1000)}k
          </text>
          <text x="${x + barWidth / 2}" y="${height - 10}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-muted)">
            ${item.day}
          </text>
        </g>
      `;
    });

    const goalY = height - padY - (state.activity.goal / maxVal) * chartH;
    const goalLineSvg = `
      <line x1="${padX}" y1="${goalY}" x2="${width - padX}" y2="${goalY}" stroke="#ef4444" stroke-dasharray="4,4" stroke-width="1.5" />
      <text x="${width - padX}" y="${goalY - 4}" text-anchor="end" font-size="9" font-weight="700" fill="#ef4444">10k Goal</text>
    `;

    dom.stepChartContainer.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%; display: block;">
        ${goalLineSvg}
        ${barsSvg}
      </svg>
    `;
  }

  // Render Vitals View
  function renderVitalsView() {
    renderWaterTracker();

    if (dom.vitalBpVal) dom.vitalBpVal.textContent = `${state.vitals.bpSys}/${state.vitals.bpDia}`;
    if (dom.vitalHrVal) dom.vitalHrVal.textContent = state.vitals.heartRate;
    if (dom.vitalSugarVal) dom.vitalSugarVal.textContent = state.vitals.bloodSugar;

    if (dom.vitalsStatusTag) {
      const sys = state.vitals.bpSys;
      const dia = state.vitals.bpDia;
      if (sys < 120 && dia < 80) {
        dom.vitalsStatusTag.textContent = '✓ Optimal Ranges';
        dom.vitalsStatusTag.style.backgroundColor = 'var(--success-light)';
        dom.vitalsStatusTag.style.color = 'var(--success)';
      } else if (sys <= 129 && dia < 80) {
        dom.vitalsStatusTag.textContent = '⚠️ Elevated Blood Pressure';
        dom.vitalsStatusTag.style.backgroundColor = 'var(--warning-light)';
        dom.vitalsStatusTag.style.color = 'var(--warning-dark)';
      } else {
        dom.vitalsStatusTag.textContent = '⚠️ Stage 1/2 Hypertension';
        dom.vitalsStatusTag.style.backgroundColor = 'var(--danger-light)';
        dom.vitalsStatusTag.style.color = 'var(--danger-dark)';
      }
    }

    if (dom.vitalsHistoryList) {
      dom.vitalsHistoryList.innerHTML = '<h5 style="margin-bottom: 10px; font-weight: 700;">Recent Log Entries:</h5>';
      state.vitals.history.forEach(item => {
        const row = document.createElement('div');
        row.style.padding = '8px 12px';
        row.style.backgroundColor = 'var(--bg-subtle)';
        row.style.borderRadius = 'var(--radius-sm)';
        row.style.marginBottom = '6px';
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.innerHTML = `
          <span>${item.timestamp}</span>
          <span>BP: <strong>${item.bp}</strong> | HR: <strong>${item.hr} bpm</strong> | Sugar: <strong>${item.sugar} mg/dL</strong> (${item.status})</span>
        `;
        dom.vitalsHistoryList.appendChild(row);
      });
    }
  }

  // Render Doctor / RX Summary View
  function renderDoctorView() {
    if (!state.user) return;
    if (dom.icePatientName) dom.icePatientName.textContent = state.user.name;
    if (dom.iceBloodGroup) dom.iceBloodGroup.textContent = `${state.user.bloodGroup} (${state.user.age} yrs)`;
    if (dom.iceAddress) dom.iceAddress.textContent = state.user.address;
    if (dom.iceAllergies) dom.iceAllergies.textContent = state.user.allergies;
    if (dom.icePhysician) dom.icePhysician.textContent = state.user.physician;
    if (dom.iceContact) dom.iceContact.textContent = state.user.ice;

    if (!dom.docTableBody) return;
    dom.docTableBody.innerHTML = '';

    state.medications.forEach(med => {
      const daysLeft = Math.max(0, Math.floor(med.stock / 1));
      const isLow = med.stock <= med.threshold;

      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border-color)';
      tr.innerHTML = `
        <td style="padding: 12px 10px; font-weight: 700;">${med.name} (${med.form})</td>
        <td style="padding: 12px 10px;">${med.dosage}</td>
        <td style="padding: 12px 10px;">${formatTime12Hour(med.time)}</td>
        <td style="padding: 12px 10px;">${med.food}</td>
        <td style="padding: 12px 10px; font-weight: 700; color: ${isLow ? 'var(--danger)' : 'inherit'};">
          ${med.stock} pills
        </td>
        <td style="padding: 12px 10px;">~${daysLeft} days</td>
        <td style="padding: 12px 10px;">
          ${isLow
            ? '<span style="color: var(--danger); font-weight: 700;">⚠️ REFILL REQUIRED</span>'
            : '<span style="color: var(--success); font-weight: 600;">Adequate</span>'
          }
        </td>
      `;
      dom.docTableBody.appendChild(tr);
    });
  }

  function exportRefillList() {
    const lowStock = state.medications.filter(m => m.stock <= m.threshold);
    const pName = state.user ? state.user.name : 'Patient';
    const pAge = state.user ? state.user.age : '58';
    const pDoc = state.user ? state.user.physician : 'Dr. Sarah Adams';

    let message = `PHARMACY REFILL REQUEST\nPatient: ${pName} (Age: ${pAge})\nDoctor: ${pDoc}\nDate: ${new Date().toLocaleDateString()}\n\nMEDICATIONS NEEDING REFILL:\n`;

    if (lowStock.length === 0) {
      message += `All medications currently have adequate stock. Here is the full active prescription list:\n`;
      state.medications.forEach(m => {
        message += `- ${m.name} ${m.dosage} (${m.form}): Current stock ${m.stock} pills.\n`;
      });
    } else {
      lowStock.forEach(m => {
        message += `- ${m.name} ${m.dosage} (${m.form}) - Current Stock: ${m.stock} pills (Refill requested: 30-day supply).\n`;
      });
    }

    navigator.clipboard.writeText(message).then(() => {
      alert(`📋 Pharmacy Refill summary copied to clipboard!\n\n${message}`);
    }).catch(() => {
      alert(`Pharmacy Refill summary:\n\n${message}`);
    });
  }

  // =========================================================================
  // Theme & Accessibility Toggles
  // =========================================================================
  function toggleTheme() {
    state.settings.darkMode = !state.settings.darkMode;
    applyTheme();
    saveState();
  }

  function applyTheme() {
    if (state.settings.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  function toggleSeniorMode() {
    state.settings.seniorMode = !state.settings.seniorMode;
    applySeniorMode();
    saveState();
  }

  function applySeniorMode() {
    if (state.settings.seniorMode) {
      document.body.classList.add('senior-mode');
      if (dom.btnToggleSenior) dom.btnToggleSenior.classList.add('active-sound');
    } else {
      document.body.classList.remove('senior-mode');
      if (dom.btnToggleSenior) dom.btnToggleSenior.classList.remove('active-sound');
    }
  }

  function toggleSound() {
    state.settings.soundEnabled = !state.settings.soundEnabled;
    if (dom.btnToggleSound) {
      if (state.settings.soundEnabled) {
        dom.btnToggleSound.classList.add('active-sound');
        playUrgentMedicalBeep();
      } else {
        dom.btnToggleSound.classList.remove('active-sound');
      }
    }
    saveState();
  }

  function toggleVoice() {
    state.settings.voiceEnabled = !state.settings.voiceEnabled;
    if (dom.btnToggleVoice) {
      if (state.settings.voiceEnabled) {
        dom.btnToggleVoice.classList.add('active-sound');
        speakReminder('Voice reminders activated.');
      } else {
        dom.btnToggleVoice.classList.remove('active-sound');
      }
    }
    saveState();
  }

  // =========================================================================
  // Event Listeners Binding
  // =========================================================================
  function initEventListeners() {
    // Quick Demo Fill button
    if (dom.btnQuickFillDemo) {
      dom.btnQuickFillDemo.addEventListener('click', quickFillDemo);
    }

    // Nav tabs
    dom.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.getAttribute('data-tab');
        if (tab) switchTab(tab);
      });
    });

    // Mobile menu toggle
    if (dom.menuToggle) {
      dom.menuToggle.addEventListener('click', () => {
        dom.sidebar.classList.toggle('open');
      });
    }

    // Add to Shortcut buttons
    if (dom.btnInstallShortcut) {
      dom.btnInstallShortcut.addEventListener('click', triggerInstallShortcut);
    }
    if (dom.btnTriggerPwaPrompt) {
      dom.btnTriggerPwaPrompt.addEventListener('click', triggerInstallShortcut);
    }

    // App Bar Action Buttons
    if (dom.btnToggleTheme) dom.btnToggleTheme.addEventListener('click', toggleTheme);
    if (dom.btnToggleSenior) dom.btnToggleSenior.addEventListener('click', toggleSeniorMode);
    if (dom.btnToggleSound) dom.btnToggleSound.addEventListener('click', toggleSound);
    if (dom.btnToggleVoice) dom.btnToggleVoice.addEventListener('click', toggleVoice);
    if (dom.btnOpenAddMed) dom.btnOpenAddMed.addEventListener('click', () => openAddMedicineModal());

    // Test Urgent Beep Alarm buttons
    const triggerTestBeep = () => {
      const testMed = state.medications.find(m => !m.takenToday) || state.medications[0];
      triggerDoseAlarm(testMed, true);
    };

    if (dom.btnTestUrgentBeep) dom.btnTestUrgentBeep.addEventListener('click', triggerTestBeep);
    if (dom.btnTestUrgentBeepSchedule) dom.btnTestUrgentBeepSchedule.addEventListener('click', triggerTestBeep);
    if (dom.btnTestAlarm) dom.btnTestAlarm.addEventListener('click', () => playGentleChime());

    // Walking Simulator
    if (dom.btnToggleWalkingSim) {
      dom.btnToggleWalkingSim.addEventListener('click', toggleWalkingSimulator);
    }
    if (dom.btnManualAddSteps) {
      dom.btnManualAddSteps.addEventListener('click', () => openModal('modal-log-steps'));
    }
    if (dom.btnEditStepGoal) {
      dom.btnEditStepGoal.addEventListener('click', () => openModal('modal-log-steps'));
    }

    // Hydration buttons
    if (dom.btnWaterPlus) {
      dom.btnWaterPlus.addEventListener('click', () => {
        if (state.water.glasses < state.water.maxGlasses) {
          state.water.glasses++;
          saveState();
          renderWaterTracker();
        }
      });
    }
    if (dom.btnWaterMinus) {
      dom.btnWaterMinus.addEventListener('click', () => {
        if (state.water.glasses > 0) {
          state.water.glasses--;
          saveState();
          renderWaterTracker();
        }
      });
    }
    if (dom.btnWaterReset) {
      dom.btnWaterReset.addEventListener('click', () => {
        state.water.glasses = 0;
        saveState();
        renderWaterTracker();
      });
    }

    // Vitals & Doctor buttons
    if (dom.btnOpenLogVitals) {
      dom.btnOpenLogVitals.addEventListener('click', () => openModal('modal-log-vitals'));
    }
    if (dom.btnEditEmergencyCard) {
      dom.btnEditEmergencyCard.addEventListener('click', () => {
        if (state.user) {
          document.getElementById('input-ice-name').value = state.user.name;
          document.getElementById('input-ice-blood').value = `${state.user.bloodGroup} (${state.user.age} yrs)`;
          document.getElementById('input-ice-address').value = state.user.address;
          document.getElementById('input-ice-allergies').value = state.user.allergies;
          document.getElementById('input-ice-physician').value = state.user.physician;
          document.getElementById('input-ice-contact').value = state.user.ice;
        }
        openModal('modal-edit-ice');
      });
    }
    if (dom.btnExportRefillList) {
      dom.btnExportRefillList.addEventListener('click', exportRefillList);
    }

    // Window Click to close modals when clicking backdrop
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        e.target.classList.remove('show');
      }
    });

    // Mobile Accelerometer integration
    if (window.DeviceMotionEvent) {
      let lastAccel = { x: 0, y: 0, z: 0 };
      let lastStepTime = 0;
      window.addEventListener('devicemotion', (event) => {
        const accel = event.accelerationIncludingGravity;
        if (!accel) return;
        const delta = Math.abs(accel.x - lastAccel.x) + Math.abs(accel.y - lastAccel.y) + Math.abs(accel.z - lastAccel.z);
        const now = Date.now();
        if (delta > 12 && now - lastStepTime > 350) {
          lastStepTime = now;
          addSteps(1);
        }
        lastAccel = { x: accel.x || 0, y: accel.y || 0, z: accel.z || 0 };
      }, false);
    }
  }

  // =========================================================================
  // Initialize Application
  // =========================================================================
  function init() {
    registerServiceWorker();
    applyTheme();
    applySeniorMode();
    initEventListeners();
    checkAuth();

    // Start Real-Time Clock & Reminders (Every 1000ms)
    updateClockAndCountdown();
    setInterval(updateClockAndCountdown, 1000);

    if (dom.btnToggleSound && state.settings.soundEnabled) {
      dom.btnToggleSound.classList.add('active-sound');
    }
    if (dom.btnToggleVoice && state.settings.voiceEnabled) {
      dom.btnToggleVoice.classList.add('active-sound');
    }

    console.log('MediPulse Smart Reminder initialized.');
  }

  // Expose global methods to window.app
  window.app = {
    handleAuthLogin,
    handleLogout,
    switchTab,
    takeMedicine,
    snoozeMedicine,
    skipMedicine,
    deleteMedicine,
    openAddMedicineModal,
    handleSaveMedicine,
    openRefillModal,
    handleSaveRefill,
    closeModal,
    openModal,
    addSteps,
    handleSaveCustomSteps,
    handleSaveVitals,
    handleSaveIce,
    exportRefillList,
    dismissAlarm
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
