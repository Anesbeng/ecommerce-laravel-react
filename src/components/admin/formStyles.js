// Shared CSS string injected by all admin form pages
// Import and use inside a <style> tag: <style>{FORM_CSS}</style>

export const FORM_CSS = `
  .af-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 28px; flex-wrap: wrap; gap: 12px;
  }
  .af-title { font-size: 1.4rem; font-weight: 700; color: #1a1a1a; }
  .af-back {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px; border-radius: 10px; font-size: 0.85rem;
    font-weight: 500; border: 1px solid #e8e8ec; background: #fff;
    color: #444; text-decoration: none; transition: background 0.15s;
  }
  .af-back:hover { background: #f4f5f7; color: #1a1a1a; }

  .af-card {
    background: #fff; border: 1px solid #e8e8ec;
    border-radius: 14px; padding: 32px;
  }

  .af-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .af-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
  .af-field.span2 { grid-column: 1 / -1; }

  .af-label {
    font-size: 0.75rem; font-weight: 600; color: #888;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .af-input, .af-select, .af-textarea {
    padding: 11px 14px; border: 1px solid #e8e8ec; border-radius: 10px;
    font-size: 0.9rem; color: #1a1a1a; background: #fff; outline: none;
    font-family: inherit; transition: border-color 0.15s; width: 100%;
    box-sizing: border-box;
  }
  .af-input:focus, .af-select:focus, .af-textarea:focus { border-color: #1a1a1a; }
  .af-input.error, .af-select.error, .af-textarea.error { border-color: #ef4444; }
  .af-textarea { resize: vertical; min-height: 110px; }
  .af-error { font-size: 0.78rem; color: #ef4444; margin-top: 2px; }

  .af-section-title {
    font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.8px;
    color: #aaa; font-weight: 600; margin-bottom: 14px; margin-top: 8px;
  }

  /* Size checkboxes */
  .af-sizes { display: flex; flex-wrap: wrap; gap: 10px; }
  .af-size-chip {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px; border: 1px solid #e8e8ec;
    font-size: 0.82rem; font-weight: 500; color: #555;
    cursor: pointer; transition: all 0.15s; user-select: none;
    background: #fff;
  }
  .af-size-chip.checked { background: #1a1a2e; color: #fff; border-color: #1a1a2e; }
  .af-size-chip input { display: none; }

  /* Image upload */
  .af-upload-zone {
    border: 2px dashed #e8e8ec; border-radius: 12px; padding: 28px;
    text-align: center; cursor: pointer; transition: border-color 0.15s;
    background: #fafafa;
  }
  .af-upload-zone:hover { border-color: #1a1a1a; }
  .af-upload-icon { color: #ccc; margin-bottom: 8px; }
  .af-upload-text { font-size: 0.85rem; color: #aaa; }
  .af-upload-text strong { color: #1a1a1a; }
  .af-upload-input { display: none; }

  .af-previews { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
  .af-preview-wrap { position: relative; }
  .af-preview-img {
    width: 100px; height: 100px; object-fit: cover;
    border-radius: 10px; border: 1px solid #e8e8ec; display: block;
  }
  .af-preview-img.new-img { border: 2px dashed #4f6ef7; }
  .af-preview-badge {
    position: absolute; bottom: 6px; left: 6px;
    background: #4f6ef7; color: #fff;
    font-size: 0.65rem; font-weight: 700; padding: 2px 6px; border-radius: 4px;
  }
  .af-preview-remove {
    position: absolute; top: -7px; right: -7px;
    width: 20px; height: 20px; border-radius: 50%;
    background: #ef4444; color: #fff; border: none; cursor: pointer;
    font-size: 0.7rem; display: flex; align-items: center; justify-content: center;
  }

  /* Footer */
  .af-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 28px; padding-top: 24px; border-top: 1px solid #f0f0f4; }
  .af-submit-btn {
    padding: 11px 28px; border-radius: 10px; font-size: 0.9rem;
    font-weight: 600; background: #1a1a1a; color: #fff; border: none;
    cursor: pointer; transition: background 0.15s; font-family: inherit;
  }
  .af-submit-btn:hover:not(:disabled) { background: #333; }
  .af-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  @media (max-width: 640px) {
    .af-card { padding: 20px; }
    .af-grid-2 { grid-template-columns: 1fr; }
  }
`;
