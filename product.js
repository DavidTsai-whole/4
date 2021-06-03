import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js';

let productModal = {};
let deleteModal = {};

const app = createApp({
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io',
            apiPath: 'jamestsai',
            products: [],
            tempProduct: {},
            pagination: {},
            isNew: false,
        }
    },
    components: {
        pagination
    },
    methods: {
        getData(page = 1) {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
            axios.get(url).then(res => {
                if (res.data.success) {
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                }
                else {
                    alert('讀取失敗')
                }
            }).catch(error => {
                consolo.log(error)
            });
        },
        openModal(isNew, item) {
            this.isNew = isNew;
            if (this.isNew) {
                this.tempProduct = {};
                productModal.show();
            } else {
                this.tempProduct = { ...item };
                productModal.show();
            }
        },
        delModal(item) {
            this.tempProduct = item;
            deleteModal.show();
        },

        updateProduct(item) {
            let api = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let method = 'post';
            if (!this.isNew) {
                api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${item.id}`;
                method = 'put';
            }
            axios[method](api, { data: item }).then(res => {
                if (res.data.success) {
                    productModal.hide();
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
            const api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(api).then(res => {
                if (res.data.success) {
                    this.getData();
                    deleteModal.hide();
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
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        deleteModal = new bootstrap.Modal(document.getElementById('delProductModal'));

        this.getData();
    }
});
//元件是內層，用props接收外層資料，用emit操縱外層事件,並建議把資料再帶回去(參數)
app.component('productModal', {
    props: ['tempProduct'],
    template: `<div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalLabel" class="modal-title">
            <span>新增產品</span>
            <span>編輯產品</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-1">
                <div class="form-group">
                  <label for="imageUrl">主要圖片</label>
                  <input type="text" v-model="tempProduct.imageUrl" class="form-control" placeholder="請輸入圖片連結">
                  <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
                </div>

              </div>
              <div class="mb-1">
              <input type="file" class="form-control" @change="upload" id="file"/>   
              </div>
              
              <div class="mb-1">多圖新增</div>
              <div v-if="Array.isArray(tempProduct.imagesUrl)">
                <div class="mb-1" v-for="(image, key) in tempProduct.imagesUrl" :key="key">
                  <div class="form-group">
                    <label for="imageUrl">圖片網址</label>
                    <input type="text" class="form-control" placeholder="請輸入圖片連結"
                      v-model="tempProduct.imagesUrl[key]">
                  </div>
                  <img class="img-fluid" :src="image">
                </div>
                <div v-if="!tempProduct.imagesUrl.length || tempProduct.imagesUrl[tempProduct.imagesUrl.length-1] ">
                  <button class="btn btn-outline-primary btn-sm d-block w-100"
                    @click="tempProduct.imagesUrl.push('')">
                    新增圖片
                  </button>
                </div>
                <div v-else>
                  <button class="btn btn-outline-danger btn-sm d-block w-100" @click="tempProduct.imagesUrl.pop()">
                    刪除圖片
                  </button>
                </div>
              </div>
              <div v-else>
                <button class="btn btn-outline-primary btn-sm d-block w-100" @click="createImages">
                  新增陣列圖片
                </button>
              </div>

            </div>
            <div class="col-sm-8">
              <div class="form-group">
                <label for="title">標題</label>
                <input id="title" type="text" class="form-control" v-model="tempProduct.title" placeholder="請輸入標題">
              </div>

              <div class="row">
                <div class="form-group col-md-6">
                  <label for="category">分類</label>
                  <input id="category" v-model="tempProduct.category" type="text" class="form-control"
                    placeholder="請輸入分類">
                </div>
                <div class="form-group col-md-6">
                  <label for="price">單位</label>
                  <input id="unit" v-model="tempProduct.unit" type="text" class="form-control" placeholder="請輸入單位">
                </div>
              </div>

              <div class="row">
                <div class="form-group col-md-6">
                  <label for="origin_price">原價</label>
                  <input id="origin_price" v-model.number="tempProduct.origin_price" type="number" min="0"
                    class="form-control" placeholder="請輸入原價">
                </div>
                <div class="form-group col-md-6">
                  <label for="price">售價</label>
                  <input id="price" v-model.number="tempProduct.price" type="number" min="0" class="form-control"
                    placeholder="請輸入售價">
                </div>
              </div>
              <hr>

              <div class="form-group">
                <label for="description">產品描述</label>
                <textarea id="description" v-model="tempProduct.description" type="text" class="form-control"
                  placeholder="請輸入產品描述">
                  </textarea>
              </div>
              <div class="form-group">
                <label for="content">說明內容</label>
                <textarea id="description" v-model="tempProduct.content" type="text" class="form-control"
                  placeholder="請輸入說明內容">
                  </textarea>
              </div>
              <div class="form-group">
                <div class="form-check">
                  <input id="is_enabled" v-model="tempProduct.is_enabled" class="form-check-input" type="checkbox"
                    :true-value="1" :false-value="0">
                  <label class="form-check-label" for="is_enabled">是否啟用</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="$emit('update',tempProduct)">
            確認
          </button>
        </div>
      </div>
    </div>
  </div>`,
    methods: {
        createImages() {
            this.tempProduct.imagesUrl = ['']
        },
        upload(){
          
        }
    }
});
app.component('deleteModal', {
    props:['tempProduct'],
    template: `<div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
    aria-labelledby="delProductModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="delProductModalLabel" class="modal-title">
            <span>刪除產品</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          是否刪除
          <strong class="text-danger">{{tempProduct.title}}</strong> 商品(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button type="button" class="btn btn-danger" @click="$emit('delete',tempProduct)">
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>`
})
app.mount('#app')