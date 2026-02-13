# Root Cause Analysis: Image Revert Incident

**Date:** 2026-02-12
**Severity:** Medium (UI regression in production for ~30 minutes)
**Status:** Partially Resolved

---

## 1. Incident Summary

During the session to implement expandable weekly day cards, a request to "revert image changes" resulted in a broad `git checkout` of 11 page files. This reverted not only the image additions but also **unrelated functional changes** (custom BirthDatePicker/BirthTimePicker/CityAutocomplete integrations) that existed in the working tree of those files.

## 2. Timeline

| Time  | Event |
|-------|-------|
| T+0   | Expandable weekly day cards feature implemented and deployed successfully |
| T+1   | User asked to check recently added images across pages |
| T+2   | User requested: "revert all these image changes" |
| T+3   | **`git checkout` run on 11 page files** — reverted ALL working tree changes, not just images |
| T+4   | Build + deploy completed with reverted files |
| T+5   | Commit + push to GitHub (with reverted pages baked into the commit) |
| T+6   | User reported kundli/login date pickers broken ("nothing shows here") |
| T+7   | Root cause identified — `git checkout` wiped picker integrations |
| T+8   | kundli/page.tsx and login/page.tsx re-fixed with custom pickers |
| T+9   | Rebuilt and redeployed — pickers restored on those 2 pages |
| T+10  | RCA initiated to check remaining 9 pages |

## 3. Root Cause

**`git checkout <file>` is a destructive, all-or-nothing operation.** It reverts the entire file to the last committed state, discarding ALL uncommitted modifications — not just the specific changes (images) that were targeted.

The 11 affected files had **two types of uncommitted changes mixed together**:
1. **Image additions** (decorative images added to various pages) — user wanted these removed
2. **Custom picker integrations** (BirthDatePicker, BirthTimePicker, CityAutocomplete replacing plain HTML inputs) — user did NOT want these removed

Using `git checkout` to remove the image changes also wiped the picker integrations.

### What Should Have Been Done Instead
- **Surgical edits:** Remove only the specific image-related lines/blocks from each file, leaving all other changes intact
- **Interactive staging:** Use `git diff` to review each file's changes before reverting, to identify mixed change types
- **Stash + selective apply:** Stash all changes, then selectively re-apply non-image changes

## 4. Impact Assessment

### Files Affected (11 pages reverted via `git checkout`)

| Page | Had Forms? | Picker Integration Lost? | Status |
|------|-----------|------------------------|--------|
| `kundli/page.tsx` | Yes (DOB, TOB, POB) | **YES** — BirthDatePicker, BirthTimePicker, CityAutocomplete | **FIXED** (re-integrated, uncommitted) |
| `login/page.tsx` | Yes (DOB, TOB, POB) | **YES** — BirthDatePicker, BirthTimePicker, CityAutocomplete | **FIXED** (re-integrated, uncommitted) |
| `profile/page.tsx` | Yes (DOB, TOB, POB) | **LIKELY** — still has plain `<input type="date/time/text">` | **NEEDS FIX** |
| `compatibility/page.tsx` | Yes (DOB x2) | **POSSIBLE** — still has plain `<input type="date">` | **NEEDS FIX** |
| `about/page.tsx` | No | No (image-only changes, correctly reverted) | OK |
| `articles/page.tsx` | No | No (image-only changes, correctly reverted) | OK |
| `consultation/page.tsx` | No | No (image-only changes, correctly reverted) | OK |
| `contact/page.tsx` | Yes (name/email/subject — no birth details) | No | OK |
| `horoscopes/page.tsx` | No | No (image-only changes, correctly reverted) | OK |
| `panchang/page.tsx` | No | No (image-only changes, correctly reverted) | OK |
| `zodiac/page.tsx` | No | No (image-only changes, correctly reverted) | OK |

### Custom Picker Usage Across App (Current State)

| Location | BirthDatePicker | BirthTimePicker | CityAutocomplete |
|----------|----------------|-----------------|------------------|
| Home (QuickKundli) | Yes | Yes | Yes |
| Dashboard (edit birth) | Yes | Yes | Yes |
| Kundli page | Yes (re-fixed) | Yes (re-fixed) | Yes (re-fixed) |
| Login page (register) | Yes (re-fixed) | Yes (re-fixed) | Yes (re-fixed) |
| Profile page | **NO — plain input** | **NO — plain input** | **NO — plain input** |
| Compatibility page | **NO — plain input** | N/A | N/A |

## 5. Pages Still Needing Fixes

### 5a. `profile/page.tsx` (HIGH PRIORITY)
- Line 52: `<input type="date" name="dob">` → should be `<BirthDatePicker>`
- Line 53: `<input type="time" name="tob">` → should be `<BirthTimePicker>`
- Line 55: `<input type="text" name="pob">` → should be `<CityAutocomplete>`
- This is the "Edit Birth Details" form — users actively use this to update their profile

### 5b. `compatibility/page.tsx` (MEDIUM PRIORITY)
- Line 40: `<input type="date" name="dob1">` → should be `<BirthDatePicker>`
- Line 45: `<input type="date" name="dob2">` → should be `<BirthDatePicker>`
- Compatibility check only uses date of birth (no time or city)

## 6. What Was NOT Affected

- **Dashboard page** (`dashboard/page.tsx`) — was NOT reverted, only had surgical image removal
- **QuickKundli component** — was NOT reverted (not in the 11 page list)
- **Custom picker components** themselves — the component files (BirthDatePicker.tsx, BirthTimePicker.tsx, CityAutocomplete.tsx) were never touched
- **Expandable weekly cards feature** — fully intact and working
- **PDF Report** — images kept intact as requested

## 7. Other Issues Found

### Newsletter Not Working (Pre-existing)
- The newsletter component calls API endpoints (`/newsletter/subscribe`, `/newsletter/status`, `/newsletter/preferences`) that don't exist
- This is a backend/API issue, NOT caused by the image revert
- Requires backend implementation or removal of the newsletter UI

## 8. Action Items

| # | Action | Priority | Status |
|---|--------|----------|--------|
| 1 | Fix kundli/page.tsx picker integration | HIGH | DONE (uncommitted) |
| 2 | Fix login/page.tsx picker integration | HIGH | DONE (uncommitted) |
| 3 | Fix profile/page.tsx picker integration | HIGH | TODO |
| 4 | Fix compatibility/page.tsx picker integration | MEDIUM | TODO |
| 5 | Commit and push all fixes | HIGH | TODO |
| 6 | Deploy updated build | HIGH | TODO |
| 7 | Investigate newsletter backend | LOW | BACKLOG |

## 9. Lessons Learned

1. **Never use `git checkout <file>` to remove specific changes** — it's nuclear, not surgical. Use targeted edits instead.
2. **Always `git diff <file>` before reverting** to understand what you're discarding.
3. **Commit frequently** — if the picker integrations had been committed separately from the image additions, `git checkout` would not have affected them.
4. **Mixed changes in working tree are risky** — different types of modifications in the same file should ideally be committed in separate, logical commits.
5. **Test all forms after any bulk file operation** — quick smoke test of all form pages would have caught this immediately.
