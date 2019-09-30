<template>
  <div class="account">
    <h1>This is the account page</h1>
    <md-steppers md-vertical>

      <md-step id="first" md-label="Get Ether Balance for a single Address" md-description="Optional">
        <Example1></Example1>
      </md-step>

      <md-step id="second" md-label="Get Ether Balance for multiple Addresses in a single call">
        <Example2></Example2>
      </md-step>

      <md-step id="third" md-label="Get a list of 'Normal' Transactions By Address">
        <Example3></Example3>
      </md-step>

      <md-step id="fourth" md-label="Get a list of 'Internal' Transactions by Address">
        <Example4></Example4>
      </md-step>

      <md-step id="fifth" md-label="Get 'Internal Transactions' by Transaction Hash">
        <Example5></Example5>
      </md-step>
    </md-steppers>
  </div>
</template>
<script>
// @ is an alias to /src
import Example1 from '@/components/account/Example1.vue'
import Example2 from '@/components/account/Example2.vue'
import Example3 from '@/components/account/Example3.vue'
import Example4 from '@/components/account/Example4.vue'
import Example5 from '@/components/account/Example5.vue'

export default {
  name: 'Acccount',
  components: {
    Example1, Example2, Example3, Example4, Example5
  }
}
</script>
