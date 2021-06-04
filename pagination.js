//元件是內層，用props接收外層資料，用emit操縱外層事件
export default {
    props: ['page'],
    template: `<nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" @click="$emit('page-change',page.current_page -1)" :class="{disabled:!page.has_pre}" >
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item"  v-for="item in page.total_pages" :key="item" :class="{active:item === page.current_page}"><a class="page-link" href="#" @click="$emit('page-change',item)">{{item}}</a></li>
      <li class="page-item" :class="{disabled:!page.has_next}" @click="$emit('page-change',page.current_page +1)">
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`,
 
}