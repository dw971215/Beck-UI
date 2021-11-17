<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <!-- <el-form-item label="会员Id" prop="user.id">
        <el-input v-model="queryParams.user.id" placeholder="请输入会员id" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="会员积分" prop="pointNum">
        <el-input v-model="queryParams.pointNum" placeholder="请输入会员积分" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
     <!-- <el-form-item label="余额" prop="balance">
        <el-input v-model="queryParams.balance" placeholder="请输入余额" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="当前成长值" prop="currentValue">
        <el-input v-model="queryParams.currentValue" placeholder="请输入当前成长值" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="会员等级" prop="memberLevel">
        <el-input v-model="queryParams.memberLevel" placeholder="请输入会员等级" clearable size="small"
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
          v-hasPermi="['business:assets:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['business:assets:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['business:assets:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading"
          @click="handleExport" v-hasPermi="['business:assets:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="assetsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="会员昵称" align="center" prop="user.nickName" />
      <el-table-column label="会员积分" align="center" prop="pointNum" />
      <el-table-column label="余额" align="center" prop="balance" />
      <el-table-column label="当前成长值" align="center" prop="currentValue" />
      <el-table-column label="会员等级" align="center" prop="memberLevel" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['business:assets:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['business:assets:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改用户资产对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
       <!-- <el-form-item label="会员id" prop="user.id">
          <el-input v-model="form.user.id" placeholder="请输入会员id" />
        </el-form-item> -->
        <el-form-item label="会员积分" prop="pointNum">
          <el-input v-model="form.pointNum" placeholder="请输入会员积分" />
        </el-form-item>
        <el-form-item label="余额" prop="balance">
          <el-input v-model="form.balance" placeholder="请输入余额" />
        </el-form-item>
        <el-form-item label="成长值" prop="currentValue">
          <el-input v-model="form.currentValue" placeholder="请输入当前成长值" />
        </el-form-item>
        <el-form-item label="会员等级" prop="memberLevel">
          <el-input v-model="form.memberLevel" placeholder="请输入会员等级" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" :autosize="{minRows: 4, maxRows: 4}" />
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
    listAssets,
    getAssets,
    delAssets,
    addAssets,
    updateAssets,
    exportAssets
  } from "@/api/business/assets";

  export default {
    name: "Assets",
    components: {},
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
        // 用户资产表格数据
        assetsList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          pointNum: null,
          balance: null,
          currentValue: null,
          memberLevel: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询用户资产列表 */
      getList() {
        this.loading = true;
        listAssets(this.queryParams).then(response => {
          this.assetsList = response.rows;
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
          user: {
            id: null,
            nickName: null,
            realName: null
          },
          pointNum: null,
          balance: null,
          currentValue: null,
          memberLevel: null
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
        this.title = "添加用户资产";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getAssets(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改用户资产";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateAssets(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addAssets(this.form).then(response => {
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
        this.$confirm('是否确认删除用户资产编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAssets(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有用户资产数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportAssets(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
      }
    }
  };
</script>
