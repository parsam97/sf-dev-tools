export function handleMessages(request, sender, sendResponse) {
    console.log("request", request);
    sendResponse({
        success: true,
        reply: `Request for ${request.operation}`
    });
    return true;
}
