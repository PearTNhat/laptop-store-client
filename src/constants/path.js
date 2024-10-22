
const path= {
    PUBLIC:'/',
    HOME: '',
    LOGIN: 'login',
    REGISTER: 'register',
    PROFILE: 'profile',
    BLOGS: 'blogs',
    PRODUCT_DETAIL: ':category/:slug',
    PRODUCTS_CATEGORY: ':category',
    OUR_SERVICES: 'services',
    RESET_PASSWORD: 'reset-password/:resetToken',
    FINAL_REGISTER:'/final-register/:status',

    USER_PROFILE: 'user-profile',

    ///Admin
    ADMIN: '/admin',
    ADMIN_DASHBOARD: 'dashboard',
    ADMIN_MANAGE_USERS: 'manage/users',
    ADMIN_MANAGE_PRODUCTS: 'manage/products',
    ADMIN_MANAGE_PRODUCTS_CREATE: 'manage/products/create',
    ADMIN_MANAGE_ORDERS: 'manage/orders',
}
export default path