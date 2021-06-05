export default {
    props: ['tempProduct', 'api'],
  template: `<div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalLabel" class="modal-title">
            <span v-if="tempProduct.title">{{tempProduct.title}}</span>
            <span v-else>新增商品</span>
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
              <input type="file" class="form-control" ref="uploadDom" @change="upload"/> 
              <img class="img-fluid" :src="tempProduct.imgUpload" alt="">  
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
  data() {
    return {
      modal: '',
    }
  },
  methods: {
    upload() {
      const file = this.$refs.uploadDom.files[0]
      const formData = new FormData();
      formData.append('file-to-upload', file);
      axios.post(`${this.api.apiUrl}/api/${this.api.apiPath}/admin/upload`, formData).then(res => {
        this.tempProduct.imgUpload = res.data.imageUrl

      }).catch(error => {
        console.log(error)
      })
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.productModal);
  }
}