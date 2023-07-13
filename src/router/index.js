import {
    createRouter,
    // createWebHashHistory,//这个是路径带'#'号的
    createWebHistory//不带’#‘号
}from 'vue-router'

//管理页面
import Login from '@/views/admin/login.vue'
import AdminMain from "@/views/admin/main.vue"
import AdminHome from "@/views/admin/home.vue"

//管理页面-->角色管理role
import AdminUser from "@/views/admin/role/user.vue"
import AdminEmployee from "@/views/admin/role/employee.vue"
import AdminDept from "@/views/admin/role/dept.vue"
import AdminCompany from "@/views/admin/role/company.vue"

//管理页面-->菜单图片ICON
import AdminMenuIcon from "@/views/admin/icon/icon.vue"


//管理页面-->页面管理admin
import AdminPageModule from "@/views/admin/page/admin/module.vue"
import AdminPageAction from "@/views/admin/page/admin/action.vue"
import AdminPageRole from "@/views/admin/page/admin/role.vue"
import AdminPermission from "@/views/admin/page/admin/permission.vue"

//公共页面
import Footer from "@/views/public/footer.vue"
import NotFound from "@/views/public/404.vue"

//用户页面
import Main from "@/views/users/main.vue"
import Home from "@/views/users/home.vue";
import System from "@/views/users/system.vue";

import {ElMessage} from "element-plus";

/*
 *  hidden: true// 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 */

const routes = [{
    //登录页面
    path: '/login',
    name: 'Login',
    hidden:true,
    component: Login
},
    {
        //用户主页面
        path: '/',
        name: 'Main',
        //重定向，防止跳转到无内容页
        redirect: '/home',
        hidden:true,
        component: Main,
        children: [{
            //首页
            path: '/home',
            name: 'Home',
            component: Home,
            meta: {
                title: '首页',
                // keepAlive:true // 需要缓存(页面加载数据较多时，可以使用这个，只刷新一次，后面再次刷新时只获取缓存的数据）
            }
        },
            {
                //用户页脚
                path: '/footer',
                name: 'Footer',
                component: Footer,
                meta: {
                    title: '页脚',
                }
            },
            {
                //用户系统页（待用）
                path: '/system',
                name: 'System',
                component: System,
                meta: {
                    title: '系统页',
                }
            }]
    },
    {
        //管理页面
        path: '/admin',
        name: 'AdminMain',
        redirect: '/admin/home',
        component: AdminMain,
        children: [{
            //管理首页
            path: '/admin/home',
            name: 'AdminHome',
            component: AdminHome,
            meta: {
                title: '首页',
                icon: 'HomeFilled',
                isTab:true
            }
        },
            {
                //管理页脚
                path: '/footer',
                name: 'Footer',
                component: Footer,
                meta: {
                    title: '页脚',
                    isTab:true
                }
            },
            {
                //用户管理
                path: '/admin/user',
                name: 'AdminUser',
                component: AdminUser,
                meta: {
                    title: '用户管理',
                    icon: 'UserFilled',
                    isTab:true
                }
            },
            {
                //员工管理
                path: '/admin/employee',
                name: 'AdminEmployee',
                component: AdminEmployee,
                meta: {
                    title: '员工管理',
                    icon: 'Avatar',
                    isTab:true
                }
            },
            {
                //部门管理
                path: '/admin/dept',
                name: 'AdminDept',
                component: AdminDept,
                meta: {
                    title: '部门管理',
                    icon: 'Platform',
                    isTab:true
                }
            },
            {
                //公司管理
                path: '/admin/company',
                name: 'AdminCompany',
                component: AdminCompany,
                meta: {
                    title: '公司管理',
                    icon: 'Management',
                    isTab:true
                }
            },
            {
                //管理菜单页面
                path: '/admin/page/module',
                name: 'AdminPageModule',
                component: AdminPageModule,
                meta: {
                    title: '菜单管理',
                    icon: 'Menu',
                    isTab:true
                }
            },
            {
                //功能维护
                path: '/admin/page/action',
                name: 'AdminPageAction',
                component: AdminPageAction,
                meta: {
                    title: '功能管理',
                    icon: 'Operation',
                    isTab:true
                }
            },
            {
                //角色管理
                path: '/admin/page/role',
                name: 'AdminPageRole',
                component: AdminPageRole,
                meta: {
                    title: '角色管理',
                    icon: 'Operation',
                    isTab:true
                }
            },
            {
                //角色管理
                path: '/admin/icon',
                name: 'AdminMenuIcon',
                component: AdminMenuIcon,
                meta: {
                    title: '菜单图片',
                    icon: 'PictureFilled',
                    isTab:true
                }
            },
            {
                //权限管理
                path: '/admin/permission',
                name: 'AdminPermission',
                component: AdminPermission,
                meta: {
                    title: '权限管理',
                    icon: 'Stamp',
                    isTab:true
                }
            }
        ]
    },
    {
        path: "/404",
        name: "NotFound",
        component: NotFound
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: "/404"
    }
]

const router = createRouter({
    history: createWebHistory(),//不带’#‘号
    // history: createWebHashHistory(),//这个是路径带'#'号的
    routes
})

//路由守卫
// to：即将要进入的目标 路由对象
// from：当前导航正要离开的路由
//next：放行
router.beforeEach((to, from, next) => {
    if (to.name !== "Login") {
        let permissions = localStorage.getItem("permissions")
        let token = localStorage.getItem("token")
        if (permissions == null || permissions === ""||token == null || token === ""||permissions === "undefined" || token === "undefined") {
            ElMessage.error({
                message: '还未登录，请先登录！',
                duration: 1200
            });
            next({
                name: 'Login'
            });
        }else if (to.name === "AdminHome") {
            if (permissions.indexOf('EMPLOYEE:SEE') === -1 && permissions.indexOf('ROOT') === -1) {
                // window.alert("管理员无权访问，请联系管理员！");
                ElMessage.error({
                    message: '管理页无权访问，请联系管理员！',
                    duration: 1200
                });
                next({
                    name: 'Login'
                });
            }
        }else if (to.name === "Home"){
            if (permissions.indexOf('USER:SEE') === -1 && permissions.indexOf('ROOT') === -1) {
                // window.alert("首页无权访问，请联系管理员！");
                ElMessage.error({
                    message: '首页无权访问，请联系管理员！',
                    duration: 1200
                });
                next({
                    name: 'Login'
                });
            }
        }
    }
    return next();
})

export default router
