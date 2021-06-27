<template>
  <div
    id="app"
    class="bg-gradient-to-r from-green-800 to-green-400 relative"
  >
    <router-view />
  </div>
</template>

<style>
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

body,
html {
  height: 100%;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

.container {
  @apply mx-auto;
}
</style>

<style lang="scss">
* {
  &::-webkit-scrollbar {
    border-radius: 5px;
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgb(118, 118, 199);

    border-radius: 5px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: rgb(174, 170, 170);
  }
}
</style>
