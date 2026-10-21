UCD EXPENSE DESK v1.4 - WEBSITE UPDATE

All files needed to run this static web tool are included. No server database,
paid OCR subscription, or API key is required. Keep the complete assets folder.

NEW IN v1.4

The review form now has an optional Saved merchant dropdown above the editable
Merchant field. Every saved merchant appears in alphabetical order, including
merchants restored from backups or kept from previous reports.

Choosing a merchant fills its name and saved selections immediately. You can
customize any field before saving. Dates and amounts stay specific to the
expense. Confirmation is reset for changed included expenses.

The Merchant text box always accepts any new name, whether or not defaults
exist. Choose Enter a new merchant to clear the merchant name and type a new
one, or replace the name directly in the Merchant field. Save merchant defaults
adds the new merchant to the dropdown immediately. The list follows the saved
merchants in Defaults & settings. With no saved merchants, the text box works
normally and the dropdown explains how to create your first saved merchant.

Save a backup, replace the extracted website files, then hard-refresh and check
that the footer says v1.4. Existing reports, saved merchants and backups work
with this update. The complete assets folder is included.

V1.4 VALIDATION
Browser checks covered the empty saved list, unrestricted entry, saving two
merchants and immediately seeing both in alphabetical order, selecting saved
names/defaults, preserving the expense date/amount, entering and confirming an
unlisted merchant, and reopening it after reload. Choosing a saved merchant
from a confirmed expense returns it to review. Special characters in saved
names were also checked.

RETAINED FROM v1.3

1. AUTOMATIC ITEMIZED-RECEIPT DEFAULT
Newly uploaded receipts, pasted email receipts, and receipts attached later
start with Itemized receipt = Yes. This is an editable default; choose No if
the document is not itemized. Explicit saved merchant preferences still apply.
Existing attached receipts whose itemized field was blank also default to Yes
when loaded or restored. An existing explicit No is kept for your review.

2. ADD AN EXPENSE WITHOUT A RECEIPT
Choose Add expense without receipt beside the upload and paste controls.
Enter the date, merchant, business purpose, amount, currency, expense code and
other usual fields. No attachment is required to save or confirm the expense.
Itemized receipt is set to No while there are no attachments.

Business Justification displays an emphasized missing-receipt reminder.
Explain why the itemized receipt is unavailable in the separate explanation
box below it. That explanation is required for confirmation, including when an
attached document is marked No. You can save an incomplete draft at any time.
A general category reason such as Meal during recruitment travel does not
replace the explanation of why the receipt is unavailable.

The explanation is appended to Business Justification in Expense Review and
Ready to Copy, so it will also be copied into your final report. The PDF includes
a clearly labeled missing-receipt explanation page at the matching item number.
For an attached, non-itemized document, an explanation page precedes that
expense's attachments. These pages are user-entered statements, not receipts
or approval of reimbursement. Date sorting, matching item numbers and totals
continue to work. Long explanations continue on additional pages as needed.

If you find the receipt later, open the expense and choose Attach a receipt.
Uploading it defaults the itemized field to Yes and returns the expense to
review. The earlier explanation is retained locally but omitted from the
exported justification when an itemized receipt is available. Removing the
last attachment changes the field to No and restores the explanation prompt.
Receipt explanations are specific to each expense, never merchant defaults.

BACKUPS AND UPGRADING
Save a backup before replacing website files. Keep the same URL/browser
profile to retain your workspace; do not clear browser data. Older backups
remain supported. Use v1.3 or later to restore backups with missing-receipt
explanations. Previously confirmed records marked No without an explanation
return to review so you can complete the new required explanation.

After replacing all extracted files and the complete assets folder on your
website, hard-refresh and check the footer says v1.4. The upload instructions
below still apply. No additional modules or server services are required.

V1.3 VALIDATION
Automated checks covered uploaded-receipt defaults, keeping an explicit No,
preventing a no-file expense from claiming Yes, confirmation requirements,
merchant-default safety, backup preservation, Excel justification/No values,
PDF placeholder item order, non-itemized attachments and long explanations.
The actual PDF text was parsed to check item order and complete explanations.
Existing image-editing, merchant matching and matched-export checks also pass.

Browser checks covered manual creation, saving an incomplete draft, blocked
confirmation without an explanation, successful confirmation with one,
persistence after reload, uploading a new receipt with Yes, adding a receipt
later, switching to No, removing the last attachment, and matched Excel/PDF
ZIP generation. Downloads should still be checked on your deployed website.

RETAINED FROM v1.2

1. RECEIPT IMAGE EDITOR
Open an expense with a JPG, PNG or WEBP attachment, then choose Rotate / mark up.
Rotate left or right in 90-degree steps; draw, outline, highlight or add a text
label. Use Undo, Redo or Reset edits as needed. Save image edits persists the
edited copy and returns the expense to review. Cancel discards pending image
changes. Reopen the editor to revise or reset saved edits.

The receipt PDF uses the edited copy. Original downloads the original file.
Backups retain original bytes, edited PNGs and reversible editing instructions.
Markup is not secure redaction: originals remain available in browser storage
and backups. The image editor does not edit native PDF pages or text receipts.
Large photos are reduced to at most 3500 pixels on their longest edge when
saved as edited copies. Review small print before submitting.

2. SAVED MERCHANT DEFAULTS
From an expense, complete the usual fields and choose Save merchant defaults.
Choose which selections to reuse: category, justification, expense code,
subcategory and cost centre; currency and itemized status are optional.
Add exact alternate receipt names, one per line, if needed. Matching ignores
capitalization and repeated whitespace; it does not guess similar names.

Newly read matching receipts receive these defaults automatically. The optional
"Also apply" checkbox updates all matching included, finished-reading expenses
in the current report, replacing only the selected fields and returning matches
to review. Excluded and still-processing expenses are skipped. Use saved defaults
can also apply them to an individual receipt after a manual merchant correction.

Dates, amounts, exchange rates, USD card charges and confirmation are never
copied as merchant defaults. Changing a saved currency clears any previous
conversion on affected records. Every receipt still needs review. Individual
corrections can be customized; reading again preserves those corrections.
Manage saved merchants in Defaults & settings; Forget leaves expense values
unchanged. Up to 200 merchants and 20 alternate names each are supported.

3. CLEAR ALL / NEW REPORT
The top button opens a confirmation showing expense, receipt and image-edit
counts and what will be removed from this browser. Cancel keeps the workspace.
Save backup first prepares a ZIP; check that it finished downloading before
clearing. The final clear removes current expenses, receipt originals, image
edits and report notes. Existing downloads and other devices are unaffected.

Saved merchants and personal defaults are kept by default. Select either of the
separate checkboxes to remove saved merchants or reset personal defaults too.
A new report starts with the default report name and reset list/export filters.
Automatic receipt reading is stopped if needed. Deletion is local and requires
a saved backup to undo. Wait for the dialog to close before closing the tab.

4. PRIVACY NOTICE
The top intro now includes a short notice and expandable details about local
processing/storage, browser/device access, shared website origins, website-owner
and hosting visibility, optional exchange-rate requests, downloaded files,
backups, data clearing and code changes by the host. Review this notice against
your hosting setup if you add analytics or change how the tool handles data.
This distributed version has no analytics or receipt-upload service.

UPDATE YOUR EXISTING WEBSITE

1. In your current tool, choose Save backup. Keep that ZIP on your computer and
   check the download. Do not clear browser data or put receipt backups in the
   GitHub repository. Website source and bundled generic assets may be public;
   personal report backups should remain private.

2. Extract this update ZIP on your computer. Replace the extracted FILES AND
   FOLDERS in the same repository folder that currently contains index.html.
   Do not upload only the ZIP: GitHub Pages will not extract it.

   Required top-level files:
     index.html
     styles.css
     app.js
     core.js
     exports.js
     receipt-tools.js
     file-utils.js
     image-render.js
     image-editor.js
     merchants.js
     .nojekyll
     assets/ (complete folder, including subfolders and license files)

   Upload all files, including the new image and merchant modules. Preserve the
   exact assets paths. Do not add an extra parent folder around these files if
   index.html is currently at the repository root. The bundled Excel template
   and the earlier OCR/PDF dependency fixes are retained.

3. Commit your changes and wait for GitHub Pages deployment to finish. Open the
   same tool URL and hard-refresh (Ctrl+Shift+R on Windows; Cmd+Shift+R on Mac).
   The footer should say v1.4. Keep the same URL/browser profile to retain local
   expenses and settings. Existing v1/v1.1 browser records and backups work in
   this version. A v1.2 backup should be opened with v1.2 or later to preserve
   image edits and merchant defaults.

4. Open Defaults & settings > Check receipt tools > Check files. Every listed
   asset should say Available. If a file is missing, upload it at the displayed
   path, wait for deployment and check again. The new app modules must also be
   uploaded; a missing module can prevent the app from starting.

5. Test with disposable receipts: rotate and mark up a photo, save/reopen it,
   create a merchant rule and add another matching receipt. Confirm details and
   download Excel + PDF together. Open the actual downloaded files and verify
   image appearance, date order and matching item numbers. Save a backup, test
   opening it, and check original/edited images and merchant defaults before
   relying on it for a real report. Test Clear All using only disposable data.

The same extracted files can be served from an HTTPS subfolder on other static
hosts. .htaccess supplies JavaScript MIME types on compatible Apache servers;
GitHub Pages ignores it. No additional install/build step is required.

EXISTING RECEIPT READING AND EXPORT BEHAVIOR

OCR remains a suggestion and cannot guarantee correct details. Missing totals,
ambiguous currencies and dates need human review. Manual changes can be saved
when automatic reading fails; complete manually reviewed expenses can still be
confirmed with the reading note retained. Use Stop reading; enter manually if
needed. Native PDF preview has a browser fallback; Read receipt again preserves
manual corrections. The complete OCR and PDF assets from v1.1 are included.

Review/Ready to Copy worksheets and the combined receipt PDF remain sorted by
expense date, oldest first. Undated records appear last in review and need a
date for matching PDF export. Re-export both files after changing an expense or
image. The final UCD template has 50 expense rows; split larger submissions.
The tool does not split different expenses inside one PDF. Encrypted/damaged
PDFs must be replaced/unlocked before they can be included in a receipt PDF.
Limits remain 500 expenses, 25 MB per attachment/edited image, and 250 MB per
report including both originals and edited copies. Browser storage capacity
also varies; watch the save status and retain your backups.

VALIDATION FOR THIS RELEASE

Automated checks covered merchant normalization/aliases, restricted reusable
fields, custom override preservation, currency conversion invalidation, rotation
coordinates, image rendering, edited-PNG embedding in the receipt PDF, matching
spreadsheet/PDF date order, and actual backup generation with original bytes,
edited images, edit state and merchant defaults preserved.

Browser tests covered an old backup with a reading error, image rotation,
annotations and undo/redo, saving edited receipts, applying merchant defaults
across existing receipts, automatic alias matching on new receipts, preserving
individual justifications on re-reading, local photo OCR with defaults in a new
report, canceling/confirming clear, keeping or resetting merchants/settings,
persistence after the completed reset, restoration of a v1.2 backup with editable
images/defaults, manual confirmation after image editing with an old reading
error retained, and matching Excel/PDF ZIP generation in the browser.

The browser automation environment did not expose a download event for its
backup link, although the app completed ZIP generation and the same backup
function passed byte-level checks. Verify the actual downloads on your deployed
website as described above.
