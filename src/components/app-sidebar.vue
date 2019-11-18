<template>
  <div class="sidebar">

    <!-- 一级菜单 -->
    <ul class="menu" :class="expand ? 'fat' : 'thin'">
      <!-- 一级菜单项 -->
      <li v-for="(item, index) in permissionMenu"
          @click.stop="activeItem(item)"
          class="menu-item menu-first-item" :class="{active: item.active}" v-if="item.show">
        <i class="icon iconfont" :class="item.icon"></i>
        <span class="item-text">{{item.name}}</span>
        <!-- 没有子菜单, 隐藏小图标 -->
        <i v-if="isChildren(item)" class="el-icon-caret-right"></i>


        <!-- 二级菜单 -->
        <ul v-if="isChildren(item)" class="menu sub-menu">
          <!-- 二级菜单项 -->
          <li v-for="(secondItem, index) in item.children" @click.stop="activeItem(secondItem)"
              class="menu-item" :class="{active: secondItem.active}" v-if="secondItem.show">
            <span class="item-text">{{secondItem.name}}</span>
            <!-- 没有子菜单, 隐藏小图标 -->
            <i v-if="isChildren(secondItem)" class="el-icon-caret-right"></i>


            <!-- 三级菜单 -->
            <ul v-if="isChildren(secondItem)" class="menu sub-menu">
              <!-- 三级菜单项 -->
              <li v-for="(thirdItem, index) in secondItem.children" @click.stop="activeItem(thirdItem)"
                  class="menu-item" :class="{active: thirdItem.active}" v-if="thirdItem.show">
                <span class="item-text">{{thirdItem.name}}</span>
                <!-- 没有子菜单, 隐藏小图标 -->
                <!--<i v-if="isChildren(thirdItem)" class="el-icon-caret-right"></i>-->
              </li>
            </ul>


          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'app-sidebar',
    props: ['expand'],
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'activeMenu'
    },
    computed: {
      permission() {
        let permission = this.localStore.get("permission") || this.$store.state.permission;
        return permission || {}
      }
    },
    data() {
      return {
        // 被权限过滤后当前菜单
        permissionMenu: [],
        // 所有的菜单模板
        menu: {
          main: [
            {
              icon: 'icon-yibiaopan1',
              name: '仪表盘',
              routerName: 'dashboard',
              children: [
                {
                  name: '网站监测平台',
                  routerName: 'website_monitoring'
                },
                {
                  name: '漏洞扫描平台',
                  routerName: 'vul_scanning_platform'
                }
              ]
            },
            {
              icon: 'icon-mubiaozhongxin',
              name: '事件中心',
              routerName: 'event_center',
              children: [
                {
                  name: '网站监测事件',
                  routerName: 'web_monitoring_events'
                },
                {
                  name: '漏洞威胁事件',
                  routerName: 'vul_threat_incidents'
                }
              ]
            },
            {
              icon: 'icon-anquanpinggu',
              name: '安全评估',
              routerName: 'safety_assessment',
              children: [
                {
                  name: '基础信息获取',
                  routerName: 'basic_info_acquisition'
                },
                {
                  name: '漏洞扫描',
                  routerName: 'vulnerability_scan'
                },
                {
                  name: 'WEBSHELL在线分析',
                  routerName: 'webshell_analysis'
                },
                {
                  name: 'POC插件管理',
                  routerName: 'poc_plugin'
                }
              ]
            },
            {
              icon: 'icon-guanli',
              name: '管理中心',
              routerName: 'manage_center',
              children: [
                {
                  name: '资产管理',
                  routerName: 'asset_manage'
                },
                {
                  name: '资产组',
                  routerName: 'asset_group'
                },
                {
                  name: '网站监测任务管理',
                  routerName: 'task_manage'
                },
                {
                  name: '漏洞扫描任务管理',
                  routerName: 'loophole_task_manage'
                },
                {
                  name: '用户中心',
                  routerName: 'user'
                },
//                {
//                  name: '用户日志',
//                  routerName: 'user_log'
//                },
                {
                  name: '通报管理',
                  routerName: 'notified_manage',
                },
                {
                  name: '事件类型管理',
                  routerName: 'event_type_manage'
                }
              ]
            },
            {
              icon: 'icon-kucun',
              name: '规则库',
              routerName: 'rule_base',
            },
//            {
//              icon: 'icon-mobanguanli',
//              name: '模板管理',
//              routerName: 'template_management',
//              children: [
//                {
//                  name: '扫描模板',
//                  routerName: 'scan_template'
//                },
//              ]
//            },
            {
              icon: 'icon-baobiao',
              name: '报表管理',
              routerName: 'report_manage'
            },
            {
              icon: 'icon-baobiao1',
              name: '漏洞知识库',
              routerName: 'knowledge_base'
            }
          ]
        }
      }
    },
    methods: {
      // 是否有子菜单
      isChildren(item) {
        return item.children && item.children.length > 0
      },
      // 设置菜单选中
      activeMenu() {
        let menu = JSON.parse(JSON.stringify(this.menu[this.$store.state.navName]));
        this.eachActive(menu);
        // @特殊处理, 如果子页面有访问权限, 那么文件夹的也有访问权限
        let arr = this.getPermissionRoute(this.$router.options.routes, this.permission, []);
        this.permissionMenu = this.getPermissionMenu(menu, this.permission, arr);
        // @特殊处理, 如果所有菜单都没有配置权限, 则侧边栏消失
        if (Array.isArray(this.permissionMenu) && this.permissionMenu.length > 0 && !this.permissionMenu.some(v => v.show)) {
          this.$store.commit('sidebarShow', {sidebarShow: false});
        }
      },
      // 取得有访问权限的父路由
      getPermissionRoute(router, permission, arr) {
        router.forEach(item => {
          // 如果是组, 开始递归
          if (Array.isArray(item.children)) {
            arr.concat(this.getPermissionRoute(item.children, permission, arr));
            // @特殊处理, 如果子菜单有个别有访问权限, 则组也可见
            let show = item.children.some(v => v.meta.show);
            !item.meta && (item.meta = {});
            show && arr.push(item.name);
            item.meta.show = show
          } else {
            // 判断单个路由是否有访问权限
            let per = permission[item.name];
            let show = (per && per.query) ? true : false;
            !item.meta && (item.meta = {});
            item.meta.show = show;
            show && arr.push(item.name);
          }
        });
        // console.log(arr);
        return arr;
      },
      // 权限控制
      getPermissionMenu(menu, permission, arr) {
        menu.forEach(item => {
          let show = true;
          // 如果是组, 开始递归
          if (Array.isArray(item.children)) {
            if (item.children.length > 0) {
              this.getPermissionMenu(item.children, permission, arr);
              // @特殊处理, 如果子菜单都不可见, 则组也不可见
              show = item.children.some(v => v.show);
            }
          } else {
            // console.log(item.routerName);
            // 判断是否拥有权限
            let per = permission[item.routerName];
            show = (per && per.query) ? true : false;
          }
          // @特殊处理, 如果子页面有访问权限, 那么文件夹的也有访问权限
          if (arr.includes(item.routerName)) {
            show = true;
          }
          this.$set(item, 'show', show);
        });
        return menu;
      },
      // 递归遍历菜单
      eachActive(arr) {
        arr.forEach(item => {
          // @特殊处理, 递归执行eachActive会清空active的赋值, 所以当 active = undefined | false 赋值
          if (!item.active) {
            this.$set(item, 'active', this.matchMenuWithRoute(item))
          }
          if (Array.isArray(item.children)) {
            this.eachActive(item.children)
          }
        });
      },
      // 将路由和菜单项匹配
      matchMenuWithRoute(item) {
        // 子路由会继承父路由的params参数
        const routeParams = this.$route.params;
        return !!this.$route.matched.find(match => {
          // 路由名 & 参数
          let sameRouter = (match.name === item.routerName);
          let sameParams = true;
          // 过滤没有配置参数的情况
          if (item.params) {
            sameParams = JSON.stringify(item.params) + '' === JSON.stringify(routeParams) + ''
          }
          return sameRouter && sameParams;
        });
      },
      // 点击菜单事件
      activeItem: function (item) {
        if (item.children && item.children.length > 0) {
          // @特殊处理, 选中有子菜单的父菜单时, 默认选中第一个可显示的子菜单
          this.activeItem(item.children.find(v => v.show));
        } else {
          let path = {name: item.routerName};
          item.params && (path.params = item.params);
          item.routerName && this.$router.push(path);
        }
      }
    },
    mounted() {
      this.activeMenu();
    }
  }
</script>

<style>
  .sidebar {
    height: 100%;
  }

  .sidebar .menu {
    border-radius: 0;
    text-align: left;
    box-sizing: border-box;
  }

  .sidebar .menu-item {
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    color: #fff;
    padding-left: 17px;
    font-size: 14px;
    position: relative;
  }

  .sidebar .menu-item .item-text {
    padding-left: 10px;
  }

  .sidebar .menu-item .el-icon-caret-right {
    position: absolute;
    right: 15px;
    top: 20px;
  }

  .sidebar .sub-menu > .menu-item .el-icon-caret-right {
    position: absolute;
    right: 15px;
    top: 15px;
  }

  .sidebar .menu-item .icon {
    position: relative;
    top: 1px;
  }

  .sidebar .menu-item:hover {
    color: #fff;
    background: linear-gradient(90deg, RGBA(96, 198, 249, 0.75) 50%, RGBA(86, 142, 245, 0.75));
  }

  .sidebar .menu-item.active {
    color: #fff;
    background: linear-gradient(90deg, RGBA(96, 198, 249, 1) 50%, RGBA(86, 142, 245, 1));
  }

  .sidebar .menu-item:hover > .sub-menu {
    display: block;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  .sidebar .menu-item > .sub-menu {
    display: none;
    position: absolute;
    width: 180px;
    right: -180px;
    top: 5px;
    background-color: RGBA(17, 23, 32, 0.85);
    box-shadow: 4px 4px 9px RGBA(0, 0, 0, 0.28);
    transition: all .25s;
    transform-origin: top;
    padding: .5rem 0;
    border-bottom: 1px solid #252525;
  }

  .sidebar .sub-menu > .menu-item {
    height: 40px;
    line-height: 40px;
  }

  /* 收起情况 */

  .sidebar .menu.thin {
  }

  .sidebar .menu.thin .menu-first-item > .item-text {
    display: none;
  }

  .sidebar .menu.thin .menu-first-item:hover > .item-text {
    position: absolute;
    bottom: -12px;
    left: 5px;
    z-index: 2;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    display: block;
    border-radius: 3px;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    white-space: nowrap;
    padding: 0 5px;
  }

  .sidebar .menu.thin .menu-first-item > .el-icon-caret-right {
    display: none;
  }
</style>
