//ESModule載入vue
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';
//定義axios串接api會取到的變數
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'ptsai129';
//ESModule載入方式的vue起手式
const app = createApp({
    data(){
        return{
            cartData:{},
            products:[],
            productId:'',


        }
    },
    methods:{
        //取得產品列表
        getProductList(){
            axios.get(`${apiUrl}/api/${apiPath}/products/all`).then((res)=>{
                //把api取得的商品賦予到data內的products陣列
                this.products = res.data.products;
            }).catch((err)=>{
                alert(err.data.message);
            })
        },
        //開啟modal 取得單一產品細節
        openProductModal(id){
            //把傳入的id放到productId內
            this.productId = id; 
            this.$refs.productModal.openModal();
        }



        
    },
    mounted(){
        //執行取得產品列表
        this.getProductList();

    }
})
//註冊全域變數 product modal
app.component('product-modal',{
    data(){
        return{
           modal:{},
           product:{},

        }
    },
    template: '#userProductModal',
    //props id接收外層傳入內層的值
    props:['id'],
    watch:{
    //監聽id的值是否有變動 若有變動就觸發取得單一產品內容
    id(){
        this.getProdcutDetails();
    }

    },
    methods:{
        //開啟modal
        openModal(){
         this.modal.show();
        },
        //取得單一產品細節
        getProdcutDetails(){
                                                        //props的id
            axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`).then((res)=>{
                console.log(res.data);
                this.product = res.data.product;
            }).catch((err)=>{
                alert(err.data.message);
            })

        }
    },
    mounted(){
        //實體化moddl運用ref抓到dom 並儲存到modal物件內
        this.modal = new bootstrap.Modal(this.$refs.modal);
       
    },
})


//掛載
app.mount("#app");
