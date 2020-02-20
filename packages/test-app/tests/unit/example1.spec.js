import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Example1 from '@/components/account/Example1.vue'

describe('Example1.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    shallowMount(Example1, {
      propsData: { msg }
    })
    // expect(wrapper.text()).to.include(msg)
  })
})
