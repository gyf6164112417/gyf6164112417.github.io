<template>
  <div class="job-list-container">
    <div class="filters">
      <h2 class="section-title">模型训练任务</h2>
      
      <div class="search-controls">
        <InputField
          v-model="searchQuery"
          placeholder="搜索任务..."
          icon="search"
          class="search-input"
        />
        
        <DropdownSelector
          v-model="statusFilter"
          :options="statusOptions"
          placeholder="任务状态"
          class="status-filter"
        />
        
        <DropdownSelector
          v-model="dateFilter"
          :options="dateOptions"
          placeholder="创建时间"
          class="date-filter"
        />
      </div>
      
      <div class="action-buttons">
        <Button
          label="新建任务"
          primary
          icon="add"
          @click="openCreateModal"
        />
        <Button
          v-if="selectedJobs.length > 0"
          label="批量操作"
          icon="settings"
          @click="openBatchActions"
        />
      </div>
    </div>
    
    <div class="loading-overlay" v-if="loading">
      <Spinner size="large" />
    </div>
    
    <div class="empty-state" v-if="!loading && filteredJobs.length === 0">
      <EmptyState
        icon="assignment"
        title="暂无任务"
        description="您当前没有符合筛选条件的模型训练任务。"
        action-label="创建任务"
        @action="openCreateModal"
      />
    </div>
    
    <div v-if="!loading && filteredJobs.length > 0" class="job-list-wrapper">
      <RecycleScroller
        class="job-list"
        :items="filteredJobs"
        :item-size="96"
        key-field="id"
        v-slot="{ item: job }"
      >
        <div 
          class="job-card"
          :class="{ 'selected': selectedJobs.includes(job.id) }"
          @click="toggleJobSelection(job.id)"
        >
          <div class="job-card-header">
            <Checkbox
              :checked="selectedJobs.includes(job.id)"
              @change="toggleJobSelection(job.id)"
            />
            <span class="job-name">{{ job.name }}</span>
            <StatusBadge :status="job.status" />
          </div>
          
          <div class="job-card-body">
            <div class="job-details">
              <div class="detail-item">
                <icon name="calendar" />
                <span>创建时间: {{ formatDate(job.createdAt) }}</span>
              </div>
              <div class="detail-item">
                <icon name="dataset" />
                <span>数据集: {{ job.datasetName }}</span>
              </div>
              <div class="detail-item">
                <icon name="model" />
                <span>模型类型: {{ job.modelType }}</span>
              </div>
            </div>
            
            <div class="job-progress" v-if="job.status === 'running'">
              <ProgressBar :value="job.progress" :label="`${job.progress}%`" />
            </div>
          </div>
          
          <div class="job-card-actions">
            <Button
              icon="visibility"
              label="查看详情"
              @click.stop="viewJobDetails(job.id)"
              small
            />
            <Button
              v-if="job.status === 'running'"
              icon="pause"
              label="暂停"
              @click.stop="pauseJob(job.id)"
              small
            />
            <Button
              v-if="job.status === 'paused'"
              icon="play_arrow"
              label="继续"
              @click.stop="resumeJob(job.id)"
              small
            />
            <Button
              v-if="['completed', 'failed', 'stopped'].includes(job.status)"
              icon="delete"
              label="删除"
              @click.stop="confirmDeleteJob(job.id)"
              small
              danger
            />
          </div>
        </div>
      </RecycleScroller>
      
      <div class="pagination-controls">
        <span class="pagination-info">显示 {{ filteredJobs.length }} 个任务中的 {{ paginatedJobs.length }} 个</span>
        <Pagination
          :total-items="filteredJobs.length"
          :page-size="pageSize"
          :current-page="currentPage"
          @page-change="handlePageChange"
        />
        <DropdownSelector
          v-model="pageSize"
          :options="pageSizeOptions"
          class="page-size-selector"
        />
      </div>
    </div>
    
    <ConfirmDialog
      v-if="confirmDialog.visible"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :confirm-label="confirmDialog.confirmLabel"
      :cancel-label="confirmDialog.cancelLabel"
      @confirm="confirmDialog.onConfirm"
      @cancel="confirmDialog.visible = false"
    />
    
    <CreateJobModal
      v-if="createModalVisible"
      @close="createModalVisible = false"
      @create="handleJobCreated"
    />
    
    <BatchActionsModal
      v-if="batchActionsVisible"
      :selected-count="selectedJobs.length"
      @close="batchActionsVisible = false"
      @delete="confirmDeleteBatch"
      @stop="confirmStopBatch"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { debounce } from 'lodash-es';
import InputField from '../UI/InputField.vue';
import DropdownSelector from '../UI/DropdownSelector.vue';
import Button from '../UI/Button.vue';
import StatusBadge from '../UI/StatusBadge.vue';
import ProgressBar from '../UI/ProgressBar.vue';
import Pagination from '../UI/Pagination.vue';
import Spinner from '../UI/Spinner.vue';
import Checkbox from '../UI/Checkbox.vue';
import EmptyState from '../UI/EmptyState.vue';
import ConfirmDialog from '../UI/ConfirmDialog.vue';
import CreateJobModal from './CreateJobModal.vue';
import BatchActionsModal from './BatchActionsModal.vue';
import { formatDate } from '@/utils/dateFormatter';
import { useJobStore } from '@/stores/jobStore';
import { useToast } from '@/composables/useToast';

export default {
  name: 'JobList',
  components: {
    InputField,
    DropdownSelector,
    Button,
    StatusBadge,
    ProgressBar,
    Pagination,
    Spinner,
    Checkbox,
    EmptyState,
    ConfirmDialog,
    CreateJobModal,
    BatchActionsModal,
    RecycleScroller
  },
  setup() {
    const jobStore = useJobStore();
    const { showToast } = useToast();
    
    // 状态和筛选
    const loading = ref(true);
    const searchQuery = ref('');
    const statusFilter = ref('');
    const dateFilter = ref('');
    const selectedJobs = ref([]);
    const createModalVisible = ref(false);
    const batchActionsVisible = ref(false);
    const confirmDialog = ref({
      visible: false,
      title: '',
      message: '',
      confirmLabel: '',
      cancelLabel: '取消',
      onConfirm: () => {}
    });
    
    // 分页
    const currentPage = ref(1);
    const pageSize = ref(10);
    
    // 筛选选项
    const statusOptions = [
      { value: '', label: '全部状态' },
      { value: 'running', label: '进行中' },
      { value: 'completed', label: '已完成' },
      { value: 'paused', label: '已暂停' },
      { value: 'failed', label: '失败' },
      { value: 'stopped', label: '已停止' }
    ];
    
    const dateOptions = [
      { value: '', label: '全部时间' },
      { value: 'today', label: '今天' },
      { value: 'week', label: '本周' },
      { value: 'month', label: '本月' }
    ];
    
    const pageSizeOptions = [
      { value: 10, label: '10条/页' },
      { value: 20, label: '20条/页' },
      { value: 50, label: '50条/页' },
      { value: 100, label: '100条/页' }
    ];
    
    // 计算属性：筛选后的任务列表
    const filteredJobs = computed(() => {
      let result = jobStore.jobs;
      
      // 搜索筛选
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(job => 
          job.name.toLowerCase().includes(query) || 
          job.datasetName.toLowerCase().includes(query) ||
          job.modelType.toLowerCase().includes(query)
        );
      }
      
      // 状态筛选
      if (statusFilter.value) {
        result = result.filter(job => job.status === statusFilter.value);
      }
      
      // 日期筛选
      if (dateFilter.value) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        result = result.filter(job => {
          const jobDate = new Date(job.createdAt);
          switch (dateFilter.value) {
            case 'today':
              return jobDate >= today;
            case 'week':
              return jobDate >= startOfWeek;
            case 'month':
              return jobDate >= startOfMonth;
            default:
              return true;
          }
        });
      }
      
      return result;
    });
    
    // 计算属性：分页后的任务
    const paginatedJobs = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredJobs.value.slice(start, end);
    });
    
    // 性能优化：使用防抖搜索
    const debouncedSearch = debounce(() => {
      currentPage.value = 1; // 重置到第一页
    }, 300);
    
    // 监听搜索查询变化
    const watchSearchQuery = () => {
      debouncedSearch();
    };
    
    // 分页处理
    const handlePageChange = (page) => {
      currentPage.value = page;
      // 滚动到顶部
      const listWrapper = document.querySelector('.job-list-wrapper');
      if (listWrapper) {
        listWrapper.scrollTop = 0;
      }
    };
    
    // 任务选择
    const toggleJobSelection = (jobId) => {
      const index = selectedJobs.value.indexOf(jobId);
      if (index === -1) {
        selectedJobs.value.push(jobId);
      } else {
        selectedJobs.value.splice(index, 1);
      }
    };
    
    // 查看任务详情
    const viewJobDetails = (jobId) => {
      // TODO: 导航到任务详情页面
      showToast('查看任务详情: ' + jobId, 'info');
    };
    
    // 暂停任务
    const pauseJob = (jobId) => {
      showToast('正在暂停任务...', 'info');
      jobStore.pauseJob(jobId)
        .then(() => {
          showToast('任务已暂停', 'success');
        })
        .catch(error => {
          showToast(`暂停任务失败: ${error.message}`, 'error');
        });
    };
    
    // 继续任务
    const resumeJob = (jobId) => {
      showToast('正在恢复任务...', 'info');
      jobStore.resumeJob(jobId)
        .then(() => {
          showToast('任务已恢复', 'success');
        })
        .catch(error => {
          showToast(`恢复任务失败: ${error.message}`, 'error');
        });
    };
    
    // 确认删除任务
    const confirmDeleteJob = (jobId) => {
      confirmDialog.value = {
        visible: true,
        title: '删除任务',
        message: '确定要删除此训练任务吗？此操作无法撤销。',
        confirmLabel: '删除',
        cancelLabel: '取消',
        onConfirm: () => {
          deleteJob(jobId);
          confirmDialog.value.visible = false;
        }
      };
    };
    
    // 删除任务
    const deleteJob = (jobId) => {
      showToast('正在删除任务...', 'info');
      jobStore.deleteJob(jobId)
        .then(() => {
          showToast('任务已删除', 'success');
          // 如果任务在选中列表中，移除它
          const index = selectedJobs.value.indexOf(jobId);
          if (index !== -1) {
            selectedJobs.value.splice(index, 1);
          }
        })
        .catch(error => {
          showToast(`删除任务失败: ${error.message}`, 'error');
        });
    };
    
    // 打开创建任务模态框
    const openCreateModal = () => {
      createModalVisible.value = true;
    };
    
    // 处理新任务创建
    const handleJobCreated = () => {
      showToast('任务已创建', 'success');
      createModalVisible.value = false;
      // 切换到第一页以显示新任务
      currentPage.value = 1;
    };
    
    // 打开批量操作模态框
    const openBatchActions = () => {
      if (selectedJobs.value.length === 0) {
        showToast('请先选择任务', 'warning');
        return;
      }
      batchActionsVisible.value = true;
    };
    
    // 确认批量删除
    const confirmDeleteBatch = () => {
      confirmDialog.value = {
        visible: true,
        title: '批量删除任务',
        message: `确定要删除选中的 ${selectedJobs.value.length} 个任务吗？此操作无法撤销。`,
        confirmLabel: '删除',
        cancelLabel: '取消',
        onConfirm: () => {
          batchActionsVisible.value = false;
          deleteBatchJobs();
          confirmDialog.value.visible = false;
        }
      };
    };
    
    // 确认批量停止
    const confirmStopBatch = () => {
      confirmDialog.value = {
        visible: true,
        title: '批量停止任务',
        message: `确定要停止选中的 ${selectedJobs.value.length} 个任务吗？`,
        confirmLabel: '停止',
        cancelLabel: '取消',
        onConfirm: () => {
          batchActionsVisible.value = false;
          stopBatchJobs();
          confirmDialog.value.visible = false;
        }
      };
    };
    
    // 批量删除任务
    const deleteBatchJobs = () => {
      showToast(`正在删除 ${selectedJobs.value.length} 个任务...`, 'info');
      
      Promise.all(selectedJobs.value.map(jobId => jobStore.deleteJob(jobId)))
        .then(() => {
          showToast(`成功删除 ${selectedJobs.value.length} 个任务`, 'success');
          selectedJobs.value = [];
        })
        .catch(error => {
          showToast(`批量删除任务失败: ${error.message}`, 'error');
        });
    };
    
    // 批量停止任务
    const stopBatchJobs = () => {
      showToast(`正在停止 ${selectedJobs.value.length} 个任务...`, 'info');
      
      Promise.all(selectedJobs.value.map(jobId => jobStore.stopJob(jobId)))
        .then(() => {
          showToast(`成功停止 ${selectedJobs.value.length} 个任务`, 'success');
          selectedJobs.value = [];
        })
        .catch(error => {
          showToast(`批量停止任务失败: ${error.message}`, 'error');
        });
    };
    
    // 加载任务数据
    const loadJobs = () => {
      loading.value = true;
      
      jobStore.fetchJobs()
        .then(() => {
          loading.value = false;
        })
        .catch(error => {
          loading.value = false;
          showToast(`加载任务失败: ${error.message}`, 'error');
        });
    };
    
    // 组件挂载时加载数据
    onMounted(() => {
      loadJobs();
      
      // 监听搜索查询变化
      searchQuery.value = '';
      // 添加防抖搜索监听
      const unwatch = watchSearchQuery;
      
      // 设置任务更新轮询
      const pollingInterval = setInterval(() => {
        // 仅在后台轮询运行中的任务进度
        if (jobStore.hasRunningJobs) {
          jobStore.updateRunningJobsProgress();
        }
      }, 5000); // 每5秒轮询一次
      
      // 卸载时清理
      onUnmounted(() => {
        clearInterval(pollingInterval);
        if (unwatch) unwatch();
      });
    });
    
    return {
      loading,
      searchQuery,
      statusFilter,
      dateFilter,
      selectedJobs,
      createModalVisible,
      batchActionsVisible,
      confirmDialog,
      currentPage,
      pageSize,
      statusOptions,
      dateOptions,
      pageSizeOptions,
      filteredJobs,
      paginatedJobs,
      formatDate,
      handlePageChange,
      toggleJobSelection,
      viewJobDetails,
      pauseJob,
      resumeJob,
      confirmDeleteJob,
      openCreateModal,
      handleJobCreated,
      openBatchActions,
      confirmDeleteBatch,
      confirmStopBatch
    };
  }
};
</script>

<style scoped>
.job-list-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.filters {
  padding: 1rem;
  background-color: var(--surface-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  margin-bottom: 1rem;
}

.section-title {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-color-primary);
}

.search-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.status-filter,
.date-filter {
  width: 150px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(var(--surface-color-rgb), 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.job-list-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.job-list {
  flex: 1;
  overflow: auto;
  will-change: transform; /* 性能优化: 提示浏览器该元素将会被频繁变换 */
}

.job-card {
  padding: 1rem;
  margin: 0.5rem;
  background-color: var(--surface-color-secondary);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-xs);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  contain: content; /* 性能优化: 限制重绘范围 */
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.job-card.selected {
  border: 2px solid var(--primary-color);
}

.job-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.job-name {
  margin-left: 0.5rem;
  flex: 1;
  font-weight: 600;
  color: var(--text-color-primary);
}

.job-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.job-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.job-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.empty-state {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.pagination-info {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.page-size-selector {
  width: 100px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .search-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .search-input,
  .status-filter,
  .date-filter {
    width: 100%;
  }
  
  .action-buttons {
    margin-top: 0.5rem;
  }
  
  .job-details {
    flex-direction: column;
  }
}
</style> 