import Vue from 'vue'
import Vuex from 'vuex'
import defaultBoard from '../default-board'
import {
  saveStatePlugin,
  uuid
} from '../utils'

Vue.use(Vuex)

const board = JSON.parse(localStorage.getItem('board')) || defaultBoard

export default new Vuex.Store({
  plugins: [saveStatePlugin],
  state: {
    board,
    user: {},
    token: ''
  },
  getters: {
    getTask (state) {
      return (id) => {
        for (const column of state.board.columns) {
          for (const task of column.cards) {
            if (task.id === id) {
              return task
            }
          }
        }
      }
    },
    getLoggedInUser (state) {
      return state.user
    },
    isAuthenticated: state => state.token || localStorage.getItem('token')
  },
  actions: {
    login ({
      commit
    }, payload) {
      return this._vm.$axios.post('/user/login', payload).then(({
        data
      }) => {
        commit('SET_TOKEN', data.token)
        commit('SET_USER', data.user)
      })
    },
    register ({
      commit
    }, payload) {
      return this._vm.$axios.post('/user/register', payload)
    },
    getColumns ({
      commit
    }) {
      return this._vm.$axios.get('/lists').then(({
        data
      }) => {
        commit('SET_COLUMNS', data)
      })
    }
  },
  mutations: {
    SET_TOKEN (state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER (state, user) {
      state.user = user
    },
    SET_COLUMNS (state, columns) {
      state.board.columns = columns
    },
    CREATE_TASK (state, {
      cards,
      name
    }) {
      cards.push({
        name,
        id: uuid(),
        description: ''
      })
    },
    CREATE_COLUMN (state, {
      name
    }) {
      state.board.columns.push({
        name,
        cards: []
      })
    },
    UPDATE_TASK (state, {
      task,
      key,
      value
    }) {
      task[key] = value
    },
    MOVE_TASK (state, {
      fromTasks,
      toTasks,
      fromTaskIndex,
      toTaskIndex
    }) {
      const taskToMove = fromTasks.splice(fromTaskIndex, 1)[0]
      toTasks.splice(toTaskIndex, 0, taskToMove)
    },
    MOVE_COLUMN (state, {
      fromColumnIndex,
      toColumnIndex
    }) {
      const columnList = state.board.columns

      const columnToMove = columnList.splice(fromColumnIndex, 1)[0]
      columnList.splice(toColumnIndex, 0, columnToMove)
    }
  }
})
