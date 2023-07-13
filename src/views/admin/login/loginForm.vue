<template>
  <div class="login-form">
        <h1 class="login-title">登录</h1>
    <div v-if="!qrCodeVisible">
        <div class="row">
            <el-input
                placeholder="请输入账号"
                :prefix-icon="User"
                v-model="username"
                size="large"
                clearable="clearable"
            >
            </el-input>
        </div>
        <div class="row">
            <el-input
                placeholder="请输入密码"
                show-password :prefix-icon="Unlock"
                v-model="password"
                size="large"
                clearable="clearable"
                @keyup.enter.native="login"
            >
            </el-input>
        </div>
        <div class="row">
            <el-checkbox v-model="loginCheck">七天登录时长</el-checkbox>
        </div>
        <div class="row">
            <el-button
                type="primary"
                class="login-btn"
                size="large"
                @click="login">
                登录
            </el-button>
        </div>
    </div>
  </div>
</template>

<script>
import 'element-plus/theme-chalk/display.css';
import {isUsername,isPassword} from '@/utils/validate.js';
import router from '@/router/index.js';
import {User,Unlock} from "@element-plus/icons-vue";
export default {
  computed: {
    Unlock() {
      return Unlock
    },
    User() {
      return User
    }
  },
  data: function() {
    return {
      username: null,
      password: null,
      msg:null,
      loginCheck:false,
      qrCodeVisible: false
    };
  },
  methods: {
    login:function() {
      let that = this;
      if (!isUsername(that.username)) {
        //只显示一个
        that.$message.closeAll();
        that.$message({
          message: '用户名格式不正确!（必须5位）',
          type: 'error',
          duration: 1200
        });
      } else if (!isPassword(that.password)) {
        //只显示一个
        that.$message.closeAll();
        that.$message({
          message: '密码格式不正确!（必须6位）',
          type: 'error',
          duration: 1200
        });
      } else {
        let data = {username: that.username, password: that.password,loginCheck:that.loginCheck};
        that.$http("user/login", "POST", data, "true", function (resp) {
          if (resp.result) {
            let permissions = resp.permissions;
            let token = resp.token;
            localStorage.setItem("permissions", permissions);
            localStorage.setItem("token", token);
            let i = 4
            let time = setInterval(function(){/*设置循环的计时器*/
              i--;
              //只显示一个
              that.$message.closeAll();
              that.$message({
                message: '登录成功,'+i+'秒后跳转....',
                type: 'success',
                duration: 1000
              });
              if(i === 1){
                clearInterval(time)/*移除定时器*/
                function myMessage() {
                  if (permissions.indexOf('EMPLOYEE:SEE') !== -1 || permissions.indexOf('ROOT') !== -1){
                    that.$router.push({name: "AdminHome"})
                  }else if (permissions.indexOf('USER:SEE') !== -1 || permissions.indexOf('ROOT') !== -1){
                    that.$router.push({name: "Home"})
                  }else{
                    // console.log(permissions.indexOf('ROOT'))
                    that.$router.push({name: "Login"});
                    that.$message({
                      message: '你没有权限访问任何页面，请联系管理员！',
                      type: 'error',
                      duration: 1200
                    });
                  }
                }
                setTimeout(myMessage, 1100);
              }
            },1000)
          } else {
            //只显示一个
            that.$message.closeAll();
            that.$message({
              message: resp.msg == null ? '登录失败!': '登录失败!' + resp.msg,
              type: 'error',
              duration: 1200
            });
          }
        })
      }
    }
  }
};
</script>

<style lang="less" scoped="scoped">
@import url('../less/login.less');
</style>
