<template>
  <div>
    <h1>Hello Salesforce Dev!</h1>
    <p>Salesforce Session:</p>
    <pre>sessionId: {{ session.sessionId }}</pre>
    <pre>Instance Hostname: {{ session.instanceHostname }}</pre>

    <p>Operations available to you</p>
    <ul class="operations">
      <li v-for="operation in operations" :key="operation.key">
        <button @click="openOperation(operation)">{{ operation.label }}</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSession } from './sfConn';
import { operations } from "./operations"

const session = ref({})

onMounted(async () => {
  try {
    const { sessionId, instanceHostname } = await getSession();
    console.log('Session:', sessionId, 'Instance Hostname:', instanceHostname);
    session.value = { sessionId, instanceHostname }
    // now you can do whatever you want, REST API call etc
  } catch (error) {
    console.error('Failed to get Salesforce session', error);
  }
});

function openOperation(operation) {
  const operationLink = `operation.html?op=${operation.key}`
  let pageUrl;
  if (chrome.runtime) {
    pageUrl = chrome.runtime.getURL(operationLink)
    chrome.tabs.create({ url: pageUrl })
  } else {
    pageUrl = `${window.location.origin}/${operationLink}`;
    window.location.href = pageUrl;
  }
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
ul.operations li {
  list-style:none
}
pre {
  background: #eee;
  padding: 1rem;
  border-radius: 8px;
}
</style>
