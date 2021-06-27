<template>
  <div class="flex flex-col bg-gray-200 justify-center items-center h-full">
    <h2 class="font-bold mb-4 text-2xl">welcome back </h2>
    <div class="flex flex-col p-5 pt-12 shadow bg-gray-300 border-none rounded">
      <input
        type="text"
        placeholder="Email"
        v-model="email"
        class="mb-4 p-2 outline-none rounded border focus:border-primary"
      >
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        class="mb-4 p-2 outline-none rounded  border focus:border-primary"
      >
      <div class="text-right flex items-center">
        <p>
          Don&apos;t have an account? <router-link :to="{ name: 'register' }"> <strong class="text-green-600">Register</strong>
          </router-link>
        </p>

        <button
          class="ml-6 p-2 rounded bg-green-600 text-white focus:outline-none outline-none"
          type="button"
          @click="performLogin"
        >Login</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    email: '',
    password: ''
  }),
  methods: {
    async performLogin () {
      var re = /\S+@\S+\.\S+/
      if (this.email === '') {
        alert(`Please Enter Email`)
      } else if (!re.test(this.email)) {
        alert(`please Enter valid Email`)
      } else if (this.password === '') {
        alert(`Please Enter Password`)
      } else {
        console.log(this.email, this.password)
        await this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        }).then(() => {
          this.$router.push({
            name: 'board'
          })
        })
      }
    }
  }
}
</script>

<style>
</style>
