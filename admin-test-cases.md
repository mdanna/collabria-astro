# Collabria CMS — Admin Test Cases

**Application URL:** https://collabria-astro.vercel.app/admin  
**Version:** 1.0 — May 2026

---

## 1. Authentication

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|----|-------|---------------|-------|-----------------|----------|
| TC-AUTH-01 | Successful login | User has a GitHub account that is a collaborator on the repo | 1. Navigate to /admin 2. Click "Login with GitHub" 3. Authorise on GitHub | User is redirected to the CMS dashboard showing Case Studies list | High |
| TC-AUTH-02 | Login page displayed for unauthenticated user | User is not logged in | 1. Navigate to /admin | Decap login screen shown with "Login with GitHub" button | High |
| TC-AUTH-03 | Session persistence | User has previously logged in | 1. Log in 2. Close browser tab 3. Reopen /admin | User is taken directly to dashboard without having to log in again | Medium |
| TC-AUTH-04 | Non-collaborator cannot publish | GitHub account is NOT a collaborator on the repo | 1. Log in with non-collaborator account 2. Edit any field 3. Click Publish | GitHub API returns an error; change is not committed | High |
| TC-AUTH-05 | User Guide download button visible | User is logged in | 1. Navigate to /admin | Dark brown "User Guide" button visible in bottom-right corner | Low |
| TC-AUTH-06 | User Guide downloads correctly | User is logged in | 1. Click "User Guide" button | `Collabria CMS User Guide.docx` downloads to user's computer | Low |

---

## 2. Navigation & Dashboard

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|----|-------|---------------|-------|-----------------|----------|
| TC-NAV-01 | Case Studies collection visible | Logged in | 1. Open /admin | "Case Studies" visible in left sidebar | High |
| TC-NAV-02 | Site Data collection visible | Logged in | 1. Open /admin | "Site Data" visible in left sidebar | High |
| TC-NAV-03 | Switch between collections | Logged in | 1. Click "Case Studies" 2. Click "Site Data" | Each click loads the correct collection list | High |
| TC-NAV-04 | Site Data shows three files | Logged in, on Site Data | 1. Click "Site Data" | Three items shown: Client List, Homepage Quotes, Services | High |
| TC-NAV-05 | "New Case Study" button visible | Logged in, on Case Studies | 1. Click "Case Studies" | "New Case Study" button visible top right | Medium |

---

## 3. Case Studies — Read

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|----|-------|---------------|-------|-----------------|----------|
| TC-CS-01 | All 12 cases listed | Logged in | 1. Click "Case Studies" | List shows 12 entries in "Client — Title" format | High |
| TC-CS-02 | Case entry format | Logged in, on Case Studies | 1. View list | Each entry shows "Client — Title" e.g. "Genentech — Competing in the war for talent" | Medium |
| TC-CS-03 | Open existing case | Logged in | 1. Click any case in the list | Editor opens with all fields populated: Client Name, Title, Logo, Challenge Quote, Tags, Solution | High |
| TC-CS-04 | Right panel preview | Logged in, case editor open | 1. Open any case | Right panel shows a text preview of the content | Medium |

---

## 4. Case Studies — Edit

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|----|-------|---------------|-------|-----------------|----------|
| TC-CS-05 | Edit Client Name | Logged in, case editor open | 1. Clear Client Name field 2. Type new name 3. Click Publish | GitHub commit created; site rebuilds; new name appears on /cases page | High |
| TC-CS-06 | Edit Title | Logged in, case editor open | 1. Change Title field 2. Click Publish | New title appears in case list and on the story page | High |
| TC-CS-07 | Edit Challenge Quote | Logged in, case editor open | 1. Change Challenge Quote 2. Click Publish | New quote appears in italics on the story page | High |
| TC-CS-08 | Edit Solution text | Logged in, case editor open | 1. Modify Solution field 2. Click Publish | Updated solution text appears on the story page | High |
| TC-CS-09 | Bold formatting in Solution | Logged in, case editor open | 1. Select text in Solution 2. Click Bold (B) in toolbar 3. Publish | Selected text renders in bold on the live story page | Medium |
| TC-CS-10 | Save without publishing | Logged in, case editor open | 1. Edit any field 2. Click "Save" (not Publish) | "Changes saved" shown; live site NOT updated; draft retained in CMS | High |
| TC-CS-11 | Publish updates live site | Logged in, case editor open | 1. Edit any field 2. Click Publish 3. Wait 30 seconds 4. Visit story page | Change visible on live site within 60 seconds | High |
| TC-CS-12 | "View on Site ↗" opens correct page | Logged in, inside case editor | 1. Click "View on Site ↗" | New tab opens at /stories/{slug} for the current case | High |

---

## 5. Case Studies — Logo Upload

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|----|-------|---------------|-------|-----------------|----------|
| TC-CS-13 | Upload new logo | Logged in, case editor open | 1. Click "Choose an image" in Logo field 2. Click "Upload" 3. Select a JPG file 4. Publish | Logo committed to public/logos/ in GitHub; logo appears on the story and cases page | High |
| TC-CS-14 | Select existing logo | Logged in, case editor open | 1. Click "Choose an image" 2. Select an existing logo from the media library | Logo path updated in frontmatter | Medium |
| TC-CS-15 | PNG logo upload | Logged in, case editor open | 1. Upload a PNG file as logo 2. Publish | PNG logo displays correctly on site | Medium |
| TC-CS-16 | Logo with spaces in filename | Logged in, case editor open | 1. Upload a file named "my logo.jpg" | File is accepted and path saved (CMS may encode spaces) OR clear error shown | Low |

---

## 6. Case Studies — Add & Delete

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|----|-------|---------------|-------|-----------------|----------|
| TC-CS-17 | Add new case study | Logged in, on Case Studies | 1. Click "New Case Study" 2. Fill in all fields 3. Upload a logo 4. Click Publish | New markdown file created in repo; new story page accessible at /stories/{slug}; case appears in /cases grid | High |
| TC-CS-18 | New case appears in list | After TC-CS-17 | 1. Click "Case Studies" in sidebar | New case appears in the collection list | High |
| TC-CS-19 | Add case with missing required fields | Logged in, new case editor open | 1. Click "New Case Study" 2. Leave Client Name blank 3. Click Publish | Validation error shown; publish blocked | Medium |
| TC-CS-20 | Delete a case study | Logged in, case editor open | 1. Open any case 2. Click "Delete entry" 3. Confirm | Markdown file removed from repo; case no longer appears on /cases; story page returns 404 after rebuild | High |

---

## 7. Client List

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|----|-------|---------------|-------|-----------------|----------|
| TC-CL-01 | Client List opens | Logged in | 1. Click "Site Data" 2. Click "Client List" | Editor opens showing client list | High |
| TC-CL-02 | All 61 clients shown | Logged in, Client List open | 1. Expand the list with ">" | 61 client rows visible | High |
| TC-CL-03 | Expand a client row | Logged in, Client List open | 1. Click ">" on any client row | Row expands showing Company Name and Logo fields | Medium |
| TC-CL-04 | Edit company name | Logged in, client row expanded | 1. Change Company Name 2. Publish | Updated name appears as fallback text when logo fails to load on /clients page | Medium |
| TC-CL-05 | Upload new client logo | Logged in, client row expanded | 1. Click "Choose an image" in Logo field 2. Upload a new file 3. Publish | Logo appears in the honeycomb grid on /clients after rebuild | High |
| TC-CL-06 | Reorder clients | Logged in, Client List open | 1. Drag a client row using ≡ handle to a new position 2. Publish | Honeycomb grid on /clients reflects the new order after rebuild | High |
| TC-CL-07 | Add new client | Logged in, Client List open | 1. Click "Add clients +" 2. Enter Company Name 3. Upload a logo 4. Publish | New client appears in the honeycomb grid | High |
| TC-CL-08 | Remove a client | Logged in, Client List open | 1. Click × on any client row 2. Publish | Client no longer appears in the honeycomb grid on /clients | High |
| TC-CL-09 | View on Site opens clients page | Logged in, Client List open | 1. Click "View on Site ↗" | New tab opens at /clients | Medium |
| TC-CL-10 | Grid renders correctly after reorder | After TC-CL-06 | 1. Visit /clients | Honeycomb grid shows all clients in the new order with no layout issues | High |

---

## 8. Homepage Quotes

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|----|-------|---------------|-------|-----------------|----------|
| TC-HQ-01 | Homepage Quotes opens | Logged in | 1. Click "Site Data" 2. Click "Homepage Quotes" | Editor opens with 5 quote rows | High |
| TC-HQ-02 | Expand a quote row | Logged in, Quotes editor open | 1. Click ">" on any row | Row expands showing Quote, Client Name, Case Slug fields | Medium |
| TC-HQ-03 | Edit quote text | Logged in, quote row expanded | 1. Change Quote text 2. Publish | Updated quote appears in the rotating hero on the homepage | High |
| TC-HQ-04 | Edit client name | Logged in, quote row expanded | 1. Change Client Name 2. Publish | Updated attribution (— ClientName) appears below the quote | Medium |
| TC-HQ-05 | Edit with valid case slug | Logged in, quote row expanded | 1. Set Case Slug to "genentech" 2. Publish | "Read the story" link on homepage points to /stories/genentech | High |
| TC-HQ-06 | Edit with invalid case slug | Logged in, quote row expanded | 1. Set Case Slug to "nonexistent" 2. Publish | "Read the story" link points to /stories/nonexistent which returns 404 | Medium |
| TC-HQ-07 | Reorder quotes | Logged in, Quotes editor open | 1. Drag a quote row to a new position 2. Publish | Quotes rotate in the new order on the homepage | Medium |
| TC-HQ-08 | Add a new quote | Logged in, Quotes editor open | 1. Click "Add quotes +" 2. Fill all three fields 3. Publish | New quote appears in the rotation on the homepage hero | Medium |
| TC-HQ-09 | Remove a quote | Logged in, Quotes editor open | 1. Click × on any quote row 2. Publish | Removed quote no longer appears on the homepage | Medium |
| TC-HQ-10 | View on Site opens homepage | Logged in, Quotes editor open | 1. Click "View on Site ↗" | New tab opens at / (homepage) | Medium |

---

## 9. Services

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|----|-------|---------------|-------|-----------------|----------|
| TC-SV-01 | Services editor opens | Logged in | 1. Click "Site Data" 2. Click "Services" | Editor opens with 3 service rows | High |
| TC-SV-02 | Expand a service row | Logged in, Services editor open | 1. Click ">" on any row | Row expands showing Title, Lead Sentence / Pull Quote, Body, Bullet Points | Medium |
| TC-SV-03 | Edit service title | Logged in, service row expanded | 1. Change Title 2. Publish | Updated title appears on the homepage service card | High |
| TC-SV-04 | Edit lead sentence | Logged in, Leadership Alignment expanded | 1. Change Lead Sentence 2. Publish | Updated bold intro line appears on the service card | High |
| TC-SV-05 | Edit pull quote | Logged in, Culture and Change expanded | 1. Change Pull Quote 2. Publish | Updated italic quote appears on the Culture and Change card | High |
| TC-SV-06 | Edit body text | Logged in, service row expanded | 1. Change Body 2. Publish | Updated paragraph appears on the service card | High |
| TC-SV-07 | Edit a bullet point | Logged in, service row expanded | 1. Expand Bullet Points 2. Change one item 3. Publish | Updated bullet appears at the bottom of the service card | High |
| TC-SV-08 | Add a bullet point | Logged in, service row expanded | 1. Click "Add item +" in Bullet Points 2. Enter text 3. Publish | New bullet appears on the service card | Medium |
| TC-SV-09 | Remove a bullet point | Logged in, service row expanded | 1. Click × on a bullet item 2. Publish | Bullet removed from the service card | Medium |
| TC-SV-10 | Reorder bullet points | Logged in, service row expanded | 1. Drag ≡ on a bullet item 2. Publish | Bullets appear in the new order on the service card | Medium |
| TC-SV-11 | View on Site opens services section | Logged in, Services editor open | 1. Click "View on Site ↗" | New tab opens at /#services | Medium |
| TC-SV-12 | Three services always present | Logged in, Services editor open | 1. Count service rows | Exactly 3 service rows visible; no add/delete option at service level | High |

---

## 10. Publishing & Live Site Verification

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|----|-------|---------------|-------|-----------------|----------|
| TC-PUB-01 | Publish triggers GitHub commit | Any change made | 1. Make any edit 2. Click Publish | New commit visible at github.com/mdanna/collabria-astro | High |
| TC-PUB-02 | Publish triggers Vercel rebuild | After TC-PUB-01 | 1. Check Vercel dashboard after publishing | New deployment shown as "Building" then "Ready" | High |
| TC-PUB-03 | Live site updated within 60 seconds | After TC-PUB-01 | 1. Wait 30–60 seconds 2. Visit the relevant live page 3. Hard refresh (Cmd+Shift+R) | Change visible on live site | High |
| TC-PUB-04 | Save does not update live site | Any change made | 1. Make an edit 2. Click Save (not Publish) 3. Visit live site immediately | Live site unchanged; draft saved in CMS only | High |
| TC-PUB-05 | Multiple edits in one session | Logged in | 1. Edit Case Study 2. Save 3. Edit another field 4. Publish | All changes from the session included in a single commit | Medium |

---

## 11. Media Library

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|----|-------|---------------|-------|-----------------|----------|
| TC-ML-01 | Media tab accessible | Logged in | 1. Click "Media" in the top bar | Media library opens showing uploaded files | Medium |
| TC-ML-02 | Existing logos visible | Logged in, Media open | 1. Open Media library | All files from public/logos/ visible as thumbnails | Medium |
| TC-ML-03 | Upload via Media tab | Logged in, Media open | 1. Click Upload 2. Select a JPG file | File appears in the media library and is committed to public/ in GitHub | Medium |
| TC-ML-04 | Delete from Media tab | Logged in, Media open | 1. Select a file 2. Delete it 3. Publish | File removed from GitHub repo and no longer served | Low |

---

## 12. Edge Cases & Regression

| ID | Title | Preconditions | Steps | Expected Result | Priority |
|----|-------|---------------|-------|-----------------|----------|
| TC-EDGE-01 | Logo path without leading slash | Logged in, client row expanded | 1. Manually type `logos/cisco.jpg` (no leading /) in Logo field 2. Publish | Logo still renders correctly (defensive normalisation in clients.astro adds the / automatically) | High |
| TC-EDGE-02 | Very long quote text | Logged in, Quotes editor open | 1. Paste a quote longer than 300 characters 2. Publish | Quote displays without breaking the hero layout | Medium |
| TC-EDGE-03 | Special characters in case title | Logged in, new case editor | 1. Set Title to "M&A: Post-merger Integration" 2. Publish | Title renders correctly with ampersand; no HTML encoding issues | Medium |
| TC-EDGE-04 | Client list after Decap reorder | After reordering clients and publishing | 1. Visit /clients | All 61 clients shown in new order; no missing hexagons; grid layout intact | High |
| TC-EDGE-05 | Admin accessible after domain switch | After collabriainc.com is configured | 1. Navigate to collabriainc.com/admin | CMS loads correctly; login works; OAuth callback resolves to new domain | High |
| TC-EDGE-06 | Concurrent edits not possible | Two browser sessions logged in | 1. Open same case in two tabs 2. Edit in tab A and publish 3. Edit in tab B and publish | Second publish overwrites first; no corruption | Low |
| TC-EDGE-07 | Browser back button in CMS | Logged in, inside case editor | 1. Navigate to a case 2. Press browser back | Returns to case list without errors | Low |

---

## Test Execution Summary Template

| Category | Total TCs | Pass | Fail | Blocked | Notes |
|----------|-----------|------|------|---------|-------|
| Authentication | 6 | | | | |
| Navigation | 5 | | | | |
| Case Studies — Read | 4 | | | | |
| Case Studies — Edit | 8 | | | | |
| Case Studies — Logo | 4 | | | | |
| Case Studies — Add/Delete | 4 | | | | |
| Client List | 10 | | | | |
| Homepage Quotes | 10 | | | | |
| Services | 12 | | | | |
| Publishing | 5 | | | | |
| Media Library | 4 | | | | |
| Edge Cases | 7 | | | | |
| **Total** | **79** | | | | |
