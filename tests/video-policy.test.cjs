const test = require('node:test');
const assert = require('node:assert/strict');
const { isInteractivePath, videoScore } = require('../video-policy.js');
const node = (tagName, role = null, edit = false) => ({
  nodeType: 1, tagName, isContentEditable: edit,
  getAttribute: name => name === 'role' ? role : null
});
test('playing visible video outranks paused previews', () => {
  assert.ok(videoScore(640,360,false,false)>videoScore(320,180,true,false));
});
test('largest playing video outranks other playing previews', () => {
  assert.ok(videoScore(800,600,false,false)>videoScore(200,150,false,false));
});
test('text-entry and site controls are never shortcut targets', () => {
  for (const target of [node('INPUT'),node('TEXTAREA'),node('BUTTON'),node('DIV','textbox'),node('DIV','menuitem'),node('A'),node('DIV',null,true)]) {
    assert.equal(isInteractivePath([target, node('BODY')]), true);
  }
});
test('non-interactive page targets remain usable', () => {
  assert.equal(isInteractivePath([node('VIDEO'),node('DIV'),node('BODY')]), false);
});
test('missing media dimensions are not valid candidates', () => {
  assert.equal(videoScore(0,360,false,false),-1);
});
