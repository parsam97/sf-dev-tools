<template>
  <div>
    <h1>Hello Salesforce Dev!</h1>
    <p>This is your extension popup.</p>
    <button @click="sendTestMessage">Send Test Message</button>
  </div>
</template>

<script setup>
function sendTestMessage() {
    chrome.runtime.sendMessage({ message: "test" }, (response) => {
        console.log("Response from background", response);
        alert(response.reply);
    })
}
</script>

<style scoped>
h1 {
  color: #42b983;
  font-size: 20px;
}
button {
  margin-top: 1rem;
  padding: 0.5rem;
}
</style>
