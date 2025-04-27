import { sendMessage } from "../utils/messaging";

let sessionId = null;
let instanceHostname = null;

export async function getSession() {
    if (sessionId && instanceHostname) {
        return { sessionId, instanceHostname };
    }

    const sfHost = await sendMessage({ message: 'askSfHost' });

    if (!sfHost) {
        throw new Error("Salesforce host not detected");
    }

    const session = await sendMessage({ message: 'getSession', sfHost });

    if (!session || !session.key) {
        throw new Error("Could not get Salesforce session");
    }

    sessionId = session.key;
    instanceHostname = session.hostname;

    return { sessionId, instanceHostname };
}
