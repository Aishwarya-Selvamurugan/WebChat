chrome.runtime.onInstalled.addListener(() => {
    console.log('Hello World!')
})



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getActiveTabURL') {
      // Query the active tab in the current window
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTabURL = tabs[0]?.url;  // Get the URL of the active tab
        if (activeTabURL) {
          console.log(activeTabURL);
            
          sendResponse({ url: activeTabURL });  // Send the URL back to the content script
        } else {
          console.log("no");
          sendResponse({ url: null });  // No active tab URL found
        }
      });
      return true;  // Keep the message channel open for asynchronous response
    }
  });
  