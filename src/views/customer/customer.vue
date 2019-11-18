<template>
  <div class="page-customer">
    <div class="app-page-container">
      <!--查询条件-->
      <div class="app-page-box">
        <div class="app-page-box-header">
          <i class="icon iconfont icon-shaixuan"></i>查询条件
        </div>
        <div class="app-page-box-content clearfix">
          <el-form :inline="true" :model="searchForm" class="app-form-clear-margin-bottom">
            <el-form-item label="类型">
              <el-radio-group v-model="searchForm.status" @change="search">
                <el-radio label="all">全部</el-radio>
                <el-radio label="clue">线索</el-radio>
                <el-radio label="important">重要</el-radio>
                <el-radio label="blacklist">黑名单</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--<el-form-item label="日期">-->
              <!--<el-input v-model="searchForm.name" @keyup.enter.native="search" placeholder="请输入漏洞名称"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 按钮组 -->
      <div class="app-page-box">
        <div class="app-page-box-content clearfix">
          <el-button type="success" @click="editConfirm('insert')">新增</el-button>
        </div>
      </div>

      <!-- 列表 -->
      <div class="app-page-box">
        <!-- 表格 -->
        <el-table
          stripe
          border
          style="width: 100%"
          v-loading="loading"
          :data="tableData"
          @sort-change="handleSortChange">
          <el-table-column type="index" fixed width="50" align="center"></el-table-column>
          <el-table-column prop="name" fixed label="客户名称" sortable>
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" sortable>
            <template slot-scope="scope">{{ scope.row.phone }}</template>
          </el-table-column>
          <el-table-column prop="weixin" label="微信" sortable>
            <template slot-scope="scope">{{ scope.row.weixin }}</template>
          </el-table-column>
          <el-table-column prop="follow" label="跟踪人" sortable>
            <template slot-scope="scope">{{ scope.row.follow || '?' }}</template>
          </el-table-column>
          <el-table-column prop="description" show-overflow-tooltip label="描述" sortable>
            <template slot-scope="scope">{{ scope.row.description }}</template>
          </el-table-column>
          <el-table-column prop="date" label="登记日期" sortable>
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column prop="status" width="80px" label="状态" sortable>
            <template slot-scope="scope">
              <span :class="scope.row.status">{{ dict.status[scope.row.status || 'clue'] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100px" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="editConfirm('update', scope.row)">修改</el-button>
              <div class="operation-line"></div>
              <el-button type="text" @click="delConfirm(scope.row)" class="text-color-red">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="app-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :total="total"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </div>

      <!-- 新增 & 编辑 dialog -->
      <el-dialog class="edit-dialog" width="600px" append-to-body @close="resetEditForm()" :title="editDialogDisplayTitle"
                 :visible.sync="editDialogVisible">

        <el-form status-icon label-width="95px"
                 :model="editForm" :rules="editFormRules" ref="editForm">
          <el-form-item label="客户名称:" prop="name">
            <el-input v-model="editForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号:" prop="phone">
            <el-input v-model="editForm.phone" clearable></el-input>
          </el-form-item>
          <el-form-item label="微信号:" prop="微信">
            <el-input v-model="editForm.weixin" clearable></el-input>
          </el-form-item>
          <el-form-item label="跟踪人:" prop="follow">
            <el-select v-model="editForm.follow" clearable placeholder="请选择">
              <el-option label="田明" value="田明"></el-option>
              <el-option label="何英杰" value="何英杰"></el-option>
              <el-option label="张雪原" value="张雪原"></el-option>
              <el-option label="李尊怡" value="李尊怡"></el-option>
              <el-option label="李亚玲" value="李亚玲"></el-option>
              <el-option label="周耀东" value="周耀东"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-radio-group v-model="editForm.status">
              <el-radio label="clue">线索</el-radio>
              <el-radio label="important">重要</el-radio>
              <el-radio label="blacklist">黑名单</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述:" prop="description">
            <el-input type="textarea" clearable :rows="6" v-model="editForm.description"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="info" @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="editBtnLoading" @click="editSave()">保存</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  export default {
    name: "customer",
    data() {

      // 自定义验证 是否重名
      let validateRename = (rule, value, callback) => {
        let display = {name: '漏洞名称', cnvd_code: 'CNVD编号'};
        // 编辑情况下, 过滤自己的名字
        if (this.editDialogType === 'update') {
          if (this.editRow[rule.field] === value) {
            return callback();
          }
        }
        this.$post('/action', {
          data: {
            "select": this.tableName,
            "where": rule.field + '=' + value,
            "fields": ["name"]
          }
        }, true).then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            callback(new Error(display[rule.field] + ' ' + value + ' 已存在, 请更换' + display[rule.field] + '重试'))
          } else {
            callback();
          }
        })
      };

      return {
        dict: {
          status: {
            "clue": "线索",
            "important": "重要",
            "blacklist": "黑名单"
          }
        },
        // 查询
        searchForm: {
          status: 'all',
        },
        // 新增 & 编辑
        editRow: {},                  // 编辑时当前临时记录
        editForm: {
          "follow": "田明",
          "status": "clue"
        },
        editDialogVisible: false,     // 编辑弹出框显示状态
        editBtnLoading: false,        // 编辑弹出框的保存按钮的loading
        editDialogType: "",           // 编辑弹出框的当前状态, 是编辑, 还是新增
        editDialogDisplayTitle: "",   // 编辑弹出框的标题
        editDialogDisplay: {          // 编辑弹出框的标题映射
          "insert": "新增",
          "update": "编辑"
        },
        //表单验证
        editFormRules: {
          name: [
            {required: true, message: '字段不能为空', trigger: 'blur'},
          ],
          follow: [
            {required: true, message: '字段不能为空', trigger: 'change'},
          ],
          description: [
            {required: true, message: '字段不能为空', trigger: 'blur'},
          ]
        },
        // 列表相关
        loading: true,
        tableData: [],
        tableDataAll: [],
        join: [],
        total: 0,
        pageSize: 100,
        pageSizes: [100, 200, 300, 500],
        currentPage: 1,
        multipleSelection: []
      }
    },
    methods: {
      // 查询
      search() {
        this.currentPage = 1
        this.list()
      },
      // tab切换
      handleTabClick(tab, event) {

      },
      // 新增 & 编辑
      editConfirm(type, row) {
        this.editDialogVisible = true;
        this.editDialogType = type;
        this.editDialogDisplayTitle = this.editDialogDisplay[type];
        if (type === 'update') {
          this.detail(row);
        }
      },
      // 保存事件
      editSave() {
        this[this.editDialogType]();
      },
      // 更新时查询单条
      detail(row) {
        this.editRow = row
        this.editForm = JSON.parse(JSON.stringify(row))
      },
      // 新增
      insert() {
        // 表单验证
        this.$refs["editForm"].validate((valid) => {
          if (valid) {
            this.editForm.date = this.$filter.datetime(Date.now() ,'YYYY-MM-DD HH:mm:ss');
            this.editBtnLoading = true;
            this.$post('/customer/insert', {
              data: this.editForm
            }, true).then((data) => {
              if (data && data.id > 0) {
                this.editBtnLoading = false;
                this.editDialogVisible = false;
                this.$message({message: '新增成功', type: 'success'});
                this.list();
              }
            }).catch(err => {
              this.editBtnLoading = false;
              this.$message({message: '新增失败', type: 'error'});
            })
          }
        });
      },
      // 更新
      update() {
        // 表单验证
        this.$refs["editForm"].validate((valid) => {
          if (valid) {
            this.editBtnLoading = true;
            this.$post('/customer/update', {
              data: this.editForm
            }, true).then((data) => {
              if (data && data.id > 0) {
                this.editBtnLoading = false;
                this.editDialogVisible = false;
                this.$message({message: '更新成功', type: 'success'});
                this.list();
              }
            }).catch(err => {
              this.editBtnLoading = false;
              this.$message({message: '更新失败', type: 'error'});
            })
          }
        });
      },
      // 表单重置
      resetEditForm() {
        let editForm = this.$refs["editForm"];
        editForm.clearValidate();
        editForm.resetFields();
        this.editForm = {}
        this.editRow = {}
      },
      // 删除框
      delConfirm(row) {
        this.$confirm('确定删除该条记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('/customer/delete', {
            data: {
              id: row.id
            }
          }, true).then((data) => {
            this.$message({message: '删除成功', type: 'success'});
            this.list();
          });
        }).catch(() => {});
      },
      // 排序
      handleSortChange(column) {
        // console.log(column, prop, order);
        this.order = column.prop && column.order
          ? [column.prop + ' ' + column.order.replace("ending", "")]
          : [];
        this.list();
      },
      // 修改分页数量
      handleSizeChange(val) {
        this.pageSize = val;
        this.list();
      },
      // 切换分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.list();
      },
      // 列表
      list() {
        this.$post('/customer/query', {
          data: {}
        }).then((data) => {
          if (data && Array.isArray(data)) {
            this.total = data.length;
            this.tableData = data;
          }
        })
      },
      // 列表
      list() {
        this.$post('/customer/query', {
          data: {}
        }).then((data) => {
          if (data && Array.isArray(data)) {
            this.total = data.length;
            this.tableDataAll = JSON.parse(JSON.stringify(data));
            this.page()
          }
        })
      },
      // 分页
      page() {
        let list = this.tableDataAll
        if (this.searchForm.status !== 'all') {
          list = list.filter(d => {
            return d.status === this.searchForm.status
          })
        }
        this.tableData = list.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      },
      // 加载
      load() {
        this.list();
      }
    },
    mounted() {
      this.load();
    }
  }
</script>

<style>
  .page-customer {

  }
  .page-customer .el-table__row .clue {
    background-color: #20a0ff;
    color: #fff;
  }
  .page-customer .el-table__row .important {
    background-color: red;
    color: #fff;
  }
  .page-customer .el-table__row .blacklist {
    background-color: #585858;
    color: #f5f5f5;
  }
</style>
