import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Slug from '~/pages/_slug.vue'
import merge from 'lodash.merge'

const localVue = createLocalVue()
localVue.use(Vuex)

let todos

function createStore(overrides) {
  todos = [
    { title: 'one', completed: false },
    { title: 'two', completed: true }
  ]

  const activeTodos = [
    { title: 'one', completed: false }
  ]

  const completedTodos = [
    { title: 'two', completed: true }    
  ]

  const defaultStoreConfig = {
    getters: {
      allTodos: () => todos,
      activeTodos: () => activeTodos,
      completedTodos: () => completedTodos
    }
  }
  return new Vuex.Store(
    merge(defaultStoreConfig, overrides)
  )
}

function createWrapper(overrides) {
  const defaultMountingOptions = {
    mocks: {
      $route: {
        params: {}
      }      
    },
    localVue,
    store: createStore()
  }
  return shallowMount(Slug, merge(defaultMountingOptions, overrides))
}

describe('_slug.vue', () => {

  describe('active', () => {

    it('match snapshot', () => {
      const wrapper = createWrapper()
      expect(wrapper.element).toMatchSnapshot()
    })

    it('todoリストはactiveなのが1つある', () => {
      const store = createStore()
      const mocks = {
        $route: {
          params: { slug: 'active' }
        }      
      }
      const wrapper = createWrapper({ mocks, store })
      expect(wrapper.vm.todos).toHaveLength(1)
      expect(wrapper.vm.todos[0].completed).toBeFalsy()
    })
  })

  describe('completed', () => {

    it('match snapshot', () => {
      const wrapper = createWrapper()
      expect(wrapper.element).toMatchSnapshot()
    })

    it('todoリストはcompletedなのが1つある', () => {
      const store = createStore()
      const mocks = {
        $route: {
          params: { slug: 'completed' }
        }
      }

      const wrapper = createWrapper({ mocks, store })
      expect(wrapper.vm.todos).toHaveLength(1)
      expect(wrapper.vm.todos[0].completed).toBeTruthy()
    })
  })

  describe('all', () => {

    it('match snapshot', () => {
      const wrapper = createWrapper()
      expect(wrapper.element).toMatchSnapshot()
    })

    it('render slug', () => {
      const store = createStore({})
      const wrapper = createWrapper({ store })
      const items = wrapper.findAll('li')
      expect(items).toHaveLength(2)
    })
  
    it('Mark all as complete', () => {
      const store = createStore({})
      store.dispatch = jest.fn()
      const wrapper = createWrapper({ store })
      wrapper.find('.toggle').trigger('click')
      expect(store.dispatch).toHaveBeenCalledWith('allDone')
    })
  
    it('1個目のタスクをdoneにする', () => {
      const store = createStore()
      const wrapper = createWrapper({ store })
      expect(wrapper.vm.todos[0].completed).toBeFalsy()    
      let checkbox = wrapper.findAll('li').at(0).find('input[type="checkbox"]')    
      checkbox.setChecked()
      expect(wrapper.vm.todos[0].completed).toBeTruthy()
    })
  
    it('2個目のタスクを削除する', () => {
      const store = createStore()
      store.dispatch = jest.fn()
      const wrapper = createWrapper({ store })
      expect(wrapper.vm.todos).toHaveLength(2)
  
      let task = wrapper.findAll('li').at(1)
      task.find('.destroy').trigger('click')
      const expectedData = expect.objectContaining({
        completed: true,
        title: 'two'
      })
      expect(store.dispatch).toHaveBeenCalledWith('removeTodo', expectedData)
    })
  
    it('1個目のタスクを編集する', () => {
      const store = createStore()
      const wrapper = createWrapper({ store })
  
      let task = wrapper.findAll('li').at(0)
      task.find('label').trigger('dbclick')
      let editInput = task.find('.edit')
      editInput.setValue('Hoge')
      editInput.trigger('keyup.enter')
      expect(wrapper.vm.todos[0].title).toBe('Hoge')
    })
  
    it('タスクを編集しても、タイトルが入力されていないと削除される', () => {
      const store = createStore()
      store.dispatch = jest.fn()
      const wrapper = createWrapper({ store })
      
      let task = wrapper.findAll('li').at(0)
      task.find('label').trigger('dbclick')
      let editInput = task.find('.edit')
      editInput.setValue('')
      editInput.trigger('keyup.enter')
      const expectedData = expect.objectContaining({
        title: "",
        completed: false
      })
      expect(store.dispatch).toHaveBeenCalledWith('removeTodo', expectedData)
    })
  
    it('編集をキャンセル', () => {
      const store = createStore()
      let wrapper = createWrapper({ store })
      wrapper.vm.beforeEditCache = 'one'
  
      let task = wrapper.findAll('li').at(0)
      task.find('label').trigger('dbclick')
      let editInput = task.find('.edit')
      editInput.setValue('Hoge')
      editInput.trigger('keyup.esc')
      expect(wrapper.vm.todos[0].title).toBe('one')
    })
  
    it('save', () => {
      const store = createStore()
      store.dispatch = jest.fn()
      let wrapper = createWrapper({ store })
      wrapper.vm.save()
      expect(store.dispatch).toHaveBeenCalledWith('saveTodos')    
    })
  })
})