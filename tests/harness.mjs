/* Minimal test harness. No framework — the project has no build step and no
   runtime dependencies in the browser, and the tests should not be the first
   thing to break that. */
let current = '';
const failures = [];
let passed = 0;

export async function suite(name, fn) {
  console.log('\n' + name);
  await fn();
}

export async function test(name, fn) {
  current = name;
  try {
    await fn();
    passed += 1;
    console.log('  ✓ ' + name);
  } catch (err) {
    failures.push({ name, message: err.message });
    console.log('  ✗ ' + name + '\n      ' + err.message.split('\n').join('\n      '));
  }
}

export function assert(cond, message) {
  if (!cond) throw new Error(message || 'assertion failed');
}

export function equal(actual, expected, message) {
  if (actual !== expected) {
    throw new Error((message ? message + ': ' : '') + `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

export function report() {
  console.log(`\n${passed} passed, ${failures.length} failed`);
  return failures.length;
}
