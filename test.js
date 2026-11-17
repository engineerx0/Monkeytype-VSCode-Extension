const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Module = require('module');

console.log('Running Monkeytype extension verification tests...\n');

// 1. Verify package.json manifest
const pkgPath = path.join(__dirname, 'package.json');
assert.ok(fs.existsSync(pkgPath), 'package.json must exist');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

assert.strictEqual(pkg.name, 'monkeytype-vscode', 'Package name must match');
assert.strictEqual(pkg.main, './extension.js', 'Main entrypoint must be ./extension.js');

// Verify contributes.commands
const commands = pkg.contributes.commands;
assert.ok(Array.isArray(commands), 'commands must be an array');
const openCmd = commands.find(c => c.command === 'monkeytype.open');
assert.ok(openCmd, 'monkeytype.open command must be registered');
assert.strictEqual(openCmd.title, 'Open Monkeytype');

// Verify viewsContainers
const activityBar = pkg.contributes.viewsContainers.activitybar;
assert.ok(Array.isArray(activityBar), 'activitybar must be an array');
const container = activityBar.find(c => c.id === 'monkeytype-container');
assert.ok(container, 'monkeytype-container must be defined');

// Verify views
const views = pkg.contributes.views['monkeytype-container'];
assert.ok(Array.isArray(views), 'views for container must exist');
const sidebarView = views.find(v => v.id === 'monkeytype.sidebar');
assert.ok(sidebarView, 'monkeytype.sidebar view must be defined');

// Verify SVG icon exists
const iconPath = path.join(__dirname, pkg.contributes.viewsContainers.activitybar[0].icon);
assert.ok(fs.existsSync(iconPath), 'Activity bar icon file must exist');

// 2. Inject mock for 'vscode' module so extension.js can be tested in pure Node
const mockVscode = {
  commands: {
    executeCommand: async (cmd, ...args) => {
      mockVscode._executedCommands.push({ cmd, args });
      if (cmd === 'simpleBrowser.api.open') {
        return true;
      }
      throw new Error(`Command ${cmd} not found`);
    },
    registerCommand: (id, handler) => {
      mockVscode._registeredCommands[id] = handler;
      return { dispose: () => {} };
    }
  },
  window: {
    createStatusBarItem: (alignment, priority) => ({
      command: '',
      text: '',
      tooltip: '',
      show: () => {},
      dispose: () => {}
    }),
    showInformationMessage: () => {},
    showErrorMessage: () => {}
  },
  env: {
    openExternal: async (uri) => true
  },
  Uri: {
    parse: (str) => ({
      toString: () => str,
      scheme: str.split(':')[0],
      authority: str.replace(/^https?:\/\//, '').split('/')[0]
    })
  },
  StatusBarAlignment: {
    Left: 1,
    Right: 2
  },
  _executedCommands: [],
  _registeredCommands: {}
};

const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'vscode') {
    return mockVscode;
  }
  return originalRequire.apply(this, arguments);
};

// 3. Load extension.js and verify exports
const ext = require('./extension.js');
assert.strictEqual(ext.MONKEYTYPE_URL, 'https://monkeytype.com', 'Target URL must strictly be https://monkeytype.com');
assert.strictEqual(typeof ext.activate, 'function', 'activate must be a function');
assert.strictEqual(typeof ext.deactivate, 'function', 'deactivate must be a function');
assert.strictEqual(typeof ext.openMonkeytype, 'function', 'openMonkeytype must be a function');

// 4. Test activate lifecycle
const dummyContext = { subscriptions: [] };
ext.activate(dummyContext);
assert.strictEqual(dummyContext.subscriptions.length, 2, 'Should register command and status bar item');
assert.ok(mockVscode._registeredCommands['monkeytype.open'], 'Command monkeytype.open must be registered in context');

// 5. Test openMonkeytype execution
(async () => {
  await ext.openMonkeytype();
  assert.ok(
    mockVscode._executedCommands.some(c => c.cmd === 'simpleBrowser.api.open' && c.args[0] === 'https://monkeytype.com'),
    'Should invoke simpleBrowser.api.open with https://monkeytype.com'
  );

  console.log('✔ Package manifest validated');
  console.log('✔ Activity Bar and Sidebar view configured');
  console.log('✔ Target URL strictly https://monkeytype.com');
  console.log('✔ Extension activation and command registration passed');
  console.log('✔ openMonkeytype execution verified');
  console.log('\nAll verification tests passed successfully!');
})();
