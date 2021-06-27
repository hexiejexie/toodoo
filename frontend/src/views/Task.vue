<template>
  <div class="
      task-view
      bg-gray-50
      m-16
      mx-auto
      py-4
      text-left
      rounded
      shadow
    ">
    <div
      class="float-right mr-4 cursor-pointer"
      @click="close()"
    > &#10006; </div>
    <div class="flex flex-col flex-grow items-start justify-between px-4">
      <input
        type="text"
        class="
          p-2
          overflow-auto
          text-xl
          font-bold
          rounded
          outline-none
          w-full
          bg-gray-100
          focus:bg-white
          focus:shadow-lg
        "
        v-model="task.name"
      />

      <div class="mt-2  w-full">
        <label
          :for="`textarea-${task._id}`"
          class="font-bold text-xl"
        >Description</label>
        <textarea
          :id="`textarea-${task._id}`"
          class="
          relative
          w-full
          bg-transparent
          px-2
          border
          mt-2
          outline-none
          leading-normal
          rounded
          bg-gray-100
          focus:bg-white
          focus:border-primary
          focus:shadow-lg
          description
        "
          v-model="task.description"
        />
      </div>
      <div class="mt-4 block text-right w-full">
        <button
          @click="close"
          type="button"
          class="btn bg-yellow-500 hover:bg-yellow-600 rounded text-white mr-2 p-2"
        >Close</button>
        <button
          @click="deleteTask"
          type="button"
          class="btn bg-red-500 hover:bg-red-600 rounded text-white mr-2 p-2"
        >Delete</button>
        <button
          type="button"
          @click="saveTask()"
          class="btn bg-green-500 hover:bg-green-600 rounded  text-white p-2"
        >Save Task</button>
      </div>
      <div class="block mt-4 w-full border-t-2 border-accent">
        <div class="mt-4 flex w-full justify-between">
          <input
            type="text"
            class="
          p-2
          outline-none
          overflow-auto
          text-xl
          rounded
          w-3/4
          text-black
          bg-gray-100
          focus:shadow-lg

        "
            placeholder="Comment"
            v-model="newComment"
          />
          <button
            type="button"
            @click="postComment()"
            class="btn bg-green-500 hover:bg-green-600 rounded  text-white p-2"
          >Post Comment</button>
        </div>
        <div
          class="block mt-6 w-full border-t-2 border-secondary"
          v-if="allComments.length"
        >
          <div
            class="mt-2"
            v-for="(comment, key) in allComments"
            :key="key"
          >
            <div class="flex justify-between">
              <p class="text-lg">
                {{ comment.content }}
              </p>
              <span class="text-blue-600 ml-2 font-bold">{{ comment.userName }}</span>
            </div>
            <span class="font-bold mt-1">{{ comment.createdAt }}</span>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Task',
  data: () => ({
    task: '',
    comments: '',
    newComment: ''
  }),
  computed: {
    ...mapGetters(['getTask']),
    allComments () {
      if (this.comments && this.comments.length) {
        return this.comments.map((comment) => {
          comment.userName = comment.userId.name
          comment.createdAt = new Date(comment.createdAt).toLocaleString()
          delete comment.userId
          return comment
        })
      }
      return []
    }
  },
  async created () {
    if (this.$route.params.id) {
      const that = this
      await this.$axios.get(`/cards/${this.$route.params.id}`).then(async ({ data }) => {
        that.task = data
        if (this.task && this.task._id) {
          await this.getComments()
        }
      })
    }
  },
  methods: {
    close () {
      this.$router.push({ name: 'board' })
    },
    async getComments () {
      await this.$axios.get(`/cards/${this.task._id}/comments`).then(({ data }) => {
        this.comments = data
      })
    },
    async postComment () {
      if (!this.newComment) return
      await this.$axios.post(`/cards/${this.task._id}/comments`, {
        content: this.newComment
      }).then(async () => {
        await this.getComments()
        this.newComment = ''
      })
    },
    async saveTask () {
      const { name, listId, order, description } = this.task

      await this.$axios.patch(`/cards/${this.$route.params.id}`, {
        name, listId, order, description
      })
      await this.$store.dispatch('getColumns')
      this.close()
    },
    async deleteTask () {
      await this.$axios.delete(`/cards/${this.task._id}`)
      await this.$store.dispatch('getColumns')
      this.close()
    },
    updateTaskProperty (e, key) {
      this.$store.commit('UPDATE_TASK', {
        task: this.task,
        key,
        value: e.target.value
      })
    }
  }
}
</script>

<style lang="scss">
.task-view {
  max-width: 700px;
  .description {
    min-height: 150px;
    max-height: 150px;
  }
}
</style>
