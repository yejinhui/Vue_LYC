<template>
  <el-dialog
      :title="'详情'"
      v-if="isAuth(['ROOT', 'EMPLOYEE:SELECT'])"
      :close-on-click-modal="false"
      v-model="visible"
      class="dialog"
      width="1060px"
  >
    <el-form :inline="true" :model="dataForm" ref="dataForm" :rules="dataRule" label-width="auto">
      <el-form-item label="照片:" prop="photo">
          <el-avatar :size="52" v-if="dataForm.photo" :src="dataForm.photo" @error="errorHandler" loading = 'lazy'/>
          <el-text class="el-text-cont" v-else >图片不存在</el-text>
      </el-form-item>
      <br/>
      <el-form-item label="编号:" prop="code">
        <el-text class="el-text-cont">{{ dataForm.code }}</el-text>
      </el-form-item>
      <el-form-item label="真实姓名:" prop="name">
        <el-text class="el-text-cont">{{ dataForm.name }}</el-text>
      </el-form-item>
      <el-form-item label="用户名:" prop="username">
        <el-text class="el-text-cont">{{ dataForm.username }}</el-text>
      </el-form-item>
      <el-form-item label="电子邮件:" prop="email">
        <el-text class="el-text-cont">{{ dataForm.email }}</el-text>
      </el-form-item>
      <el-form-item label="部门:" prop="deptName" v-show="type">
        <el-text class="el-text-cont">{{ dataForm.deptName }}</el-text>
      </el-form-item>
      <el-form-item label="公司:" prop="companyName" v-show="type">
        <el-text class="el-text-cont">{{ dataForm.companyName }}</el-text>
      </el-form-item>
      <el-form-item label="昵称:" prop="nickname">
        <el-text class="el-text-cont">{{ dataForm.nickname }}</el-text>
      </el-form-item>
      <el-form-item label="联系电话:" prop="tel">
        <el-text class="el-text-cont">{{ dataForm.tel }}</el-text>
      </el-form-item>
      <el-form-item label="出生日期:" prop="birthday">
        <el-text class="el-text-cont">{{ dataForm.birthday }}</el-text>
      </el-form-item>
      <el-form-item label="入职日期:" prop="hiredate" v-show="type">
        <el-text class="el-text-cont">{{ dataForm.hiredate }}</el-text>
      </el-form-item>
      <el-form-item label="性别:" prop="sex">
        <el-text class="el-text-cont">{{ dataForm.sex }}</el-text>
      </el-form-item>
      <el-form-item label="角色:" prop="roles" v-show="type">
        <el-text class="el-text-cont">{{ dataForm.roles }}</el-text>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-text class="el-text-cont">{{ dataForm.status }}</el-text>
      </el-form-item>
      <el-form-item label="创建时间:" prop="createTime">
        <el-text class="el-text-cont">{{ dataForm.createTime }}</el-text>
      </el-form-item>
      <el-form-item label="最近登录时间:" prop="loginDate">
        <el-text class="el-text-cont">{{ dataForm.loginDate }}</el-text>
      </el-form-item>
    </el-form>
    <template #footer>
			<span class="dialog-footer">
				<el-button size="medium" type="danger" @click="visible = false"><el-icon><Close /></el-icon>关闭</el-button>
			</span>
    </template>
  </el-dialog>
</template>

<script>
import {Close, Plus} from "@element-plus/icons-vue";

export default {
  components: {Close, Plus},
  data: function() {
    return {
      visible: false,
      errorHandler: true,
      type:null,
      dataForm: {
        id: null,
        roles:null,
        photo: null,
        name: null,
        username: null,
        password: null,
        code: null,
        nickname: null,
        companyName: null,
        deptName: null,
        sex: null,
        createTime: null,
        loginDate: null,
        tel: null,
        hiredate: null,
        birthday: null,
        status:null,
        email: null
      },
    };
  },
  methods: {
    init: function(id,type) {
      let that = this;
      that.dataForm.id = id || 0;
      that.type = type;
      that.visible = true;
      that.$nextTick(() => {
        that.$refs['dataForm'].resetFields();
        if (id) {
          that.$http('user/searchUserById', 'POST', { id: id }, false, function(resp) {
            let params = resp.params;
            that.dataForm.photo = params.photo;
            that.dataForm.name = params.name;
            that.dataForm.createTime = params.createTime;
            that.dataForm.loginDate = params.loginDate;
            that.dataForm.username = params.username;
            that.dataForm.code = params.code;
            that.dataForm.nickname = params.nickname;
            that.dataForm.sex = params.sex;
            that.dataForm.tel = params.tel;
            that.dataForm.deptName = params.deptName;
            that.dataForm.companyName = params.companyName;
            that.dataForm.hiredate = params.hiredate;
            that.dataForm.birthday = params.birthday;
            that.dataForm.email = params.email;
            that.dataForm.roles = params.roles;
            if (params.status === 1) {
              that.dataForm.status = '有效';
            }else if(params.status === 0) {
              that.dataForm.status = '无效';
            }
          });
        }
      });
    },
  },
};
</script>
<style>
.el-text-cont{
  width: 200px;
}
</style>
