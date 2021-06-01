import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
data() {
    return {
        api:'https://vue3-course-api.hexschool.io',
        use:{
         username:'',
         password:''
        },
    }
},
methods: {
    login(){
        const api = `${this.api}/admin/signin`;
        axios.post(api,this.use).then(res=>{
            if(res.data.success){
                let {token,expired} = res.data;
                document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
                window.location = 'product.html';
                
            }
        }).catch(error=>{
            console.log(error)
        })
    }
},

}).mount('#app');