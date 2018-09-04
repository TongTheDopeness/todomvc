import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils'
import Vuex from 'vuex'
import Footer from '~/components/Footer.vue'
import merge from 'lodash.merge'

const localVue = createLocalVue()
localVue.use(Vuex)


const todos = [
  { title: 'one', completed: false },
  { title: 'two', completed: true }
]

const activeTodos = [
  { title: 'one', completed: false }    
]

function createStore(overrides) {

  const defaultStoreConfig = {
    getters: {
      allTodos: () => todos,
      activeTodos: () => activeTodos,
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

  it('match snapshot', () => {
    const wrapper = createWrapper()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('todoが2つ残っている', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.todo-count').text()).toBe("1 item left")
  })

  it('Clear completed ボタンを押すとsetTodosgがdispatchされる', () => {
    const store = createStore()
    store.dispatch = jest.fn()
      
    const wrapper = createWrapper({ store })

    wrapper.find('.clear-completed').trigger('click')
    const expectedData = expect.objectContaining([{
      completed: false,
      title: 'one'
    }])
    expect(store.dispatch).toHaveBeenCalledWith('setTodos', expectedData)
  })
})