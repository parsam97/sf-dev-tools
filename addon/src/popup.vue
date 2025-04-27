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
  const pageUrl = chrome.runtime.getURL(`operation.html?op=${operation.key}`)
  console.log('creating tab to', pageUrl);
  chrome.tabs.create({ url: pageUrl })
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
