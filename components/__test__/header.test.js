import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Header from '~/components/Header.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('header.vue', () => {
  let storeOptions
  let store

  beforeEach(() => {
    storeOptions = {}
    store = new Vuex.Store(storeOptions)
  })

  it('テキストを入力し、エンターを押すとコンポーネントのaddTodoが呼び出される', () => {
    const wrapper = shallowMount(Header, { 
      mocks: {}, 
      localVue,
      store
    })

    wrapper.vm.addTodo = jest.fn()
    const input = wrapper.find('.new-todo')
    input.element.value = 'Hoge'
    input.trigger('keyup.enter')
    expect(wrapper.vm.addTodo).toHaveBeenCalled()
  })

  it("dispatch('addTodo')が呼び出される", () => {
    store.dispatch = jest.fn()

    const wrapper = shallowMount(Header, { 
      mocks: {
        $route: {
          params: {
            slug: 'completed'
          }
        }        
      }, 
      localVue,
      store
    })
    
    let input = wrapper.find('.new-todo')
    input.setValue('hogehoge')
    input.trigger('keyup.enter')
    const expectedValue = expect.objectContaining({
      completed: true, 
      title: "hogehoge"      
    })
    expect(store.dispatch).toHaveBeenCalledWith('addTodo', expectedValue)
  })
})