<template>
  <div class="mod-permission">
  </div>
</template>

<script>
  export default {
    name: 'permission',
    computed: {
      permission() {
        let permission = this.localStore.get("permission") || this.$store.state.permission;
        return permission || {}
      }
    },
    data() {
      return {}
    },
    methods: {
      permissionShow(action) {
        return !!this.permission[this.$options.name][action];
      },
      permissionsLock(rule) {
        let [module, ... action] = rule.split('.');
        // 具备模块的权限, 并具备模块的动作权限
        let per = this.permission[module];
        if (per && action.some(v => per[v]) ) {
          return true;
        }
      }
    },
    mounted() {}
  }
</script>

<style>
  .mod-permission {

  }
</style>
