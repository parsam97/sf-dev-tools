export function handleMessages(request, sender, sendResponse) {
    if (request.message == "test") {
        console.log("Received message from popup");
        sendResponse({ reply: "Hello from background!" });
        return true;
    }
}
