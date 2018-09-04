import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Slug from '~/pages/_slug.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('_slug.vue', () => {
  let storeOptions
  let store

  let todos = [
    { title: 'one', completed: false },
    { title: 'two', completed: true }
  ]

  beforeEach(() => {
    storeOptions = {
      getters: {
        allTodos: jest.fn()
      }
    }
    store = new Vuex.Store(storeOptions)
  })

  it('render slug', () => {
    storeOptions.getters.allTodos.mockReturnValue(todos)
    const wrapper = shallowMount(Slug, {
      mocks: {
        $route: {
          params: {}
        }
      }, 
      localVue,
      store      
    })

    const items = wrapper.findAll('li')
    expect(items).toHaveLength(2)
  })

  it('Mark all as complete', () => {
    storeOptions.getters.allTodos.mockReturnValue(todos)
    store.dispatch = jest.fn()

    const wrapper = shallowMount(Slug, {
      mocks: {
        $route: {
          params: {}
        }
      },
      localVue,
      store
    })

    wrapper.find('.toggle').trigger('click')
    expect(store.dispatch).toHaveBeenCalledWith('allDone')
  })
})