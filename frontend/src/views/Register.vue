<template>
  <div class="flex flex-col bg-gray-200 justify-center items-center h-full">
    <h2 class="font-bold mb-4 text-2xl">hello, I am</h2>
    <div class="flex flex-col p-5 pt-12 shadow bg-gray-300 border-none rounded">
      <input
        type="text"
        v-model="name"
        placeholder="Name"
        class="mb-4 p-2 outline-none rounded border focus:border-primary"
      >
      <input
        type="text"
        v-model="email"
        placeholder="Email"
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
          Already have an account?  <router-link :to="{ name: 'login' }"> <strong class="text-green-600">Login</strong>
          </router-link>
        </p>

        <button
          class="ml-6 p-2 rounded bg-green-600 text-white focus:outline-none outline-none"
          type="button"
          @click="performRegistration"
        >Register</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    name: '',
    email: '',
    password: ''
  }),
  methods: {
    async performRegistration () {
      var re = /\S+@\S+\.\S+/
      if (this.email === '') {
        alert(`Please Enter Email`)
      } else if (this.name === '') {
        alert(`Please Enter name field`)
      } else if (!re.test(this.email)) {
        alert(`please Enter valid Email`)
      } else if (this.password === '') {
        alert(`Please Enter Password`)
      } else {
        console.log(`data ${this.name} ${this.email} ${this.password}`)
        await this.$store.dispatch('register', {
          name: this.name,
          email: this.email,
          password: this.password
        }).then(() => {
          this.$router.push({
            name: 'login'
          })
        })
      }
    }
  }
}
</script>

<style>
</style>
