import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuex from 'vuex'
import Footer from '~/components/Footer.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

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

  beforeEach(() => {
    storeOptions = {
      getters: {
        allTodos: jest.fn(),
        activeTodos: jest.fn(),
      }
    }
    
    store = new Vuex.Store(storeOptions)
    store.dispatch = jest.fn()  
  })

  it('todoが2つ残っている', () => {
    storeOptions.getters.allTodos.mockReturnValue(todos)
    storeOptions.getters.activeTodos.mockReturnValue(activeTodos)        
    const wrapper = shallowMount(Footer, {
      stubs: {
        NuxtLink: RouterLinkStub
      },      
      mocks: {},
      localVue,
      store
    })

    expect(wrapper.find('.todo-count').text()).toBe("1 item left")
  })

  it('Clear completed ボタンを押すとsetTodosgがdispatchされる', () => {
    storeOptions.getters.allTodos.mockReturnValue(todos)
    storeOptions.getters.activeTodos.mockReturnValue(activeTodos)        
      
    const wrapper = shallowMount(Footer, {
      stubs: {
        NuxtLink: RouterLinkStub
      },
      mocks: {},
      localVue,
      store
    })

    wrapper.find('.clear-completed').trigger('click')
    expect(store.dispatch).toHaveBeenCalledWith('setTodos', activeTodos)
  })
})