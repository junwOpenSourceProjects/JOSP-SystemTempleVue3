import { ref } from "vue";
import type {
  IObject,
  PageContentInstance,
  PageModalInstance,
  PageSearchInstance,
} from "./types";

/**
 * 分页页面 Hook
 * 职责：整合 PageSearch、PageContent、PageModal 三个组件的交互逻辑
 * 提供统一的增删改查操作接口，简化页面代码
 *
 * 使用方式：
 * ```ts
 * const {
 *   searchRef,      // PageSearch 组件引用
 *   contentRef,     // PageContent 组件引用
 *   addModalRef,    // 新增弹窗引用
 *   editModalRef,   // 编辑弹窗引用
 *   handleQueryClick,     // 搜索
 *   handleResetClick,     // 重置
 *   handleAddClick,       // 新增
 *   handleEditClick,      // 编辑
 *   handleSubmitClick,    // 提交后刷新
 *   handleExportClick,    // 导出
 *   handleSearchClick,    // 搜索区域显隐
 *   handleFilterChange,   // 筛选变化
 * } = usePage();
 * ```
 */
function usePage() {
  /** PageSearch 组件引用（用于获取查询参数、切换显示状态） */
  const searchRef = ref<PageSearchInstance>();

  /** PageContent 组件引用（用于刷新列表数据、获取筛选条件） */
  const contentRef = ref<PageContentInstance>();

  /** 新增弹窗组件引用 */
  const addModalRef = ref<PageModalInstance>();

  /** 编辑弹窗组件引用 */
  const editModalRef = ref<PageModalInstance>();

  /**
   * 搜索按钮点击处理
   * 合并搜索条件和筛选条件，刷新列表（从第一页开始）
   * @param queryParams 搜索表单数据
   */
  function handleQueryClick(queryParams: IObject) {
    const filterParams = contentRef.value?.getFilterParams();
    contentRef.value?.fetchPageData({ ...queryParams, ...filterParams }, true);
  }

  /**
   * 重置按钮点击处理
   * 合并重置后的搜索条件和筛选条件，刷新列表（从第一页开始）
   * @param queryParams 重置后的搜索表单数据
   */
  function handleResetClick(queryParams: IObject) {
    const filterParams = contentRef.value?.getFilterParams();
    contentRef.value?.fetchPageData({ ...queryParams, ...filterParams }, true);
  }

  /**
   * 新增按钮点击处理
   * 打开新增弹窗（清空表单）
   */
  function handleAddClick() {
    // 显示添加表单（不传数据则清空表单）
    addModalRef.value?.setModalVisible();
  }

  /**
   * 编辑按钮点击处理
   * 打开编辑弹窗并用行数据填充表单
   * @param row 当前行的数据对象
   */
  function handleEditClick(row: IObject) {
    // 显示编辑表单，传入行数据用于填充
    editModalRef.value?.setModalVisible(row);
  }

  /**
   * 表单提交成功后处理
   * 刷新列表数据（保留当前搜索条件）
   */
  function handleSubmitClick() {
    // 根据当前检索条件刷新列表
    const queryParams = searchRef.value?.getQueryParams();
    contentRef.value?.fetchPageData(queryParams, true);
  }

  /**
   * 导出按钮点击处理
   * 根据当前搜索条件导出数据
   */
  function handleExportClick() {
    // 根据检索条件导出数据
    const queryParams = searchRef.value?.getQueryParams();
    contentRef.value?.exportPageData(queryParams);
  }

  /**
   * 搜索区域显隐切换
   */
  function handleSearchClick() {
    searchRef.value?.toggleVisible();
  }

  /**
   * 表格列筛选变化处理
   * 合并新的筛选条件和当前搜索条件，重新查询
   * @param filterParams 新的筛选条件
   */
  function handleFilterChange(filterParams: IObject) {
    const queryParams = searchRef.value?.getQueryParams();
    contentRef.value?.fetchPageData({ ...queryParams, ...filterParams }, true);
  }

  return {
    searchRef,
    contentRef,
    addModalRef,
    editModalRef,
    handleQueryClick,
    handleResetClick,
    handleAddClick,
    handleEditClick,
    handleSubmitClick,
    handleExportClick,
    handleSearchClick,
    handleFilterChange,
  };
}

export default usePage;
