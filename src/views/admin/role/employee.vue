<template>
  <div v-if="isAuth(['ROOT', 'EMPLOYEE:CHECK'])"
       element-loading-text="拼命加载中"
       v-loading="dataListLoading">
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm">
      <div class="input-item">
      <el-form-item prop="name">
        <el-input
          v-model="dataForm.name"
          placeholder="真实姓名"
          size="small"
          class="input"
          clearable="clearable"
          @keyup.enter.native="searchHandle()"
      />
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="dataForm.code"
          placeholder="用户编号"
          size="small"
          class="input"
          clearable="clearable"
          @keyup.enter.native="searchHandle()"
      />
      </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.role" class="input" placeholder="角色" size="small" clearable="clearable">
            <el-option v-for="one in roleList" :label="one.roleName" :value="one.roleName" />
          </el-select>
        </el-form-item>
      <el-form-item prop="tel" :id="showMore ? 'show-hidden' :''">
        <el-input
          v-model="dataForm.tel"
          placeholder="联系电话"
          size="small"
          class="input"
          clearable="clearable"
          @keyup.enter.native="searchHandle()"
      />
      </el-form-item>
      <el-form-item :id="showMore ? 'show-hidden' :''">
        <el-select
            v-model="dataForm.sex"
            class="input"
            placeholder="性别"
            size="small"
            clearable="clearable"
        >
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
      <el-form-item :id="showMore ? 'show-hidden' :''">
        <el-select
            v-model="dataForm.status"
            class="input"
            placeholder="状态"
            size="small"
            clearable="clearable"
        >
          <el-option label="无效" value="0" />
          <el-option label="有效" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item prop="hiredate" :id="showMore ? 'show-hidden' :''">
        入职日期：<el-date-picker
          v-model="dataForm.hiredate"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          placeholder="请输入入职日期"
          format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          size="small"
      />
      </el-form-item>
      <el-form-item prop="loginDate" :id="showMore ? 'show-hidden' :''">
        最近登录日期：<el-date-picker
          v-model="dataForm.loginDate"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          placeholder="请输入最近登录日期"
          format="YYYY-MM-DD HH:mm:ss"
          type="datetimerange"
          size="small"
      />
      </el-form-item>
      </div>
      <div class="button-item">
      <el-form-item>
        <!--size的medium是最大号的-->
        <el-button
            size="small"
            type="primary"
            @click="searchHandle()">
          <el-icon><Search /></el-icon>
          查询
        </el-button>
        <el-button size="small"
                   type="info"
                   @click="resetHandle()">
          <el-icon><RefreshRight /></el-icon>
          重置
        </el-button>
        <el-button
            size="small"
            type="success"
            :disabled="!isAuth(['ROOT', 'EMPLOYEE:INSERT'])"
            @click="addHandle()"
        >
          <el-icon><Plus /></el-icon>
          添加
        </el-button>
        <el-button
            size="small"
            type="danger"
            :disabled="!isAuth(['ROOT', 'EMPLOYEE:DELETE'])"
            @click="deleteHandle()"
        >
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
        <el-button
            class="more-arrow"
            link
            title="更多查询条件"
            @click="toggleSearch">
          {{ showMore ? '展开' : '收起' }}
        </el-button>
        <el-button type="primary"
                   size="small"
                   :id="showMore ? 'show-hidden' :''"
                   class="button"
                   :disabled="!isAuth(['ROOT', 'EMPLOYEE:UPLOAD'])"
                   @click="exportExcel">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
        <!--el-upload自带的成功和失败的执行方法，但是本项目暂时不用-->
        <!--:on-error="onError"和:on-success="onSuccess"-->
        <el-upload
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="handlerUpload"
            :id="showMore ? 'show-hidden' :''"
            :disabled="importDisabled || !isAuth(['ROOT', 'EMPLOYEE:UPLOAD'])"
            style="display: inline-flex;margin-right: 10px;">
          <el-button size="small"
                     :id="showMore ? 'show-hidden' :''"
                     :disabled="importDisabled || !isAuth(['ROOT', 'EMPLOYEE:UPLOAD'])"
                     type="success">
            <el-icon :class="importDataIcon ? '' : 'is-loading'">
              <component :is="importDataIcon ? UploadFilled : Loading"/>
            </el-icon>
            {{importDataText}}
          </el-button>
        </el-upload>
        <el-button size="small" type="primary" @click="printTable" :id="showMore ? 'show-hidden' :''">
          <el-icon><Search /></el-icon>
          打印
        </el-button>
        <el-button type="success"
                   size="small"
                   :id="showMore ? 'show-hidden' :''"
                   class="button"
                   :disabled="!isAuth(['ROOT', 'EMPLOYEE:UPLOAD'])"
                   @click="exportAllExcel">
          <el-icon><Download /></el-icon>
          导出全部
        </el-button>
      </el-form-item>
      </div>
    </el-form>
    <!--show-summary显示汇总-->
    <!--选中一行，按住SHIFT键滚动鼠标或者键盘的上下左右键都能让滚动条实现滚动。el-table-->
    <el-table :data="dataList" style="width: 100%" highlight-current-row
              :default-sort="{ prop: 'createTime', order: 'descending' }"
              border
              id="out-table"
              table-layout="auto"
              ref="multipleTableRef"
              @current-change="handleCurrentChange"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection" min-width="55" :selectable="selectable" header-align="center" align="center" />
      <el-table-column label="序号" type="index" min-width="70" header-align="center" align="center" fixed>
        <template #default="scope">
          <span>{{ (pageIndex - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" min-width="200" sortable
                       header-align="center" align="center"
                       column-key="createTime"
                       prop="createTime"
                       :filter-multiple="true"
                       :filters="filterData('createTime')"
                       :filter-method="filterHandler">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="真实姓名" min-width="120" sortable header-align="center" align="center"/>
      <el-table-column label="照片" min-width="80" header-align="center" align="center">
        <template #default="scope">
          <el-avatar :size="30" style="margin-right: 5px" :src="scope.row.photo" @error="errorHandler" loading = 'lazy'/>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="编号" min-width="100" sortable header-align="center" align="center"/>
      <el-table-column label="昵称" min-width="100" sortable header-align="center" align="center">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" width="auto">
            <template #default>
              <div>{{ scope.row.nickname }}</div>
            </template>
            <template #reference>
              <el-tag>{{ scope.row.nickname }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别"
                       :filter-multiple="true"
                       :filters="filterData('sex')"
                       :filter-method="filterHandler"
                       min-width="100" sortable header-align="center" align="center" />
      <el-table-column prop="tel" label="联系电话" min-width="130" sortable header-align="center" align="center"/>
      <el-table-column label="用户名" min-width="120" sortable header-align="center" align="center">
        <template #default="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="电子邮件" min-width="150" sortable header-align="center" align="center">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="top" min-width="auto">
            <template #default>
              <div>{{ scope.row.email }}</div>
            </template>
            <template #reference>
              <el-tag>{{ scope.row.email }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="部门" min-width="130" sortable header-align="center" align="center">
        <template #default="scope">
          <el-tag>{{ scope.row.deptName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="所属公司" min-width="130" sortable header-align="center" align="center">
        <template #default="scope">
          <el-tag>{{ scope.row.companyName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="出生日期" min-width="130" sortable header-align="center" align="center">
        <template #default="scope">
          {{ scope.row.birthday }}
        </template>
      </el-table-column>
      <el-table-column
          prop="roles"
          header-align="center"
          align="center"
          min-width="150"
          label="角色"
          :show-overflow-tooltip="true"
      />
      <el-table-column prop="hiredate" label="入职日期" min-width="130" sortable header-align="center" align="center"/>
      <el-table-column prop="loginDate" label="最近登录日期" min-width="180" sortable header-align="center" align="center"/>
      <el-table-column prop="status" label="状态" min-width="80" sortable header-align="center" align="center"/>
      <el-table-column label="操作" min-width="250" header-align="center" align="center" fixed="right">
        <template #default="scope">
          <el-button size="small"
                     type="info"
                     :disabled="!isAuth(['ROOT', 'EMPLOYEE:SELECT'])"
                     @click="selectDetailHandle(scope.row.id)"
                     plain
          >
            <el-icon><WarningFilled /></el-icon>
            详情
          </el-button>
          <el-button size="small"
                     type="primary"
                     :disabled="!isAuth(['ROOT', 'EMPLOYEE:UPDATE'])"
                     @click="updateHandle(scope.row.id)"
                     plain
          >
            <el-icon><EditPen /></el-icon>
            修改
          </el-button>
          <el-button
              size="small"
              type="danger"
              :disabled="!isAuth(['ROOT', 'EMPLOYEE:DELETE'])"
              @click="deleteHandle(scope.row.id)"
              plain
          >
            <el-icon><Delete /></el-icon>
            删除</el-button>
        </template>
      </el-table-column>
      <!--      <el-table-column width="200">-->
      <!--        <template #header>-->
      <!--          <el-input v-model="search" size="small" placeholder="快捷查询" />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>
    <el-pagination background
                   @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   :page-sizes="[10, 15, 20]"
                   :page-size="pageSize"
                   :total="totalCount"
                   layout="total, sizes, prev, pager, next, jumper" />
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="searchHandle"></add-or-update>
    <select-detail v-if="selectDetailVisible" ref="selectDetail"></select-detail>
  </div>

</template>

<script>
import {
  Delete,
  Download,
  Edit,
  EditPen, Loading,
  Plus,
  RefreshRight,
  Search,
  Timer,
  Upload, UploadFilled,
  WarningFilled
} from "@element-plus/icons-vue";
import {dayjs} from "element-plus";
import AddOrUpdate from "./employee-add-or-update.vue"
import selectDetail from "./employee-select-detail.vue"
import FileSaver from 'file-saver'
import * as XLSX from "xlsx";
import printJS from "print-js";

export default {
  components: {
    UploadFilled,
    WarningFilled,
    EditPen, RefreshRight, Search, Plus, Edit, Delete, Download, Upload, Timer,AddOrUpdate,selectDetail},
  data: function() {
    return {
      dataForm:{
        name: null,
        code: null,
        tel: null,
        role:null,
        hiredate: null,
        loginDate: null,
        sex:null,
        status:null
      },
      roleList:[],
      //详情也是否显示对应的栏位
      type:true,
      // 是否下拉显示更多
      showMore: true,
      errorHandler:true,
      //加载状态
      dataListLoading:false,
      //添加或者更新弹窗
      addOrUpdateVisible:false,
      //详情弹窗
      selectDetailVisible: false,
      //分页
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      //被选中的数据
      dataListSelections: [],
      //数据初始化
      dataList: [],
      // 导入按钮的文本
      importDataText: '导入数据',
      // 导入按钮的图标
      importDataIcon: true,
      // 导入按钮是否被禁用
      importDisabled: false,
      dataRule: {
        name: [{ required: false, pattern: '^[\u4e00-\u9fa5]{1,10}$', message: '姓名格式错误' }],
        tel: [{ required: false, pattern: '^1[0-9]{10}$', message: '联系电话格式错误' }]
      },
    };
  },
  computed:{
    Loading() {
      return Loading
    },
    UploadFilled() {
      return UploadFilled
    },
    // 筛选项
    // filterData(){
    //   return function(data){
    //     let obj = [];
    //     //找到对应的数据 并添加到obj
    //     this.dataList.filter(item => {
    //       obj.push({
    //         text: item.createTime,
    //         value: item.createTime
    //       })
    //     });
    //     //因为column有重复数据，所以要进行去重
    //     return this.deWeight(obj)
    //   }
    // },
    //循环遍历，防止打印时出现null与undefined的值
    printTableData() {
      return this.dataList.map(item => {
        const newItem = {}
        Object.keys(item).forEach(key => {
          if (!item[key]) {
            newItem[key] = ''
          }else {
            newItem[key] = item[key]
          }
        })
        return newItem
      })
    }
  },
  methods:{
    //上传Excel
    handlerUpload(param) {
      let that = this;
      let file = param.file;//获取到上传Excel
      let formData = new FormData();//通过formdata上传
      formData.append('file', file);
      that.$httpImg('user/uploadEmployeeExcel', 'POST', formData, true, function (resp) {
        if (resp.result) {
          that.onSuccess(resp.msg);
        } else {
          that.onError(resp.msg);
        }
      });
    },
    // 导入文件失败后回调
    onError(msg) {
      this.importDataText = '导入数据';
      this.importDataIcon = true;
      this.importDisabled = false;
      this.searchHandle();
      this.$message.error(msg);
    },
    // 导入文件成功后回调
    onSuccess(msg) {
      // 成功后文本修改为原来的导入数据
      this.importDataText = '导入数据';
      // 图标修改
      this.importDataIcon = true;
      // 将上传组件改为允许使用
      this.importDisabled = false;
      // 调用刷新数据的方法
      this.searchHandle();
      // message 弹出消息
      this.$message.success(msg);
    },
    // 上传文件调用
    beforeUpload() {
      // 将文本修改为正在导入
      this.importDataText = '正在导入';
      // 修改其图标
      this.importDataIcon = false;
      // 将其上传组件暂时禁用
      this.importDisabled = true;
    },
    //实现搜索隐藏
    toggleSearch () {
      this.showMore = !this.showMore;
    },
    //打印
    printTable(){
      let that = this;
      printJS({
        printable: that.printTableData,
        type: 'json',
        properties: [
          {field:'name',displayName:'真实姓名'},
          {field:'code',displayName:'编号'},
          {field:'nickname',displayName:'昵称'},
          {field:'sex',displayName:'性别'},
          {field:'tel',displayName:'联系电话'},
          {field:'username',displayName:'用户名'},
          {field:'email',displayName:'电子邮箱'},
          {field:'deptName',displayName:'部门'},
          {field:'companyName',displayName:'所属公司'},
          {field:'birthday',displayName:'出生日期'},
          {field:'hiredate',displayName:'入职日期'},
          {field:'loginDate',displayName:'最近登录日期'},
        ],
        gridHeaderStyle: 'color: red;  border: 2px solid #3971A5;',
        gridStyle: 'border: 2px solid #3971A5;',
        header:'<h3 class="custom">员工管理</h3>',
        style: '.custom { color: red; text-align: center;}'
      })
    },
    //筛选项
    filterData(data){
      let obj = this.dataList.map((item) => ({
        text: item[data],
        value: item[data]
      }))
      return this.deWeight(obj)
    },
    //导出Excel报表
    // exportExcel() {
    //   // 1.生成Excel工作簿对象
    //   // var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'));
    //   // 2.手机号，身份证号等会默认使用科学计数法表示，则需要这样设置
    //   var wb = XLSX.utils.table_to_book(
    //       document.querySelector("#out-table"),
    //       { raw: true }
    //   );
    //   // 获取二进制字符串作为输出
    //   var wbout = XLSX.write(wb, {
    //     bookType: 'xlsx',
    //     book: true,
    //     type: 'array',
    //   })
    //   try {
    //     FileSaver.saveAs(
    //         // Blob: 对象表示一个不可变 原始数据的类文件对象,不一定是JS原生格式的数据。
    //         // File: 基于Blob，继承了blob的功能并将其扩展使其支持用户系统上的文件。
    //         new Blob([wbout], { type: 'application/octet-stream' }),
    //         // 设置导出的文件名称可随意
    //         '员工管理.xlsx'
    //     )
    //   } catch (e) {
    //     if (typeof console != 'undefined') console.log(e, wbout);
    //   }
    //   // 返回一个新创建的Blob对象，其内容由参数中给定的数组串联组成。
    //   return wbout
    // },
    //导出Excel（选中或者当前页）
    exportExcel:function () {
      let that = this;
      let list = [];
      if (that.dataListSelections.length>0){ //如图我选择了导出那几条数据则导出我需要导出的数据（this.selectRows表示我选中导出数据的数组）
        list =that.dataListSelections  //选择导出部分代码
        that.exportList(list);
      } else {//如果木有选择则导出当前页全部数据
        list = that.dataList; //导出全部代码或条件查询出来的代码
        this.exportList(list);
      }
    },
    //导出全部数据
    exportAllExcel:function () {
      let that = this;
      that.$http('user/selectAllEmployeeExcel', 'GET', null, true, function (resp) {
        let list = resp.list;
        let status = { 0: '离职', 1: '在职' };
        for (let one of list){
          one.status = status[one.status];
        }
        that.exportList(list);
      })
    },
    exportList(list){
      let tableData = [
        ['序号','真实姓名', '编号','昵称', '性别',"手机号码","用户名","电子邮箱","部门","所属公司","入职日期","生日日期","最近登录状态","创建日期","状态"]//导出表头
      ] // 表格表头
      list.forEach ((item,index)=> {
        let rowData = []
        //导出内容的字段
        rowData = [
          index+1,
          item.name,
          item.code,
          item.nickname,
          item.sex,
          item.tel,
          item.username,
          item.email,
          item.deptName,
          item.companyName,
          item.hiredate,
          item.birthday,
          item.loginDate,
          item.createTime,
          item.status,
        ]
        tableData.push(rowData)
      })
      let ws = XLSX.utils.aoa_to_sheet(tableData)
      let wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '员工管理') // 工作簿名称
      XLSX.writeFile(wb, '员工管理.xlsx') // 保存的文件名
    },
    //初始化数据
    loadDataList: function() {
      let that = this;
      that.dataListLoading = true;
      let data = {
        role: that.dataForm.role,
        name: that.dataForm.name,
        code: that.dataForm.code,
        tel: that.dataForm.tel,
        status: that.dataForm.status,
        sex: that.dataForm.sex,
        page: that.pageIndex,
        length: that.pageSize
      };
      if (that.dataForm.hiredate != null && that.dataForm.hiredate.length === 2) {
        let startDate = that.dataForm.hiredate[0];
        let endDate = that.dataForm.hiredate[1];
        data.startHireDate = dayjs(startDate).format('YYYY-MM-DD');
        data.endHireDate = dayjs(endDate).format('YYYY-MM-DD');
      }
      if (that.dataForm.loginDate != null && that.dataForm.loginDate.length === 2) {
        let startDate = that.dataForm.loginDate[0];
        let endDate = that.dataForm.loginDate[1];
        data.startLoginDate = dayjs(startDate).format('YYYY-MM-DD');
        data.endLoginDate = dayjs(endDate).format('YYYY-MM-DD');
      }
      that.$http('user/searchEmployeeByPage', 'POST', data, true, function(resp) {
        let page = resp.page;
        let status = { 0: '离职', 1: '在职' };
        for (let one of page.list) {
          one.status = status[one.status];
        }
        that.dataList = page.list;
        that.totalCount = page.totalCount;
      });
      that.$http('role/searchAllRole', 'GET', null, true, function(resp) {
        that.roleList = resp.roleList;
      });
      that.dataListLoading = false;
    },
    sizeChangeHandle: function(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.loadDataList();
    },
    currentChangeHandle: function(val) {
      this.pageIndex = val;
      this.loadDataList();
    },
    searchHandle: function() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$refs['dataForm'].clearValidate();
          if (this.dataForm.name === '') {
            this.dataForm.name = null;
          }
          if (this.dataForm.code === '') {
            this.dataForm.code = null;
          }
          if (this.dataForm.tel === '') {
            this.dataForm.tel = null;
          }
          if (this.dataForm.status === '') {
            this.dataForm.status = null;
          }
          if (this.dataForm.sex === '') {
            this.dataForm.sex = null;
          }
          if (this.pageIndex !== 1) {
            this.pageIndex = 1;
          }
          this.loadDataList();
        } else {
          return false;
        }
      });
    },
    //选中的焦点
    selectionChangeHandle: function(val) {
      this.dataListSelections = val;
    },
    //高亮选中行
    handleCurrentChange:function (val) {
      this.currentRow = val;
    },
    //返回符合条件的数据
    // 参数分别是：选中的条件 、当前行 、当前列
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    // 数组对象去重
    deWeight(arr) {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].text === arr[j].text) {
            arr.splice(j, 1);
            j--;
          }
        }
      }
      return arr;
    },
    //更新方法
    updateHandle: function(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    //新增方法
    addHandle: function() {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init();
      });
    },
    //详情
    selectDetailHandle: function (id) {
      this.selectDetailVisible = true;
      this.$nextTick(() => {
        this.$refs.selectDetail.init(id,this.type);
      });
    },
    //批量删除与单笔删除的方法
    deleteHandle:function(id) {
      let that = this;
      let ids = id
          ? [id]
          : that.dataListSelections.map(item => {
            return item.id;
          });
      if (ids.length === 0) {
        that.$message({
          message: '没有选中记录',
          type: 'warning',
          duration: 1200
        });
      } else {
        that.$confirm(`确定要删除选中的记录？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http('user/deleteUserByIds', 'POST', {ids: ids}, true, function (resp) {
            if (resp.rows > 0) {
              that.$message({
                message: '操作成功',
                type: 'success',
                duration: 1200
              });
              that.loadDataList();
            } else {
              that.$message({
                message: '未能删除记录',
                type: 'warning',
                duration: 1200
              });
            }
          });
        });
      }
    },
    //重置查询条件内的内容
    resetHandle:function () {
      this.$refs.dataForm.resetFields();
      this.dataForm.status = null;
      this.dataForm.sex = null;
      this.dataForm.role = null;
      this.searchHandle();
    }
  },
  //表单创建前先初始化
  created: function() {
    this.loadDataList();
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/admin-role/index.scss";
</style>
