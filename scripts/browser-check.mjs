import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Exercise only a local demo, in a disposable browser profile without customer data.
const origin = new URL(process.argv[2] || 'http://127.0.0.1:4176');
assert(['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname), 'Use a loopback preview URL');
const candidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
let executable;
for (const path of candidates) {
  try {
    await access(path);
    executable = path;
    break;
  } catch {
    /* Try the next installed browser. */
  }
}
assert(executable, 'Install Chrome or set CHROME_PATH');
const profile = await mkdtemp(join(tmpdir(), 'lumen-browser-'));
const chrome = spawn(
  executable,
  [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ],
  { stdio: 'ignore' },
);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let ws;
try {
  let port;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      port = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0];
      break;
    } catch {
      await pause(100);
    }
  }
  assert(port, 'Chrome did not start');
  const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  ws = new WebSocket(pages.find((page) => page.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));
  let id = 0;
  const pending = new Map(),
    errors = [];
  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const entry = pending.get(message.id);
      if (!entry) return;
      pending.delete(message.id);
      clearTimeout(entry.timer);
      message.error
        ? entry.reject(new Error(message.error.message))
        : entry.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown')
      errors.push(
        message.params.exceptionDetails.exception?.description ||
          message.params.exceptionDetails.text,
      );
  });
  const call = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const next = ++id;
      const timer = setTimeout(() => {
        pending.delete(next);
        reject(new Error(`CDP timeout: ${method}`));
      }, 15000);
      pending.set(next, { resolve, reject, timer });
      ws.send(JSON.stringify({ id: next, method, params }));
    });
  const ev = async (expression) => {
    const result = await call('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description);
    return result.result.value;
  };
  const wait = async (expression) => {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await ev(expression)) return;
      await pause(100);
    }
    throw new Error(`Timed out: ${expression}`);
  };
  const nav = async (path) => {
    await call('Page.navigate', { url: new URL(path, origin).href });
    await wait(`document.readyState === 'complete' && !!document.querySelector('h1')`);
    await pause(300);
  };
  const click = async (text) => {
    await wait(
      `!![...document.querySelectorAll('button,a')].find(e => e.textContent.trim() === ${JSON.stringify(text)} && !e.disabled)`,
    );
    assert(
      await ev(
        `(()=>{const button=[...document.querySelectorAll('button,a')].find(e=>e.textContent.trim()===${JSON.stringify(text)}&&!e.disabled);button.focus();button.click();return true;})()`,
      ),
      text,
    );
    await pause(350);
  };
  const check = async (expression, label) => {
    assert(await ev(expression), label);
    console.log('PASS', label);
  };
  await call('Runtime.enable');
  await call('Page.enable');
  await call('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  for (const path of [
    '/',
    '/shop',
    '/collections',
    '/collection/col-01',
    '/journal',
    '/journal/article-01',
    '/about',
    '/faq',
    '/shipping-returns',
    '/contact',
    '/sustainability',
    '/legal',
    '/missing',
    '/product/prod-lumen-01',
  ]) {
    await nav(path);
    await check(`!!document.querySelector('h1')`, 'Page renders ' + path);
    await check(`document.documentElement.scrollWidth<=innerWidth`, 'No desktop overflow ' + path);
    await ev(`document.querySelectorAll('img').forEach(i=>i.loading='eager')`);
    await wait(`[...document.images].every(i=>i.complete)`);
    const broken = await ev(
      `[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)`,
    );
    assert.deepEqual(broken, [], 'Broken images ' + path);
  }
  await click('Size Guide');
  await check(`!!document.querySelector('[role=dialog]')`, 'Size guide opens');
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
  await pause(100);
  await click('Add to Cart');
  await check(
    `document.querySelector('[role=dialog]').textContent.includes('$495.00')`,
    'Cart subtotal',
  );
  await ev(`document.querySelector('button[aria-label="Close cart"]').click()`);
  await call('Page.reload');
  await pause(1200);
  await ev(`document.querySelector('button[aria-label^="Open cart"]').click()`);
  await pause(350);
  await check(
    `document.querySelector('[role=dialog]').textContent.includes('$495.00')`,
    'Cart survives reload',
  );
  await click('Preview Checkout');
  await pause(600);
  await check(`!!document.querySelector('input[autocomplete="country-name"]')`, 'Checkout entry');
  await ev(
    `(()=>{const values=['review@example.com','Demo','Shopper','123 Demo Road','Lagos','Nigeria',''];document.querySelectorAll('[role=dialog] input').forEach((input,i)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,values[i]);input.dispatchEvent(new Event('input',{bubbles:true}));});})()`,
  );
  await click('Review checkout');
  await check(
    `document.querySelector('[role=dialog]').textContent.includes('Estimate before taxes')`,
    'Checkout review',
  );
  await click('Complete preview');
  await check(
    `document.querySelector('[role=dialog]').textContent.includes('No order was placed')`,
    'Honest completion',
  );
  await click('Continue shopping');
  await call('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 1,
    mobile: true,
  });
  for (const path of ['/', '/shop', '/product/prod-lumen-01', '/contact', '/faq']) {
    await nav(path);
    await check(`document.documentElement.scrollWidth<=innerWidth`, 'No mobile overflow ' + path);
  }
  await ev(`document.querySelector('button[aria-label="Toggle menu"]').click()`);
  await check(
    `document.querySelector('#mobile-menu').getAttribute('aria-modal')==='true'`,
    'Mobile menu opens',
  );
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
  await pause(100);
  await check(`document.querySelector('#mobile-menu').inert`, 'Mobile menu closes');
  await call('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await nav('/shop?q=doesnotexist');
  await pause(150);
  await check(`document.body.textContent.includes('No pieces match')`, 'Search empty state');
  await click('Clear filters');
  await pause(150);
  await check(`document.querySelectorAll('a[href^="/product/"]').length===4`, 'Search reset');
  await ev(
    `const select=document.querySelector('select');select.value='Knitwear';select.dispatchEvent(new Event('change',{bubbles:true}))`,
  );
  await pause(150);
  await check(`document.querySelectorAll('a[href^="/product/"]').length===1`, 'Category filter');
  await nav('/product/prod-lumen-02');
  await click('L');
  await ev(`document.querySelector('[aria-label="Select color Ivory"]').click()`);
  await pause(150);
  await check(
    `document.querySelector('button[aria-label="Select color Ivory"]').getAttribute('aria-pressed')==='true' && [...document.querySelectorAll('button[aria-pressed="true"]')].some(b=>b.textContent.trim()==='S')`,
    'Color change selects available size',
  );
  await click('Size Guide');
  await pause(150);
  await check(`document.activeElement.closest('[role=dialog]')!==null`, 'Dialog receives focus');
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
  await pause(100);
  await pause(150);
  await check(`document.activeElement.textContent.trim()==='Size Guide'`, 'Dialog restores focus');
  await nav('/contact');
  await ev(`document.querySelector('form').requestSubmit()`);
  await pause(150);
  await check(`!document.querySelector('[role=status]')`, 'Contact rejects empty input');
  await ev(
    `(()=>{const values=['Demo','Shopper','demo@example.com'];document.querySelectorAll('form input').forEach((i,n)=>{i.value=values[n];i.dispatchEvent(new Event('input',{bubbles:true}));});const t=document.querySelector('textarea');t.value='Demo message for frontend evaluation';t.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('form').requestSubmit();})()`,
  );
  await pause(150);
  await check(
    `document.querySelector('[role=status]').textContent.includes('Nothing was sent')`,
    'Contact preview feedback',
  );
  await nav('/');
  await ev(`document.querySelector('form').scrollIntoView()`);
  await pause(800);
  await ev(`document.querySelector('form').requestSubmit()`);
  await pause(150);
  await check(`!document.querySelector('[role=status]')`, 'Newsletter rejects empty email');
  await ev(
    `const input=document.querySelector('input[type=email]');input.value='demo@example.com';input.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('form').requestSubmit()`,
  );
  await pause(150);
  await check(
    `document.querySelector('[role=status]').textContent.includes('not been registered')`,
    'Newsletter preview feedback',
  );

  // Tablet layouts and reduced-motion preferences use the same production build.
  await call('Emulation.setDeviceMetricsOverride', {
    width: 768,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  for (const path of ['/', '/shop', '/product/prod-lumen-01', '/contact']) {
    await nav(path);
    await check('document.documentElement.scrollWidth <= innerWidth', 'No tablet overflow ' + path);
  }
  await call('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  });
  await nav('/');
  await check(
    `getComputedStyle(document.querySelector('h1').parentElement).opacity === '1'`,
    'Reduced-motion hero is visible',
  );
  await nav('/product/missing');
  await check(
    `document.body.textContent.includes('Page not found')`,
    'Invalid product has a recovery state',
  );

  await nav('/shop?category=Knitwear&sort=price-desc&q=merino');
  await check(
    `document.querySelector('input[type=search]').value==='merino' && document.querySelectorAll('a[href^="/product/"]').length===1`,
    'URL query state survives navigation',
  );
  await call('Page.reload');
  await wait(`!!document.querySelector('input[type=search]')`);
  await check(
    `document.querySelector('input[type=search]').value==='merino' && document.querySelectorAll('select')[1].value==='price-desc'`,
    'Query state survives reload',
  );
  await ev(`localStorage.removeItem('dtc-cart-storage')`);
  await nav('/product/prod-lumen-01');
  await check(
    `[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='L').disabled`,
    'Out-of-stock size is disabled',
  );
  await click('Add to Cart');
  await wait(`!!document.querySelector('[role=dialog]')`);
  await ev(`document.querySelector('[aria-label="Close cart"]').click()`);
  await ev(`document.querySelector('[aria-label="Select color Camel"]').click()`);
  await click('Add to Cart');
  await wait(`!!document.querySelector('[role=dialog]')`);
  await check(
    `document.querySelectorAll('button[aria-label^="Remove "]').length===2`,
    'Distinct variants remain separate cart lines',
  );
  await ev(`document.querySelectorAll('button[aria-label^="Increase quantity"]')[1].click()`);
  await check(
    `document.querySelectorAll('button[aria-label^="Increase quantity"]')[1].disabled`,
    'Variant quantity stops at stock limit',
  );
  await ev(`document.querySelectorAll('button[aria-label^="Remove "]')[1].click()`);
  await check(
    `document.querySelectorAll('button[aria-label^="Remove "]').length===1 && document.querySelector('[role=dialog]').textContent.includes('$495.00')`,
    'Removing a variant recalculates totals',
  );
  await click('Preview Checkout');
  await wait(`!!document.querySelector('input[autocomplete="country-name"]')`);
  await click('Review checkout');
  await check(
    `document.querySelector('input:invalid')!==null`,
    'Checkout rejects empty required fields',
  );
  await ev(
    `(()=>{const values=['demo@example.com','   ','Shopper','123 Demo Road','Lagos','Nigeria',''];document.querySelectorAll('[role=dialog] input').forEach((input,i)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,values[i]);input.dispatchEvent(new Event('input',{bubbles:true}));});})()`,
  );
  await click('Review checkout');
  await check(
    `!!document.querySelector('[aria-invalid="true"][aria-describedby]')`,
    'Zod whitespace error is linked to its field',
  );
  await ev(
    `(()=>{const input=document.querySelector('input[autocomplete="given-name"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'Demo');input.dispatchEvent(new Event('input',{bubbles:true}));const select=document.querySelector('[role=dialog] select');select.value='express';select.dispatchEvent(new Event('change',{bubbles:true}));})()`,
  );
  await click('Review checkout');
  await check(
    `document.querySelector('[role=dialog]').textContent.includes('$25.00') && document.querySelector('[role=dialog]').textContent.includes('$520.00')`,
    'Express shipping is included in review',
  );
  await click('Edit details');
  await check(
    `document.querySelector('input[autocomplete="given-name"]').value==='Demo'`,
    'Editing preserves validated details',
  );
  await click('Review checkout');
  await click('Complete preview');
  await click('Continue shopping');

  // Fault injection stays in this disposable profile and preserves the normal code path.
  await ev(`localStorage.removeItem('dtc-cart-storage')`);
  const injection = await call('Page.addScriptToEvaluateOnNewDocument', {
    source: `window.__rejectCartWrites=true; const write=Storage.prototype.setItem; Storage.prototype.setItem=function(key,value){if(window.__rejectCartWrites&&key==='dtc-cart-storage')throw new DOMException('Test quota','QuotaExceededError'); return write.call(this,key,value);};`,
  });
  await nav('/product/prod-lumen-01');
  await click('Add to Cart');
  await wait(`!!document.querySelector('[role=dialog]')`);
  await check(
    `document.querySelector('[role=dialog]').textContent.includes('browser storage is unavailable')`,
    'Storage failures are disclosed without crashing',
  );
  await ev(`document.querySelector('button[aria-label^="Increase quantity"]').click()`);
  await check(
    `document.querySelector('[role=dialog]').textContent.includes('$990.00')`,
    'Memory cart quantities still work',
  );
  await click('Preview Checkout');
  await wait(`!!document.querySelector('input[autocomplete="country-name"]')`);
  await ev(
    `(()=>{const values=['demo@example.com','Demo','Shopper','123 Demo Road','Lagos','Nigeria',''];document.querySelectorAll('[role=dialog] input').forEach((input,i)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,values[i]);input.dispatchEvent(new Event('input',{bubbles:true}));});})()`,
  );
  await click('Review checkout');
  await click('Complete preview');
  await check(
    `document.querySelector('[role=dialog]').textContent.includes('browser storage has not been confirmed')`,
    'Completion does not promise failed persistence',
  );
  await click('Continue shopping');
  await ev(`document.querySelector('button[aria-label^="Open cart"]').click()`);
  await wait(`!!document.querySelector('[role=dialog]')`);
  await ev(`window.__rejectCartWrites=false`);
  await click('Retry cart storage');
  await check(
    `JSON.parse(localStorage.getItem('dtc-cart-storage')).state.items[0].quantity===2`,
    'Retry saves the current cart',
  );
  await call('Page.removeScriptToEvaluateOnNewDocument', { identifier: injection.identifier });
  await nav('/product/prod-lumen-01');
  await ev(`document.querySelector('button[aria-label^="Open cart"]').click()`);
  await wait(`!!document.querySelector('[role=dialog]')`);
  await check(
    `document.querySelector('[role=dialog]').textContent.includes('$990.00')`,
    'Recovered cart survives reload',
  );
  await ev(`localStorage.setItem('dtc-cart-storage','{broken')`);
  await nav('/product/prod-lumen-01');
  await ev(`document.querySelector('button[aria-label^="Open cart"]').click()`);
  await wait(`!!document.querySelector('[role=dialog]')`);
  await check(
    `document.querySelector('[role=dialog]').textContent.includes('could not be restored')`,
    'Corrupt storage is disclosed',
  );
  await click('Save current cart');
  await check(
    `JSON.parse(localStorage.getItem('dtc-cart-storage')).state.items.length===0`,
    'Explicit save repairs corrupt storage',
  );
  assert.deepEqual(errors, [], 'Browser runtime errors');
  console.log('PASS no observed runtime exceptions');
} finally {
  ws?.close();
  const exited = new Promise((resolve) => chrome.once('exit', resolve));
  chrome.kill();
  await Promise.race([exited, pause(3000)]);
  if (chrome.exitCode === null) chrome.kill('SIGKILL');
  await rm(profile, { recursive: true, force: true });
}
