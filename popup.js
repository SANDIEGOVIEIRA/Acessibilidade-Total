// popup.js
async function sendMessage(action) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action });
}

// mapeia botões para as ações corretas
const map = {
  'toggle-contrast': 'togglecontrast',
  'increase-font':   'increasefont',
  'decrease-font':   'decreasefont',
  'read-page':       'readpage',
  'pause-reading':   'pause_reading',
  'resume-reading':  'resume_reading',
  'increase-rate':   'increase_rate',
  'decrease-rate':   'decrease_rate',
};

document.addEventListener('DOMContentLoaded', () => {
  for (const [btnId, action] of Object.entries(map)) {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => sendMessage(action));
    }
  }
});
