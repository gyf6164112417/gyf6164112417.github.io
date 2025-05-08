<template>
  <div class="material-library">
    <!-- 加载中遮罩 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <div class="main-container">
      <!-- 左侧表单区域 -->
      <div class="upload-form">
        <h1 class="title">素材库</h1>
        
        <div class="form-content">
          <div class="form-item">
            <div class="upload-area" @click="triggerFileUpload">
              <div v-if="formData.imageUrl" class="preview-container">
                <img :src="formData.imageUrl" alt="Preview" class="preview-image">
              </div>
              <div v-else class="upload-placeholder">
                <i class="el-icon-plus"></i>
                <span>上传图片</span>
              </div>
            </div>
            <input 
              type="file" 
              ref="fileInput" 
              style="display: none" 
              accept="image/*" 
              @change="handleFileUpload"
            >
          </div>

          <div class="form-column">
            <!-- 两行两列布局 -->
            <div class="form-row">
              <div class="form-item-half">
                <label>服装类型：</label>
                <div class="select-container">
                  <select v-model="formData.clothingType">
                    <option value="上衣">上衣</option>
                    <option value="下装">下装</option>
                  </select>
                </div>
              </div>
              
              <div class="form-item-half">
                <label>风格属性：</label>
                <div class="select-container">
                  <select v-model="formData.styleType">
                    <option value="基础风格">基础风格</option>
                    <option value="细分风格">细分风格</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-item-half">
                <label>颜色：</label>
                <input type="color" v-model="formData.color" class="color-picker">
              </div>
              
              <div class="form-item-half">
                <label>图案：</label>
                <div class="select-container">
                  <select v-model="formData.pattern">
                    <option value="纯色">纯色</option>
                    <option value="条纹">条纹</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-buttons">
              <button class="cancel-button" @click="resetForm">取消</button>
              <button class="save-button" @click="saveItem">保存</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧展示区域 -->
      <div class="content-display">
        <div v-if="savedItems.length === 0" class="empty-state">
          <i class="el-icon-picture-outline"></i>
          <p>还没有上传图片，请在左侧添加</p>
        </div>
        
        <div v-else class="items-grid">
          <div v-for="(item, index) in savedItems" :key="index" class="item-card">
            <div class="item-image" @click="previewImage(item.imageUrl)">
              <img :src="item.imageUrl" alt="Item image">
              <div class="image-overlay">
                <i class="el-icon-zoom-in"></i>
              </div>
            </div>
            <div class="item-info">
              <div class="item-content">
                <div class="item-type">
                  <span class="label">服装类型:</span> 
                  <span class="value">{{ item.clothingType }}</span>
                </div>
                <div class="item-style">
                  <span class="label">风格属性:</span> 
                  <span class="value">{{ item.styleType }}</span>
                </div>
                <div class="item-color">
                  <span class="label">颜色:</span>
                  <span class="color-sample" :style="{ backgroundColor: item.color }"></span>
                </div>
                <div class="item-pattern">
                  <span class="label">图案:</span>
                  <span class="value">{{ item.pattern }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览对话框 -->
    <div v-if="previewVisible" class="image-preview-modal" @click="closePreview">
      <div class="preview-content" @click.stop>
        <img :src="previewImageUrl" alt="预览图片" class="preview-large-image">
        <button class="close-preview-btn" @click="closePreview">
          <i class="el-icon-close"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MaterialLibrary',
  data() {
    return {
      isLoading: false,
      previewVisible: false,
      previewImageUrl: '',
      formData: {
        imageUrl: '',
        clothingType: '上衣',
        styleType: '基础风格',
        color: '#2196F3',
        pattern: '纯色'
      },
      savedItems: []
    };
  },
  methods: {
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
    
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    resetForm() {
      this.formData = {
        imageUrl: '',
        clothingType: '上衣',
        styleType: '基础风格',
        color: '#2196F3',
        pattern: '纯色'
      };
    },
    
    saveItem() {
      if (!this.formData.imageUrl) {
        alert('请先上传图片');
        return;
      }
      
      this.isLoading = true;
      
      // 模拟保存延迟
      setTimeout(() => {
        // 创建新对象以避免引用问题
        const newItem = JSON.parse(JSON.stringify(this.formData));
        this.savedItems.unshift(newItem);
        this.resetForm();
        this.isLoading = false;
      }, 500);
    },
    
    deleteItem(index) {
      if (confirm('确定要删除这个图片吗？')) {
        this.savedItems.splice(index, 1);
      }
    },
    
    previewImage(imageUrl) {
      this.previewImageUrl = imageUrl;
      this.previewVisible = true;
    },
    
    closePreview() {
      this.previewVisible = false;
    }
  },
  mounted() {
    // 初始化
  }
};
</script>

<style scoped>
.material-library {
  width: 100%;
  height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}

.main-container {
  display: flex;
  gap: 24px;
  height: calc(100% - 40px);
  overflow: hidden;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.spinner {
  width: 45px;
  height: 45px;
  border: 4px solid rgba(103, 114, 229, 0.2);
  border-top: 4px solid #6772e5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.upload-form {
  background-color: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  flex: 0 0 45%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 20px;
  color: #343a40;
  margin-bottom: 20px;
  font-weight: 600;
  letter-spacing: -0.5px;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 12px;
}

.form-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.form-item {
  margin-bottom: 16px;
}

.form-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-item label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #525f7f;
  font-weight: 500;
}

.upload-area {
  border: 2px dashed #ced4da;
  height: 180px;
  width: 100%;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background-color: #f8f9fa;
  margin-bottom: 16px;
}

.upload-area:hover {
  border-color: #8a96e5;
  background-color: #eef2ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(103, 114, 229, 0.1);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #8898aa;
}

.upload-placeholder i {
  font-size: 36px;
  margin-bottom: 12px;
  color: #6772e5;
}

.upload-placeholder span {
  font-size: 14px;
}

.preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  padding: 5px;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.select-container {
  position: relative;
  border: 1px solid #ced4da;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  background-color: white;
}

.select-container:hover {
  border-color: #8a96e5;
  box-shadow: 0 2px 6px rgba(103, 114, 229, 0.15);
}

.select-container select {
  width: 100%;
  padding: 10px 14px;
  border: none;
  background-color: transparent;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.select-container::after {
  content: '\25BC';
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #adb5bd;
  pointer-events: none;
  font-size: 10px;
  transition: color 0.3s ease;
}

.select-container:hover::after {
  color: #6772e5;
}

.color-picker {
  width: 100%;
  height: 40px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  cursor: pointer;
  padding: 4px;
  background-color: white;
  transition: border-color 0.3s ease;
}

.color-picker:hover {
  border-color: #8a96e5;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #dee2e6;
}

.cancel-button, .save-button {
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.07);
  border: none;
}

.cancel-button {
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.save-button {
  background-color: #6772e5;
  color: white;
}

.cancel-button:hover {
  background-color: #e9ecef;
  border-color: #ced4da;
  color: #343a40;
  transform: translateY(-1px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.08);
}

.save-button:hover {
  background-color: #5a66d6;
  transform: translateY(-1px);
  box-shadow: 0 5px 10px rgba(103, 114, 229, 0.25);
}

.content-display {
  background-color: white;
  padding: 15px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  height: 100%;
  text-align: center;
}

.empty-state i {
  font-size: 50px;
  margin-bottom: 20px;
  color: #e9ecef;
}

.empty-state p {
  margin: 0;
  font-size: 15px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  overflow-y: auto;
  height: 100%;
  padding: 5px;
}

.item-card {
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid #f1f3f5;
  display: flex;
  flex-direction: column;
  height: 300px;
}

.item-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
  border-color: #e9ecef;
}

.item-image {
  height: 70%;
  overflow: hidden;
  background-color: #f8f9fa;
  position: relative;
  cursor: pointer;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease-out, filter 0.3s ease;
}

.item-card:hover .item-image img {
  transform: scale(1.05);
  filter: brightness(1.03);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0,0,0,0) 70%, rgba(0,0,0,0.3));
  display: flex;
  justify-content: center;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding-bottom: 10px;
}

.image-overlay i {
  color: white;
  font-size: 18px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  padding: 10px;
  transition: background-color 0.3s ease;
}

.image-overlay i:hover {
   background-color: rgba(0, 0, 0, 0.8);
}

.item-image:hover .image-overlay {
  opacity: 1;
}

.item-info {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  font-size: 12px;
  background-color: white;
  border-top: 1px solid #f1f3f5;
  overflow: hidden;
  line-height: 1.5;
}

.item-content {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
}

.item-type, .item-style, .item-color, .item-pattern {
  flex: 0 0 calc(50% - 5px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
}

.item-info .label {
  color: #868e96;
  font-size: 11px;
  margin-right: 4px;
  flex-shrink: 0;
}

.item-info .value {
  color: #495057;
  font-weight: 500;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.color-sample {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  vertical-align: middle;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  margin-left: 4px;
}

.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(3px);
}

.preview-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.preview-large-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.25);
}

.close-preview-btn {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  color: #555;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: all 0.25s ease;
}

.close-preview-btn:hover {
  background-color: #dc3545;
  color: white;
  transform: scale(1.1) rotate(90deg);
}

@media (max-width: 1024px) {
  .main-container {
    flex-direction: column;
    height: auto;
    overflow: visible;
  }
  
  .upload-form, .content-display {
    flex: none;
    width: 100%;
    height: auto;
    margin-bottom: 16px;
  }
  
  .items-grid {
    height: 350px;
  }
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-item-half {
  flex: 1;
  min-width: 0;
}

.upload-area {
  height: 180px;
}

.form-buttons {
  margin-top: 10px;
  padding-top: 10px;
}
</style>