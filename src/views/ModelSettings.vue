<template>
  <div class="model-settings-container">
    <div class="settings-card">
      <h2>训练参数设置</h2>
      <div class="form-wrapper">
        <div class="form-row">
          <div class="form-group">
            <label>模型名称</label>
            <input type="text" v-model="modelName" placeholder="输入模型名称">
          </div>
          <div class="form-group">
            <label>模型类型</label>
            <select v-model="modelType">
              <option value="basic">基础模型</option>
              <option value="advanced">高级模型</option>
              <option value="pro">专业模型</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>学习率 <span class="value-display">{{ learningRate }}</span></label>
            <input type="range" v-model="learningRate" min="0.0001" max="0.01" step="0.0001">
            <div class="range-marks">
              <span>低</span>
              <span>中</span>
              <span>高</span>
            </div>
          </div>
          <div class="form-group">
            <label>训练轮数</label>
            <input type="number" v-model="epochs" min="1" max="1000">
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>批次大小</label>
            <select v-model="batchSize">
              <option value="8">8</option>
              <option value="16">16</option>
              <option value="32">32</option>
              <option value="64">64</option>
            </select>
          </div>
          <div class="form-group">
            <label>优化器</label>
            <select v-model="optimizer">
              <option value="adam">Adam</option>
              <option value="sgd">SGD</option>
              <option value="rmsprop">RMSprop</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>数据增强</label>
            <div class="toggle-wrapper">
              <div class="toggle" :class="{ active: dataAugmentation }" @click="dataAugmentation = !dataAugmentation">
                <div class="toggle-handle"></div>
              </div>
              <span>{{ dataAugmentation ? '开启' : '关闭' }}</span>
            </div>
          </div>
          <div class="form-group">
            <label>早停策略</label>
            <div class="toggle-wrapper">
              <div class="toggle" :class="{ active: earlyStop }" @click="earlyStop = !earlyStop">
                <div class="toggle-handle"></div>
              </div>
              <span>{{ earlyStop ? '开启' : '关闭' }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button class="btn reset-btn">重置</button>
        <button class="btn save-btn">保存设置</button>
      </div>
    </div>
    
    <div class="model-list">
      <h2>已保存的模型</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>模型名称</th>
              <th>类型</th>
              <th>创建时间</th>
              <th>训练状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(model, index) in savedModels" :key="index">
              <td>{{ model.name }}</td>
              <td>{{ getModelTypeName(model.type) }}</td>
              <td>{{ model.createdAt }}</td>
              <td>
                <span class="status" :class="model.status">
                  {{ getStatusName(model.status) }}
                </span>
              </td>
              <td class="actions">
                <button class="icon-btn edit-btn" title="编辑">✏️</button>
                <button class="icon-btn download-btn" title="下载">📥</button>
                <button class="icon-btn delete-btn" title="删除">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModelSettings',
  data() {
    return {
      modelName: '',
      modelType: 'basic',
      learningRate: 0.001,
      epochs: 100,
      batchSize: '32',
      optimizer: 'adam',
      dataAugmentation: true,
      earlyStop: true,
      savedModels: [
        { name: '基础风格模型', type: 'basic', createdAt: '2023-04-12', status: 'completed' },
        { name: '高级服饰模型', type: 'advanced', createdAt: '2023-05-25', status: 'training' },
        { name: '专业款式模型', type: 'pro', createdAt: '2023-06-18', status: 'failed' }
      ]
    }
  },
  methods: {
    getModelTypeName(type) {
      const types = {
        'basic': '基础模型',
        'advanced': '高级模型',
        'pro': '专业模型'
      };
      return types[type] || type;
    },
    getStatusName(status) {
      const statuses = {
        'completed': '已完成',
        'training': '训练中',
        'failed': '失败',
        'pending': '等待中'
      };
      return statuses[status] || status;
    }
  }
}
</script>

<style scoped>
.model-settings-container {
  height: 100vh;
  overflow: hidden;
  padding: 0;
}

h1 {
  margin-bottom: 30px;
  font-size: 28px;
  color: var(--primary-color);
}

h2 {
  font-size: 22px;
  color: var(--text-color);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

h2::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 20px;
  background: var(--primary-color);
  margin-right: 10px;
  border-radius: 2px;
}

.settings-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 25px;
  box-shadow: var(--shadow-md);
  margin-bottom: 30px;
  border: 1px solid var(--border-color);
}

.form-wrapper {
  margin-bottom: 30px;
}

.form-row {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 500;
  color: var(--text-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value-display {
  color: var(--primary-color);
  font-weight: normal;
}

input[type="text"],
input[type="number"],
select {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 16px;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s ease;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

input[type="range"] {
  width: 100%;
  margin: 10px 0;
  -webkit-appearance: none;
  height: 8px;
  border-radius: 5px;
  background: var(--border-color);
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 5px rgba(67, 97, 238, 0.2);
}

.range-marks {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--text-secondary);
}

.toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
}

.toggle {
  width: 48px;
  height: 24px;
  background-color: var(--border-color);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle.active {
  background-color: var(--primary-color);
}

.toggle-handle {
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.toggle.active .toggle-handle {
  left: 26px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn {
  background-color: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.reset-btn:hover {
  background-color: var(--border-color);
}

.save-btn {
  background-color: var(--primary-color);
  color: white;
}

.save-btn:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.model-list {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 25px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  color: var(--text-color);
  font-weight: 600;
  background-color: rgba(67, 97, 238, 0.05);
}

td {
  color: var(--text-color);
}

.status {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status.completed {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status.training {
  background-color: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
}

.status.failed {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status.pending {
  background-color: rgba(249, 115, 22, 0.1);
  color: #f97316;
}

.actions {
  display: flex;
  gap: 10px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.icon-btn:hover {
  background-color: rgba(67, 97, 238, 0.1);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 20px;
  }
}
</style> 