<template>
  <AppDrop @drop="moveTaskOrColumn">
    <AppDrag
      class="column p-2 mr-4 text-left shadow rounded bg-gray-100"
      :transferData="{
        type: 'column',
        fromColumnIndex: columnIndex,
        columnId: column._id
      }"
    >
      <div class="flex items-center justify-between mb-2 font-bold">
        <div class="font-bold">
          {{ column.name }}
        </div>
        <div class="mr-2 relative">
          <button
            class="block font-bold focus:outline-none"
            aria-expanded="true"
            aria-haspopup="true"
            @blur="isExpanded = false"
            @click="isExpanded = !isExpanded"
          >
            ...
          </button>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              class="absolute text-left right-0 w-44 mt-1 p-2 bg-white border rounded shadow-xl"
              role="menu"
              v-show="isExpanded"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <a
                href="javascript:void(0)"
                @click="deleteList"
                class="transition-colors duration-200 rounded block px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-100"
              >
                Delete Column
              </a>
            </div>
          </transition>
          <!-- // Dropdown Body -->
        </div>
      </div>
      <div class="list-reset">
        <ColumnTask
          v-for="(task, $taskIndex) of filteredCards"
          :key="$taskIndex"
          :task="task"
          :taskIndex="$taskIndex"
          :column="column"
          :columnIndex="columnIndex"
          :board="board"
        />
        
        <input
          type="text"
          class="block p-2 w-full bg-transparent"
          placeholder="+ Enter new task"
          @keyup.enter="createTask($event, column.order || [])"
        />
      </div>
    </AppDrag>
  </AppDrop>
</template>

<script>
import ColumnTask from './ColumnTask'
import AppDrag from './AppDrag'
import AppDrop from './AppDrop'
import movingTasksAndColumnsMixin from '@/mixins/movingTasksAndColumnsMixin'

export default {
  name: 'BoardColumn',
  data: () => ({
    isExpanded: false
  }),
  components: {
    ColumnTask,
    AppDrag,
    AppDrop
  },
  mixins: [movingTasksAndColumnsMixin],
  computed: {
    filteredCards () {
      if (this.column && this.column.cards) {
        return this.column.cards.filter((card) => card._id)
      }

      return []
    }
  },
  methods: {
    async deleteList () {
      if (this.column && this.column._id) {
        await this.$axios.delete(`/lists/${this.column._id}`)
        await this.getAllColumns()
      }
    },
    pickupColumn (e, fromColumnIndex) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.dropEffect = 'move'

      e.dataTransfer.setData('from-column-index', fromColumnIndex)
      e.dataTransfer.setData('type', 'column')
    },
    async createTask (e, cards) {
      await this.$axios.post('/cards', {
        name: e.target.value,
        order: cards.length || 0,
        listId: this.column._id
      })
      await this.getAllColumns()
      // this.$store.commit('CREATE_TASK', {
      //   cards,
      //   name: e.target.value
      // })
      e.target.value = ''
    },
    async getAllColumns () {
      await this.$store.dispatch('getColumns')
    }
  }
}
</script>

<style lang="css">
.column {
  min-width: 350px;
}
</style>
