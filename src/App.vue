<template>
  <div>
    <top/>
    <list/>
  </div>
</template>
<script>

/*引入组件*/
import list from '@/components/list'
import top from '@/components/top'

export default {
  name: 'App',
  components: {
    list,
    top
  }
}
</script>

<style>

</style>
