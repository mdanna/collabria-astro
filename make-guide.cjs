const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, LevelFormat, PageNumber, PageBreak
} = require('docx');
const fs = require('fs');
const path = require('path');

const BROWN       = '3b1a0c';
const BROWN_MID   = '8a5230';
const CREAM       = 'fdf8f3';
const TAUPE       = 'c9aa88';
const BEIGE_TIP   = 'f5ede0';
const CONTENT_W   = 9026;

// ── helpers ───────────────────────────────────────────────────────────────────

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    children: [new TextRun({ text, bold: true, size: 32, color: BROWN, font: 'Arial' })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, bold: true, size: 26, color: BROWN_MID, font: 'Arial' })],
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, size: 22, font: 'Arial', ...opts })],
  });
}

function code(text) {
  return new TextRun({ text, font: 'Courier New', size: 20, color: BROWN_MID });
}

function numbered(items, ref) {
  return items.map(text => new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80 },
    children: Array.isArray(text) ? text : [new TextRun({ text, size: 22, font: 'Arial' })],
  }));
}

function bullets(items, ref) {
  return items.map(text => new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80 },
    children: Array.isArray(text) ? text : [new TextRun({ text, size: 22, font: 'Arial' })],
  }));
}

function spacer(pt = 120) {
  return new Paragraph({ spacing: { after: pt }, children: [] });
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text, italics: true, size: 18, color: '888888', font: 'Arial' })],
  });
}

function tip(text, isWarning = false) {
  const fill = isWarning ? 'fce8e8' : BEIGE_TIP;
  const label = isWarning ? '⚠  Important' : '💡  Tip';
  const labelColor = isWarning ? 'b00000' : BROWN;
  const border = { style: BorderStyle.SINGLE, size: 4, color: isWarning ? 'b00000' : BROWN_MID };
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    borders: { top: border, bottom: border, left: border, right: border },
    rows: [new TableRow({ children: [new TableCell({
      width: { size: CONTENT_W, type: WidthType.DXA },
      shading: { fill, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 160, right: 160 },
      children: [
        new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: label, bold: true, size: 20, color: labelColor, font: 'Arial' })] }),
        new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text, size: 20, font: 'Arial' })] }),
      ],
    })] })],
  });
}

function image(filepath, widthPx, heightPx, altText) {
  if (!fs.existsSync(filepath)) return null;
  const data = fs.readFileSync(filepath);
  const ext = path.extname(filepath).slice(1).toLowerCase();
  const typeMap = { jpg: 'jpeg', jpeg: 'jpeg', png: 'png' };
  const maxW = 600;
  const scale = Math.min(1, maxW / widthPx);
  const w = Math.round(widthPx * scale);
  const h = Math.round(heightPx * scale);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new ImageRun({
      type: typeMap[ext] || 'jpeg',
      data,
      transformation: { width: w, height: h },
      altText: { title: altText, description: altText, name: altText },
    })],
  });
}

function placeholderImg(label) {
  const border = { style: BorderStyle.SINGLE, size: 4, color: 'cccccc' };
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    borders: { top: border, bottom: border, left: border, right: border },
    rows: [new TableRow({ children: [new TableCell({
      width: { size: CONTENT_W, type: WidthType.DXA },
      shading: { fill: 'f5f5f5', type: ShadingType.CLEAR },
      margins: { top: 200, bottom: 200, left: 200, right: 200 },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: `[ Screenshot: ${label} ]`, size: 20, italics: true, color: '888888', font: 'Arial' })],
      })],
    })] })],
  });
}

function fieldRow(name, desc) {
  return new Paragraph({
    spacing: { after: 80 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: name + ': ', bold: true, size: 22, font: 'Arial', color: BROWN }),
      new TextRun({ text: desc, size: 22, font: 'Arial' }),
    ],
  });
}

function img(el, label) {
  return el ? [el, caption(label)] : [placeholderImg(label), caption(label)];
}

// ── Load screenshots ──────────────────────────────────────────────────────────

const SHOTS = path.join(__dirname, 'guide-screenshots');
const imgDashboard  = image(path.join(SHOTS, 'dashboard.jpg'),  1568, 770, 'CMS Dashboard');
const imgLogin      = image(path.join(SHOTS, 'login.jpg'),      1568, 770, 'CMS Login screen');
const imgCaseEditor = image(path.join(SHOTS, 'caseEditor.jpg'), 1568, 770, 'Case study editor');
const imgSiteData   = image(path.join(SHOTS, 'siteData.jpg'),   1568, 770, 'Site Data menu');

// ── Footer ────────────────────────────────────────────────────────────────────

const footer = new Footer({
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: 'cccccc' } },
    spacing: { before: 80 },
    children: [
      new TextRun({ text: 'Collabria CMS User Guide  —  v1.1  —  May 2026     |     Page ', size: 18, color: '888888', font: 'Arial' }),
      new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '888888', font: 'Arial' }),
    ],
  })],
});

// ── Publish/Save table ────────────────────────────────────────────────────────

function savePublishTable() {
  const b = { style: BorderStyle.SINGLE, size: 2, color: 'dddddd' };
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [Math.round(CONTENT_W * 0.15), Math.round(CONTENT_W * 0.85)],
    borders: { top: b, bottom: b, left: b, right: b, insideH: b, insideV: { style: BorderStyle.NONE, size: 0, color: 'ffffff' } },
    rows: [
      new TableRow({ children: [
        new TableCell({ width: { size: Math.round(CONTENT_W*0.15), type: WidthType.DXA }, shading: { fill: 'f0e6d6', type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: 'Save', bold: true, size: 20, font: 'Arial', color: BROWN })] })] }),
        new TableCell({ width: { size: Math.round(CONTENT_W*0.85), type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: 'Stores a draft in the CMS. Changes are NOT live yet.', size: 20, font: 'Arial' })] })] }),
      ]}),
      new TableRow({ children: [
        new TableCell({ width: { size: Math.round(CONTENT_W*0.15), type: WidthType.DXA }, shading: { fill: BROWN, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: 'Publish', bold: true, size: 20, font: 'Arial', color: 'FFFFFF' })] })] }),
        new TableCell({ width: { size: Math.round(CONTENT_W*0.85), type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: 'Sends the change to the live website immediately.', size: 20, font: 'Arial' })] })] }),
      ]}),
    ],
  });
}

// ── Document ──────────────────────────────────────────────────────────────────

const numRefs = ['n1','n2','n3','n4','n5','n6','n7','n8'];
const bulRefs = ['b1','b2','b3','b4','b5','b6','b7'];

const doc = new Document({
  numbering: {
    config: [
      ...numRefs.map(r => ({ reference: r, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 560, hanging: 360 } } } }] })),
      ...bulRefs.map(r => ({ reference: r, levels: [{ level: 0, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT, style: { run: { font: 'Arial' }, paragraph: { indent: { left: 560, hanging: 280 } } } }] })),
    ],
  },
  sections: [
    // ── COVER ──────────────────────────────────────────────────────────────────
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
      children: [
        spacer(2000),
        new Paragraph({ alignment: AlignmentType.CENTER, shading: { fill: BROWN, type: ShadingType.CLEAR }, spacing: { after: 0 }, children: [new TextRun({ text: 'Collabria CMS', bold: true, size: 72, color: 'FFFFFF', font: 'Arial' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, shading: { fill: BROWN, type: ShadingType.CLEAR }, spacing: { after: 0 }, children: [new TextRun({ text: 'Content Management User Guide', size: 36, color: CREAM, font: 'Arial' })] }),
        spacer(400),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Version 1.1  —  May 2026', size: 22, color: TAUPE, font: 'Arial' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: 'collabria-astro.vercel.app/admin', size: 20, color: TAUPE, font: 'Arial' })] }),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    },

    // ── MAIN CONTENT ───────────────────────────────────────────────────────────
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
      footers: { default: footer },
      children: [

        // 1 — Getting Started
        h1('1  Getting Started'),
        h2('1.1  Accessing the Admin'),
        body('Your content management address is:'),
        new Paragraph({ spacing: { after: 160 }, indent: { left: 360 }, children: [code('https://collabria-astro.vercel.app/admin')] }),
        body('Bookmark this URL — it is the only address you need.'),
        spacer(),

        h2('1.2  Logging In'),
        ...img(imgLogin, 'The Collabria CMS login screen.'),
        ...numbered([
          'Go to https://collabria-astro.vercel.app/admin',
          'Click the "Login with GitHub" button',
          'You will be redirected to GitHub to confirm access — click "Authorize"',
          'You will be returned to the dashboard automatically',
        ], 'n1'),
        spacer(),
        tip('If you see a GitHub login page asking for your username and password, sign in with your GitHub account credentials. Once authorised you will not need to log in again for several weeks.'),
        spacer(200),

        h2('1.3  The Dashboard'),
        ...img(imgDashboard, 'The CMS dashboard. Use the left sidebar to switch between sections.'),
        body('Once logged in you will see two sections in the left sidebar:'),
        ...bullets([
          'Case Studies — all client success stories shown on the Cases page',
          'Site Data — contains the Client List, Homepage Quotes, and Services',
        ], 'b1'),
        spacer(),

        // 2 — Case Studies
        new Paragraph({ children: [new PageBreak()] }),
        h1('2  Case Studies'),
        body('Case studies appear on the Cases page and as rotating quotes on the homepage. Each entry has a client name, a challenge quote, and a solution description.'),
        spacer(),

        h2('2.1  Editing an Existing Case Study'),
        ...img(imgCaseEditor, 'A case study open for editing. Left panel: fields. Right panel: live preview.'),
        ...numbered([
          'Click "Case Studies" in the left sidebar',
          'Click any case in the list — shown as "Client — Title" e.g. "Genentech — Competing in the war for talent"',
          'Edit the fields as needed (see descriptions below)',
          'Click "Published" then "Publish" to make changes live',
          'Click "View on Site ↗" (top right) to confirm the change on the live website',
        ], 'n2'),
        spacer(),
        body('Field descriptions:', { bold: true }),
        fieldRow('CLIENT NAME', 'The company name displayed on the case card and story page'),
        fieldRow('TITLE', 'A short phrase describing the engagement'),
        fieldRow('LOGO', 'Click "Choose an image" to open the media library. Click "Upload" to add a new logo from your computer, or select an existing one. The file is saved automatically to the website.'),
        fieldRow('CHALLENGE QUOTE', "The client's challenge in their own words, shown in italics on the story page"),
        fieldRow('TAGS (optional)', 'Keywords shown as small chips — click the ">" arrow to expand each tag'),
        fieldRow('SOLUTION', 'Full description of the work. Supports bold, italic, and bullet lists using the toolbar.'),
        spacer(),
        tip('To add a brand new logo: in the Logo field click "Choose an image" → "Upload" → select the file from your computer. Accepted formats: JPG, PNG. Best results with a square image and a white or transparent background.'),
        spacer(200),

        h2('2.2  Adding a New Case Study'),
        ...numbered([
          'Click "Case Studies" in the left sidebar',
          'Click the "New Case Study" button (dark button, top right)',
          'Fill in all fields: Client Name, Title, Logo, Challenge Quote, Solution',
          'Add 2–3 relevant Tags using "Add tags +"',
          'Click "Published" → "Publish" when ready',
        ], 'n3'),
        spacer(),

        h2('2.3  Deleting a Case Study'),
        ...numbered([
          'Open the case study you want to remove',
          'Click "Delete entry" (red button in the top bar)',
          'Confirm the deletion',
        ], 'n4'),
        spacer(),
        tip('Deletion is permanent. The case study will be removed from the website on the next publish and cannot be recovered without developer assistance.', true),
        spacer(200),

        // 3 — Site Data
        new Paragraph({ children: [new PageBreak()] }),
        h1('3  Site Data'),
        body('Site Data contains three files that control different parts of the website. Click "Site Data" in the left sidebar to see them.'),
        spacer(),
        ...img(imgSiteData, 'The Site Data section — Client List, Homepage Quotes, and Services.'),

        h2('3.1  Client List'),
        body('The Client List controls the honeycomb grid on the Clients page.'),
        spacer(80),
        body('How to open: Click "Site Data" → "Client List"'),
        spacer(),
        body('Each client row can be expanded with the ">" arrow to show two fields:'),
        ...bullets([
          'COMPANY NAME — The name shown when the logo image cannot load',
          'LOGO — Click "Choose an image" to upload a new logo or select an existing one from the library',
        ], 'b2'),
        spacer(),
        body('To upload a new logo:', { bold: true }),
        ...numbered([
          'Expand the client row with ">"',
          'Click "Choose an image" in the Logo field',
          'Click "Upload" in the media library panel that opens',
          'Select the logo file from your computer (JPG or PNG recommended)',
          'The file uploads to the website automatically — click "Publish" to go live',
        ], 'n5'),
        spacer(),
        body('To reorder clients:', { bold: true }),
        ...bullets(['Drag the ≡ handle on the left of any row up or down', 'Click "Published" → "Publish" to update the live site'], 'b3'),
        spacer(80),
        body('To add a client:', { bold: true }),
        ...numbered(['Scroll to the bottom and click "Add clients +"', 'Enter the Company Name and upload or select a Logo', 'Click "Published" → "Publish"'], 'n6'),
        spacer(80),
        body('To remove a client:', { bold: true }),
        ...bullets(['Click the × on the right side of the client row', 'Click "Published" → "Publish"'], 'b4'),
        spacer(200),

        h2('3.2  Homepage Quotes'),
        body('The five rotating quotes on the homepage hero section are managed here.'),
        spacer(80),
        body('How to open: Click "Site Data" → "Homepage Quotes"'),
        spacer(),
        body('Each quote has three fields (click ">" to expand a row):'),
        fieldRow('QUOTE', 'The full text of the quote. Quotation marks are added automatically by the website.'),
        fieldRow('CLIENT NAME', 'The attribution shown beneath the quote, e.g. iRhythm'),
        fieldRow('CASE SLUG', 'The URL identifier linking "Read the story" to the correct case page'),
        spacer(),
        body('Valid case slugs:'),
        new Paragraph({ spacing: { after: 160 }, indent: { left: 360 }, children: [code('irhythm, cyrq, digital-realty, ideo, special-olympics, mozilla, genentech, riot-games, chevron, dolby, visa, informatica')] }),
        body('To edit: Expand the row, update the fields, click "Published" → "Publish"'),
        body('To reorder: Drag the ≡ handle, then Publish'),
        body('To add: Click "Add quotes +", fill all three fields, then Publish'),
        spacer(200),

        h2('3.3  Services'),
        body('The three service cards on the homepage are edited here: Leadership Alignment, Organizational Effectiveness, and Culture and Change.'),
        spacer(80),
        body('How to open: Click "Site Data" → "Services"'),
        spacer(),
        body('Each service has the following fields (click ">" to expand):'),
        fieldRow('TITLE', 'The service name shown as the card heading'),
        fieldRow('LEAD SENTENCE', 'The bold introductory line (Leadership Alignment and Org. Effectiveness only)'),
        fieldRow('PULL QUOTE', 'An italic quotation (Culture and Change only, replaces Lead Sentence)'),
        fieldRow('BODY', 'The main description paragraph'),
        fieldRow('BULLET POINTS', 'The three capability lines at the bottom. Use "Add item +" to add, × to remove, ≡ to reorder.'),
        spacer(),
        body('To edit a service: Expand the row, update the fields, click "Published" → "Publish"'),
        spacer(),
        tip('Do not add or remove services — the homepage layout is designed for exactly three. Only edit the content within existing service rows.', true),
        spacer(200),

        // 4 — Publishing
        new Paragraph({ children: [new PageBreak()] }),
        h1('4  Publishing Changes'),
        body('Every time you click "Publish":'),
        ...numbered([
          'Your change (including any uploaded logos) is saved to the code repository',
          'The website rebuilds automatically — approximately 30 seconds',
          'The live site is updated',
        ], 'n7'),
        spacer(),
        body('To confirm a change is live:'),
        ...bullets([
          'Click "View on Site ↗" in the top-right corner of any editor',
          'This opens the relevant live page in a new browser tab',
          'If the change is not yet visible, wait 30 seconds and refresh',
        ], 'b5'),
        spacer(),
        savePublishTable(),
        spacer(240),

        // 5 — Troubleshooting
        new Paragraph({ children: [new PageBreak()] }),
        h1('5  Troubleshooting'),

        h2('Logo does not appear on the site'),
        body('If you used the upload button, wait 60 seconds and hard-refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows). If it still does not appear, try re-uploading the logo — the file name must not contain spaces or special characters.'),
        spacer(),

        h2('Changes are not showing on the live site'),
        body('Wait 60 seconds, then do a hard refresh:'),
        ...bullets(['Mac: Cmd + Shift + R', 'Windows: Ctrl + Shift + R'], 'b6'),
        spacer(),

        h2('Logged out of the CMS'),
        body('Return to https://collabria-astro.vercel.app/admin and click "Login with GitHub".'),
        spacer(),

        h2('Logo upload fails or image looks wrong'),
        ...bullets([
          'Make sure the file is JPG or PNG format',
          'Keep the file size under 2 MB for best results',
          'Use a square image with a white or transparent background',
          'Avoid spaces and special characters in the filename',
        ], 'b7'),
        spacer(400),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: BROWN_MID } },
          spacing: { before: 240 },
          children: [new TextRun({ text: 'End of document', italics: true, size: 20, color: TAUPE, font: 'Arial' })],
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then(buf => {
  const out = path.join(__dirname, 'collabria-cms-guide.docx');
  fs.writeFileSync(out, buf);
  console.log('Written:', out, '(' + Math.round(buf.length/1024) + ' KB)');
}).catch(e => { console.error(e.message); process.exit(1); });
