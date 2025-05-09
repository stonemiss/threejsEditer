<!-- <template>
  <div class="flex flex-wrap items-center gap-4">
  
    <el-dropdown placement="bottom-start">
      <el-button> bottomStart </el-button>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>The Action 1st</el-dropdown-item>
          <el-dropdown-item>The Action 2st</el-dropdown-item>
          <el-dropdown-item>The Action 3st</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style> -->

<template>
  <div class="top-menu">
    <el-dropdown placement="bottom-start">
      <span class="top-menu-el">
        文件
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>新建</el-dropdown-item>
          <el-dropdown-item>保存</el-dropdown-item>
          <el-dropdown-item>打开</el-dropdown-item>
          <el-dropdown-item>导入</el-dropdown-item>
          <el-dropdown-item>导出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script  setup>

</script>

<style lang="scss" scoped>
.top-menu{
  position: absolute;
  top: 0;
  left: 0;
  height: 40px;
  .top-menu-el{
    line-height: 40px;
    padding: 0 10px;
  }
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>