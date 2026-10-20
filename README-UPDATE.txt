UCD EXPENSE DESK v1.1 - GITHUB PAGES UPDATE

WHAT CAUSED THE ERRORS
The published site returned 404 Not Found for the OCR engine, OCR worker,
English language data and PDF modules. These are needed for reading image/scanned
receipts and rendering PDF previews. The earlier version also blocked
confirmation whenever automatic reading recorded an error.

WHAT CHANGED
- Complete bundled OCR and PDF assets, with clearer loading errors and retries.
- Standard .js module filenames and project-relative asset paths.
- Partial or complete manual entry can be saved even if reading fails.
- A complete, manually checked expense can be confirmed and exported while
  retaining its reading-error note and original receipt.
- Stop reading; enter manually cancels automatic reading when it takes too long.
- Improved total selection, decimal formats, date prioritization and merchant
  extraction from pasted emails. Suggested tips and tax totals are not treated
  as the final amount paid. Currency ambiguity still needs your review.
- Difficult images get a second OCR pass with improved contrast. Native PDF
  text is preferred; scanned pages use OCR. Available text from other attachments
  is kept if one file cannot be read.
- Read receipt again preserves corrections rather than replacing them blindly.
- Native browser PDF preview is available if the enhanced preview cannot load.
- Defaults & settings > Check receipt tools > Check files lists missing files.
- Existing version 1 browser storage and backup files remain compatible.

UPDATE YOUR EXISTING GITHUB PAGES SITE
1. On your current tool, use Save backup first if available. Keep this backup
   on your computer. Do not clear browser data, or upload receipt backups to GitHub.

2. Extract this ZIP ON YOUR COMPUTER. Upload the extracted FILES AND FOLDERS
   into the same repository folder that currently contains index.html.
   For your current site this is the folder serving Expense-Desk-Tool.

   The structure must be:
     index.html
     styles.css
     app.js
     core.js
     exports.js
     receipt-tools.js
     file-utils.js
     .nojekyll
     assets/
       tesseract.min.js
       worker.min.js
       tesseract-core-lstm.wasm.js
       eng.traineddata
       pdf.min.js
       pdf.worker.min.js
       pdf-lib.min.js
       jszip.min.js
       expense-template.xlsx
       codes.json
       standard_fonts/...
       license files...

   Replace index.html and styles.css as well as uploading the new .js files.
   Upload the ENTIRE assets folder and preserve its subfolders. Do not nest
   these files inside an additional ucd-expense-desk folder if your existing
   index.html is already at the repository root. Uploading this ZIP alone will
   not extract it on GitHub Pages.

3. Commit the changes and wait for your GitHub Pages deployment to complete.
   If you use GitHub's web uploader, ensure every file in assets was included;
   uploading only the top-level HTML/JavaScript files is insufficient.

4. Open your existing tool URL and hard-refresh (Ctrl+Shift+R on Windows).
   Check the footer says v1.1. Keep the same URL/browser profile to retain your
   existing workspace. Old .mjs files may remain; the updated index does not use
   them. Avoid browser-data clearing as a cache troubleshooting step.

5. Open Defaults & settings, expand Check receipt tools and click Check files.
   Every listed file should say Available. If one says MISSING, upload that file
   at the exact displayed path, wait for deployment, and check again.

6. Open an expense carrying an earlier reading error. You can now edit fields
   and choose Save changes. Once the required details are complete, check the
   review confirmation box and choose Confirm expense. Reading errors are
   retained for reference and do not block confirmation. You do not have to
   delete or upload these receipts again. Read receipt again is optional.

7. Test a photo, a scanned PDF and a normal text PDF. Check the date, merchant,
   currency and final total. Export the matching Excel and PDF after review.

If you move to a different domain or browser, choose Open backup to restore
your downloaded report backup. Backups replace the current workspace after
confirmation. Receipt data is still stored locally in your browser, not GitHub.

READING AND EXPORT LIMITS
OCR still requires human review. A dollar sign alone does not determine whether
a receipt is USD, CAD or another dollar currency. The tool does not invent a
missing total or silently confirm a suggestion. It does not split several
different expenses inside a single PDF; split those into separate files first.

A reading failure and a damaged original file are different. A valid original
receipt can be combined into the PDF even when its text could not be read. If
an original PDF is encrypted or corrupted, you can save the expense and export
Excel, but you must replace/unlock that file before a matching PDF can be made.
The PDF export reports the problem rather than silently leaving out a receipt.

File/report limits and your 50-row final UCD form are unchanged. Review and copy
tabs remain date-sorted, and PDF item numbers match Ready to Copy. Re-export
Excel and PDF together after edits.

TESTING COMPLETED
Browser tests covered photo OCR, scanned-PDF OCR, two-page PDF preview, native
PDF preview fallback with a deliberately missing module, restoration of an old
failed expense, saving manual edits, and manual confirmation with the old error
still retained. Automated checks generated Excel and multipage PDF exports with
a manually confirmed failed-reading record and checked parsing/selection rules.
The browser download event could not be captured in the test environment;
verify actual downloaded files on your hosting account. The completed export
was reported by the application, and its generation functions passed checks.

OTHER WEB HOSTS
The same extracted files work in an HTTPS subfolder on ordinary static hosting.
No server database or paid receipt-reading service is required. The optional
.htaccess supplies JavaScript MIME types on compatible Apache hosts. GitHub
Pages ignores .htaccess; .nojekyll is included for straightforward static serving.
