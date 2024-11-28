<script setup lang="ts">
import ChatRoom from './components/ChatRoom.vue'
</script>

<template>
  <div class="app">
    <header>
      <h1>Vue WebSocket Chat</h1>
    </header>
    <main>
      <ChatRoom />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f0f2f5;
}

.app {
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 20px;
}

h1 {
  color: #1976d2;
}
</style>
