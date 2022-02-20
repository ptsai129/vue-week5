//定義axios串接api會取到的變數
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'ptsai129';

//表單驗證規則
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });

//多國語系
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

//CDN載入方式的vue起手式
const app = Vue.createApp({
    data(){
        return{
            cartData:{},
            products:[],
            productId:'',
            isLoadingItem:'',
            form: {
                user: {
                  name: '',
                  email: '',
                  tel: '',
                  address:''
                },
                message: ''
              },
             
            };
          },
    methods:{
        //取得產品列表
        getProductList(){
            axios.get(`${apiUrl}/api/${apiPath}/products/all`).then((res)=>{
                //把api取得的商品賦予到data內的products陣列
                this.products = res.data.products;
            })
        },
        //開啟modal 取得單一產品細節
        openProductModal(id){
            //把傳入的id放到productId內
            this.productId = id; 
            this.$refs.productModal.openModal();
        },
        //取得購物車
        getCarts(){
            axios.get(`${apiUrl}/api/${apiPath}/cart`).then((res)=>{
                this.cartData = res.data.data;
            })
        },
        //新增品項到購物車
                      //沒有傳入值時 qty預設為1
        addToCart(id , qty=1){
            //定義要帶入api的資訊
            let data = {
                product_id: id, 
                qty
            }
            //加入購物車的品項id的值賦予到isLoadingItem變數上 用來做後續判斷
            this.isLoadingItem = id; 
            axios.post(`${apiUrl}/api/${apiPath}/cart`,{data}).then((res)=>{
                //再重新取得購物車內內容
                this.getCarts();
                //完成購物車內容渲染後 將isLoadingItem狀態改為預設
                this.isLoadingItem = "";
                 //顯示已加入購物車提示訊息
                 alert(res.data.message);          
            })
        },
        //刪除購物車內單一品項
        deleteCartItem(id){
            axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`).then((res)=>{
                this.getCarts();
                alert(res.data.message);
            })
        },
        //刪除全部購物車
        deleteAll(){
            axios.delete(`${apiUrl}/api/${apiPath}/carts`).then((res)=>{
                this.getCarts();
                alert(res.data.message);
            })
        },
        //更新購物車 帶入完整品項資料
        updateCart(item){
            //定義要帶入api的資訊
            let data = {
                product_id: item.id, 
                qty:item.qty
            }
            //加入購物車的品項id的值賦予到isLoadingItem變數上 用來做後續判斷
            this.isLoadingItem = item.id; 
            axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`,{data}).then((res)=>{
                //顯示更新購物車提示訊息
                alert(res.data.message);
                //再重新取得購物車內內容
                this.getCarts();
                //完成購物車內容渲染後 將isLoadingItem狀態改為預設
                this.isLoadingItem = "";           
            })
        },
        //驗證電話號碼
        isPhone (value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
          },
        //送出表單
        onSubmit() {
            const order = this.form;
            axios.post(`${apiUrl}/api/${apiPath}/order`, { data: order })
              .then((res) => {
                  alert(res.data.message);
                  this.$refs.form.resetForm();
                  this.form.message = '';
                  this.getCarts();
              })
              .catch((error) => {
                alert(error.message);
              });
          }   
    },
    mounted(){
        //初始化執行取得產品列表
        this.getProductList();
        //初始化取得購物車列表
        this.getCarts();
    }
})
//註冊全域變數 product modal
app.component('product-modal',{
    data(){
        return{
           modal:{},
           product:{},
           //數量預設一個
           qty:1

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
        //關閉modal
        hideModal(){
            this.modal.hide();
        },
        //取得單一產品細節
        getProdcutDetails(){
            //觸發 getProdcutDetails 的時， qty 要變成初始值
            this.qty=1;                                                     
                                                       //props的id
            axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`).then((res)=>{
                this.product = res.data.product;
            })
        },
        modalAddtoCart(){
            //看有沒有取得數量
            console.log(this.qty);
            //定義emit名稱是modal-addcart 並帶入id 跟qty
           this.$emit('modal-addcart', this.product.id, this.qty);
           this.hideModal();
            
        }
    },
    mounted(){
        //實體化moddl運用ref抓到dom 並儲存到modal物件內
        this.modal = new bootstrap.Modal(this.$refs.modal);
       
    }
});
//表單驗證元件
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

//掛載
app.mount("#app");

