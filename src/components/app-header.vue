<template>
  <div class="header">
    <!-- logo -->
    <div class="logo">
      内部管理系统
    </div>
    <!-- 导航 -->
    <div class="nav-container">
      <ul class="clearfix nav">
        <li v-for="(item, index) in nav" class="nav-item" :key="index"
            :data-index="index"
            @click="activeItem(item.routerName)"
            :class="{active: true}"> <!-- :class="{active: item.routerName === active}" -->
          {{item.name}}
        </li>
      </ul>
    </div>
    <!-- 个人中心 & 设置 -->
    <div class="user">
      <div class="item user-info">
        <!-- 当前 -->
        <div class="el-dropdown-link">
          <i class="icon iconfont icon-denglu"></i>
          {{ $store.getters.user.name }}
          <i class="el-icon-caret-bottom"></i>
        </div>
        <div class="v-line"></div>
      </div>
      <div class="item" title="退出系统" @click="logout">
        <i class="icon iconfont icon-icon-"></i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "app-header",
    props: ["expand"],
    computed: {
      active() {
        return this.$store.state.navName;
      }
    },
    data() {
      return {
        username: "",
        // 导航
        nav: [
          {
            routerName: 'customer',
            name: '客户关系管理'
          },
//          {
//            routerName: 'project',
//            name: '项目管理'
//          }
        ]
      };
    },
    methods: {
      // nav导航切换路由
      activeItem(routerName) {
        if (routerName !== 'main') {
          this.$router.push({name: routerName});
        }
      },
      // 退出 & 注销
      logout() {
        this.$confirm('是否确认退出系统？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(_ => {
          // 请求
          this.$post('/logout').then((data) => {
            if (data === true) {
              this.localStore.remove("user");
              this.localStore.remove("permission");
              this.$router.push('/login');
            }
          })
        }).catch(_ => {
        })
      }
    }
  };
</script>

<style>
  .header {
    position: relative;
    height: 100%;
  }

  /* logo */
  .header .logo {
    /*cursor: pointer;*/
    position: absolute;
    top: 0;
    left: 0;
    width: 180px;
    height: 100%;
    line-height: 60px;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
  }

  .header .logo img {
    position: relative;
    height: 60%;
    top: 20%;
  }

  /* 边栏控制 */
  .header .sidebar-control {
    position: absolute;
    left: 210px;
    top: 22px;
    color: #585858;
    cursor: pointer;
  }

  .header .sidebar-control:hover,
  .header .sidebar-control.active {
    color: #3d9df4;
  }

  .header .sidebar-control .icon {
    font-size: 18px;
  }

  /* 导航 */
  .header .nav-container {
    padding-left: 240px;
  }

  .header .nav-container .nav {
  }

  .header .nav-container .nav .nav-item {
    float: left;
    padding: 0 20px;
    height: 60px;
    line-height: 60px;
    font-size: 0.9rem;
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.1s;
    color: #585858;
  }

  .header .nav-container .nav .nav-item:hover,
  .header .nav-container .nav .nav-item.active {
    border-bottom: 5px solid #20a0ff;
    color: #3d9df4;
  }

  /* 个人中心 设置 */
  .header .user {
    position: absolute;
    top: 0;
    right: 0;
  }

  .header .user .item {
    display: inline-block;
    min-width: 60px;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
    position: relative;
    color: #585858;
    text-align: center;
  }

  .header .user .item .icon-target {
    position: absolute;
    font-size: 10px;
    background-color: #b60102;
    border-radius: 50%;
    height: 14px;
    padding: 0 4px;
    line-height: 14px;
    top: 16px;
    right: 16px;
    color: #ffffff;
  }

  .header .user .item .icon {
    font-size: 18px;
  }

  .header .user .item.user-info .el-dropdown {
  }

  .header .user .item.user-info .el-dropdown .el-dropdown-link {
    padding: 0 10px;
  }

  .header .user .item.user-info .el-dropdown .el-dropdown-link:hover {
    color: #3d9df4;
  }

  .header .user .v-line {
    position: absolute;
    right: 0;
    height: 40%;
    top: 30%;
    width: 1px;
    background: #ededed;
  }

  .header .user .item:hover {
    color: #3d9df4;
  }

  .update-pwd-dialog .el-dialog__body {
    padding: 30px 20px 20px;
  }

  .update-pwd-dialog .el-dialog__body .el-form-item--small.el-form-item {
    margin-bottom: 18px;
  }
</style>
