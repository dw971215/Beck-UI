<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="规格名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入规格名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['business:specs:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['business:specs:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['business:specs:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading"
          @click="handleExport" v-hasPermi="['business:specs:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="specsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="规格名称" align="center" prop="name" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['business:specs:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['business:specs:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改商品规格分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="规格名称" prop="name" :style="{width: '50%'}">
          <el-input v-model="form.name" placeholder="请输入规格名称" />
        </el-form-item>
         <el-form-item label="显示排序" prop="sort">
           <el-input-number v-model="form.sort" controls-position="right" :min="0" />
         </el-form-item>
        <el-form-item label="备注" prop="remark"  :style="{width: '50%'}">
          <el-input v-model="form.remark" :rows="4" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-divider content-position="center">商品规格属性信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddBeckGoodSpecsProperty">添加
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteBeckGoodSpecsProperty">删除
            </el-button>
          </el-col>
        </el-row>
        <el-table :data="beckGoodSpecsPropertyList" :row-class-name="rowBeckGoodSpecsPropertyIndex"
          @selection-change="handleBeckGoodSpecsPropertySelectionChange" ref="beckGoodSpecsProperty">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50" />

          <el-table-column label="规格属性名称" prop="name">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" placeholder="请输入规格属性名称" />
            </template>
          </el-table-column>
          <el-table-column label="规格属性编码" prop="code">
            <template slot-scope="scope">
              <el-input v-model="scope.row.code" placeholder="请输入规格属性编码" />
            </template>
          </el-table-column>
          <el-table-column label="是否默认" align="center" key="isDefault">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isDefault"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="排序" prop="sort">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.sort" controls-position="right" :min="0"  />
            </template>
          </el-table-column>
          <!-- <el-table-column label="备注" prop="remark">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注" />
            </template>
          </el-table-column> -->
        </el-table>
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
    listSpecs,
    getSpecs,
    delSpecs,
    addSpecs,
    updateSpecs,
    exportSpecs,
    changeDefaultStatus
  } from "@/api/business/specs";

  export default {
    name: "Specs",
    components: {},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 导出遮罩层
        exportLoading: false,
        // 选中数组
        ids: [],
        // 子表选中数据
        checkedBeckGoodSpecsProperty: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 商品规格分类表格数据
        specsList: [],
        // 商品规格属性表格数据
        beckGoodSpecsPropertyList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          params:{
            goodId:null
          }
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      const goodId = this.$route.params && this.$route.params.goodId;
      if(goodId){
         this.queryParams.params.goodId = goodId
      }
      this.getList();
    },
    methods: {
      /** 查询商品规格分类列表 */
      getList() {
        this.loading = true;
        listSpecs(this.queryParams).then(response => {
          this.specsList = response.rows;
          this.total = response.total;
          this.loading = false;
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
          sort: null,
          goodVo:{
             id:null
          }
        };
        this.beckGoodSpecsPropertyList = [];
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
        this.title = "添加商品规格分类";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getSpecs(id).then(response => {
          this.form = response.data;
          this.beckGoodSpecsPropertyList = response.data.beckGoodSpecsPropertyList;
          this.open = true;
          this.title = "修改商品规格分类";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.goodVo.id = this.queryParams.params.goodId;
            this.form.beckGoodSpecsPropertyList = this.beckGoodSpecsPropertyList;
            if (this.form.id != null) {
              updateSpecs(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addSpecs(this.form).then(response => {
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
        this.$confirm('是否确认删除商品规格分类编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSpecs(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 商品规格属性序号 */
      rowBeckGoodSpecsPropertyIndex({
        row,
        rowIndex
      }) {
        row.index = rowIndex + 1;
      },
      /** 商品规格属性添加按钮操作 */
      handleAddBeckGoodSpecsProperty() {
        let obj = {};
        obj.remark = "";
        obj.name = "";
        obj.code = "";
        obj.isDefault = "";
        obj.sort = "";
        this.beckGoodSpecsPropertyList.push(obj);
      },
      /** 商品规格属性删除按钮操作 */
      handleDeleteBeckGoodSpecsProperty() {
        if (this.checkedBeckGoodSpecsProperty.length == 0) {
          this.$alert("请先选择要删除的商品规格属性数据", "提示", {
            confirmButtonText: "确定",
          });
        } else {
          this.beckGoodSpecsPropertyList.splice(this.checkedBeckGoodSpecsProperty[0].index - 1, 1);
        }
      },
      /** 单选框选中数据 */
      handleBeckGoodSpecsPropertySelectionChange(selection) {
        if (selection.length > 1) {
          this.$refs.beckGoodSpecsProperty.clearSelection();
          this.$refs.beckGoodSpecsProperty.toggleRowSelection(selection.pop());
        } else {
          this.checkedBeckGoodSpecsProperty = selection;
        }
      },
      // 默认状态修改
      handleStatusChange(row) {
        let text = row.isDefault === "0" ? "启用" : "停用";
        this.$confirm('确认要"' + text + '""' + row.name + '"为默认属性吗?', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function() {
            console.log("测试默认数据："+row.isDefault)
            // changeDefaultStatus(row.id, row.isDefault);
            return "1";
          }).then(() => {
            this.msgSuccess(text + "成功");
          }).catch(function() {
            row.isDefault = row.isDefault === "0" ? "1" : "0";
          });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有商品规格分类数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportSpecs(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
      }
    }
  };
</script>
