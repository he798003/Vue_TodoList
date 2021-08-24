import Vue from 'vue'
import Vuex from 'vuex'
import LocalStorage from '../modules/localStorage'
Vue.use(Vuex)

const STORE = new LocalStorage('todo-vue')

export default new Vuex.Store({
  state: {
    todos: [{ content: 123, done: false }, { content: 456, done: false }, { content: 789, done: false }]
  },
  getters: {
    // 產出todoId，如有後端資料庫，則不須此動作
    list (state) {
      return state.todos.map((todo, tid) => {
        return {
          tid,
          todo
        }
      })
    },
    filterList (state, getters) {
      return function (filter) {
        switch (filter) {
          case 'all':
            return getters.list
          case 'active':
            return getters.list.filter((todo) => {
              return todo.todo.done === false
            })
          case 'done':
            return getters.list.filter((todo) => {
              return todo.todo.done === true
            })
          default:
            return []
        }
      }
    }
  },
  mutations: {
    SET_TODOS (state, todos) {
      state.todos = todos
    }

  },
  // 呼叫mutations=>使用commit
  actions: {
    LOAD_TODOS ({ commit }) {
      // 1. load todos進來
      // window.localStorage.getItem('XXX')
      const todos = STORE.load()
      // 2. commit 呼叫mutations
      commit('SET_TODOS', todos)
      // 3. return
      return {
        todos
      }
    },
    CREATE_TODO ({ commit }, { todo }) {
      // 1. POST // 使用API的情況:axios.post()
      const todos = STORE.load()
      todos.push(todo)
      STORE.save(todos)
      // 2. commit 呼叫mutations
      commit('SET_TODOS', todos)
      // 3. return
      return {
        tid: todos.length - 1,
        todo
      }
    },
    EIDE_TODO ({ commit }, { tid, todo }) {
      // 1. 使用API的情況:axios.delete()
      const todos = STORE.load()
      const newTodo = todos.splice(tid, 1, todo)
      STORE.save(todos)
      // 2. commit 呼叫mutations
      commit('SET_TODOS', todos)
      return {
        tid,
        newTodo
      }
    },
    DELETE_TODO ({ commit }, { tid }) {
      // 1. 使用API的情況:axios.delete()
      const todos = STORE.load()
      const todo = todos.splice(tid, 1)[0]
      STORE.save(todos)
      // 2. commit 呼叫mutations
      commit('SET_TODOS', todos)
      return {
        tid: null,
        todo
      }
    }
  },
  modules: {}
})
