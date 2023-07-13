<template>
  <el-dialog title="修改个人资料" v-model="visible" width="25%" class="updateInfo">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="照片" prop="photo" class="itemImg">
        <!--        <img :src="dataForm.photo" alt="照片">--><!--            multiple="multiple"-->
        <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            action="html"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :http-request="handlerUpload"
        >
          <el-avatar :size="52" style="margin-right: 5px" v-if="dataForm.photo" :src="dataForm.photo" @error="dataForm.errorHandler" loading = 'lazy'/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="dataForm.username" size="medium" :prefix-icon="User" clearable/>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input type="text" v-model="dataForm.nickname" size="medium" :prefix-icon="User" clearable/>
      </el-form-item>
      <el-form-item label="真实姓名" prop="name">
        <el-input type="text" v-model="dataForm.name" size="medium" :prefix-icon="Avatar" clearable/>
      </el-form-item>
      <el-form-item label="生日日期" prop="birthday">
        <div class="block">
          <el-date-picker
              style="width:100%"
              v-model="dataForm.birthday"
              format="YYYY-MM-DD"
              type="datetime"
              placeholder="请选择日期"
              :shortcuts="dataForm.shortcuts"
          />
        </div>
      </el-form-item>
      <el-form-item label="入职日期" prop="hiredate"
                    v-show="isAuth(['ROOT','EMPLOYEE:SEE'])">
        <div class="block">
          <el-date-picker
              style="width:100%"
              v-model="dataForm.hiredate"
              format="YYYY-MM-DD HH:mm:ss"
              type="datetime"
              placeholder="请选择日期"
              :shortcuts="dataForm.shortcuts"
              :disabled="!isAuth(['ROOT','EMPLOYEE:INFOUPDATE'])"
          />
        </div>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio v-model="dataForm.sex" label="男" border>男</el-radio>
        <el-radio v-model="dataForm.sex" label="女" border>女</el-radio>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input type="text" v-model="dataForm.email" size="medium" :prefix-icon="Message" clearable/>
      </el-form-item>
      <el-form-item label="联系电话" prop="tel">
        <el-input type="text" v-model="dataForm.tel" size="medium" :prefix-icon="Promotion" clearable/>
      </el-form-item>
      <el-form-item label="所属部门"
                    prop="deptname"
                    v-show="isAuth(['ROOT','EMPLOYEE:SEE'])">
        <el-select v-model="dataForm.deptName"
                   class="m-2"
                   placeholder="请选择部门" size="large"
                   :disabled="!isAuth(['ROOT','EMPLOYEE:INFOUPDATE'])">
          <el-option
              v-for="item in dataForm.deptNameList"
              :key="item.id"
              :label="item.deptName"
              :value="item.deptName"
              placeholder="请选择部门"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属公司"
                    prop="companyname"
                    v-show="isAuth(['ROOT','EMPLOYEE:SEE'])">
        <el-select v-model="dataForm.companyName"
                   class="m-2"
                   placeholder="请选择所属公司"
                   size="large"
                   :disabled="!isAuth(['ROOT','EMPLOYEE:INFOUPDATE'])">
          <el-option
              v-for="item in dataForm.companyNameList"
              :key="item.id"
              :label="item.companyName"
              :value="item.companyName"
              placeholder="请选择所属公司"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
			<span class="dialog-footer">
				<el-button size="medium" @click="visible = false">取消</el-button>
				<el-button type="primary" size="medium" @click="dataFormSubmit">确定</el-button>
			</span>
    </template>
  </el-dialog>
</template>

<script>
import {ref} from 'vue'
import {User, Message, Avatar, Promotion, UserFilled, Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

export default {
  computed: {
    UserFilled() {
      return UserFilled
    },
    Promotion() {
      return Promotion
    },
    Avatar() {
      return Avatar
    },
    Message() {
      return Message
    },
    User() {
      return User
    }
  },
  components: {
    Plus,
    ref
  },
  data() {
    return {
      visible: false,
      dataForm: {
        username: '',
        nickname: '',
        deptNameList: [],
        companyNameList: [],
        errorHandler: true,
        photo: '',
        name: '',
        email: '',
        sex: '',
        birthday: '',
        hiredate: '',
        deptName: '',
        companyName: '',
        shortcuts: [
          {
            text: '今天',
            value: new Date(),
          },
          {
            text: '昨天',
            value: () => {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              return date
            },
          },
          {
            text: '一周前',
            value: () => {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              return date
            },
          },
          // {
          //   text: '一周后',
          //   value: () => {
          //     const date = new Date()
          //     date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
          //     return date
          //   }
          // }
        ],
        tel: ''
      },
      dataRule: {
        username: [{pattern: '^[a-zA-Z0-9]{5,50}$', message: '用户名格式错误（5位以上）'}],
        nickname: [{pattern: '^[\u4e00-\u9fa5]{3,20}$', message: '昵称格式错误（3位以上中文名称）'}],
        name: [{pattern: '^[\u4e00-\u9fa5]{2,20}$', message: '真实姓名格式错误（3位以上中文名称）'}],
        email: [{
          pattern: '^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$',
          message: '电子邮箱格式错误'
        }],
        tel: [{pattern: '^1[0-9]{10}$', message: '联系电话格式错误'}]
      }
    };
  },
  methods: {
    init: function () {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();
      });
      let that = this;
      //加载用户数据
      that.$http('user/selectUserInfo', 'GET', null, true, function (resp) {
          let param = resp.param;
          that.dataForm.name = param.name;
          that.dataForm.username = param.userName;
          that.dataForm.photo = param.photo;
          that.dataForm.email = param.email;
          that.dataForm.sex = param.sex;
          that.dataForm.birthday = param.birthday;
          that.dataForm.hiredate = param.hiredate;
          that.dataForm.deptName = param.deptName;
          that.dataForm.companyName = param.companyName;
          that.dataForm.tel = param.tel;
          that.dataForm.nickname = param.nickname;
      });
      //加载部门下拉数据
      that.$http('dept/selectDeptInfoList', 'GET', null, true, function (resp) {
        that.dataForm.deptNameList = resp.deptNameList
      });
      //加载公司下拉数据
      that.$http('company/selectCompanyInfoList', 'GET', null, true, function (resp) {
        that.dataForm.companyNameList = resp.companyNameList
      });
    },
    dataFormSubmit: function () {
      let that = this;
      that.$refs['dataForm'].validate(function (valid) {
        if (valid) {
          let data = that.dataForm;
          that.$http("user/updateUserInfo", "POST", data, true, function (resp) {
            if (resp.rows === 1) {
              that.$message({
                message: '资料修改成功',
                type: 'success',
                duration: 1200
              });
              that.$emit('changeHandle', that.dataForm.photo, that.dataForm.name);
              // that.$emit('changeHandle', that.dataForm.name);
              that.visible = false;
              that.$emit('resetDataList');
            } else {
              that.$message({
                message: '资料修改失败',
                type: 'error',
                duration: 1200
              });
            }
          })
        }
      })
    },
    handlerUpload(param) {
      let that = this;
      let file = param.file;//获取到上传的图片
      let formData = new FormData();//通过formdata上传
      formData.append('file', file);
      that.$httpImg('user/uploadPicSaveById', 'POST', formData, true, function (resp) {
        if (resp && resp.code === 200) {
          that.dataForm.photo = resp.photo;
          that.$emit('photoHandle', resp.photo);
          that.$emit('resetDataList');
          that.$message({
            message: resp.msg,
            type: 'success',
            duration: 1200
          });
        } else {
          that.$message({
            message: resp.msg,
            type: 'error',
            duration: 1200
          });
          that.$router.push({name: "Login"})
        }
      });
    },
    handleAvatarSuccess() {

    },
    beforeAvatarUpload(file) {
      let isJPG = file.type === "image/jpg" || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      let isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG、PNG、GIF 格式!");
      } else if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
  // updated:function (){
  //   this.$emit('resetDataList');
  // }
};
</script>
<style lang="scss">
@import '@/assets/scss/index';
</style>
