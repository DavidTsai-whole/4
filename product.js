import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js';
import productModal from './productModal.js';
import deleteModal from './deleteModal.js';



const app = createApp({
  data() {
    return {
      api: {
        apiUrl: 'https://vue3-course-api.hexschool.io',
        apiPath: 'jamestsai',
      },



      products: [],
      tempProduct: {},
      pagination: {},
      isNew: false,
    }
  },
  components: {
    pagination,
    productModal,
    deleteModal
  },
  methods: {
    getData(page = 1) {
      const url = `${this.api.apiUrl}/api/${this.api.apiPath}/admin/products?page=${page}`;
      axios.get(url).then(res => {
        if (res.data.success) {
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        }
        else {
          alert('讀取失敗');
          window.location = 'index.html';
        }
      }).catch(error => {
        consolo.log(error)
      });
    },
    openModal(isNew, item) {
      this.isNew = isNew;
      if (this.isNew) {
        this.tempProduct = {};
        this.$refs.modalA.modal.show();
      } else {
        this.tempProduct = { ...item };
        this.$refs.modalA.modal.show();
      }
    },
    delModal(item) {
      this.tempProduct = item;
      this.$refs.modalB.modal.show();
    },

    updateProduct(item) {
      let api = `${this.api.apiUrl}/api/${this.api.apiPath}/admin/product`;
      let method = 'post';
      if (!this.isNew) {
        api = `${this.api.apiUrl}/api/${this.api.apiPath}/admin/product/${item.id}`;
        method = 'put';
      }
      axios[method](api, { data: item }).then(res => {
        if (res.data.success) {
          this.$refs.modalA.modal.hide();
          this.getData();
        }
        else {
          alert(res.data.message)
        }
      }).catch(error => {
        consolo.log(error)
      })
      this.getData();
    },
    deleteProduct() {
      const api = `${this.api.apiUrl}/api/${this.api.apiPath}/admin/product/${this.tempProduct.id}`;
      axios.delete(api).then(res => {
        if (res.data.success) {
          this.getData();
          this.$refs.modalB.modal.hide();
        }
      }).catch(error => {
        consolo.log(error)
      })
    }
  },
  //mounted是連dom元素都取得了
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    if (token === '') {
      alert('請重新登入');
      window.location = 'index.html';
    }
    axios.defaults.headers.common.Authorization = token;

    this.getData();
  }
});
//元件是內層，用props接收外層資料，用emit操縱外層事件,並建議把資料再帶回去(參數)

app.mount('#app')