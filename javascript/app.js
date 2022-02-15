import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'ptsai129';

const app = createApp({
    data(){
        return{
            cartData:{},
            products:[],


        }
    },
    methods:{
        getProductList(){
            axios.get(`${apiUrl}/api/${apiPath}/products/all`).then((res)=>{
                console.log(res);
                //把api取得的商品賦予到data內的products陣列
                this.products = res.data.products;
            }).catch((err)=>{
                alert(err.data.message);
            })
        }

    },
    mounted(){
        //執行取得產品列表
        this.getProductList();

    }
})

app.mount("#app");
