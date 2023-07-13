<template>
    <div class="register-form">
        <h1 class="register-title">注册</h1>
      <div v-if="!qrCodeVisible">
        <div class="row">
            <el-input placeholder="请输入账号"
                      :prefix-icon="User"
                      v-model="username"
                      size="large">
            </el-input>
        </div>
        <div class="row">
            <el-input placeholder="请输入密码"
                      show-password :prefix-icon="Unlock"
                      v-model="password"
                      size="large">
            </el-input>
        </div>
        <div class="row">
            <el-input placeholder="请输入邮箱"
                      :prefix-icon="Message"
                      v-model="email"
                      size="large">
            </el-input>
        </div>
        <div class="row">
          <el-input placeholder="请输入真实姓名"
                    :prefix-icon="Avatar"
                    v-model="name"
                    size="large">
          </el-input>
        </div>
        <div class="row">
          <el-input placeholder="请输入联系电话"
                    :prefix-icon="Promotion"
                    v-model="tel"
                    size="large">
          </el-input>
        </div>
        <div class="row">
          <el-radio v-model="sex" label="男" border>男</el-radio>
          <el-radio v-model="sex" label="女" border>女</el-radio>
        </div>
        <div class="row">
            <el-button
                type="primary"
                class="register-btn"
                size="large"
                @click="registerRef">
              注册
            </el-button>
        </div>
      </div>
    </div>
</template>

<script>
import 'element-plus/theme-chalk/display.css';
import {isUsername, isPassword, isEmail, isMobile,isName} from '@/utils/validate.js';
import router from '@/router/index.js';
import {User, Message, Avatar, Promotion, Unlock} from "@element-plus/icons-vue";
export default {
  computed: {
    Unlock() {
      return Unlock
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
  data: function() {
    return {
      username: null,
      password: null,
      email:null,
      msg: null,
      sex:"男",
      tel:null,
      name:null,
      qrCodeVisible: false
    };
  },
  methods: {
    registerRef:function() {
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
      } else if (!isEmail(that.email)) {
        //只显示一个
        that.$message.closeAll();
        that.$message({
          message: '邮箱格式不正确!',
          type: 'error',
          duration: 1200
        });
      }else if (!isName(that.name)) {
        //只显示一个
        that.$message.closeAll();
        that.$message({
          message: '真实姓名格式不正确!（必须大于等2位字符）',
          type: 'error',
          duration: 1200
        });
      }else if (!isMobile(that.tel)) {
        //只显示一个
        that.$message.closeAll();
        that.$message({
          message: '电话格式不正确!（必须11位）',
          type: 'error',
          duration: 1200
        });
      } else {
        let data = {username: that.username, password: that.password,email: that.email,name: that.name,tel: that.tel,sex: that.sex};
        that.$http("user/register", "POST", data, "true", function (resp) {
          if (resp.result) {
            let permissions = resp.permissions
            let token = resp.token
            localStorage.setItem("permissions", permissions)
            localStorage.setItem("token", token)
            let i = 4
            let time = setInterval(function(){/*设置循环的计时器*/
              i--;
              //只显示一个
              that.$message.closeAll();
              that.$message({
                message: '注册成功,'+i+'秒后跳转....',
                type: 'success',
                duration: 1000
              });
              if(i === 1){
                clearInterval(time)/*移除定时器*/
                function myMessage() {
                  that.$router.push({name: "Home"})
                }
                setTimeout(myMessage, 1100);
              }
            },1000)
          } else {
            //只显示一个
            that.$message.closeAll();
            that.$message({
              message: resp.msg == null ? '注册失败!': '注册失败!' + resp.msg,
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
