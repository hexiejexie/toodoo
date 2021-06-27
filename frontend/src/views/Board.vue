<template>
  <div
    class="p-4  h-full relative"
    :class="isTaskOpen? 'overflow-x-hidden': 'overflow-auto'"
  >
    <div class="mb-4 flex items-end justify-end">
      <div
        class="ml-8 relative"
        v-if="isAuthenticated"
      >
        <button
          class="block bg-white h-14 w-14 py-2 rounded-full overflow-hidden focus:outline-none"
          aria-expanded="true"
          aria-haspopup="true"
          @blur="isExpanded = false"
          @click="isExpanded = !isExpanded"
        >
          <!--  can show user image here -->
          {{ getLoggedInUser.name }}
        </button>
        <!-- Dropdown Body -->

        <transition
          enter-active-class="transition ease-out duration-100"
          enter-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            class="absolute text-left right-0 w-40 mt-2 py-2 bg-white border rounded shadow-xl"
            role="menu"
            v-show="isExpanded"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <a class="transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded">{{ getLoggedInUser.name }}</a>
            <div class="py-2"></div>
            <a
              href="javascript:void(0)"
              @click="performLogout"
              class="transition-colors duration-200 block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              Logout
            </a>
          </div>
        </transition>
        <!-- // Dropdown Body -->
      </div>
    </div>
    <div class="flex flex-row items-start">
      <BoardColumn
        v-for="(column, $columnIndex) of board.columns"
        :key="$columnIndex"
        :column="column"
        :columnIndex="$columnIndex"
        :board="board"
      />

      <div class="column flex rounded">
        <input
          type="text"
          class="p-2 mr-2 flex-grow rounded"
          placeholder="New Task"
          v-model="newColumnName"
          @keyup.enter="createColumn"
        >
      </div>
    </div>

    <div
      class="absolute top-0 left-0 right-0 inset-0 backdrop-filter backdrop-blur-sm"
      v-if="isTaskOpen"
    >
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import BoardColumn from '@/components/BoardColumn'

export default {
  components: { BoardColumn },
  data: () => ({
    newColumnName: '',
    isExpanded: false
  }),
  async created () {
    if (this.isAuthenticated) {
      await this.$axios.get('/user/').then(({ data }) => {
        this.$store.commit('SET_USER', data.user)
      })
      await this.getColumns()
    }
  },
  computed: {
    ...mapState(['board']),
    ...mapGetters(['isAuthenticated', 'getLoggedInUser']),
    isTaskOpen () {
      return this.$route.name === 'task'
    }
  },
  methods: {
    async getColumns () {
      await this.$store.dispatch('getColumns')
    },
    performLogout () {
      localStorage.clear()
      this.$router.push({ name: 'login' })
    },
    async createColumn () {
      let max = this.board.columns.length > 0 ? Math.max.apply(Math, this.board.columns.map(function(o) { return o.order; })) : 0;
      await this.$axios.post('/lists', {
        name: this.newColumnName,
        order: max+1 || 0
      })
      await this.getColumns()
      // this.$store.commit('CREATE_COLUMN', {
      //   name: this.newColumnName
      // })

      this.newColumnName = ''
    }
  }
}
</script>

<style lang="css" scoped>
.task-bg {
  background: rgba(0, 0, 0, 0.5);
}
</style>
