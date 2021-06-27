<template>
  <AppDrop @drop="moveTaskOrColumn">
    <AppDrag
      class="flex items-center flex-wrap  mb-2 bg-white shadow rounded p-3 border border-white no-underline cursor-move"
      :transferData="{
        type: 'task',
        fromColumnIndex: columnIndex,
        fromTaskIndex: taskIndex,
        columnData: column,
      }"
      @click.native="goToTask(task)"
    >
      <div class="flex justify-between w-full">
        <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">
          {{ task.name }}
        </p>
        <div class="w-6 h-6 rounded-full font-semibold bg-indigo-100 text-indigo-700 text-center" v-if="userName" :title="userName">
          {{ userName.charAt(0) }}
        </div>
      </div>
      <div
        class="flex mt-1 justify-between items-center"
        v-if="task.description"
      >
        <span class="text-sm text-gray-600">{{ task.description }}</span>
        <!-- TODO: use this component to show badges/labels on cards -->
        <!-- <badge :color="badgeColor('default')">{{ task.type || 'temp' }}</badge> -->
      </div>
    </AppDrag>
  </AppDrop>
</template>

<script>
import movingTasksAndColumnsMixin from '@/mixins/movingTasksAndColumnsMixin'
import AppDrag from './AppDrag'
import AppDrop from './AppDrop'
// import Badge from './Badge.vue'
export default {
  name: 'ColumnTask',
  mixins: [
    movingTasksAndColumnsMixin
  ],
  components: {
    // Badge,
    AppDrag,
    AppDrop
  },
  props: {
    task: {
      type: Object,
      required: true
    },
    taskIndex: {
      type: Number,
      required: true
    }
  },
  computed: {
    userName () {
      if (this.task.user && this.task.user.length) {
        return this.task.user[0].name
      }
      return ''
    }
  },
  methods: {
    goToTask (task) {
      this.$router.push({ name: 'task', params: { id: task._id } })
    }
  }
}
</script>
