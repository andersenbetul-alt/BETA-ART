// Comprehensive list of timezones with their details
const timezones = [
    { name: 'New York', tz: 'America/New_York', emoji: '🗽' },
    { name: 'Los Angeles', tz: 'America/Los_Angeles', emoji: '🌴' },
    { name: 'Chicago', tz: 'America/Chicago', emoji: '🏙️' },
    { name: 'Denver', tz: 'America/Denver', emoji: '⛰️' },
    { name: 'London', tz: 'Europe/London', emoji: '🇬🇧' },
    { name: 'Paris', tz: 'Europe/Paris', emoji: '🗼' },
    { name: 'Berlin', tz: 'Europe/Berlin', emoji: '🇩🇪' },
    { name: 'Tokyo', tz: 'Asia/Tokyo', emoji: '🗾' },
    { name: 'Hong Kong', tz: 'Asia/Hong_Kong', emoji: '🏙️' },
    { name: 'Singapore', tz: 'Asia/Singapore', emoji: '🇸🇬' },
    { name: 'Dubai', tz: 'Asia/Dubai', emoji: '🏜️' },
    { name: 'India', tz: 'Asia/Kolkata', emoji: '🇮🇳' },
    { name: 'Sydney', tz: 'Australia/Sydney', emoji: '🦘' },
    { name: 'Melbourne', tz: 'Australia/Melbourne', emoji: '🇦🇺' },
    { name: 'Auckland', tz: 'Pacific/Auckland', emoji: '🇳🇿' },
    { name: 'São Paulo', tz: 'America/Sao_Paulo', emoji: '🇧🇷' },
    { name: 'Mexico City', tz: 'America/Mexico_City', emoji: '🌮' },
    { name: 'Toronto', tz: 'America/Toronto', emoji: '🍁' },
    { name: 'Moscow', tz: 'Europe/Moscow', emoji: '🇷🇺' },
    { name: 'Istanbul', tz: 'Europe/Istanbul', emoji: '🕌' },
    { name: 'Bangkok', tz: 'Asia/Bangkok', emoji: '🇹🇭' },
    { name: 'Seoul', tz: 'Asia/Seoul', emoji: '🇰🇷' },
    { name: 'Bangkok', tz: 'Asia/Bangkok', emoji: '🏛️' },
    { name: 'Johannesburg', tz: 'Africa/Johannesburg', emoji: '🇿🇦' },
];

let filteredTimezones = [...timezones];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    updateAllClocks();
    setInterval(updateAllClocks, 1000);
});

// Initialize app with event listeners
function initializeApp() {
    const searchInput = document.getElementById('searchInput');
    const themeToggle = document.getElementById('themeToggle');

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filteredTimezones = timezones.filter(tz =>
            tz.name.toLowerCase().includes(searchTerm) ||
            tz.tz.toLowerCase().includes(searchTerm)
        );
        renderClocks();
        updateAllClocks();
    });

    // Theme toggle
    themeToggle.addEventListener('change', (e) => {
        if (e.target.value === 'light') {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.value = 'light';
    }

    renderClocks();
}

// Render clock cards
function renderClocks() {
    const clockGrid = document.getElementById('clockGrid');
    clockGrid.innerHTML = '';

    if (filteredTimezones.length === 0) {
        clockGrid.innerHTML = '<div class="no-results">No timezones found. Try a different search.</div>';
        return;
    }

    filteredTimezones.forEach((timezone, index) => {
        const clockCard = createClockCard(timezone, index);
        clockGrid.appendChild(clockCard);
    });
}

// Create a single clock card
function createClockCard(timezone, index) {
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.style.setProperty('--index', index);

    card.innerHTML = `
        <div class="timezone-name">${timezone.emoji} ${timezone.name}</div>
        <div class="timezone-offset" id="offset-${timezone.tz}">UTC+0</div>
        <div class="digital-time" id="time-${timezone.tz}">--:--:--</div>
        <div class="date-info" id="date-${timezone.tz}">Loading...</div>
        <div class="time-details">
            <div class="time-detail">
                <div class="time-detail-label">AM/PM</div>
                <div class="time-detail-value" id="period-${timezone.tz}">--</div>
            </div>
            <div class="time-detail">
                <div class="time-detail-label">Day</div>
                <div class="time-detail-value" id="day-${timezone.tz}">--</div>
            </div>
            <div class="time-detail">
                <div class="time-detail-label">Week</div>
                <div class="time-detail-value" id="week-${timezone.tz}">--</div>
            </div>
        </div>
    `;

    return card;
}

// Update all clock displays
function updateAllClocks() {
    filteredTimezones.forEach(timezone => {
        updateClock(timezone);
    });
    updateLastUpdated();
}

// Update a single clock
function updateClock(timezone) {
    const now = new Date();
    
    // Get time in specific timezone
    const timeInTZ = new Date(now.toLocaleString('en-US', { timeZone: timezone.tz }));
    
    // Format time components
    const hours = String(timeInTZ.getHours()).padStart(2, '0');
    const minutes = String(timeInTZ.getMinutes()).padStart(2, '0');
    const seconds = String(timeInTZ.getSeconds()).padStart(2, '0');
    
    // Update digital time display with blinking colon
    const timeDisplay = document.getElementById(`time-${timezone.tz}`);
    if (timeDisplay) {
        timeDisplay.innerHTML = `${hours}<span class="blink">:</span>${minutes}<span class="blink">:</span>${seconds}`;
    }

    // Calculate and update timezone offset
    const offset = getTimezoneOffset(timezone.tz);
    const offsetDisplay = document.getElementById(`offset-${timezone.tz}`);
    if (offsetDisplay) {
        offsetDisplay.textContent = `UTC${offset >= 0 ? '+' : ''}${offset}`;
    }

    // Update date information
    const dateDisplay = document.getElementById(`date-${timezone.tz}`);
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = timeInTZ.toLocaleDateString('en-US', options);
        dateDisplay.textContent = dateString;
    }

    // Update AM/PM
    const periodDisplay = document.getElementById(`period-${timezone.tz}`);
    if (periodDisplay) {
        periodDisplay.textContent = timeInTZ.getHours() >= 12 ? 'PM' : 'AM';
    }

    // Update day of week number
    const dayDisplay = document.getElementById(`day-${timezone.tz}`);
    if (dayDisplay) {
        const dayOfWeek = timeInTZ.toLocaleDateString('en-US', { weekday: 'short' });
        dayDisplay.textContent = dayOfWeek;
    }

    // Update week number
    const weekDisplay = document.getElementById(`week-${timezone.tz}`);
    if (weekDisplay) {
        const weekNumber = getWeekNumber(timeInTZ);
        weekDisplay.textContent = `W${weekNumber}`;
    }
}

// Calculate timezone offset in hours
function getTimezoneOffset(tz) {
    const now = new Date();
    const utcTime = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzTime = new Date(now.toLocaleString('en-US', { timeZone: tz }));
    
    const offset = (tzTime - utcTime) / (1000 * 60 * 60);
    return offset;
}

// Calculate ISO week number
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Update last updated timestamp
function updateLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    document.getElementById('lastUpdated').textContent = timeString;
}

// Utility: Export current times as JSON
function exportTimesAsJSON() {
    const data = filteredTimezones.map(tz => {
        const now = new Date();
        const timeInTZ = new Date(now.toLocaleString('en-US', { timeZone: tz.tz }));
        return {
            timezone: tz.name,
            tz: tz.tz,
            time: timeInTZ.toISOString(),
            offset: getTimezoneOffset(tz.tz)
        };
    });
    
    console.log('Current times across timezones:');
    console.table(data);
    return data;
}

// Utility: Get comparison between two timezones
function compareTimezones(tz1, tz2) {
    const now = new Date();
    const time1 = new Date(now.toLocaleString('en-US', { timeZone: tz1 }));
    const time2 = new Date(now.toLocaleString('en-US', { timeZone: tz2 }));
    
    const diff = Math.abs(time1 - time2) / (1000 * 60 * 60);
    return diff;
}
