import Vue from 'vue'
import Vuex from 'vuex'

import store from '~/store'
import config from '~/store/config'
import cloneDeep from 'lodash.clonedeep'
import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex) 


describe('store', () => {

  let store

  beforeEach(() => {
    const clonedConfig = cloneDeep(config)
    store = new Vuex.Store(clonedConfig) 
  })

  describe('getters', () => {

    let todos

    beforeEach(() => {
      todos = [{ completed: false }, { completed: true }]
      store.commit('SET_TODOS', todos)
    })

    it('allTodos', () => {
      expect(store.getters.allTodos).toBe(todos)
    })

    it('activeTodos', () => {
      expect(store.getters.activeTodos).toHaveLength(1)
      const expectedData = expect.objectContaining({
        completed: false
      })
      expect(store.getters.activeTodos[0]).toEqual(expectedData)      
    })

    it('completedTodos', () => {
      expect(store.getters.completedTodos).toHaveLength(1)
      const expectedData = expect.objectContaining({
        completed: true
      })

      expect(store.getters.completedTodos[0]).toEqual(expectedData)
    })
  })

  describe('mutations', () => {
    it('SET_TODOS', () => {
      const todos = [{ name: 'todo-a' }]
      store.commit('SET_TODOS', todos)
      expect(store.state.todos).toBe(todos)
    })
    
    it('ADD_TODO', () => {
      const todo = { name: 'todo' }
      store.commit('ADD_TODO', todo)
      expect(store.state.todos[0]).toBe(todo)
    })

    it('REMOVE_TODO', () => {
      const todo_one = { name: 'one' }
      const todo_two = { name: 'two' }
      const todos = [todo_one, todo_two]
      store.commit('SET_TODOS', todos)
      store.commit('REMOVE_TODO', todo_one)
      expect(store.state.todos[0]).toBe(todo_two)
    })
  })  

  describe('actions', () => {
    it('addTodo', () => {
      const todo = { title: "foo" }
      store.dispatch('addTodo', todo)
      expect(store.state.todos[0]).toBe(todo)
    })

    it('setTodos', () => {
      const todos = [{title: 'one'}, {title: 'two'}]
      store.dispatch('setTodos', todos)
    })

    it('removeTodo', () => {
      const todo_one = { name: 'one' }
      const todo_two = { name: 'two' }
      const todos = [todo_one, todo_two]
      store.commit('SET_TODOS', todos)
      store.dispatch('removeTodo', todo_one)
      expect(store.state.todos[0]).toBe(todo_two)      
    })

    it('allDone', () => {
      const todos = [{ completed: false }, { completed: true }]      
      store.commit('SET_TODOS', todos)
      store.dispatch('allDone')

      const expectedData = expect.objectContaining({
        completed: true
      })
      expect(store.state.todos[0]).toMatchObject({completed: true})
      expect(store.state.todos[0]).toEqual(expectedData)
    })

    it('saveTodo', () => {
      //expect(store.dispatch('saveTodos'))
    })

  })
})


