// Detects if we are on a Salesforce page and initializes communication

function isSalesforcePage() {
    const host = location.host

    return document.querySelector("body.sfdcBody, body.ApexCSIPage, #auraLoadingBox, #studioBody, #flowContainer")
        || host.endsWith("visualforce.com")
}

function notifyBackgroundAboutSalesforceHost() {
    chrome.runtime.sendMessage({ message: "getSfHost", url: location.href });
}

if (isSalesforcePage()) {
    notifyBackgroundAboutSalesforceHost();
}