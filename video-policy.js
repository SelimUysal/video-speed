/* Small policy functions shared between the content script and automated tests. */
(function (scope) {
  'use strict';
  const INTERACTIVE = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A', 'SUMMARY', 'OPTION']);
  const INTERACTIVE_ROLES = new Set(['textbox', 'searchbox', 'combobox', 'button', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'listbox', 'slider', 'spinbutton', 'dialog', 'gridcell']);
  function isInteractivePath(path) {
    return (path || []).some(node => {
      if (!node || node.nodeType !== 1) return false;
      if (node.isContentEditable || INTERACTIVE.has(node.tagName)) return true;
      const role = node.getAttribute && node.getAttribute('role');
      return role ? INTERACTIVE_ROLES.has(role.toLowerCase()) : false;
    });
  }
  function videoScore(width, height, paused, ended) {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return -1;
    const size = Math.min(width * height, 1500000);
    return size + (!paused && !ended ? 2000000 : 0);
  }
  scope.VideoSpeedPolicy = Object.freeze({isInteractivePath, videoScore});
  if (typeof module !== 'undefined' && module.exports) module.exports = scope.VideoSpeedPolicy;
})(globalThis);
