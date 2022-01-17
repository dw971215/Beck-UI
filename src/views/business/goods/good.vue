<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品分类" prop="params.categoryId">
        <el-select v-model="queryParams.params.categoryId" size="small">
          <el-option v-for="item in categoryTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['business:good:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['business:good:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['business:good:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading"
          @click="handleExport" v-hasPermi="['business:good:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="goodList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商品名称" align="center" :show-overflow-tooltip="true">
         <template slot-scope="scope">
           <router-link :to="'/goods/specs/type/' + scope.row.id" class="link-type">
             <span>{{ scope.row.name }}</span>
           </router-link>
         </template>
       </el-table-column>
      <!-- <el-table-column label="商品类别" align="center" prop="goodsType" /> -->
      <el-table-column label="封面图片">
        <template slot-scope="scope">
          <el-popover placement="top" trigger="click" width="190">
            <a :href="scope.row.coverImg" target="_blank" title="查看最大化图片">
              <img :src="scope.row.coverImg" style="width: 160px;height:160px">
            </a>
            <img slot="reference" :src="scope.row.coverImg" :alt="scope.row.coverImg"
              style="max-height: 60px;max-width: 60px;border:none;" />
          </el-popover>
        </template>
      </el-table-column>
    <!--  <el-table-column label="商品描述" align="center" prop="goodDesc" /> -->
      <el-table-column label="价格" align="center" prop="price" />
      <el-table-column label="会员价" align="center" prop="membershipPrice" />
      <el-table-column label="包装费" align="center" prop="packCost" />
      <el-table-column label="最低购买量" align="center" prop="minBuyNum" />
      <!-- <el-table-column label="单位名称" align="center" prop="unitName" />
      <el-table-column label="单位键值" align="center" prop="unitValue" /> -->
      <el-table-column label="销售量" align="center" prop="salesNum" />
      <el-table-column label="库存" align="center" prop="stockNum" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['business:good:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['business:good:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改商品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品分类">
              <el-input v-model="form.goodCategoryId " :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入商品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="零售价(元)" prop="price">
              <el-input v-model="form.price" placeholder="请输入零售价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包装费(元)" prop="packCost">
              <el-input v-model="form.packCost" placeholder="请输入包装费" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会员价(元)" prop="membershipPrice">
              <el-input v-model="form.membershipPrice" placeholder="请输入会员价" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最低购买量" prop="minBuyNum">
              <el-input v-model="form.minBuyNum" placeholder="请输入最低购买数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位键值" prop="unitValue">
              <el-input v-model="form.unitValue" placeholder="请输入商品单位键值" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位名称" prop="unitName">
              <el-input v-model="form.unitName" placeholder="请输入商品单位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售量" prop="salesNum">
              <el-input v-model="form.salesNum" placeholder="请输入销售量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存" prop="stockNum">
              <el-input v-model="form.stockNum" placeholder="请输入库存" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <!-- <el-form-item label="商品类别" prop="goodsType">
             <el-select v-model="form.goodsType" placeholder="请选择商品类别" :style="{width: '100%'}">
               <el-option label="请选择字典生成" value="" />
             </el-select>
           </el-form-item> -->
          <el-col :span="24">
            <el-form-item label="封面图片">
              <imageUpload v-model="form.coverImg" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品描述" prop="goodDesc">
              <el-input v-model="form.goodDesc" type="textarea" :rows="4" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listGood,
    getGood,
    delGood,
    addGood,
    updateGood,
    exportGood
  } from "@/api/business/good";
  import ImageUpload from '@/components/ImageUpload';
  import {
    listCategory
  } from "@/api/business/category";
  export default {
    name: "Good",
    components: {
      ImageUpload
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 导出遮罩层
        exportLoading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 商品表格数据
        goodList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          goodsType: null,
          //子页面带过来的数据
          params:{
            categoryId:null
          }
        },
        defaultCategoryId: undefined,
        //分类数据
        categoryTypeOptions: [],
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      const categoryId = this.$route.params && this.$route.params.categoryId;
      if (categoryId) {
        this.queryParams.params.categoryId = categoryId;
        //进入页面前的分类id
        this.defaultCategoryId = categoryId;
      }
      //获取分类列表
      this.getCategroyTypeList();
      //获取商品列表
      this.getList();
    },
    methods: {
      /** 查询商品列表 */
      getList() {
        this.loading = true;
        listGood(this.queryParams).then(response => {
          this.goodList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      //获取分类列表数据
      getCategroyTypeList() {
        /** 查询字典类型列表 */
        listCategory().then(response => {
          this.categoryTypeOptions = response.rows;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          remark: null,
          delFlag: null,
          name: null,
          price: null,
          goodsType: null,
          coverImg: null,
          goodDesc: null,
          packCost: null,
          membershipPrice: null,
          minBuyNum: null,
          unitName: null,
          unitValue: null,
          salesNum: null,
          stockNum: null,
          sort: null,
          goodCategoryId: null, //自定义的分类id
          goodCategory: {
            id: null
          }
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.queryParams.params.categoryId = this.defaultCategoryId;
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加商品";
        this.form.goodCategoryId = this.queryParams.params.categoryId;
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getGood(id).then(response => {
          this.form = response.data;
          this.form.goodCategoryId = response.data.goodCategory.id;
          this.open = true;
          this.title = "修改商品";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.goodCategory.id = this.queryParams.params.categoryId;
            if (this.form.id != null) {
              updateGood(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addGood(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除商品编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delGood(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有商品数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportGood(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
      }
    }
  };
</script>
