// Comprehensive list of timezones with their details
const timezones = [
    { name: 'New York', tz: 'America/New_York', emoji: '🗽' },
    { name: 'Los Angeles', tz: 'America/Los_Angeles', emoji: '🌴' },
    { name: 'Chicago', tz: 'America/Chicago', emoji: '🏙️' },
    { name: 'Denver', tz: 'America/Denver', emoji: '⛰️' },
    { name: 'London', tz: 'Europe/London', emoji: '🇬🇧' },
    { name: 'Paris', tz: 'Europe/Paris', emoji: '🗼' },
    { name: 'Berlin', tz: 'Europe/Berlin', emoji: '🇩🇪' },
    { name: 'Oslo', tz: 'Europe/Oslo', emoji: '🇳🇴' },
    { name: 'Tokyo', tz: 'Asia/Tokyo', emoji: '🗾' },
    { name: 'Hong Kong', tz: 'Asia/Hong_Kong', emoji: '🌆' },
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
    // Bangkok was listed twice. Both cards were built from the same IANA name, so both
    // sets of element ids collided and getElementById only ever found the first — the
    // second Bangkok card sat at --:--:-- forever.
    { name: 'Bangkok', tz: 'Asia/Bangkok', emoji: '🇹🇭' },
    { name: 'Seoul', tz: 'Asia/Seoul', emoji: '🇰🇷' },
    { name: 'Johannesburg', tz: 'Africa/Johannesburg', emoji: '🇿🇦' },
];

let filteredTimezones = [...timezones];

// One card's live elements, keyed by IANA name. Cards used to be found with
// getElementById('time-' + tz), which puts a "/" inside an id — legal, but it made every
// lookup a document-wide search sixty times a second and broke on duplicates.
const cards = new Map();

// Intl.DateTimeFormat is expensive to construct and cheap to reuse, and the app builds one
// per zone per tick otherwise.
const formatters = new Map();

function formatterFor(tz) {
    if (!formatters.has(tz)) {
        formatters.set(tz, {
            parts: new Intl.DateTimeFormat('en-US', {
                timeZone: tz, hourCycle: 'h23',
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
            }),
            date: new Intl.DateTimeFormat('en-US', {
                timeZone: tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            }),
            weekday: new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' }),
            offset: new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' }),
        });
    }
    return formatters.get(tz);
}

// The wall-clock reading in a zone, as plain numbers.
//
// The previous version did new Date(now.toLocaleString('en-US', {timeZone: tz})). That
// builds a Date in the *browser's* zone holding another zone's digits, so it is wrong the
// moment you do arithmetic on it or call toISOString, and it depends on the engine parsing
// a locale string it was never specified to parse. formatToParts asks Intl the question
// directly and gets integers back.
function wallClock(tz, date) {
    const parts = {};
    for (const p of formatterFor(tz).parts.formatToParts(date)) {
        if (p.type !== 'literal') parts[p.type] = Number(p.value);
    }
    return parts;
}

// "GMT+05:30" → "+05:30". Half-hour and quarter-hour zones printed as 5.5 and 5.75 before.
function utcOffset(tz, date) {
    const name = formatterFor(tz).offset
        .formatToParts(date)
        .find((p) => p.type === 'timeZoneName');
    if (!name) return '+00:00';
    return name.value === 'GMT' ? '+00:00' : name.value.replace('GMT', '');
}

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
        filteredTimezones = timezones.filter((tz) =>
            tz.name.toLowerCase().includes(searchTerm) ||
            tz.tz.toLowerCase().includes(searchTerm)
        );
        renderClocks();
        updateAllClocks();
    });

    // Theme toggle
    themeToggle.addEventListener('change', (e) => {
        const light = e.target.value === 'light';
        document.body.classList.toggle('light-mode', light);
        try {
            localStorage.setItem('theme', light ? 'light' : 'dark');
        } catch (err) { /* private mode */ }
    });

    // Load saved theme preference
    let savedTheme = 'dark';
    try {
        savedTheme = localStorage.getItem('theme') || 'dark';
    } catch (err) { /* private mode */ }
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
    cards.clear();

    if (filteredTimezones.length === 0) {
        clockGrid.innerHTML = '<div class="no-results">No timezones found. Try a different search.</div>';
        return;
    }

    filteredTimezones.forEach((timezone, index) => {
        clockGrid.appendChild(createClockCard(timezone, index));
    });
}

// Create a single clock card
function createClockCard(timezone, index) {
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.style.setProperty('--index', index);

    card.innerHTML = `
        <div class="timezone-name">${timezone.emoji} ${timezone.name}</div>
        <div class="timezone-offset">UTC+00:00</div>
        <div class="digital-time" role="timer" aria-live="off">
            <span class="hh">--</span><span class="blink">:</span><span class="mm">--</span><span class="blink">:</span><span class="ss">--</span>
        </div>
        <div class="date-info">Loading...</div>
        <div class="time-details">
            <div class="time-detail">
                <div class="time-detail-label">AM/PM</div>
                <div class="time-detail-value period">--</div>
            </div>
            <div class="time-detail">
                <div class="time-detail-label">Day</div>
                <div class="time-detail-value day">--</div>
            </div>
            <div class="time-detail">
                <div class="time-detail-label">Week</div>
                <div class="time-detail-value week">--</div>
            </div>
        </div>
    `;

    // Hold the nodes rather than look them up every second. The two colons are created
    // once and never replaced: the old code rewrote the whole innerHTML on every tick,
    // which restarted the CSS animation each time, so the colon never actually blinked.
    cards.set(timezone.tz, {
        hh: card.querySelector('.hh'),
        mm: card.querySelector('.mm'),
        ss: card.querySelector('.ss'),
        offset: card.querySelector('.timezone-offset'),
        date: card.querySelector('.date-info'),
        period: card.querySelector('.period'),
        day: card.querySelector('.day'),
        week: card.querySelector('.week'),
    });

    return card;
}

// Update all clock displays
function updateAllClocks() {
    const now = new Date();
    filteredTimezones.forEach((timezone) => updateClock(timezone, now));
    updateLastUpdated(now);
}

// Update a single clock
function updateClock(timezone, now = new Date()) {
    const el = cards.get(timezone.tz);
    if (!el) return;

    const f = formatterFor(timezone.tz);
    const t = wallClock(timezone.tz, now);
    const pad = (n) => String(n).padStart(2, '0');

    // Only touch a node when its text actually changed — the minutes and the date are
    // rewritten 60 and 86400 times more often than they change otherwise.
    const set = (node, value) => { if (node.textContent !== value) node.textContent = value; };

    set(el.hh, pad(t.hour % 24));
    set(el.mm, pad(t.minute));
    set(el.ss, pad(t.second));
    set(el.offset, `UTC${utcOffset(timezone.tz, now)}`);
    set(el.date, f.date.format(now));
    set(el.period, t.hour < 12 ? 'AM' : 'PM');
    set(el.day, f.weekday.format(now));
    set(el.week, `W${getWeekNumber(t.year, t.month, t.day)}`);
}

// ISO-8601 week number for a calendar date, read in the zone's own terms.
function getWeekNumber(year, month, day) {
    const d = new Date(Date.UTC(year, month - 1, day));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Update last updated timestamp
function updateLastUpdated(now = new Date()) {
    document.getElementById('lastUpdated').textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
}

// Utility: Export current times as JSON
function exportTimesAsJSON() {
    const now = new Date();
    const data = filteredTimezones.map((zone) => {
        const t = wallClock(zone.tz, now);
        const pad = (n) => String(n).padStart(2, '0');
        return {
            timezone: zone.name,
            tz: zone.tz,
            // The instant, which is the same for every row — and the local reading, which
            // is what differs. The old version called toISOString() on a Date that already
            // held another zone's digits, so every timestamp came out shifted twice.
            instant: now.toISOString(),
            localTime: `${t.year}-${pad(t.month)}-${pad(t.day)}T${pad(t.hour)}:${pad(t.minute)}:${pad(t.second)}`,
            offset: utcOffset(zone.tz, now),
        };
    });

    console.table(data);
    return data;
}

// Utility: hours from tz1 to tz2, signed — positive when tz2 is ahead.
function compareTimezones(tz1, tz2) {
    const now = new Date();
    const minutes = (tz) => {
        const [, sign, h, m] = utcOffset(tz, now).match(/([+-])(\d{2}):(\d{2})/);
        return (sign === '-' ? -1 : 1) * (Number(h) * 60 + Number(m));
    };
    return (minutes(tz2) - minutes(tz1)) / 60;
}
