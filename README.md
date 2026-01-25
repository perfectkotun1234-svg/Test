# Google Spreadsheet to Discord Webhook

This script sends Discord notifications whenever your Google Spreadsheet is updated.

## Configuration

- **Spreadsheet**: https://docs.google.com/spreadsheets/d/1yTtqOS93tIewPoL-bxwZCC7wdDHXwUbX_YEAzbCBEqE/edit
- **Discord Webhook**: Pre-configured in the script

## Setup Instructions

### Step 1: Open Apps Script Editor

1. Open your Google Spreadsheet
2. Go to **Extensions** → **Apps Script**

### Step 2: Add the Script

1. Delete any existing code in the editor
2. Copy the entire contents of `SpreadsheetDiscordWebhook.gs` and paste it into the editor
3. Click the **Save** icon (or press Ctrl+S)
4. Name your project (e.g., "Discord Webhook")

### Step 3: Authorize the Script

1. In the Apps Script editor, select `setupTriggers` from the function dropdown
2. Click **Run**
3. You'll be prompted to authorize the script:
   - Click **Review permissions**
   - Select your Google account
   - Click **Advanced** → **Go to [project name] (unsafe)**
   - Click **Allow**

### Step 4: Test the Connection

1. Refresh your spreadsheet
2. You should see a new menu item: **Discord Webhook**
3. Click **Discord Webhook** → **Test Webhook**
4. Check your Discord channel for the test message

## Features

- **Cell Edit Notifications**: Shows which cell was changed, old value, new value, and who made the change
- **Structure Change Notifications**: Alerts when rows/columns are added or removed
- **Custom Menu**: Easy access to test and setup functions

## Notification Examples

### Cell Edit
```
📊 Spreadsheet Updated
Sheet: Sheet1
Cell: A1
Changed By: user@example.com
Previous Value: Hello
New Value: World
```

### Structure Change
```
📊 Spreadsheet Structure Changed
Change Type: INSERT ROW
Timestamp: 1/25/2026, 7:00:00 PM
```

## Troubleshooting

**Webhook not sending?**
- Run `testWebhook` to verify the connection
- Check that triggers are set up via `setupTriggers`

**Permission errors?**
- Re-run `setupTriggers` and complete the authorization flow

**Duplicate notifications?**
- Run `setupTriggers` again - it removes duplicates automatically
