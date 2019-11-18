## 内部系统

### 项目介绍

#### 浏览器兼容性

    Edge 12+   Firefox 55+    Chrome 60+    Safari 10+
    
#### 框架构成

    vue-cli3 + vue2 + vue-router3 + vuex3 + element-ui2
    
#### 图标字体

    iconfont 

### 环境安装

 本项目依赖 node.js， 使用前先安装 node.js 和 cnpm（显著提升依赖包的下载速度）。

 1. 自行下载并安装 node.js: 
 
        https://nodejs.org/en/download/

 2. 然后安装 cnpm 命令(安装 cnpm 提高安装速度):

        npm install --registry=https://registry.npm.taobao.org

 3. 安装依赖

        npm install 或者 cnpm install

 4. 执行构建并启动服务

 	1. `npm start`   |  `npm run serve`
 	2. /server/server.js下：  `node server`


### 基础命令


 ##### 开发构建 + 启动服务器

        npm start

 ##### 开发构建

        npm run build


##### 配置信息

      


##### 备份

      <template>
        <div class="page-user_log">
          <el-button>aaa</el-button>
        </div>
      </template>
      
      <script>
        import permission from '@/components/mixin/permission';
        export default {
          mixins: [permission],
          name: 'user_log',
          data() {
            return {}
          },
          methods: {},
          mounted() {
          }
        }
      </script>
      
      <style>
        .page-user_log {
      
        }
      </style>
