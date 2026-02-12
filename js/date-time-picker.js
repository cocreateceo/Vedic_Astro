// ============================================================
// Vedic Astro Picker — Date, Time & Timezone Widgets
// Self-contained: creates DOM, writes to hidden <input>.
// Public API: window.VedicPicker
// ============================================================
(function () {
    'use strict';

    // ── Timezone Data ──────────────────────────────────────
    const TZ_DATA = [
        // India
        { region: 'India', city: 'Mumbai', iana: 'Asia/Kolkata', abbr: 'IST', offset: 5.5 },
        { region: 'India', city: 'Delhi', iana: 'Asia/Kolkata', abbr: 'IST', offset: 5.5 },
        { region: 'India', city: 'Kolkata', iana: 'Asia/Kolkata', abbr: 'IST', offset: 5.5 },
        { region: 'India', city: 'Chennai', iana: 'Asia/Kolkata', abbr: 'IST', offset: 5.5 },
        // Americas
        { region: 'Americas', city: 'New York', iana: 'America/New_York', abbr: 'EST', offset: -5 },
        { region: 'Americas', city: 'Chicago', iana: 'America/Chicago', abbr: 'CST', offset: -6 },
        { region: 'Americas', city: 'Denver', iana: 'America/Denver', abbr: 'MST', offset: -7 },
        { region: 'Americas', city: 'Los Angeles', iana: 'America/Los_Angeles', abbr: 'PST', offset: -8 },
        { region: 'Americas', city: 'Toronto', iana: 'America/Toronto', abbr: 'EST', offset: -5 },
        { region: 'Americas', city: 'Sao Paulo', iana: 'America/Sao_Paulo', abbr: 'BRT', offset: -3 },
        { region: 'Americas', city: 'Mexico City', iana: 'America/Mexico_City', abbr: 'CST', offset: -6 },
        // Europe
        { region: 'Europe', city: 'London', iana: 'Europe/London', abbr: 'GMT', offset: 0 },
        { region: 'Europe', city: 'Paris', iana: 'Europe/Paris', abbr: 'CET', offset: 1 },
        { region: 'Europe', city: 'Berlin', iana: 'Europe/Berlin', abbr: 'CET', offset: 1 },
        { region: 'Europe', city: 'Moscow', iana: 'Europe/Moscow', abbr: 'MSK', offset: 3 },
        { region: 'Europe', city: 'Istanbul', iana: 'Europe/Istanbul', abbr: 'TRT', offset: 3 },
        // Asia
        { region: 'Asia', city: 'Dubai', iana: 'Asia/Dubai', abbr: 'GST', offset: 4 },
        { region: 'Asia', city: 'Karachi', iana: 'Asia/Karachi', abbr: 'PKT', offset: 5 },
        { region: 'Asia', city: 'Dhaka', iana: 'Asia/Dhaka', abbr: 'BST', offset: 6 },
        { region: 'Asia', city: 'Bangkok', iana: 'Asia/Bangkok', abbr: 'ICT', offset: 7 },
        { region: 'Asia', city: 'Singapore', iana: 'Asia/Singapore', abbr: 'SGT', offset: 8 },
        { region: 'Asia', city: 'Hong Kong', iana: 'Asia/Hong_Kong', abbr: 'HKT', offset: 8 },
        { region: 'Asia', city: 'Tokyo', iana: 'Asia/Tokyo', abbr: 'JST', offset: 9 },
        { region: 'Asia', city: 'Seoul', iana: 'Asia/Seoul', abbr: 'KST', offset: 9 },
        // Australia & Pacific
        { region: 'Australia & Pacific', city: 'Perth', iana: 'Australia/Perth', abbr: 'AWST', offset: 8 },
        { region: 'Australia & Pacific', city: 'Sydney', iana: 'Australia/Sydney', abbr: 'AEST', offset: 10 },
        { region: 'Australia & Pacific', city: 'Auckland', iana: 'Pacific/Auckland', abbr: 'NZST', offset: 12 },
        // Africa
        { region: 'Africa', city: 'Cairo', iana: 'Africa/Cairo', abbr: 'EET', offset: 2 },
        { region: 'Africa', city: 'Johannesburg', iana: 'Africa/Johannesburg', abbr: 'SAST', offset: 2 },
        { region: 'Africa', city: 'Lagos', iana: 'Africa/Lagos', abbr: 'WAT', offset: 1 },
    ];

    // ── SVG Icons ──────────────────────────────────────────
    const ICON = {
        calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
        clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        globe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2 a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        chevronDown: '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>',
        chevronUp: '<svg viewBox="0 0 24 24"><polyline points="6 15 12 9 18 15"/></svg>',
        chevronLeft: '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>',
        chevronRight: '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>',
    };

    // ── Utility ────────────────────────────────────────────
    function el(tag, cls, html) {
        var d = document.createElement(tag);
        if (cls) d.className = cls;
        if (html !== undefined) d.innerHTML = html;
        return d;
    }

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }

    function formatOffset(offset) {
        var sign = offset >= 0 ? '+' : '-';
        var abs = Math.abs(offset);
        var h = Math.floor(abs);
        var m = (abs - h) * 60;
        return 'UTC' + sign + pad(h) + ':' + pad(m);
    }

    var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    var DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    var currentYear = new Date().getFullYear();

    // Close any open picker when clicking outside
    var activePicker = null;
    document.addEventListener('mousedown', function (e) {
        if (activePicker && !activePicker._wrapper.contains(e.target)) {
            activePicker.close();
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && activePicker) {
            activePicker.close();
        }
    });

    // ── DatePicker ─────────────────────────────────────────
    function DatePicker(container, opts) {
        opts = opts || {};
        this._container = typeof container === 'string' ? document.querySelector(container) : container;
        this._hiddenId = opts.hiddenInputId || null;
        this._onSelect = opts.onSelect || null;
        this._value = null; // { y, m, d }
        this._viewYear = currentYear;
        this._viewMonth = new Date().getMonth();
        this._mode = 'calendar'; // 'calendar' | 'manual'
        this._isOpen = false;
        this._build();
        if (opts.initialValue) this.setValue(opts.initialValue);
    }

    DatePicker.prototype._build = function () {
        var self = this;
        this._wrapper = el('div', 'vap-wrapper');

        // Display field
        this._displayEl = el('div', 'vap-display');
        this._displayEl.tabIndex = 0;
        this._displayEl.setAttribute('role', 'combobox');
        this._displayEl.innerHTML =
            '<span class="vap-display-icon">' + ICON.calendar + '</span>' +
            '<span class="vap-display-text vap-placeholder">Select date</span>' +
            '<span class="vap-display-chevron">' + ICON.chevronDown + '</span>';
        this._displayText = this._displayEl.querySelector('.vap-display-text');
        this._wrapper.appendChild(this._displayEl);

        // Overlay (mobile)
        this._overlay = el('div', 'vap-overlay');
        this._wrapper.appendChild(this._overlay);

        // Dropdown
        this._dropdown = el('div', 'vap-dropdown');

        // Toggle bar
        var toggleBar = el('div', 'vap-toggle-bar');
        this._calToggle = el('button', 'vap-toggle-btn vap-active', 'Calendar');
        this._calToggle.type = 'button';
        this._manToggle = el('button', 'vap-toggle-btn', 'Manual');
        this._manToggle.type = 'button';
        toggleBar.appendChild(this._calToggle);
        toggleBar.appendChild(this._manToggle);
        this._dropdown.appendChild(toggleBar);

        // Calendar section
        this._calSection = el('div', 'vap-cal-section');
        this._buildCalHeader();
        this._calGrid = el('div', 'vap-cal-grid');
        this._buildWeekdayLabels();
        this._calDays = el('div', 'vap-cal-days');
        this._calGrid.appendChild(this._calDays);
        this._calSection.appendChild(this._calGrid);
        this._dropdown.appendChild(this._calSection);

        // Manual section
        this._manSection = el('div', 'vap-manual');
        this._buildManualFields();
        this._dropdown.appendChild(this._manSection);

        this._wrapper.appendChild(this._dropdown);
        this._container.appendChild(this._wrapper);

        // Events
        this._displayEl.addEventListener('click', function () { self.toggle(); });
        this._displayEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); self.toggle(); }
        });
        this._overlay.addEventListener('click', function () { self.close(); });
        this._calToggle.addEventListener('click', function () { self._setMode('calendar'); });
        this._manToggle.addEventListener('click', function () { self._setMode('manual'); });

        this._renderCalendar();
    };

    DatePicker.prototype._buildCalHeader = function () {
        var self = this;
        this._calHeader = el('div', 'vap-cal-header');

        var prevBtn = el('button', 'vap-cal-nav');
        prevBtn.type = 'button';
        prevBtn.innerHTML = ICON.chevronLeft;
        prevBtn.title = 'Previous month';

        var nextBtn = el('button', 'vap-cal-nav');
        nextBtn.type = 'button';
        nextBtn.innerHTML = ICON.chevronRight;
        nextBtn.title = 'Next month';

        var titleDiv = el('div', 'vap-cal-title');
        this._monthLabel = el('span', 'vap-cal-month-label');
        this._yearSelect = document.createElement('select');
        this._yearSelect.className = 'vap-year-select';
        for (var y = currentYear; y >= 1920; y--) {
            var opt = document.createElement('option');
            opt.value = y;
            opt.textContent = y;
            this._yearSelect.appendChild(opt);
        }
        titleDiv.appendChild(this._monthLabel);
        titleDiv.appendChild(this._yearSelect);

        this._calHeader.appendChild(prevBtn);
        this._calHeader.appendChild(titleDiv);
        this._calHeader.appendChild(nextBtn);
        this._calSection.appendChild(this._calHeader);

        prevBtn.addEventListener('click', function () {
            self._viewMonth--;
            if (self._viewMonth < 0) { self._viewMonth = 11; self._viewYear--; }
            self._renderCalendar();
        });
        nextBtn.addEventListener('click', function () {
            self._viewMonth++;
            if (self._viewMonth > 11) { self._viewMonth = 0; self._viewYear++; }
            self._renderCalendar();
        });
        this._yearSelect.addEventListener('change', function () {
            self._viewYear = parseInt(this.value);
            self._renderCalendar();
        });
    };

    DatePicker.prototype._buildWeekdayLabels = function () {
        var row = el('div', 'vap-cal-weekdays');
        DAY_LABELS.forEach(function (d) {
            row.appendChild(el('div', 'vap-cal-weekday', d));
        });
        this._calGrid.appendChild(row);
    };

    DatePicker.prototype._renderCalendar = function () {
        var self = this;
        this._monthLabel.textContent = MONTH_NAMES[this._viewMonth] + ' ';
        this._yearSelect.value = this._viewYear;

        var firstDay = new Date(this._viewYear, this._viewMonth, 1).getDay();
        var days = daysInMonth(this._viewYear, this._viewMonth);
        var prevDays = this._viewMonth === 0 ? daysInMonth(this._viewYear - 1, 11) : daysInMonth(this._viewYear, this._viewMonth - 1);

        var today = new Date();
        var todayY = today.getFullYear(), todayM = today.getMonth(), todayD = today.getDate();

        this._calDays.innerHTML = '';

        // Previous month overflow
        for (var i = firstDay - 1; i >= 0; i--) {
            var btn = el('button', 'vap-cal-day vap-other-month', prevDays - i);
            btn.type = 'button';
            this._calDays.appendChild(btn);
        }

        // Current month
        for (var d = 1; d <= days; d++) {
            var cls = 'vap-cal-day';
            if (todayY === this._viewYear && todayM === this._viewMonth && todayD === d) cls += ' vap-today';
            if (this._value && this._value.y === this._viewYear && this._value.m === this._viewMonth && this._value.d === d) cls += ' vap-selected';
            var dayBtn = el('button', cls, d);
            dayBtn.type = 'button';
            dayBtn.dataset.day = d;
            dayBtn.addEventListener('click', (function (day) {
                return function () { self._selectDate(self._viewYear, self._viewMonth, day); };
            })(d));
            this._calDays.appendChild(dayBtn);
        }

        // Next month overflow
        var total = firstDay + days;
        var remaining = (7 - (total % 7)) % 7;
        for (var n = 1; n <= remaining; n++) {
            var nBtn = el('button', 'vap-cal-day vap-other-month', n);
            nBtn.type = 'button';
            this._calDays.appendChild(nBtn);
        }
    };

    DatePicker.prototype._buildManualFields = function () {
        var self = this;
        var row = el('div', 'vap-manual-row');

        this._manDD = el('input', 'vap-manual-input');
        this._manDD.placeholder = 'DD';
        this._manDD.maxLength = 2;
        this._manDD.inputMode = 'numeric';

        this._manMM = el('input', 'vap-manual-input');
        this._manMM.placeholder = 'MM';
        this._manMM.maxLength = 2;
        this._manMM.inputMode = 'numeric';

        this._manYY = el('input', 'vap-manual-input vap-year-input');
        this._manYY.placeholder = 'YYYY';
        this._manYY.maxLength = 4;
        this._manYY.inputMode = 'numeric';

        row.appendChild(this._manDD);
        row.appendChild(el('span', 'vap-manual-sep', '/'));
        row.appendChild(this._manMM);
        row.appendChild(el('span', 'vap-manual-sep', '/'));
        row.appendChild(this._manYY);

        this._manSection.appendChild(row);

        // Auto-advance
        this._manDD.addEventListener('input', function () {
            if (this.value.length === 2) self._manMM.focus();
        });
        this._manMM.addEventListener('input', function () {
            if (this.value.length === 2) self._manYY.focus();
        });

        // Done button for manual
        var doneRow = el('div', 'vap-done-row');
        var doneBtn = el('button', 'vap-done-btn', 'Set Date');
        doneBtn.type = 'button';
        doneBtn.addEventListener('click', function () {
            var dd = parseInt(self._manDD.value);
            var mm = parseInt(self._manMM.value);
            var yy = parseInt(self._manYY.value);
            if (dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12 && yy >= 1920 && yy <= currentYear) {
                var maxD = daysInMonth(yy, mm - 1);
                if (dd > maxD) dd = maxD;
                self._selectDate(yy, mm - 1, dd);
            }
        });
        doneRow.appendChild(doneBtn);
        this._manSection.appendChild(doneRow);
    };

    DatePicker.prototype._selectDate = function (y, m, d) {
        this._value = { y: y, m: m, d: d };
        var iso = y + '-' + pad(m + 1) + '-' + pad(d);
        var display = pad(d) + '/' + pad(m + 1) + '/' + y;

        this._displayText.textContent = display;
        this._displayText.classList.remove('vap-placeholder');

        if (this._hiddenId) {
            var inp = document.getElementById(this._hiddenId);
            if (inp) inp.value = iso;
        }

        this._viewYear = y;
        this._viewMonth = m;
        this._renderCalendar();

        // Update manual fields
        this._manDD.value = pad(d);
        this._manMM.value = pad(m + 1);
        this._manYY.value = y;

        if (this._onSelect) this._onSelect(iso);
        this.close();
    };

    DatePicker.prototype._setMode = function (mode) {
        this._mode = mode;
        this._calToggle.classList.toggle('vap-active', mode === 'calendar');
        this._manToggle.classList.toggle('vap-active', mode === 'manual');
        this._calSection.style.display = mode === 'calendar' ? '' : 'none';
        this._manSection.classList.toggle('vap-active', mode === 'manual');
        if (mode === 'manual') {
            this._manSection.style.display = '';
        }
    };

    DatePicker.prototype.toggle = function () {
        this._isOpen ? this.close() : this.open();
    };

    DatePicker.prototype.open = function () {
        if (activePicker && activePicker !== this) activePicker.close();
        this._isOpen = true;
        activePicker = this;
        this._displayEl.classList.add('vap-open');
        this._dropdown.classList.add('vap-visible');
        this._overlay.classList.add('vap-visible');
        this._setMode(this._mode);
    };

    DatePicker.prototype.close = function () {
        this._isOpen = false;
        if (activePicker === this) activePicker = null;
        this._displayEl.classList.remove('vap-open');
        this._dropdown.classList.remove('vap-visible');
        this._overlay.classList.remove('vap-visible');
    };

    DatePicker.prototype.setValue = function (isoDate) {
        if (!isoDate) return;
        var parts = isoDate.split('-');
        if (parts.length !== 3) return;
        var y = parseInt(parts[0]), m = parseInt(parts[1]) - 1, d = parseInt(parts[2]);
        if (isNaN(y) || isNaN(m) || isNaN(d)) return;
        this._selectDate(y, m, d);
    };

    DatePicker.prototype.getValue = function () {
        if (!this._value) return '';
        return this._value.y + '-' + pad(this._value.m + 1) + '-' + pad(this._value.d);
    };

    // ── TimePicker ─────────────────────────────────────────
    function TimePicker(container, opts) {
        opts = opts || {};
        this._container = typeof container === 'string' ? document.querySelector(container) : container;
        this._hiddenId = opts.hiddenInputId || null;
        this._onSelect = opts.onSelect || null;
        this._hour12 = 12;
        this._minute = 0;
        this._ampm = 'AM';
        this._isOpen = false;
        this._mode = 'spinner'; // 'spinner' | 'manual'
        this._hasValue = false;
        this._build();
        if (opts.initialValue) this.setValue(opts.initialValue);
    }

    TimePicker.prototype._build = function () {
        var self = this;
        this._wrapper = el('div', 'vap-wrapper');

        // Display
        this._displayEl = el('div', 'vap-display');
        this._displayEl.tabIndex = 0;
        this._displayEl.setAttribute('role', 'combobox');
        this._displayEl.innerHTML =
            '<span class="vap-display-icon">' + ICON.clock + '</span>' +
            '<span class="vap-display-text vap-placeholder">Select time</span>' +
            '<span class="vap-display-chevron">' + ICON.chevronDown + '</span>';
        this._displayText = this._displayEl.querySelector('.vap-display-text');
        this._wrapper.appendChild(this._displayEl);

        // Overlay
        this._overlay = el('div', 'vap-overlay');
        this._wrapper.appendChild(this._overlay);

        // Dropdown
        this._dropdown = el('div', 'vap-dropdown');

        // Toggle bar
        var toggleBar = el('div', 'vap-toggle-bar');
        this._spinToggle = el('button', 'vap-toggle-btn vap-active', 'Spinner');
        this._spinToggle.type = 'button';
        this._manualToggle = el('button', 'vap-toggle-btn', 'Manual');
        this._manualToggle.type = 'button';
        toggleBar.appendChild(this._spinToggle);
        toggleBar.appendChild(this._manualToggle);
        this._dropdown.appendChild(toggleBar);

        // Spinner section
        this._spinnerSection = el('div', 'vap-time-spinner');
        this._buildSpinner();
        this._dropdown.appendChild(this._spinnerSection);

        // Manual section
        this._manualSection = el('div', 'vap-time-manual');
        this._buildTimeManual();
        this._dropdown.appendChild(this._manualSection);

        // Done button
        var doneRow = el('div', 'vap-done-row');
        var doneBtn = el('button', 'vap-done-btn', 'Done');
        doneBtn.type = 'button';
        doneBtn.addEventListener('click', function () { self._confirm(); });
        doneRow.appendChild(doneBtn);
        this._dropdown.appendChild(doneRow);

        this._wrapper.appendChild(this._dropdown);
        this._container.appendChild(this._wrapper);

        // Events
        this._displayEl.addEventListener('click', function () { self.toggle(); });
        this._displayEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); self.toggle(); }
        });
        this._overlay.addEventListener('click', function () { self.close(); });
        this._spinToggle.addEventListener('click', function () { self._setTimeMode('spinner'); });
        this._manualToggle.addEventListener('click', function () { self._setTimeMode('manual'); });
    };

    TimePicker.prototype._buildSpinner = function () {
        var self = this;

        // Hour column
        var hourCol = el('div', 'vap-spin-col');
        var hUp = el('button', 'vap-spin-btn'); hUp.type = 'button'; hUp.innerHTML = ICON.chevronUp;
        this._hourVal = el('div', 'vap-spin-value', pad(this._hour12));
        var hDown = el('button', 'vap-spin-btn'); hDown.type = 'button'; hDown.innerHTML = ICON.chevronDown;
        hourCol.appendChild(hUp);
        hourCol.appendChild(this._hourVal);
        hourCol.appendChild(hDown);

        hUp.addEventListener('click', function () {
            self._hour12 = self._hour12 >= 12 ? 1 : self._hour12 + 1;
            self._updateSpinDisplay();
        });
        hDown.addEventListener('click', function () {
            self._hour12 = self._hour12 <= 1 ? 12 : self._hour12 - 1;
            self._updateSpinDisplay();
        });

        // Separator
        var sep = el('div', 'vap-spin-sep', ':');

        // Minute column
        var minCol = el('div', 'vap-spin-col');
        var mUp = el('button', 'vap-spin-btn'); mUp.type = 'button'; mUp.innerHTML = ICON.chevronUp;
        this._minVal = el('div', 'vap-spin-value', pad(this._minute));
        var mDown = el('button', 'vap-spin-btn'); mDown.type = 'button'; mDown.innerHTML = ICON.chevronDown;
        minCol.appendChild(mUp);
        minCol.appendChild(this._minVal);
        minCol.appendChild(mDown);

        mUp.addEventListener('click', function () {
            self._minute = (self._minute + 1) % 60;
            self._updateSpinDisplay();
        });
        mDown.addEventListener('click', function () {
            self._minute = (self._minute - 1 + 60) % 60;
            self._updateSpinDisplay();
        });

        // AM/PM column
        var ampmCol = el('div', 'vap-spin-col');
        this._amBtn = el('button', 'vap-ampm-btn vap-active', 'AM');
        this._amBtn.type = 'button';
        this._pmBtn = el('button', 'vap-ampm-btn', 'PM');
        this._pmBtn.type = 'button';
        ampmCol.appendChild(this._amBtn);
        ampmCol.appendChild(this._pmBtn);

        this._amBtn.addEventListener('click', function () {
            self._ampm = 'AM';
            self._amBtn.classList.add('vap-active');
            self._pmBtn.classList.remove('vap-active');
        });
        this._pmBtn.addEventListener('click', function () {
            self._ampm = 'PM';
            self._pmBtn.classList.add('vap-active');
            self._amBtn.classList.remove('vap-active');
        });

        this._spinnerSection.appendChild(hourCol);
        this._spinnerSection.appendChild(sep);
        this._spinnerSection.appendChild(minCol);
        this._spinnerSection.appendChild(ampmCol);
    };

    TimePicker.prototype._buildTimeManual = function () {
        var self = this;
        var row = el('div', 'vap-time-manual-row');

        this._manTimeInput = el('input', 'vap-time-input');
        this._manTimeInput.placeholder = 'HH:MM';
        this._manTimeInput.maxLength = 5;

        this._manAmpmBtn = el('button', 'vap-ampm-btn vap-active', 'AM');
        this._manAmpmBtn.type = 'button';
        this._manAmpmBtn.addEventListener('click', function () {
            if (self._manAmpmBtn.textContent === 'AM') {
                self._manAmpmBtn.textContent = 'PM';
            } else {
                self._manAmpmBtn.textContent = 'AM';
            }
        });

        row.appendChild(this._manTimeInput);
        row.appendChild(this._manAmpmBtn);
        this._manualSection.appendChild(row);
    };

    TimePicker.prototype._updateSpinDisplay = function () {
        this._hourVal.textContent = pad(this._hour12);
        this._minVal.textContent = pad(this._minute);
    };

    TimePicker.prototype._setTimeMode = function (mode) {
        this._mode = mode;
        this._spinToggle.classList.toggle('vap-active', mode === 'spinner');
        this._manualToggle.classList.toggle('vap-active', mode === 'manual');
        this._spinnerSection.style.display = mode === 'spinner' ? '' : 'none';
        this._manualSection.classList.toggle('vap-active', mode === 'manual');
        if (mode === 'manual') {
            this._manualSection.style.display = '';
            this._manTimeInput.value = pad(this._hour12) + ':' + pad(this._minute);
            this._manAmpmBtn.textContent = this._ampm;
        }
    };

    TimePicker.prototype._confirm = function () {
        // Read from manual if in manual mode
        if (this._mode === 'manual') {
            var parts = this._manTimeInput.value.split(':');
            if (parts.length === 2) {
                var h = parseInt(parts[0]), m = parseInt(parts[1]);
                if (h >= 1 && h <= 12 && m >= 0 && m <= 59) {
                    this._hour12 = h;
                    this._minute = m;
                    this._ampm = this._manAmpmBtn.textContent;
                    this._amBtn.classList.toggle('vap-active', this._ampm === 'AM');
                    this._pmBtn.classList.toggle('vap-active', this._ampm === 'PM');
                    this._updateSpinDisplay();
                }
            }
        }

        this._hasValue = true;

        // Convert to 24h for hidden input
        var h24 = this._hour12;
        if (this._ampm === 'AM') {
            if (h24 === 12) h24 = 0;
        } else {
            if (h24 !== 12) h24 += 12;
        }

        var iso = pad(h24) + ':' + pad(this._minute);
        var display = pad(this._hour12) + ':' + pad(this._minute) + ' ' + this._ampm;

        this._displayText.textContent = display;
        this._displayText.classList.remove('vap-placeholder');

        if (this._hiddenId) {
            var inp = document.getElementById(this._hiddenId);
            if (inp) inp.value = iso;
        }

        if (this._onSelect) this._onSelect(iso);
        this.close();
    };

    TimePicker.prototype.toggle = function () {
        this._isOpen ? this.close() : this.open();
    };

    TimePicker.prototype.open = function () {
        if (activePicker && activePicker !== this) activePicker.close();
        this._isOpen = true;
        activePicker = this;
        this._displayEl.classList.add('vap-open');
        this._dropdown.classList.add('vap-visible');
        this._overlay.classList.add('vap-visible');
        this._setTimeMode(this._mode);
    };

    TimePicker.prototype.close = function () {
        this._isOpen = false;
        if (activePicker === this) activePicker = null;
        this._displayEl.classList.remove('vap-open');
        this._dropdown.classList.remove('vap-visible');
        this._overlay.classList.remove('vap-visible');
    };

    TimePicker.prototype.setValue = function (time24) {
        if (!time24) return;
        var parts = time24.split(':');
        if (parts.length < 2) return;
        var h = parseInt(parts[0]), m = parseInt(parts[1]);
        if (isNaN(h) || isNaN(m)) return;

        this._minute = m;
        if (h === 0) { this._hour12 = 12; this._ampm = 'AM'; }
        else if (h < 12) { this._hour12 = h; this._ampm = 'AM'; }
        else if (h === 12) { this._hour12 = 12; this._ampm = 'PM'; }
        else { this._hour12 = h - 12; this._ampm = 'PM'; }

        this._amBtn.classList.toggle('vap-active', this._ampm === 'AM');
        this._pmBtn.classList.toggle('vap-active', this._ampm === 'PM');
        this._updateSpinDisplay();

        this._hasValue = true;
        var display = pad(this._hour12) + ':' + pad(this._minute) + ' ' + this._ampm;
        this._displayText.textContent = display;
        this._displayText.classList.remove('vap-placeholder');

        if (this._hiddenId) {
            var inp = document.getElementById(this._hiddenId);
            if (inp) inp.value = time24;
        }
    };

    TimePicker.prototype.getValue = function () {
        if (!this._hasValue) return '';
        var h24 = this._hour12;
        if (this._ampm === 'AM') { if (h24 === 12) h24 = 0; }
        else { if (h24 !== 12) h24 += 12; }
        return pad(h24) + ':' + pad(this._minute);
    };

    // ── TimezoneSelector ───────────────────────────────────
    function TimezoneSelector(container, opts) {
        opts = opts || {};
        this._container = typeof container === 'string' ? document.querySelector(container) : container;
        this._hiddenId = opts.hiddenInputId || null;
        this._autoDetect = opts.autoDetect !== false;
        this._isOpen = false;
        this._value = null;
        this._build();
        if (opts.initialValue) {
            this.setValue(opts.initialValue);
        } else if (this._autoDetect) {
            this._detect();
        }
    }

    TimezoneSelector.prototype._build = function () {
        var self = this;
        this._wrapper = el('div', 'vap-wrapper');

        // Display
        this._displayEl = el('div', 'vap-display');
        this._displayEl.tabIndex = 0;
        this._displayEl.setAttribute('role', 'combobox');
        this._displayEl.innerHTML =
            '<span class="vap-display-icon">' + ICON.globe + '</span>' +
            '<span class="vap-display-text vap-placeholder">Select timezone</span>' +
            '<span class="vap-display-chevron">' + ICON.chevronDown + '</span>';
        this._displayText = this._displayEl.querySelector('.vap-display-text');
        this._wrapper.appendChild(this._displayEl);

        // Overlay
        this._overlay = el('div', 'vap-overlay');
        this._wrapper.appendChild(this._overlay);

        // Dropdown
        this._dropdown = el('div', 'vap-dropdown');

        // Search
        var searchDiv = el('div', 'vap-tz-search');
        this._searchInput = document.createElement('input');
        this._searchInput.type = 'text';
        this._searchInput.placeholder = 'Search timezone...';
        searchDiv.appendChild(this._searchInput);
        this._dropdown.appendChild(searchDiv);

        // List
        this._listEl = el('div', 'vap-tz-list');
        this._dropdown.appendChild(this._listEl);

        this._wrapper.appendChild(this._dropdown);
        this._container.appendChild(this._wrapper);

        // Events
        this._displayEl.addEventListener('click', function () { self.toggle(); });
        this._displayEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); self.toggle(); }
        });
        this._overlay.addEventListener('click', function () { self.close(); });
        this._searchInput.addEventListener('input', function () { self._renderList(); });

        this._renderList();
    };

    TimezoneSelector.prototype._renderList = function () {
        var self = this;
        var filter = this._searchInput.value.toLowerCase();
        this._listEl.innerHTML = '';

        var lastRegion = '';
        TZ_DATA.forEach(function (tz) {
            var matchText = (tz.city + ' ' + tz.abbr + ' ' + tz.iana + ' ' + tz.region).toLowerCase();
            if (filter && matchText.indexOf(filter) === -1) return;

            if (tz.region !== lastRegion) {
                lastRegion = tz.region;
                self._listEl.appendChild(el('div', 'vap-tz-group-label', tz.region));
            }

            var opt = el('div', 'vap-tz-option' + (self._value === tz.iana ? ' vap-selected' : ''));
            opt.innerHTML =
                '<span class="vap-tz-city">' + tz.city + '</span>' +
                '<span class="vap-tz-meta">' +
                '<span class="vap-tz-abbr">' + tz.abbr + '</span>' +
                '<span class="vap-tz-offset">' + formatOffset(tz.offset) + '</span>' +
                '</span>';
            opt.addEventListener('click', function () {
                self._select(tz);
            });
            self._listEl.appendChild(opt);
        });
    };

    TimezoneSelector.prototype._select = function (tz) {
        this._value = tz.iana;
        this._displayText.textContent = tz.city + ' (' + tz.abbr + ') ' + formatOffset(tz.offset);
        this._displayText.classList.remove('vap-placeholder');

        if (this._hiddenId) {
            var inp = document.getElementById(this._hiddenId);
            if (inp) {
                inp.value = tz.iana;
                inp.dataset.offsetHours = tz.offset;
            }
        }

        this._renderList();
        this.close();
    };

    TimezoneSelector.prototype._detect = function () {
        try {
            var detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (detected) {
                for (var i = 0; i < TZ_DATA.length; i++) {
                    if (TZ_DATA[i].iana === detected) {
                        this._select(TZ_DATA[i]);
                        return;
                    }
                }
                // If not in our list, try matching by region prefix
                var prefix = detected.split('/')[0];
                for (var j = 0; j < TZ_DATA.length; j++) {
                    if (TZ_DATA[j].iana.startsWith(prefix + '/')) {
                        this._select(TZ_DATA[j]);
                        return;
                    }
                }
            }
        } catch (e) { /* ignore */ }
    };

    TimezoneSelector.prototype.toggle = function () {
        this._isOpen ? this.close() : this.open();
    };

    TimezoneSelector.prototype.open = function () {
        if (activePicker && activePicker !== this) activePicker.close();
        this._isOpen = true;
        activePicker = this;
        this._displayEl.classList.add('vap-open');
        this._dropdown.classList.add('vap-visible');
        this._overlay.classList.add('vap-visible');
        this._searchInput.value = '';
        this._renderList();
        this._searchInput.focus();
    };

    TimezoneSelector.prototype.close = function () {
        this._isOpen = false;
        if (activePicker === this) activePicker = null;
        this._displayEl.classList.remove('vap-open');
        this._dropdown.classList.remove('vap-visible');
        this._overlay.classList.remove('vap-visible');
    };

    TimezoneSelector.prototype.setValue = function (iana) {
        if (!iana) return;
        for (var i = 0; i < TZ_DATA.length; i++) {
            if (TZ_DATA[i].iana === iana) {
                this._select(TZ_DATA[i]);
                return;
            }
        }
    };

    TimezoneSelector.prototype.getValue = function () {
        return this._value || '';
    };

    // ── Place Database ──────────────────────────────────────
    var PLACE_DB = [
        // Major Indian cities
        { city: 'Delhi', country: 'India', lat: 28.61, lng: 77.21, tz: 5.5 },
        { city: 'New Delhi', country: 'India', lat: 28.61, lng: 77.21, tz: 5.5 },
        { city: 'Mumbai', country: 'India', lat: 19.08, lng: 72.88, tz: 5.5 },
        { city: 'Kolkata', country: 'India', lat: 22.57, lng: 88.36, tz: 5.5 },
        { city: 'Chennai', country: 'India', lat: 13.08, lng: 80.27, tz: 5.5 },
        { city: 'Bengaluru', country: 'India', lat: 12.97, lng: 77.59, tz: 5.5 },
        { city: 'Bangalore', country: 'India', lat: 12.97, lng: 77.59, tz: 5.5 },
        { city: 'Hyderabad', country: 'India', lat: 17.39, lng: 78.49, tz: 5.5 },
        { city: 'Ahmedabad', country: 'India', lat: 23.02, lng: 72.57, tz: 5.5 },
        { city: 'Pune', country: 'India', lat: 18.52, lng: 73.86, tz: 5.5 },
        { city: 'Jaipur', country: 'India', lat: 26.91, lng: 75.79, tz: 5.5 },
        { city: 'Lucknow', country: 'India', lat: 26.85, lng: 80.95, tz: 5.5 },
        { city: 'Varanasi', country: 'India', lat: 25.32, lng: 83.01, tz: 5.5 },
        { city: 'Kochi', country: 'India', lat: 9.93, lng: 76.26, tz: 5.5 },
        { city: 'Chandigarh', country: 'India', lat: 30.73, lng: 76.78, tz: 5.5 },
        { city: 'Patna', country: 'India', lat: 25.60, lng: 85.10, tz: 5.5 },
        { city: 'Guwahati', country: 'India', lat: 26.14, lng: 91.74, tz: 5.5 },
        { city: 'Thiruvananthapuram', country: 'India', lat: 8.52, lng: 76.94, tz: 5.5 },
        { city: 'Bhopal', country: 'India', lat: 23.26, lng: 77.41, tz: 5.5 },
        { city: 'Indore', country: 'India', lat: 22.72, lng: 75.86, tz: 5.5 },
        { city: 'Nagpur', country: 'India', lat: 21.15, lng: 79.09, tz: 5.5 },
        { city: 'Surat', country: 'India', lat: 21.17, lng: 72.83, tz: 5.5 },
        { city: 'Visakhapatnam', country: 'India', lat: 17.69, lng: 83.22, tz: 5.5 },
        { city: 'Coimbatore', country: 'India', lat: 11.01, lng: 76.96, tz: 5.5 },
        { city: 'Madurai', country: 'India', lat: 9.93, lng: 78.12, tz: 5.5 },
        { city: 'Agra', country: 'India', lat: 27.18, lng: 78.02, tz: 5.5 },
        { city: 'Amritsar', country: 'India', lat: 31.63, lng: 74.87, tz: 5.5 },
        { city: 'Dehradun', country: 'India', lat: 30.32, lng: 78.03, tz: 5.5 },
        { city: 'Mysuru', country: 'India', lat: 12.30, lng: 76.66, tz: 5.5 },
        { city: 'Ranchi', country: 'India', lat: 23.34, lng: 85.31, tz: 5.5 },
        { city: 'Bhubaneswar', country: 'India', lat: 20.30, lng: 85.82, tz: 5.5 },
        { city: 'Mangalore', country: 'India', lat: 12.87, lng: 74.84, tz: 5.5 },
        { city: 'Ujjain', country: 'India', lat: 23.18, lng: 75.77, tz: 5.5 },
        { city: 'Rishikesh', country: 'India', lat: 30.09, lng: 78.27, tz: 5.5 },
        { city: 'Haridwar', country: 'India', lat: 29.95, lng: 78.16, tz: 5.5 },
        { city: 'Tirupati', country: 'India', lat: 13.63, lng: 79.42, tz: 5.5 },
        { city: 'Jodhpur', country: 'India', lat: 26.24, lng: 73.02, tz: 5.5 },
        { city: 'Udaipur', country: 'India', lat: 24.58, lng: 73.68, tz: 5.5 },
        { city: 'Goa', country: 'India', lat: 15.50, lng: 73.83, tz: 5.5 },
        { city: 'Shimla', country: 'India', lat: 31.10, lng: 77.17, tz: 5.5 },
        { city: 'Jammu', country: 'India', lat: 32.73, lng: 74.87, tz: 5.5 },
        { city: 'Srinagar', country: 'India', lat: 34.08, lng: 74.80, tz: 5.5 },
        // International cities
        { city: 'New York', country: 'USA', lat: 40.71, lng: -74.01, tz: -5 },
        { city: 'Los Angeles', country: 'USA', lat: 34.05, lng: -118.24, tz: -8 },
        { city: 'Chicago', country: 'USA', lat: 41.88, lng: -87.63, tz: -6 },
        { city: 'Houston', country: 'USA', lat: 29.76, lng: -95.37, tz: -6 },
        { city: 'San Francisco', country: 'USA', lat: 37.77, lng: -122.42, tz: -8 },
        { city: 'London', country: 'UK', lat: 51.51, lng: -0.13, tz: 0 },
        { city: 'Toronto', country: 'Canada', lat: 43.65, lng: -79.38, tz: -5 },
        { city: 'Vancouver', country: 'Canada', lat: 49.28, lng: -123.12, tz: -8 },
        { city: 'Dubai', country: 'UAE', lat: 25.20, lng: 55.27, tz: 4 },
        { city: 'Abu Dhabi', country: 'UAE', lat: 24.45, lng: 54.65, tz: 4 },
        { city: 'Singapore', country: 'Singapore', lat: 1.35, lng: 103.82, tz: 8 },
        { city: 'Sydney', country: 'Australia', lat: -33.87, lng: 151.21, tz: 11 },
        { city: 'Melbourne', country: 'Australia', lat: -37.81, lng: 144.96, tz: 11 },
        { city: 'Kuala Lumpur', country: 'Malaysia', lat: 3.14, lng: 101.69, tz: 8 },
        { city: 'Hong Kong', country: 'China', lat: 22.32, lng: 114.17, tz: 8 },
        { city: 'Tokyo', country: 'Japan', lat: 35.68, lng: 139.69, tz: 9 },
        { city: 'Seoul', country: 'South Korea', lat: 37.57, lng: 126.98, tz: 9 },
        { city: 'Bangkok', country: 'Thailand', lat: 13.76, lng: 100.50, tz: 7 },
        { city: 'Kathmandu', country: 'Nepal', lat: 27.70, lng: 85.32, tz: 5.75 },
        { city: 'Colombo', country: 'Sri Lanka', lat: 6.93, lng: 79.85, tz: 5.5 },
        { city: 'Dhaka', country: 'Bangladesh', lat: 23.81, lng: 90.41, tz: 6 },
        { city: 'Karachi', country: 'Pakistan', lat: 24.86, lng: 67.01, tz: 5 },
        { city: 'Lahore', country: 'Pakistan', lat: 31.55, lng: 74.35, tz: 5 },
    ];

    // ── PlaceAutocomplete ─────────────────────────────────
    function PlaceAutocomplete(inputEl, opts) {
        opts = opts || {};
        this._input = typeof inputEl === 'string' ? document.querySelector(inputEl) : inputEl;
        if (!this._input) return;
        this._minChars = opts.minChars || 2;
        this._activeIndex = -1;
        this._matches = [];
        this._isOpen = false;
        this._build();
    }

    PlaceAutocomplete.prototype._build = function () {
        var self = this;

        // Wrap input in a relative container if not already
        var parent = this._input.parentNode;
        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }

        // Create dropdown
        this._dropdown = el('div', 'vap-place-dropdown');
        parent.appendChild(this._dropdown);

        // Input events
        this._input.setAttribute('autocomplete', 'off');

        this._input.addEventListener('input', function () {
            self._onInput();
        });

        this._input.addEventListener('keydown', function (e) {
            self._onKeydown(e);
        });

        this._input.addEventListener('focus', function () {
            if (self._input.value.length >= self._minChars) {
                self._onInput();
            }
        });

        // Close on outside click
        document.addEventListener('mousedown', function (e) {
            if (!self._dropdown.contains(e.target) && e.target !== self._input) {
                self._close();
            }
        });
    };

    PlaceAutocomplete.prototype._onInput = function () {
        var query = this._input.value.trim().toLowerCase();
        if (query.length < this._minChars) {
            this._close();
            return;
        }

        this._matches = [];
        for (var i = 0; i < PLACE_DB.length; i++) {
            if (PLACE_DB[i].city.toLowerCase().indexOf(query) === 0) {
                this._matches.push(PLACE_DB[i]);
            }
        }
        // Also match anywhere in name (secondary results)
        for (var j = 0; j < PLACE_DB.length; j++) {
            var cityLower = PLACE_DB[j].city.toLowerCase();
            if (cityLower.indexOf(query) > 0) {
                // Avoid duplicates
                var isDup = false;
                for (var k = 0; k < this._matches.length; k++) {
                    if (this._matches[k].city === PLACE_DB[j].city && this._matches[k].country === PLACE_DB[j].country) {
                        isDup = true;
                        break;
                    }
                }
                if (!isDup) this._matches.push(PLACE_DB[j]);
            }
        }

        if (this._matches.length === 0) {
            this._close();
            return;
        }

        this._activeIndex = -1;
        this._render(query);
        this._open();
    };

    PlaceAutocomplete.prototype._render = function (query) {
        var self = this;
        this._dropdown.innerHTML = '';

        var max = Math.min(this._matches.length, 8);
        for (var i = 0; i < max; i++) {
            var m = this._matches[i];
            var displayName = m.city + ', ' + m.country;

            // Highlight matching portion
            var cityLower = m.city.toLowerCase();
            var idx = cityLower.indexOf(query);
            var highlighted;
            if (idx >= 0) {
                highlighted = m.city.substring(0, idx) +
                    '<span class="vap-place-highlight">' + m.city.substring(idx, idx + query.length) + '</span>' +
                    m.city.substring(idx + query.length) + ', ' + m.country;
            } else {
                highlighted = displayName;
            }

            var opt = el('div', 'vap-place-option', highlighted);
            opt.dataset.index = i;
            opt.addEventListener('mousedown', (function (index) {
                return function (e) {
                    e.preventDefault();
                    self._select(index);
                };
            })(i));
            this._dropdown.appendChild(opt);
        }
    };

    PlaceAutocomplete.prototype._select = function (index) {
        var m = this._matches[index];
        if (!m) return;

        var displayName = m.city + ', ' + m.country;
        this._input.value = displayName;
        this._input.dataset.lat = m.lat;
        this._input.dataset.lng = m.lng;
        this._input.dataset.tz = m.tz;

        this._close();

        // Fire change event so form handlers can react
        var evt = new Event('change', { bubbles: true });
        this._input.dispatchEvent(evt);
    };

    PlaceAutocomplete.prototype._onKeydown = function (e) {
        if (!this._isOpen) return;

        var options = this._dropdown.querySelectorAll('.vap-place-option');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this._activeIndex = Math.min(this._activeIndex + 1, options.length - 1);
            this._highlightOption(options);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this._activeIndex = Math.max(this._activeIndex - 1, 0);
            this._highlightOption(options);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this._activeIndex >= 0) {
                this._select(this._activeIndex);
            }
        } else if (e.key === 'Escape') {
            this._close();
        }
    };

    PlaceAutocomplete.prototype._highlightOption = function (options) {
        for (var i = 0; i < options.length; i++) {
            options[i].classList.toggle('vap-place-active', i === this._activeIndex);
        }
        if (this._activeIndex >= 0 && options[this._activeIndex]) {
            options[this._activeIndex].scrollIntoView({ block: 'nearest' });
        }
    };

    PlaceAutocomplete.prototype._open = function () {
        this._isOpen = true;
        this._dropdown.classList.add('vap-visible');
    };

    PlaceAutocomplete.prototype._close = function () {
        this._isOpen = false;
        this._activeIndex = -1;
        this._dropdown.classList.remove('vap-visible');
    };

    // ── Public API ─────────────────────────────────────────
    window.VedicPicker = {
        createDatePicker: function (sel, opts) { return new DatePicker(sel, opts); },
        createTimePicker: function (sel, opts) { return new TimePicker(sel, opts); },
        createTimezoneSelector: function (sel, opts) { return new TimezoneSelector(sel, opts); },
        createPlaceAutocomplete: function (sel, opts) { return new PlaceAutocomplete(sel, opts); },
    };
})();
