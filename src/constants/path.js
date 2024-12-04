
const path= {
    PUBLIC:'/',
    HOME: '',
    LOGIN: 'login',
    REGISTER: 'register',
    BLOGS: 'blogs',
    DETAIL_CART: 'detail-cart',
    PRODUCT_DETAIL: ':slug',
    PRODUCTS_CATEGORY: 'laptop',
    OUR_SERVICES: 'services',
    RESET_PASSWORD: 'reset-password/:resetToken',
    FINAL_REGISTER:'/final-register/:status',
    //
    CHECKOUT: '/checkout',
    //
    USER_PROFILE: '/user/profile',
    USER_CART: '/user/cart',
    USER_ORDER: '/user/order',
    USER_WISHLIST: '/user/wishlist',
    ///Admin
    ADMIN: '/admin',
    ADMIN_DASHBOARD: 'dashboard',
    ADMIN_MANAGE_USERS: 'manage/users',
    ADMIN_MANAGE_PRODUCTS: 'manage/products',
    ADMIN_MANAGE_PRODUCTS_CREATE: 'manage/products/create',
    ADMIN_MANAGE_PRODUCTS_EDIT: 'manage/products/edit/:slug',
    ADMIN_MANAGE_PRODUCTS_CREATE_COLOR: 'manage/products/create-color/:slug',
    ADMIN_MANAGE_PRODUCTS_EDIT_COLOR: 'manage/products/edit-color/:slug/:colorId',
    ADMIN_MANAGE_ORDERS: 'manage/orders',
}
export default path