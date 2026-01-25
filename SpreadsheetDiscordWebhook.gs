/**
 * Google Apps Script - Discord Webhook Notification on Spreadsheet Update
 *
 * Spreadsheet ID: 1yTtqOS93tIewPoL-bxwZCC7wdDHXwUbX_YEAzbCBEqE
 * Discord Webhook: Configured below
 */

// Discord Webhook URL
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1420758179956002939/TulDuRKu1Ajoh7LUuQXRyN5Z7E2L6TfpzZ6tH9VDnOBvlZ-jbbIcESHvBk-2XJ0kYuUg';

/**
 * Trigger function that runs when the spreadsheet is edited
 * This needs to be set up as an installable trigger
 */
function onEditTrigger(e) {
  try {
    const sheet = e.source.getActiveSheet();
    const range = e.range;
    const oldValue = e.oldValue || '(empty)';
    const newValue = e.value || '(empty)';
    const user = Session.getActiveUser().getEmail() || 'Unknown User';

    const payload = {
      embeds: [{
        title: '📊 Spreadsheet Updated',
        color: 3447003, // Blue color
        fields: [
          {
            name: 'Sheet',
            value: sheet.getName(),
            inline: true
          },
          {
            name: 'Cell',
            value: range.getA1Notation(),
            inline: true
          },
          {
            name: 'Changed By',
            value: user,
            inline: true
          },
          {
            name: 'Previous Value',
            value: String(oldValue).substring(0, 1024) || '(empty)',
            inline: false
          },
          {
            name: 'New Value',
            value: String(newValue).substring(0, 1024) || '(empty)',
            inline: false
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Spreadsheet Webhook Notification'
        }
      }]
    };

    sendToDiscord(payload);
  } catch (error) {
    console.error('Error in onEditTrigger:', error);
  }
}

/**
 * Trigger function for larger changes (multiple cells, imports, etc.)
 */
function onChangeTrigger(e) {
  try {
    const changeType = e.changeType;

    // Only notify for specific change types
    const notifyTypes = ['INSERT_ROW', 'INSERT_COLUMN', 'REMOVE_ROW', 'REMOVE_COLUMN', 'INSERT_GRID', 'REMOVE_GRID', 'OTHER'];

    if (notifyTypes.includes(changeType)) {
      const payload = {
        embeds: [{
          title: '📊 Spreadsheet Structure Changed',
          color: 15844367, // Gold color
          fields: [
            {
              name: 'Change Type',
              value: changeType.replace(/_/g, ' '),
              inline: true
            },
            {
              name: 'Timestamp',
              value: new Date().toLocaleString(),
              inline: true
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'Spreadsheet Webhook Notification'
          }
        }]
      };

      sendToDiscord(payload);
    }
  } catch (error) {
    console.error('Error in onChangeTrigger:', error);
  }
}

/**
 * Send payload to Discord webhook
 */
function sendToDiscord(payload) {
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, options);

  if (response.getResponseCode() !== 204 && response.getResponseCode() !== 200) {
    console.error('Discord webhook failed:', response.getContentText());
  }
}

/**
 * Test function to verify the webhook is working
 * Run this manually to test the connection
 */
function testWebhook() {
  const payload = {
    embeds: [{
      title: '✅ Webhook Test Successful',
      description: 'Your Google Spreadsheet is now connected to Discord!',
      color: 5763719, // Green color
      fields: [
        {
          name: 'Spreadsheet',
          value: SpreadsheetApp.getActiveSpreadsheet().getName(),
          inline: true
        },
        {
          name: 'Status',
          value: 'Connected',
          inline: true
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Spreadsheet Webhook Notification'
      }
    }]
  };

  sendToDiscord(payload);
  SpreadsheetApp.getUi().alert('Test message sent to Discord! Check your channel.');
}

/**
 * Creates the necessary triggers for the spreadsheet
 * Run this function once to set up the triggers
 */
function setupTriggers() {
  // Remove existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onEditTrigger' ||
        trigger.getHandlerFunction() === 'onChangeTrigger') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new triggers
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  // Trigger for cell edits
  ScriptApp.newTrigger('onEditTrigger')
    .forSpreadsheet(spreadsheet)
    .onEdit()
    .create();

  // Trigger for structural changes
  ScriptApp.newTrigger('onChangeTrigger')
    .forSpreadsheet(spreadsheet)
    .onChange()
    .create();

  SpreadsheetApp.getUi().alert('Triggers set up successfully! The spreadsheet will now notify Discord on updates.');
}

/**
 * Adds a custom menu to the spreadsheet for easy access
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Discord Webhook')
    .addItem('Test Webhook', 'testWebhook')
    .addItem('Setup Triggers', 'setupTriggers')
    .addToUi();
}
