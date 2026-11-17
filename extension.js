const vscode = require('vscode');

const MONKEYTYPE_URL = 'https://monkeytype.com';

/**
 * Opens Monkeytype using a 3-tier resilient browser strategy:
 * 1. simpleBrowser.api.open (programmatic API for integrated browser)
 * 2. simpleBrowser.show (built-in command for integrated browser)
 * 3. vscode.env.openExternal (documented public fallback to system browser)
 */
async function openMonkeytype() {
  // Tier 1: Try the programmatic Simple Browser API
  try {
    await vscode.commands.executeCommand('simpleBrowser.api.open', MONKEYTYPE_URL);
    return;
  } catch {
    // Proceed to Tier 2
  }

  // Tier 2: Try the user-facing simpleBrowser.show command
  try {
    await vscode.commands.executeCommand('simpleBrowser.show', MONKEYTYPE_URL);
    return;
  } catch {
    // Proceed to Tier 3
  }

  // Tier 3: Fall back to opening in the system's external browser
  try {
    const uri = vscode.Uri.parse(MONKEYTYPE_URL);
    const success = await vscode.env.openExternal(uri);
    if (success) {
      vscode.window.showInformationMessage(
        'Opened Monkeytype in your default browser because the integrated browser is unavailable.'
      );
    } else {
      vscode.window.showErrorMessage(
        'Unable to open Monkeytype in the external browser.'
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Failed to open Monkeytype: ${message}`);
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Register Command
  const openCommand = vscode.commands.registerCommand(
    'monkeytype.open',
    openMonkeytype
  );
  context.subscriptions.push(openCommand);

  // Register Status Bar Quick-Action
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = 'monkeytype.open';
  statusBarItem.text = '$(keyboard) Monkeytype';
  statusBarItem.tooltip = 'Open Monkeytype typing test';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
}

function deactivate() {
  // No persistent background tasks or state to clean up
}

module.exports = {
  MONKEYTYPE_URL,
  openMonkeytype,
  activate,
  deactivate
};
