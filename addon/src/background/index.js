import { handleMessages } from './messaging.js'
import { handleCommands } from './commands.js'

chrome.runtime.onMessage.addListener(handleMessages);
chrome.commands?.onCommand.addListener(handleCommands);

chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === "install") {
        // console.log('Installed script run');
    }
});