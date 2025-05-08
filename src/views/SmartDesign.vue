<template>
  <div class="smart-design-container">
    <div class="main-layout">
      <div class="left-section">
        <div class="prompt-section">
          <h1 class="title">智能设计</h1>
          
          <div class="input-content">
            <div class="prompt-input">
              <textarea
                placeholder="请输入提示词"
                class="prompt-field"
                v-model="promptText"
                rows="5"
              ></textarea>
            </div>
            
            <div class="input-actions">
              <button class="cancel-button" @click="regenerateDesigns">重新生成</button>
              <button class="save-button" @click="generateImages">生成图片</button>
            </div>
          </div>
        </div>
      </div>

      <div class="right-section">
        <div class="images-display">
          <h2 class="section-title">图片生成</h2>
          
          <div class="design-grid">
            <div 
              v-for="(image, index) in designImages" 
              :key="index" 
              class="design-item"
            >
              <div 
                class="image-container" 
                :class="{ 'selected': selectedImageIndex === index }"
                @click="image.url ? previewImage(index) : triggerFileUpload(index)"
              >
                <img 
                  v-if="image.url" 
                  :src="image.url" 
                  :alt="`图片${index+1}`"
                >
                <div v-else class="empty-image">
                  <i class="el-icon-plus upload-icon"></i>
                  <span class="upload-text">点击上传</span>
                </div>
                
                <div v-if="image.url" class="image-overlay">
                  <i class="el-icon-zoom-in"></i>
                </div>
              </div>
              <input 
                type="file" 
                :ref="`fileInput${index}`" 
                style="display: none" 
                accept="image/*" 
                @change="handleFileUpload($event, index)"
              >
            </div>
          </div>
        </div>
      </div>
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
export default {
  name: 'SmartDesignPage',
  data() {
    return {
      promptText: '',
      designImages: [
        { url: '' },
        { url: '' },
        { url: '' },
        { url: '' },
        { url: '' },
        { url: '' },
        { url: '' },
        { url: '' }
      ],
      selectedImageIndex: null,
      previewVisible: false,
      previewImageUrl: ''
    }
  },
  computed: {
    hasUploadedImages() {
      return this.designImages.some(img => img.url);
    }
  },
  methods: {
    generateImages() {
      if (!this.promptText.trim()) {
        alert('请输入提示词');
        return;
      }
      
      // 直接生成图片，不显示加载状态
      // 模拟生成过程
      setTimeout(() => {
        // 如果没有上传图片，创建模拟生成图片
        if (!this.hasUploadedImages) {
          // 模拟生成新图片 - 这里使用placeholder图片
          this.designImages = this.designImages.map((img, index) => {
            return { 
              url: `https://via.placeholder.com/400x400/4361ee/ffffff?text=图片${index+1}` 
            };
          });
        }
      }, 500); // 减少延迟时间
    },
    
    triggerFileUpload(index) {
      this.$refs[`fileInput${index}`][0].click();
    },
    
    handleFileUpload(event, index) {
      const file = event.target.files[0];
      if (!file) return;
      
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.designImages[index] = { url: e.target.result };
      };
      reader.readAsDataURL(file);
    },
    
    clearAllImages() {
      this.designImages = this.designImages.map(() => ({ url: '' }));
      this.selectedImageIndex = null;
    },
    
    previewImage(index) {
      this.previewImageUrl = this.designImages[index].url;
      this.previewVisible = true;
      this.selectedImageIndex = index;
    },
    
    closePreview() {
      this.previewVisible = false;
    }
  }
}
</script>

<style scoped>
.smart-design-container {
  width: 100%;
  height: 100vh;
  background-color: #f6f9fc;
  padding: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.main-layout {
  display: flex;
  gap: 12px;
  flex: 1;
  overflow: hidden;
  height: 100%;
}

.left-section {
  flex: 0 0 35%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.right-section {
  flex: 0 0 64%;
  height: 100%;
}

.title {
  font-size: 18px;
  color: #32325d;
  margin-bottom: 16px;
  font-weight: 600;
  letter-spacing: -0.5px;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 10px;
}

.prompt-section {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.input-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.prompt-input {
  margin-bottom: 16px;
}

.prompt-field {
  width: 100%;
  height: 120px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  resize: none;
  line-height: 1.5;
  background-color: #ffffff;
}

.prompt-field:focus {
  outline: none;
  border-color: #4361ee;
  box-shadow: 0 1px 5px rgba(103, 114, 229, 0.1);
}

.input-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  justify-content: space-between;
}

.cancel-button, .save-button {
  padding: 10px 0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  text-align: center;
}

.cancel-button {
  background-color: #ffffff;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.save-button {
  background-color: var(--primary);
  color: white;
  border: 1px solid var(--primary);
}

.cancel-button:hover {
  border-color: var(--text-secondary);
  color: var(--text-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.save-button:hover {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 7px rgba(103, 114, 229, 0.2);
}

.images-display {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.section-title {
  font-size: 18px;
  color: #1e293b;
  margin-bottom: 16px;
  font-weight: 600;
  letter-spacing: -0.5px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
}

.design-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
  flex: 1;
  overflow: hidden;
}

.design-item {
  display: flex;
  flex-direction: column;
}

.image-container {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f8f9fc;
  position: relative;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.empty-image {
  width: 100%;
  height: 100%;
  background-color: #f8f9fc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.upload-icon {
  font-size: 24px;
  color: #64748b;
  margin-bottom: 6px;
}

.upload-text {
  color: #64748b;
  font-size: 13px;
}

.image-container.selected {
  border: 2px solid #6772e5;
  box-shadow: 0 0 10px rgba(103, 114, 229, 0.3);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-overlay i {
  color: white;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 8px;
}

.image-container:hover .image-overlay {
  opacity: 1;
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

@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
    height: auto;
  }
  
  .left-section, .right-section {
    flex: none;
    width: 100%;
    height: auto;
  }
  
  .prompt-section, .images-display {
    height: auto;
    margin-bottom: 12px;
  }
  
  .design-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto;
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .design-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 