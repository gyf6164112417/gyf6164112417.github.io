<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1>智能换装系统 <span>数据概览</span></h1>
    </div>
    
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon material">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        </div>
        <div class="stat-info">
          <div class="stat-title">素材库</div>
          <div class="stat-value">{{ materials.length }} <span class="unit">个</span></div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon training">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>
        </div>
        <div class="stat-info">
          <div class="stat-title">训练次数</div>
          <div class="stat-value">{{ trainingCount }} <span class="unit">次</span></div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon script">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <div class="stat-info">
          <div class="stat-title">话术生成次数</div>
          <div class="stat-value">{{ scriptGenCount }} <span class="unit">次</span></div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon model">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <div class="stat-info">
          <div class="stat-title">模特数量</div>
          <div class="stat-value">{{ models.length }} <span class="unit">个</span></div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon image">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        </div>
        <div class="stat-info">
          <div class="stat-title">图片生成</div>
          <div class="stat-value">{{ imageGenCount }} <span class="unit">张</span></div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon video">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
        </div>
        <div class="stat-info">
          <div class="stat-title">视频生成</div>
          <div class="stat-value">{{ videoGenCount }} <span class="unit">个</span></div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h2>模特</h2>
        <button class="add-btn" @click="openModelUpload"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> 添加模特</button>
      </div>
      <div class="model-cards">
        <div v-for="(model, index) in models" :key="'model-'+index" class="model-card">
          <div class="model-image" v-if="model.image" @click="viewImage(model.image)">
            <img :src="model.image" alt="模特图片">
          </div>
          <div class="model-placeholder" v-else>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div class="model-name">{{ model.name }}</div>
        </div>
        <div class="model-card add-card" @click="openModelUpload">
          <div class="add-icon">+</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h2>服装</h2>
        <button class="add-btn" @click="openClothingUpload"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> 添加服装</button>
      </div>
      <div class="clothing-cards">
        <div v-for="(clothing, index) in clothes" :key="'clothing-'+index" class="clothing-card">
          <div class="clothing-image" v-if="clothing.image" @click="viewImage(clothing.image)">
            <img :src="clothing.image" alt="服装图片">
          </div>
          <div class="clothing-placeholder" v-else>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"></path></svg>
          </div>
          <div class="clothing-name">{{ clothing.name }}</div>
        </div>
        <div class="clothing-card add-card" @click="openClothingUpload">
          <div class="add-icon">+</div>
        </div>
      </div>
    </div>

    <!-- 模特上传对话框 -->
    <div class="upload-dialog" v-if="showModelUpload">
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>添加模特</h3>
          <button class="close-btn" @click="showModelUpload = false">&times;</button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>模特名称</label>
            <input type="text" v-model="newModel.name" placeholder="输入模特名称">
          </div>
          <div class="form-group">
            <label>上传图片</label>
            <div class="upload-box" @click="triggerModelFileInput">
              <input 
                type="file" 
                ref="modelFileInput" 
                style="display: none" 
                accept="image/*"
                @change="handleModelFileUpload"
              >
              <div class="upload-preview rectangular-preview" v-if="modelPreview">
                <img :src="modelPreview" alt="预览">
              </div>
              <div class="upload-placeholder" v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <p>点击或拖拽上传图片</p>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="cancel-btn" @click="showModelUpload = false">取消</button>
          <button class="confirm-btn" @click="addModel">确认添加</button>
        </div>
      </div>
    </div>

    <!-- 服装上传对话框 -->
    <div class="upload-dialog" v-if="showClothingUpload">
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>添加服装</h3>
          <button class="close-btn" @click="showClothingUpload = false">&times;</button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>服装名称</label>
            <input type="text" v-model="newClothing.name" placeholder="输入服装名称">
          </div>
          <div class="form-group">
            <label>上传图片</label>
            <div class="upload-box" @click="triggerClothingFileInput">
              <input 
                type="file" 
                ref="clothingFileInput" 
                style="display: none" 
                accept="image/*"
                @change="handleClothingFileUpload"
              >
              <div class="upload-preview rectangular-preview" v-if="clothingPreview">
                <img :src="clothingPreview" alt="预览">
              </div>
              <div class="upload-placeholder" v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <p>点击或拖拽上传图片</p>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="cancel-btn" @click="showClothingUpload = false">取消</button>
          <button class="confirm-btn" @click="addClothing">确认添加</button>
        </div>
      </div>
    </div>

    <!-- Add a modal for viewing images directly on the page -->
    <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <span class="modal-title">图片查看</span>
          <button class="modal-close" @click="closeImageModal">×</button>
        </div>
        <div class="modal-body">
          <img :src="currentImage" alt="查看图片">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      // 统计数据
      materials: [{ name: '默认素材库', count: 10 }],
      trainingCount: 0,
      scriptGenCount: 0,
      imageGenCount: 0,
      videoGenCount: 0,
      
      // 模特数据
      models: [],
      showModelUpload: false,
      newModel: {
        name: '',
        image: null
      },
      modelPreview: null,
      
      // 服装数据
      clothes: [],
      showClothingUpload: false,
      newClothing: {
        name: '',
        image: null
      },
      clothingPreview: null,

      // 图片模态框
      showImageModal: false,
      currentImage: '',

      // 移除菜单相关数据
    }
  },
  methods: {
    // 移除菜单相关方法
    
    // 模特相关方法
    openModelUpload() {
      this.showModelUpload = true;
      this.newModel = { name: '', image: null };
      this.modelPreview = null;
    },
    triggerModelFileInput() {
      this.$refs.modelFileInput.click();
    },
    handleModelFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // 检查文件类型和大小
      if (!file.type.match('image.*')) {
        alert('请上传图片文件');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB限制
        alert('图片大小不能超过5MB');
        return;
      }
      
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        this.modelPreview = e.target.result;
        this.newModel.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    addModel() {
      if (!this.newModel.name.trim()) {
        alert('请输入模特名称');
        return;
      }
      
      if (!this.newModel.image) {
        alert('请上传模特图片');
        return;
      }
      
      this.models.push({
        name: this.newModel.name,
        image: this.newModel.image
      });
      
      this.showModelUpload = false;
    },
    
    // 服装相关方法
    openClothingUpload() {
      this.showClothingUpload = true;
      this.newClothing = { name: '', image: null };
      this.clothingPreview = null;
    },
    triggerClothingFileInput() {
      this.$refs.clothingFileInput.click();
    },
    handleClothingFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // 检查文件类型和大小
      if (!file.type.match('image.*')) {
        alert('请上传图片文件');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB限制
        alert('图片大小不能超过5MB');
        return;
      }
      
      // 创建预览
      const reader = new FileReader();
      reader.onload = (e) => {
        this.clothingPreview = e.target.result;
        this.newClothing.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    addClothing() {
      if (!this.newClothing.name.trim()) {
        alert('请输入服装名称');
        return;
      }
      
      if (!this.newClothing.image) {
        alert('请上传服装图片');
        return;
      }
      
      this.clothes.push({
        name: this.newClothing.name,
        image: this.newClothing.image
      });
      
      // 更新素材库计数
      if (this.materials.length > 0) {
        this.materials[0].count++;
      }
      
      this.showClothingUpload = false;
    },
    viewImage(imageUrl) {
      this.currentImage = imageUrl;
      this.showImageModal = true;
    },
    closeImageModal() {
      this.showImageModal = false;
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.dashboard-header {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboard-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-color);
  position: relative;
  padding-bottom: 12px;
}

.dashboard-header h1::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  border-radius: 3px;
}

.dashboard-header h1 span {
  font-size: 18px;
  color: var(--primary-color);
  margin-left: 10px;
  font-weight: 400;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 22px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: linear-gradient(180deg, var(--primary-color), var(--primary-light));
  opacity: 0.8;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.stat-icon {
  width: 54px;
  height: 54px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 18px;
  color: white;
  position: relative;
  overflow: hidden;
}

.stat-icon::after {
  content: '';
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 25px;
  height: 25px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.material {
  background: linear-gradient(135deg, #4361ee, #4895ef);
}

.training {
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
}

.script {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
}

.model {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.image {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.video {
  background: linear-gradient(135deg, #ef4444, #f87171);
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 26px;
  font-weight: bold;
  color: var(--text-color);
  display: flex;
  align-items: flex-end;
}

.unit {
  font-size: 14px;
  font-weight: normal;
  color: var(--text-secondary);
  margin-left: 4px;
  margin-bottom: 3px;
}

.section {
  margin-bottom: 50px;
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 22px;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(226, 232, 240, 0.7);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.section-header h2 {
  color: var(--text-color);
  font-size: 22px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.section-header h2::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 18px;
  background: linear-gradient(180deg, var(--primary-color), var(--primary-light));
  margin-right: 10px;
  border-radius: 2px;
}

.add-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 9px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.add-btn:hover {
  background-color: var(--primary-dark);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.model-cards, .clothing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
}

.model-card, .clothing-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.model-card:hover, .clothing-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.model-placeholder, .clothing-placeholder,
.model-image, .clothing-image {
  width: 100%;
  height: 85%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  overflow: hidden;
  background-color: #f8fafc;
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

.model-placeholder, .clothing-placeholder {
  color: var(--text-secondary);
}

.model-image img, .clothing-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--radius-md);
  transition: transform 0.3s ease;
}

.model-card:hover .model-image img, 
.clothing-card:hover .clothing-image img {
  transform: scale(1.03);
}

.model-name, .clothing-name {
  font-size: 16px;
  color: var(--text-color);
  font-weight: 500;
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.add-card {
  border: 1px dashed var(--border-color);
  background-color: rgba(67, 97, 238, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.add-card:hover {
  background-color: rgba(67, 97, 238, 0.08);
  border-color: var(--primary-light);
}

.add-icon {
  font-size: 50px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  transition: all 0.3s ease;
}

.add-card:hover .add-icon {
  color: var(--primary-color);
  transform: scale(1.1);
}

/* 对话框样式 */
.upload-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dialog-content {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: slideUp 0.3s ease;
  transform: translateY(0);
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.dialog-header {
  padding: 18px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8fafc;
}

.dialog-header h3 {
  color: var(--text-color);
  font-size: 20px;
  margin: 0;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  background-color: rgba(226, 232, 240, 0.5);
  color: var(--text-color);
}

.dialog-body {
  padding: 22px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-color);
  font-weight: 500;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-group input[type="text"]:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.upload-box {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 250px;
  background-color: #f8fafc;
}

.upload-box:hover {
  border-color: var(--primary-color);
  background-color: rgba(67, 97, 238, 0.05);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-secondary);
}

.upload-placeholder svg {
  margin-bottom: 12px;
  color: var(--primary-color);
}

.upload-placeholder p {
  margin-top: 5px;
  text-align: center;
  font-size: 15px;
}

.upload-preview.rectangular-preview {
  width: 100%;
  display: flex;
  justify-content: center;
}

.upload-preview.rectangular-preview img {
  max-width: 100%;
  max-height: 250px;
  border-radius: var(--radius-md);
  object-fit: contain;
  box-shadow: var(--shadow-md);
}

.dialog-footer {
  padding: 16px 22px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: #f8fafc;
}

.cancel-btn, .confirm-btn {
  padding: 10px 18px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.cancel-btn:hover {
  background-color: #f1f5f9;
  color: var(--text-color);
}

.confirm-btn {
  background-color: var(--primary-color);
  border: none;
  color: white;
}

.confirm-btn:hover {
  background-color: var(--primary-dark);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

/* 图片查看模态框 */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

.modal-content {
  width: 500px;
  max-width: 85%;
  background-color: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  animation: zoomIn 0.3s ease;
}

@keyframes zoomIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  background-color: #f8fafc;
}

.modal-title {
  font-weight: 600;
  color: var(--text-color);
  font-size: 16px;
}

.modal-close {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #666;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: rgba(226, 232, 240, 0.5);
  color: var(--text-color);
}

.modal-body {
  padding: 20px;
  display: flex;
  justify-content: center;
  background-color: #f8fafc;
}

.modal-body img {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 