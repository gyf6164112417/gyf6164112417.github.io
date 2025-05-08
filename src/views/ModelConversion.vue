<template>
  <div class="model-conversion-container">
    <div class="content-wrapper">
      <!-- Left panel with upload sections -->
      <div class="left-panel">
        <div class="button-section">
          <BaseButton 
            class="generate-button" 
            @click="generateImage" 
            :loading="isGenerating"
            variant="primary"
            size="large"
          >
            生成
          </BaseButton>
          <BaseButton 
            class="pending-button" 
            @click="handlePending" 
            variant="outline"
            size="large"
          >
            待定
          </BaseButton>
        </div>

        <div class="upload-grid">
          <div class="upload-section model-section">
            <h2 class="section-title">模特图片</h2>
            <p class="section-description">上传模特全身照片</p>
            
            <div class="upload-area" @click="triggerFileUpload('model')">
              <div v-if="modelImage" class="preview-container">
                <img :src="modelImage" alt="Model Preview" class="preview-image">
              </div>
              <div v-else class="upload-placeholder">
                <i class="upload-icon el-icon-upload"></i>
                <span class="upload-text">点击上传模特图片</span>
              </div>
            </div>
            <input 
              type="file" 
              ref="modelInput" 
              style="display: none" 
              accept="image/*" 
              @change="handleFileUpload($event, 'model')"
            >
          </div>

          <div class="clothing-row">
            <div class="upload-section clothing-section">
              <h2 class="section-title">上衣图片</h2>
              <p class="section-description">上传上衣单品照片</p>
              
              <div class="upload-area clothing-upload" @click="triggerFileUpload('top')">
                <div v-if="topImage" class="preview-container">
                  <img :src="topImage" alt="Top Clothing Preview" class="preview-image">
                </div>
                <div v-else class="upload-placeholder">
                  <i class="upload-icon el-icon-upload"></i>
                  <span class="upload-text">点击上传上衣图片</span>
                </div>
              </div>
              <input 
                type="file" 
                ref="topInput" 
                style="display: none" 
                accept="image/*" 
                @change="handleFileUpload($event, 'top')"
              >
            </div>

            <div class="upload-section clothing-section">
              <h2 class="section-title">下装图片</h2>
              <p class="section-description">上传下装单品照片</p>
              
              <div class="upload-area clothing-upload" @click="triggerFileUpload('bottom')">
                <div v-if="bottomImage" class="preview-container">
                  <img :src="bottomImage" alt="Bottom Clothing Preview" class="preview-image">
                </div>
                <div v-else class="upload-placeholder">
                  <i class="upload-icon el-icon-upload"></i>
                  <span class="upload-text">点击上传下装图片</span>
                </div>
              </div>
              <input 
                type="file" 
                ref="bottomInput" 
                style="display: none" 
                accept="image/*" 
                @change="handleFileUpload($event, 'bottom')"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Right panel with results and history -->
      <div class="right-panel">
        <!-- Generated image display -->
        <div class="result-section">
          <h2 class="section-title-large">生成图片</h2>
          <div class="result-image-container-redesigned">
            <div v-if="generatedImage" class="generated-image-wrapper-redesigned" @click="triggerFileUpload('result')">
              <img :src="generatedImage" alt="Generated Image" class="generated-image-redesigned">
              <div class="replace-overlay-redesigned">
                <i class="el-icon-refresh"></i>
                <span>点击替换图片</span>
              </div>
            </div>
            <div v-else class="empty-result-redesigned" @click="triggerFileUpload('result')">
              <i class="el-icon-picture-outline"></i>
              <span>生成的动图将显示在此处</span>
            </div>
            <input 
              type="file" 
              ref="resultInput" 
              style="display: none" 
              accept="image/*" 
              @change="handleFileUpload($event, 'result')"
            >
          </div>
          <div class="result-actions-redesigned">
            <BaseButton 
              class="action-button-redesigned download-button-redesigned" 
              @click="downloadImage"
              :disabled="!generatedImage"
              variant="outline"
              size="medium"
            >
              <template #icon>⬇️</template>
              下载
            </BaseButton>
            <BaseButton 
              class="action-button-redesigned save-button-redesigned" 
              @click="saveToHistory"
              :disabled="!generatedImage"
              variant="outline"
              size="medium"
            >
              <template #icon>⭐</template>
              收藏
            </BaseButton>
          </div>
        </div>

        <!-- Generation history -->
        <div class="history-section">
          <div class="history-header">
            <h2 class="section-title">生成历史</h2>
            <BaseButton 
              class="clear-history-button" 
              @click="clearHistory" 
              v-if="historyImages.length > 0"
              variant="text"
              size="small"
            >
              <template #icon>🗑️</template>
              清空
            </BaseButton>
          </div>
          <div class="history-images">
            <template v-if="historyImages.length > 0">
              <div 
                v-for="(image, index) in historyImages" 
                :key="index" 
                class="history-image-item"
                @click="previewImage(image.url)"
              >
                <img :src="image.url" :alt="`历史图片${index+1}`" class="history-thumbnail">
                <div class="history-image-overlay">
                  <i class="el-icon-zoom-in"></i>
                </div>
              </div>
            </template>
            <div v-else class="empty-history">
              <i class="el-icon-time"></i>
              <span>暂无历史记录</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载中遮罩 -->
    <div v-if="isGenerating" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">正在生成中，请稍候...</div>
    </div>

    <!-- 预览弹窗 -->
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
import BaseButton from '@/components/BaseButton.vue'

export default {
  name: 'ModelConversionPage',
  components: {
    BaseButton
  },
  data() {
    return {
      modelImage: '',
      topImage: '',
      bottomImage: '',
      generatedImage: '',
      historyImages: [],
      isGenerating: false,
      previewVisible: false,
      previewImageUrl: '',
      isSaving: false,
      isDownloading: false
    }
  },
  methods: {
    triggerFileUpload(type) {
      this.$refs[`${type}Input`].click();
    },
    
    handleFileUpload(event, type) {
      const file = event.target.files[0];
      if (!file) return;
      
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'result') {
          this.generatedImage = e.target.result;
        } else {
          this[`${type}Image`] = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    },
    
    generateImage() {
      if (!this.modelImage) {
        alert('请上传模特图片');
        return;
      }
      
      if (!this.topImage && !this.bottomImage) {
        alert('请至少上传一件衣物图片');
        return;
      }
      
      this.isGenerating = true;
      
      // 模拟生成过程
      setTimeout(() => {
        this.isGenerating = false;
        // 这里使用模特图片模拟生成结果
        this.generatedImage = this.modelImage;
      }, 2000);
    },
    
    handlePending() {
      // 待定功能
      alert('此功能尚未实现');
    },
    
    downloadImage() {
      if (!this.generatedImage) return;
      
      this.isDownloading = true;
      
      // 模拟下载延迟
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = this.generatedImage;
        link.download = `模特换装_${new Date().getTime()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.isDownloading = false;
      }, 500);
    },
    
    saveToHistory() {
      if (!this.generatedImage) return;
      
      this.isSaving = true;
      
      // 模拟保存延迟
      setTimeout(() => {
        this.historyImages.unshift({
          url: this.generatedImage,
          timestamp: new Date().getTime()
        });
        this.isSaving = false;
      }, 300);
    },
    
    previewImage(imageUrl) {
      this.previewImageUrl = imageUrl;
      this.previewVisible = true;
    },
    
    closePreview() {
      this.previewVisible = false;
    },
    
    clearHistory() {
      if (confirm('确定要清空历史记录吗？')) {
        this.historyImages = [];
      }
    }
  }
}
</script>

<style scoped>
.model-conversion-container {
  width: 100%;
  height: 100vh;
  background-color: #f6f9fc;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.content-wrapper {
  display: flex;
  height: calc(100vh - 32px);
  gap: 16px;
}

.left-panel {
  flex: 0 0 55%;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.right-panel {
  flex: 0 0 43%;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;
}

.button-section {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  justify-content: center;
}

.generate-button, .pending-button {
  padding: 8px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-button {
  background-color: #4361ee;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.2);
}

.generate-button:hover {
  background-color: #3a56d4;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(67, 97, 238, 0.3);
}

.pending-button {
  background-color: #ffffff;
  color: #4361ee;
  border: 1px solid #e2e8f0;
}

.pending-button:hover {
  border-color: #4361ee;
  background-color: rgba(67, 97, 238, 0.1);
  transform: translateY(-2px);
}

.upload-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100% - 48px);
}

.upload-section {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.model-section {
  flex: 0 0 auto;
}

.clothing-row {
  display: flex;
  gap: 12px;
  flex: 1;
}

.clothing-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 15px;
  color: #1e293b;
  margin: 0 0 2px 0;
  font-weight: 600;
}

.section-description {
  font-size: 12px;
  color: #64748b;
  margin: 0 0 8px 0;
}

.upload-area {
  border: 2px dashed #e2e8f0;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: #ffffff;
  height: 280px;
  width: 100%;
}

.clothing-upload {
  height: 200px;
  flex: 1;
}

.upload-area:hover {
  border-color: var(--primary);
  background-color: var(--hover-bg);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #64748b;
  text-align: center;
  padding: 0 10px;
}

.upload-icon {
  font-size: 24px;
  margin-bottom: 6px;
  color: #4361ee;
}

.upload-text {
  font-size: 12px;
  line-height: 1.3;
}

.preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 6px;
}

/* Result section styles */
.result-section, .history-section {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.result-section {
  flex: 0 0 60%;
}

.result-image-container {
  height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  background-color: var(--bg-color);
  border: 2px dashed var(--border-color);
}

.generated-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.generated-image {
  max-width: 100%;
  max-height: 230px;
  object-fit: contain;
  margin: 0 auto;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 10px;
  background-color: var(--bg-color);
  border-top: 1px solid var(--border-color);
}

.action-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.download-button {
  background-color: var(--primary);
  color: white;
  border: none;
}

.download-button:hover {
  background-color: var(--primary-dark);
}

.save-button {
  background-color: var(--bg-card);
  color: var(--primary);
  border: 1px solid var(--primary);
}

.save-button:hover {
  background-color: var(--hover-bg);
}

.empty-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  height: 100%;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.empty-result i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #cbd5e1;
}

.empty-result span {
  font-size: 14px;
}

.empty-result:hover {
  background-color: rgba(67, 97, 238, 0.05);
}

/* History section styles */
.history-section {
  flex: 0 0 38%;
  display: flex;
  flex-direction: column;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.clear-history-button {
  background: none;
  border: none;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.clear-history-button:hover {
  color: #f43f5e;
}

.history-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  overflow-y: auto;
  height: calc(100% - 38px);
  padding: 5px;
}

.history-image-item {
  width: calc(33.33% - 7px);
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.history-image-item:hover {
  transform: translateY(-2px);
}

.history-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.history-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.history-image-overlay i {
  color: white;
  font-size: 20px;
}

.history-image-item:hover .history-image-overlay {
  opacity: 1;
}

.empty-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  width: 100%;
  height: 100%;
  text-align: center;
}

.empty-history i {
  font-size: 36px;
  margin-bottom: 12px;
  color: #cbd5e1;
}

.empty-history span {
  font-size: 14px;
}

/* Modal and loading styles */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 20px;
}

.loading-text {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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
  top: -20px;
  right: -20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  border: none;
  color: #333;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.close-preview-btn:hover {
  background-color: #f5365c;
  color: white;
  transform: scale(1.05);
}

/* Scrollbar styles */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.result-preview {
  position: relative;
  cursor: pointer;
}

.result-preview:hover .replace-overlay {
  opacity: 1;
}

.replace-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  border-radius: 6px;
}

.replace-overlay i {
  font-size: 32px;
  margin-bottom: 8px;
}

.section-title-large {
  font-size: 18px;
  color: #333;
  margin: 0 0 16px 0;
  font-weight: 600;
}

.result-image-container-redesigned {
  background-color: #f9f9f9;
  border: 1px dashed #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  height: 360px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.generated-image-wrapper-redesigned {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  position: relative;
  cursor: pointer;
}

.generated-image-wrapper-redesigned:hover .replace-overlay-redesigned {
  opacity: 1;
}

.replace-overlay-redesigned {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 16px;
}

.replace-overlay-redesigned i {
  font-size: 36px;
  margin-bottom: 12px;
}

.generated-image-redesigned {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.empty-result-redesigned {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #aaa;
  height: 100%;
  width: 100%;
  cursor: pointer;
}

.empty-result-redesigned i {
  font-size: 50px;
  margin-bottom: 16px;
  color: #ddd;
}

.empty-result-redesigned span {
  font-size: 16px;
}

.result-actions-redesigned {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.action-button-redesigned {
  width: 100px;
  padding: 10px 0;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.download-button-redesigned {
  background-color: #4361ee;
  color: white;
  border: none;
}

.download-button-redesigned:hover {
  background-color: #3a56d4;
}

.save-button-redesigned {
  background-color: white;
  color: #4361ee;
  border: 1px solid #4361ee;
}

.save-button-redesigned:hover {
  background-color: rgba(67, 97, 238, 0.05);
}
</style> 