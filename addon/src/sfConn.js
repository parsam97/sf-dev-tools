import { sendMessage } from "../utils/messaging";

let sessionId = null;
let instanceHostname = null;

export async function getSession() {
    if (sessionId && instanceHostname) {
        return { sessionId, instanceHostname };
    }

    const sfHost = await sendMessage({ message: 'askSfHost' });
    if (!sfHost) { throw new Error("Salesforce host not detected"); }

    const session = await sendMessage({ message: 'getSession', sfHost });
    if (!session || !session.key) { throw new Error("Could not get Salesforce session"); }

    return { sessionId: session.key, instanceHostname: session.hostname };
}

export async function rest(url, options = {}) {
    const { sessionId, instanceHostname } = await getSession();

    return sendMessage({
        message: 'restRequest',
        url: new URL(url, `https://${instanceHostname}`).toString(),
        method: options.method || 'GET',
        headers: {
            Authorization: `Bearer ${sessionId}`,
            Accept: 'application/json; charset=UTF-8',
            ...(options.body ? { 'Content-Type': 'application/json; charset=UTF-8' } : {})
        },
        body: options.body ? JSON.stringify(options.body) : undefined
    })
}