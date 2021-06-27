export default {
  props: {
    column: {
      type: Object,
      required: true
    },
    columnIndex: {
      type: Number,
      required: true
    },
    board: {
      type: Object,
      required: true
    }
  },
  methods: {
    moveTaskOrColumn (transferData) {
      if (transferData.type === 'task') {
        this.moveTask(transferData)
      } else {
        this.moveColumn(transferData)
      }
    },
    async moveTask ({ fromColumnIndex, fromTaskIndex }) {
      const fromTasks = this.board.columns[fromColumnIndex].cards

      this.$store.commit('MOVE_TASK', {
        fromTasks,
        fromTaskIndex,
        toTasks: this.column.cards,
        toTaskIndex: this.taskIndex
      })
      const previousColumnListId = this.board.columns[fromColumnIndex]._id
      const data = this.column.cards.find(card => card.listId !== previousColumnListId)
      const cardShifted = this.column.cards.find(card => card.listId === previousColumnListId)
      const newListId = data.listId
      const cardId = cardShifted._id
      console.log(newListId,   "          ==========", cardId)
      await this.$axios.patch(`/cards/${cardId}`, {
        listId: newListId
      })
    },
    moveColumn ({ fromColumnIndex }) {
      this.$store.commit('MOVE_COLUMN', {
        fromColumnIndex,
        toColumnIndex: this.columnIndex
      })
    }
  }
}
