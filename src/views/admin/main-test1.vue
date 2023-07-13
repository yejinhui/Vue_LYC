<template>
  <div
      class="site-wrapper"
      :class="{ 'site-sidebar--fold': sidebarFold }"
      v-loading.fullscreen.lock="loading"
      element-loading-text="拼命加载中"
  >
    <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
      <div class="site-navbar__header">
        <h1 class="site-navbar__brand">
          <a class="site-navbar__brand-lg" @click="pushHandle(link1)">{{ titleName1 }}</a>
          <a class="site-navbar__brand-mini" @click="pushHandle(link2)">{{ titleName2 }}</a>
        </h1>
      </div>
      <div class="site-navbar__body clearfix">
        <button style="width: 50px;height: 100%;padding: 0;margin: 0;border: 0;float: left" index="0" @click="handleSwitch">
          <el-icon size="20">
            <component :is="icon3" name="zhedie" class="icon-svg"/>
          </el-icon>
        </button>
        <div class="breadcrumbEl">
          <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item v-for="item in mainTabs" :key="item.path" :to="{ path: item.path }">
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="menu--right">
          <el-dropdown>
                    <span class="el-dropdown-Alink">
              <el-avatar :size="35" style="margin-right: 5px" :src="photo" @error="errorHandler" loading='lazy'/>
                      {{ name }}
                      <!--下拉箭头-->
                      <!--<el-icon class="el-icon--right">
                           <arrow-down/>
                      </el-icon>-->
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>{{ name }}</el-dropdown-item>
                <el-dropdown-item divided @click="updateUserInfoHandle()">修改资料</el-dropdown-item>
                <el-dropdown-item @click="updatePasswordHandle()">修改密码</el-dropdown-item>
                <el-dropdown-item divided @click="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <update-password v-if="updatePasswordVisible" ref="updatePassword"></update-password>
          <update-user-info v-if="updateUserInfoVisible" ref="updateUserInfo" @changeHandle="changeHandle"
                            @photoHandle="photoHandle"></update-user-info>
        </div>
      </div>
    </nav>
    <aside class="site-sidebar site-sidebar--dark" v-loading="loading_car">
      <div class="site-sidebar__inner">
        <!-- 侧边栏菜单区域(unique-opened为true时，可以控制菜单侧边栏显示，是否只显示一个子菜单） -->
        <el-menu
            :default-active="menuActiveName || 'home'"
            :collapse="sidebarFold"
            :collapseTransition="false"
            class="site-sidebar__menu"
        >
          <el-menu-item index="home" @click="$router.push({ name: 'AdminHome' })">
            <SvgIcon name="home" class="icon-svg"/>
            <span slot="title">首页</span>
          </el-menu-item>
          <!-- 一级菜单 -->
          <el-sub-menu v-for="item in moduleList"
                       :key="item.id"
                       :index="item.id"
                       :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'"
                       v-show="permisModuleCode(item.moduleCode)"
                       hide-on-click="true">
            <!-- 一级菜单模板区域 -->
            <template #title>
              <el-icon>
                <component :is="item.iconName" />
              </el-icon>
              <span slot="title">{{ item.moduleName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="subItem in item.childList"
                          :key="subItem.id"
                          :index="subItem.id"
                          v-show="permisModuleCode(subItem.moduleCode)"
                          @click="pushHandle(subItem.link)">
              <template #title>
                <el-icon>
                  <component :is="subItem.iconName"/>
                </el-icon>
                <span slot="title">{{ subItem.moduleName }}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
    </aside>
    <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
      <main class="site-content" :class="{ 'site-content--tabs': $route.meta.isTab }">
        <el-tabs class="tabSign"
                 v-if="$route.meta.isTab"
                 v-model="mainTabsActiveName"
                 :closable="true"
                 effect="dark"
                 @tab-click="selectedTabHandle"
                 @tab-remove="removeTabHandle"
        >
          <el-tab-pane v-for="item in mainTabs" :name="item.name" :key="item.name">
            <template #label>
              <span class="custom-tabs-label">
          <!--下拉选项-->
          <el-dropdown class="site-tabs__tools" ref="dropdownRef" :id="item.name"  trigger="contextmenu" @visible-change="handleChange($event, item.name)">
            <!--页签名称-->
              <span>
            <!--<el-icon><ArrowRight/></el-icon>-->
            <el-icon><component :is="item.icon" /></el-icon>{{ item.title }}</span>
          <template #dropdown>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="tabsreloadCurrentHandle" :disabled="handDisabled('tabsreloadCurrentHandle', item, index)">
                <el-icon><Refresh /></el-icon>重新刷新
              </el-dropdown-item>
              <el-dropdown-item @click.native="tabsCloseCurrentHandle" :disabled="handDisabled('tabsCloseCurrentHandle', item, index)">
                <el-icon><Close /></el-icon>关闭当前
              </el-dropdown-item>
              <el-dropdown-item @click.native="tabsCloseOtherHandle" :disabled="handDisabled('tabsCloseOtherHandle', item, index)">
                <el-icon><Remove /></el-icon>关闭其它
              </el-dropdown-item>
              <el-dropdown-item @click.native="tabsCloseAllHandle" :disabled="handDisabled('tabsCloseAllHandle', item, index)">
                <el-icon><Minus /></el-icon>关闭全部
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

          </span>
            </template>
            <el-card :body-style="siteContentViewHeight">
              <iframe
                  v-if="item.type === 'iframe'"
                  :src="item.iframeUrl"
                  width="100%"
                  height="100%"
                  frameborder="0"
                  scrolling="yes"
              ></iframe>
              <router-view v-if="item.name === mainTabsActiveName"/>
            </el-card>
          </el-tab-pane>
        </el-tabs>
        <!-- 主入口标签页 e -->
        <el-card v-else :body-style="siteContentViewHeight">
          <!-- 子路由标签 -->
          <router-view/>
        </el-card>
      </main>
    </div>
  </div>
</template>

<script>
import UpdateUserInfo from "@/views/public/update-Info.vue";
import UpdatePassword from '@/views/public/update-password.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import {isURL} from '@/utils/validate';
import {ref, provide,toRaw} from 'vue';
import {ArrowRight, Close, Fold, Grid, Minus, Refresh, Remove} from "@element-plus/icons-vue";
import Sortable from "sortablejs";

export default {
  computed: {
    ArrowRight() {
      return ArrowRight
    }
  },
  components: {Fold, ArrowRight, Minus, Remove, Close, Refresh, Grid, UpdateUserInfo, SvgIcon, UpdatePassword},
  data: function () {
    return {
      navbarLayoutType: '',
      sidebarFold: false,
      sidebarLayoutSkin: 'dark',
      // 左侧菜单数据对象
      moduleList: [],
      errorHandler: true,
      //加载属性
      loading_car: true,
      //图片切换
      icon3:null,
      icon1:null,
      icon2: null,
      //抬头名称
      titleName1: '',
      titleName2: '',
      link1: '',
      link2: '',
      iconName: '',
      //登录图片与名称
      name: '',
      photo: '',
      //下拉数据
      dropdownList:[],
      dropdownRef:null,
      documentClientHeight: 0,
      siteContentViewHeight: {},
      //自定义高度
      height: null,
      //存储Tabs生成
      mainTabs: [],
      mainTabsActiveName: '',
      menuActiveName: '',
      //更新个人资料模块是否显示
      updateUserInfoVisible: false,
      //更新密码模块是否显示
      updatePasswordVisible: false
    };
  },
  created() {
    let that = this;
    that.routeHandle(that.$route);
  },
  watch: {
    $route: {
      handler(to, from) {
        if (to.path !== from.path) {
          // this.$router.push(to);
          this.routeHandle(to);
        }
      }
    },
    mainTabs(newTag,oldTag){
      // console.log(newTag)
      if (this.mainTabs.length > 1) {
        this.rowDrop();
      }
    }
  },
  methods: {
    toRaw,
    ref,
    //菜单控件显示状态
    handleSwitch: function () {
      if (this.sidebarFold) {
        this.navbarLayoutType = '';
        this.icon3 = this.icon1;//'Fold'
      } else {
        this.navbarLayoutType = 'fold';
        this.icon3 = this.icon2;//'Expand'
      }
      this.sidebarFold = !this.sidebarFold;
    },
    //重置高度
    resetDocumentClientHeight: function () {
      this.documentClientHeight = document.documentElement['clientHeight'];
      window.onresize = () => {
        this.documentClientHeight = document.documentElement['clientHeight'];
        this.loadSiteContentViewHeight();
      };
    },
    //加载视图的高度
    loadSiteContentViewHeight: function () {
      let height = this.documentClientHeight - 50 - 30 - 2;
      if (this.$route.meta.isTab) {
        height -= 40;
        this.siteContentViewHeight = isURL(this.$route.meta.iframeUrl)
            ? {height: height + 'px'}
            : {minHeight: height + 'px'};
        this.height = provide('height', {height: height - 40 + 'px'})
      }
      this.siteContentViewHeight = {minHeight: height + 'px'};
    },
    routeHandle: function (route) {
      //每次切换页面，重新计算页面高度和内容区高度
      this.resetDocumentClientHeight();
      this.loadSiteContentViewHeight();

      if (route.meta.isTab) {
        // tab选中, 不存在先添加
        let tab = this.mainTabs.filter(item => item.name === route.name)[0];
        if (!tab) {
          if (route.meta.isDynamic) {
            route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0];
            if (!route) {
              return console.error('未能找到可用标签页!');
            }
          }
          tab = {
            menuId: route.meta.menuId || route.name,
            name: route.name,
            title: route.meta.title,
            path: route.path,
            icon: route.meta.icon,
            type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
            iframeUrl: route.meta.iframeUrl || '',
            params: route.params,
            query: route.query
          };
          this.mainTabs = this.mainTabs.concat(tab);
        }
        this.menuActiveName = tab.menuId + '';
        this.mainTabsActiveName = tab.name;
      }

    },
    //退出登录
    logout: function () {
      let that = this;
      that.$http("user/logout", "GET", null, true, function (resp) {
        //退出登陆之后没有必要在storage中保存用户权限，所以删除permissions
        localStorage.removeItem("permissions");
        localStorage.removeItem("token");
        //跳转到登陆页面
        that.$router.push({name: "Login"});
      })
    },
    //更新密码
    updatePasswordHandle: function () {
      let that = this;
      that.updatePasswordVisible = true;
      //清空表单控件，然后显示弹窗。
      that.$nextTick(() => {
        // debugger;
        that.$refs.updatePassword.init();
      });
    },
    //修改个人资料
    updateUserInfoHandle: function () {
      let that = this;
      that.updateUserInfoVisible = true;
      //清空表单控件，然后显示弹窗。
      that.$nextTick(() => {
        //debugger;
        that.$refs.updateUserInfo.init();
      });
    },
    //选择的页签
    selectedTabHandle: function (tab, e) {
      // console.log(this.mainTabs)
      tab = this.mainTabs.filter(item => item.name === tab.paneName);
      if (tab.length >= 1) {
        this.$router.push({
          name: tab[0].name,
          query: tab[0].query,
          params: tab[0].params
        });
      }
    },
    //移除页签
    removeTabHandle: function (tabName) {
      this.mainTabs = this.mainTabs.filter(item => item.name !== tabName);
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        if (tabName === this.mainTabsActiveName) {
          var tab = this.mainTabs[this.mainTabs.length - 1];
          this.$router.push(
              {name: tab.name, query: tab.query, params: tab.params},
              () => {
                this.mainTabsActiveName = this.$route.name;
              }
          );
        }
      } else {
        this.menuActiveName = '';
        this.$router.push({name: 'AdminHome'});
      }
    },
    // tabs, 关闭当前
    tabsCloseCurrentHandle: function () {
      this.removeTabHandle(this.mainTabsActiveName);
    },
    // tabs, 关闭其它
    tabsCloseOtherHandle: function () {
      this.mainTabs = this.mainTabs.filter(item => item.name === this.mainTabsActiveName);
    },
    // tabs, 关闭全部
    tabsCloseAllHandle: function () {
      this.mainTabs = [];
      this.menuActiveName = '';
      this.$router.push({name: 'AdminHome'});
    },
    //刷新当前
    tabsreloadCurrentHandle: function (item) {
      this.mainTabsActiveName.goto;
    },
    //点击执行的懒加载的方法
    pushHandle: function (resp) {
      this.$router.push({name: resp})
    },
    //将没有权限的菜单进行隐藏
    permisModuleCode: function (moduleCode) {
      let permissions = localStorage.getItem("permissions");
      let moduleCheck = moduleCode + ':CHECK';
      return permissions.indexOf(moduleCheck) !== -1 || permissions.indexOf('ROOT') !== -1;
    },
    //$emit进行子传父
    changeHandle(photo, name) {
      this.photo = photo;
      this.name = name;
    },
    //$emit进行子传父
    photoHandle(photo) {
      this.photo = photo;
    },
    //右键菜单生效后控制每个下拉项的禁用与显示(每一项代表一个功能)
    handDisabled(action,data,index){
      if (action === 'tabsreloadCurrentHandle') {
        return this.mainTabsActiveName !== data.name;
      }
      if (action === 'tabsCloseCurrentHandle') {
        return this.mainTabsActiveName !== data.name;
      }
      if (action === 'tabsCloseOtherHandle') {
        return this.mainTabsActiveName !== data.name;
      }
      return false;
    },
    //控制每次只显示一个右键
    handleChange(visible,name){
      if (!visible) return
      if (!this.$refs.dropdownRef) return
      this.$refs.dropdownRef.forEach((item) => {
        if (item.id === name) return
        item.handleClose()
      })
    },
    //拖拽方法
    rowDrop() {
      const el = document.querySelector(".tabSign .el-tabs__nav"); //找到想要拖拽的那一列
      const _this = this;
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) {
          //oldIIndex拖放前的位置， newIndex拖放后的位置  //mainTabs为遍历的tab签
          const currRow = _this.mainTabs.splice(oldIndex, 1)[0]; //鼠标拖拽当前的el-tabs-pane
          _this.mainTabs.splice(newIndex, 0, currRow); //tableData 是存放所以el-tabs-pane的数组
        },
      });
    },
  },
  mounted: function () {
    let that = this;
    //加载用户数据
    that.$http('userInfo/homeInfo', 'POST', {page: '/user/home'}, true, function (resp) {
      let summary = resp.summary;
      that.name = summary.name;
      that.photo = summary.photo;
    });
    //加载菜单数据
    that.$http('module/moduleInfo', 'GET', null, true, function (resp) {
      that.moduleList = resp.moduleList;
      that.loading_car = false;
    });
    //加载标题数据
    that.$http('adminCol/titleInfo', 'GET', null, true, function (resp) {
      let param = resp.params;
      that.icon3 = param.icon;
      that.icon1 = param.icon;
      that.icon2 = param.small_icon;
      that.titleName1 = param.title_name;
      that.titleName2 = param.small_name;
      that.link1 = param.link;
      that.link2 = param.small_link;
    });
    //加载菜单数据
    // that.$http('dropdown/dropdownInfo', 'GET', null, true, function (resp) {
    //   that.dropdownList = resp.dropdownList;
    // });

    this.$router.push({name: 'AdminHome'});

    // this.rowDrop(); //初始化拖拽方法
    that.resetDocumentClientHeight();
    that.loadSiteContentViewHeight();
  }
};
</script>

<style lang="scss">
@import '@/assets/scss/admin/index.scss';
</style>
