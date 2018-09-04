import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Header from '~/components/Header.vue'
import merge from 'lodash.merge'

const localVue = createLocalVue()
localVue.use(Vuex)

function createStore(overrides) {
  const defaultStoreConfig = {}
  return new Vuex.Store(
    merge(defaultStoreConfig, overrides)
  )
}

function createWrapper(overrides) {
  const defaultMountingOptions = {
    mocks: {}, 
    localVue,
    store: createStore()    
  }
  return shallowMount(Header, merge(defaultMountingOptions, overrides))
}

describe('header.vue', () => {

  it('match snapshot', () => {
    const wrapper = createWrapper()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('テキストを入力し、エンターを押すとコンポーネントのaddTodoが呼び出される', () => {
    const wrapper = createWrapper()
    wrapper.vm.addTodo = jest.fn()
    const input = wrapper.find('.new-todo')
    input.setValue('Hoge')
    input.trigger('keyup.enter')
    expect(wrapper.vm.addTodo).toHaveBeenCalled()
  })

  it("dispatch('addTodo')が呼び出される", () => {
    const store = createStore()
    const mocks = {
      $route: {
        params: {
          slug: 'completed'
        }
      }  
    }

    store.dispatch = jest.fn()
    const wrapper = createWrapper({ mocks, store })
    
    let input = wrapper.find('.new-todo')
    input.setValue('hogehoge')
    input.trigger('keyup.enter')
    const expectedValue = expect.objectContaining({
      completed: true, 
      title: "hogehoge"      
    })
    expect(store.dispatch).toHaveBeenCalledWith('addTodo', expectedValue)
    expect(wrapper.vm.todo).toBe('')
  })
})