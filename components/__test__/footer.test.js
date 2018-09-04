import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuex from 'vuex'
import Footer from '~/components/Footer.vue'
import merge from 'lodash.merge'

const localVue = createLocalVue()
localVue.use(Vuex)

function createStore(overrides) {
  const defaultStoreConfig = {
    getters: {
      allTodos: jest.fn(),
      activeTodos: jest.fn(),
    }
  }
  return new Vuex.Store(
    merge(defaultStoreConfig, overrides)
  )  
}

function createWrapper(overrides) {
  const defaultMountingOptions = {
    stubs: {
      NuxtLink: RouterLinkStub
    },         
    mocks: {},
    localVue,
    store: createStore()
  }

  return shallowMount(Footer, merge(defaultMountingOptions, overrides))
}


describe('footer.vue', () => {
  let storeOptions
  let store
  const todos = [
    { title: 'one', completed: false },
    { title: 'two', completed: true }
  ]

  const activeTodos = [
    { title: 'one', completed: false }    
  ]

  it('todoが2つ残っている', () => {
    const store = createStore({
      getters: {
        allTodos: () => todos,
        activeTodos: () => activeTodos
      }
    })

    const wrapper = createWrapper({ store })
    expect(wrapper.find('.todo-count').text()).toBe("1 item left")
  })

  it('Clear completed ボタンを押すとsetTodosgがdispatchされる', () => {

    const store = createStore({
      getters: {
        allTodos: () => todos,
        activeTodos: () => activeTodos
      }
    })

    store.dispatch = jest.fn()
      
    const wrapper = createWrapper({ store })

    wrapper.find('.clear-completed').trigger('click')
    expect(store.dispatch).toHaveBeenCalledWith('setTodos', activeTodos)
  })
})