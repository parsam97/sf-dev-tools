<template>
  <div>
    <h1>Tree-Query</h1>
    <p>Welcome to the Tree-Query operation.</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { rest } from '@src/sfConn.js'

onMounted(async () => {
  try {
    const queryResult = await rest('/services/data/v60.0/query/?q=SELECT+Name+FROM+Account');
    console.log('Accounts:', queryResult);
  } catch (error) {
    console.error('REST API call failed:', error);
  }
});
</script>
