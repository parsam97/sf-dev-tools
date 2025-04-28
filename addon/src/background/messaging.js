let sfHost = null;

function handleGetSfHost(request, sender, sendResponse) {
    const currentDomain = new URL(request.url).hostname

    chrome.cookies.get({ url: request.url, name: "sid", storeId: sender.tab?.cookieStoreId }, cookie => {
        if (!cookie || currentDomain.endsWith(".mcas.ms")) {
            sfHost = currentDomain;
            sendResponse(currentDomain);
            return;
        }

        const [orgId] = cookie.value.split("!")
        const orderedDomains = [
            "salesforce.com",
            "cloudforce.com",
            "salesforce.mil",
            "cloudforce.mil",
            "sfcrmproducts.cn"
        ]

        orderedDomains.forEach(domain => {
            chrome.cookies.getAll({ name: "sid", domain, secure: true, storeId: sender.tab?.cookieStoreId }, cookies => {
                const sessionCookie = cookies.find(c => c.value.startsWith(orgId + "!"));
                if (sessionCookie) {
                    sfHost = sessionCookie.domain;
                    sendResponse(sessionCookie.domain);
                }
            })
        })
    })

    return true // allow async sendResponse
}

function handleAskSfHost(_, __, sendResponse) {
    sendResponse(sfHost);
}

function handleGetSession(request, sender, sendResponse) {
    chrome.cookies.get({ url: `https://${request.sfHost}`, name: "sid", storeId: sender.tab?.cookieStoreId }, sessionCookie => {
        if (!sessionCookie) {
            sendResponse(null)
            return
        }

        const session = {
            key: sessionCookie.value,
            hostname: sessionCookie.domain
        }
        sendResponse(session)
    })

    return true
}

function handleRestRequest(request, sender, sendResponse) {
    fetch(request.url, {
        method: request.method || 'GET',
        headers: request.headers,
        body: request.body,
        credentials: 'include'
    })
        .then(async response => {
            const contentType = response.headers.get('content-type') || '';
            let result;

            if (contentType.includes('application/json')) {
                result = await response.json();
            } else {
                result = await response.text();
            }

            sendResponse({ status: response.status, body: result });
        })
        .catch(error => {
            console.error('Rest API call failed', error);
            sendResponse({ error: error.message || 'Unknown error' });
        });

    return true;
}

const messageHandlers = {
    getSfHost: handleGetSfHost,
    askSfHost: handleAskSfHost,
    getSession: handleGetSession,
    restRequest: handleRestRequest,
}

export function handleMessages(request, sender, sendResponse) {
    if (messageHandlers[request.message]) {
        return messageHandlers[request.message](request, sender, sendResponse)
    }

    return true
}