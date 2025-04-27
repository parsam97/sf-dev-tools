<template>
  <div>
    <h1>Hello Salesforce Dev!</h1>
    <p>Operations available to you</p>
    <ul class="operations">
      <li v-for="operation in operations" :key="operation.key">
        <button @click="openOperation(operation)">{{ operation.label }}</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { operations } from "./operations"

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
</style>
