<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="店铺名称" prop="shopName">
        <el-input v-model="queryParams.shopName" placeholder="请输入店铺名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="区域编码" prop="areaCode">
        <el-input v-model="queryParams.areaCode" placeholder="请输入区域编码" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="联系电话" prop="mobile">
        <el-input v-model="queryParams.mobile" placeholder="请输入联系电话" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="详细地址" prop="address">
        <el-input v-model="queryParams.address" placeholder="请输入详细地址" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="门店经度" prop="longitude">
        <el-input v-model="queryParams.longitude" placeholder="请输入门店经度" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="门店纬度" prop="latitude">
        <el-input v-model="queryParams.latitude" placeholder="请输入门店纬度" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="是否营业" prop="isOpen">
        <el-select v-model="queryParams.isOpen" placeholder="请选择是否营业" clearable size="small">
          <el-option v-for="dict in isOpenOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="最低消费额" prop="minPrice">
        <el-input v-model="queryParams.minPrice" placeholder="请输入最低消费额" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="包装费" prop="packingFee">
        <el-input v-model="queryParams.packingFee" placeholder="请输入包装费" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['business:shop:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['business:shop:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['business:shop:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading"
          @click="handleExport" v-hasPermi="['business:shop:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shopList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="唯一标识" align="center" prop="id" /> -->
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column label="店铺名称" align="center" prop="shopName" />
      <el-table-column label="门头照">
        <template slot-scope="scope">
          <el-popover placement="top" trigger="click" width="190">
            <a :href="scope.row.outDoorPhoto" target="_blank" title="查看最大化图片">
              <img :src="scope.row.outDoorPhoto" style="width: 160px;height:160px">
            </a>
            <img slot="reference" :src="scope.row.outDoorPhoto" :alt="scope.row.outDoorPhoto"
              style="max-height: 60px;max-width: 60px;border:none;" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center" prop="mobile" />
      <el-table-column label="详细地址" align="center" prop="address" />
      <el-table-column label="区域编码" align="center" prop="areaCode" />
      <el-table-column label="门店经度" align="center" prop="longitude" />
      <el-table-column label="门店纬度" align="center" prop="latitude" />
      <el-table-column label="是否营业" align="center" prop="isOpen" :formatter="isOpenFormat" />
      <el-table-column label="最低消费(元)" align="center" prop="minPrice" />
      <el-table-column label="包装费(元)" align="center" prop="packingFee" />
      <el-table-column label="配送费(元)" align="center" prop="deliveryCost" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['business:shop:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['business:shop:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改商户门店对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="店铺名称" prop="shopName">
          <el-input v-model="form.shopName" placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item label="门头照">
          <imageUpload v-model="form.outDoorPhoto" />
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="区域编码" prop="areaCode">
          <el-input v-model="form.areaCode" placeholder="请输入区域编码" />
        </el-form-item>
        <el-form-item label="门店经度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入门店经度" />
        </el-form-item>
        <el-form-item label="门店纬度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入门店纬度" />
        </el-form-item>
        <el-form-item label="是否营业" prop="isOpen">
          <el-select v-model="form.isOpen" placeholder="请选择是否营业">
            <el-option v-for="dict in isOpenOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最低消费" prop="minPrice">
          <el-input v-model="form.minPrice" placeholder="请输入最低消费额" />
        </el-form-item>
        <el-form-item label="包装费" prop="packingFee">
          <el-input v-model="form.packingFee" placeholder="请输入包装费" />
        </el-form-item>
        <el-form-item label="配送费" prop="deliveryCost">
          <el-input v-model="form.deliveryCost" placeholder="请输入配送费" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :autosize="{minRows: 4, maxRows: 4}" placeholder="请输入内容" />
        </el-form-item>
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
    listShop,
    getShop,
    delShop,
    addShop,
    updateShop,
    exportShop
  } from "@/api/business/shop";
  import ImageUpload from '@/components/ImageUpload';
  export default {
    name: "Shop",
    components: {
      ImageUpload,
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
        // 商户门店表格数据
        shopList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 删除标识字典
        delFlagOptions: [],
        // 是否营业字典
        isOpenOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          shopName: null,
          areaCode: null,
          mobile: null,
          address: null,
          longitude: null,
          latitude: null,
          outDoorPhoto: null,
          isOpen: null,
          minPrice: null,
          packingFee: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
      this.getDicts("business_yes_no").then(response => {
        this.delFlagOptions = response.data;
      });
      this.getDicts("business_yes_no").then(response => {
        this.isOpenOptions = response.data;
      });
    },
    methods: {
      /** 查询商户门店列表 */
      getList() {
        this.loading = true;
        listShop(this.queryParams).then(response => {
          this.shopList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 删除标识字典翻译
      delFlagFormat(row, column) {
        return this.selectDictLabel(this.delFlagOptions, row.delFlag);
      },
      // 是否营业字典翻译
      isOpenFormat(row, column) {
        return this.selectDictLabel(this.isOpenOptions, row.isOpen);
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
          shopName: null,
          areaCode: null,
          mobile: null,
          address: null,
          longitude: null,
          latitude: null,
          outDoorPhoto: null,
          isOpen: null,
          minPrice: null,
          packingFee: null
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
        this.title = "添加商户门店";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getShop(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改商户门店";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateShop(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addShop(this.form).then(response => {
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
        this.$confirm('是否确认删除商户门店编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delShop(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有商户门店数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportShop(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
      }
    }
  };
</script>
