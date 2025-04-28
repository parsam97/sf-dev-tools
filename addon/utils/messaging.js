import { getMockRestResponse } from '@mock/restMocks';

let devMockSession = {
    key: '00Dd2000001GWg5!AQEAQMzHPrhecZq9ijnfWRqPQJNs2cyQX94Ar1bBK.NcLllr4.bmVyL415dlWVIj73ZMJ6K.f0Vq8B1VJujGN.dfpLyOSzrx',
    hostname: 'justpracticing-dev-ed.develop.my.salesforce.com'
};

function isExtensionRuntimeAvailable() {
    return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage;
}

function isDevMode() {
    return location.origin.includes('localhost');
}

export function sendMessage(message) {
    if (isExtensionRuntimeAvailable()) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        });
    }

    if (isDevMode()) {
        return simulateDevMessage(message);
    }

    throw new Error('No extension runtime and not in dev mode');
}

function simulateDevMessage(message) {
    console.warn('[DevMode] Simulating message', message);

    switch (message.message) {
        case 'askSfHost':
            return Promise.resolve(devMockSession.hostname);

        case 'getSession':
            return Promise.resolve({
                key: devMockSession.key,
                hostname: devMockSession.hostname
            });

        case 'restRequest':
            return Promise.resolve(getMockRestResponse(message.url, {
                method: message.method,
                body: message.body ? JSON.parse(message.body) : undefined
            }));

        default:
            console.error('No dev mock for message', message.message);
            return Promise.reject(new Error(`No dev mock for message: ${message.message}`));
    }
}