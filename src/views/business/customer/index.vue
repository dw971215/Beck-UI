<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="登录账号" prop="loginName">
        <el-input v-model="queryParams.loginName" placeholder="请输入登录账号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!--  <el-form-item label="登录密码" prop="loginPassword">
        <el-input
          v-model="queryParams.loginPassword"
          placeholder="请输入登录密码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入用户昵称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="queryParams.realName" placeholder="请输入真实姓名" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="queryParams.mobile" placeholder="请输入手机号码" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="openid" prop="wxOpenid">
        <el-input v-model="queryParams.wxOpenid" placeholder="请输入微信用户openid" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select
          v-model="queryParams.gender"
          placeholder="性别"
          clearable
          size="small"
          style="width: 205px"
        >
          <el-option
            v-for="dict in genderOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户来源" prop="customerSource">
        <el-select
          v-model="queryParams.customerSource"
          placeholder="用户来源"
          clearable
          size="small"
          style="width: 205px"
        >
          <el-option
            v-for="dict in sourceOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
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
          v-hasPermi="['system:customer:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:customer:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:customer:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading"
          @click="handleExport" v-hasPermi="['system:customer:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="customerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="主键,唯一标识" align="center" prop="id" /> -->
      <!--  <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column label="登录账号" align="center" prop="loginName" />
      <!-- <el-table-column label="登录密码" align="center" prop="loginPassword" /> -->
      <el-table-column label="用户头像">
       <template slot-scope="scope">
          <el-popover placement="top" trigger="click" width="190">
            <a :href="scope.row.loginPhoto" target="_blank" title="查看最大化图片">
              <img :src="scope.row.loginPhoto" style="width: 160px;height:160px">
            </a>
            <img slot="reference" :src="scope.row.loginPhoto" :alt="scope.row.loginPhoto"
              style="max-height: 60px;max-width: 60px;border:none;" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="gender" :formatter="genderFormat"/>
       <el-table-column label="真实姓名" align="center" prop="realName" />
      <el-table-column label="用户昵称" align="center" prop="nickName" />
      <el-table-column label="手机号码" align="center" prop="mobile" />
      <el-table-column label="微信用户openid" align="center" prop="wxOpenid" />
      <el-table-column label="用户来源" align="center" prop="customerSource" :formatter="sourceFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:customer:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:customer:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="删除标识" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标识" />
        </el-form-item> -->
        <el-form-item label="登录账号" prop="loginName">
          <el-input v-model="form.loginName" placeholder="请输入登录账号" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="nickName">
          <el-input v-model="form.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择"  clearable :style="{width: '100%'}">
            <el-option
              v-for="dict in genderOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="form.mobile" :maxlength="11" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="openid" prop="wxOpenid">
          <el-input v-model="form.wxOpenid" placeholder="请输入微信用户小程序唯一标识" />
        </el-form-item>
        <el-form-item label="用户来源" prop="customerSource">
          <el-select v-model="form.customerSource" placeholder="请选择"  clearable :style="{width: '100%'}">
            <el-option
              v-for="dict in sourceOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户头像">
          <imageUpload v-model="form.loginPhoto" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :autosize="{minRows: 4, maxRows: 4}"  placeholder="请输入内容" />
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
    listCustomer,
    getCustomer,
    delCustomer,
    addCustomer,
    updateCustomer,
    exportCustomer
  } from "@/api/business/customer";

  import ImageUpload from '@/components/ImageUpload';
  export default {
    name: "Customer",
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
        // 用户表格数据
        customerList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 客户来源数据字典
        sourceOptions: [],
        //性别数据字典
        genderOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          loginName: null,
          loginPassword: null,
          loginPhoto: null,
          nickName: null,
          mobile: null,
          wxOpenid: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
      this.getDicts("customer_source").then(response => {
        this.sourceOptions = response.data;
      });
      this.getDicts("sys_user_sex").then(response => {
        this.genderOptions = response.data;
      });
    },
    methods: {
      /** 查询用户列表 */
      getList() {
        this.loading = true;
        listCustomer(this.queryParams).then(response => {
          this.customerList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 操作日志状态字典翻译
      sourceFormat(row, column) {
        return this.selectDictLabel(this.sourceOptions, row.customerSource);
      },
      // 性别字典翻译
      genderFormat(row, column) {
        return this.selectDictLabel(this.genderOptions, row.gender);
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
          loginName: null,
          loginPassword: null,
          loginPhoto: null,
          nickName: null,
          mobile: null,
          wxOpenid: null
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
        this.title = "添加用户";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getCustomer(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改用户";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateCustomer(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addCustomer(this.form).then(response => {
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
        this.$confirm('是否确认删除该数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCustomer(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有用户数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportCustomer(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
      }
    }
  };
</script>
