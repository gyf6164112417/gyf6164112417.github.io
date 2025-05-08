<template>
  <div class="animation-container">
    <div class="main-layout">
      <div class="left-panel">
        <div class="upload-section">
          <h3>上传原始图片</h3>
          <div class="upload-area" @click="triggerFileUpload">
            <div v-if="imageUrl" class="preview-container">
              <img :src="imageUrl" alt="Preview" class="preview-image">
            </div>
            <div v-else class="upload-placeholder">
              <i class="upload-icon">+</i>
              <span class="upload-text">点击上传图片</span>
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

        <div class="prompt-section">
          <h3>输入提示词</h3>
          <div class="input-wrapper">
            <textarea 
              v-model="promptText" 
              class="prompt-textarea"
              placeholder="输入提示词..."
            ></textarea>
          </div>
        </div>

        <div class="generate-section">
          <BaseButton 
            class="generate-button" 
            @click="generateAnimation" 
            :disabled="!imageUrl || !promptText.trim()"
            variant="primary"
            size="large"
          >
            生成动图
          </BaseButton>
        </div>
      </div>

      <div class="right-panel">
        <div class="results-section">
          <h3>生成动图</h3>
          <div class="result-images">
            <div class="result-image-item" v-for="(image, index) in displayImages" :key="index">
              <div class="result-image-container" @click="previewOrUpload(index)">
                <img v-if="image.url" :src="image.url" :alt="`图片${index + 1}`" class="result-img">
                <div v-else class="upload-placeholder small">
                  <i class="upload-icon small">+</i>
                  <span class="upload-text small">点击上传</span>
                </div>
              </div>
              <div class="image-actions">
                <BaseButton 
                  v-if="image.url" 
                  @click.stop="downloadImage(image.url, index)" 
                  variant="outline" 
                  size="small"
                  class="action-button"
                >
                  <template #icon>⬇️</template>
                  下载
                </BaseButton>
              </div>
              <input 
                type="file" 
                :ref="`resultFileInput${index}`" 
                style="display: none" 
                accept="image/*" 
                @change="handleResultImageUpload($event, index)"
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览弹窗 -->
    <div v-if="previewVisible" class="preview-modal" @click="closePreview">
      <div class="preview-content" @click.stop>
        <img :src="previewImageUrl" alt="预览图片" class="preview-large-image">
        <BaseButton class="close-preview" @click="closePreview" variant="text" size="small">
          &times;
        </BaseButton>
        <div class="preview-actions">
          <BaseButton @click="downloadImage(previewImageUrl)" variant="primary" size="medium">
            <template #icon>⬇️</template>
            下载图片
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/BaseButton.vue'

export default {
  name: 'AnimationPage',
  components: {
    BaseButton
  },
  data() {
    return {
      imageUrl: '',
      promptText: '',
      generatedImages: [],
      previewVisible: false,
      previewImageUrl: '',
      previewIndex: null
    };
  },
  computed: {
    displayImages() {
      // 如果没有生成的图片，则显示4个空白占位图
      if (this.generatedImages.length === 0) {
        return Array(4).fill().map(() => ({ url: '' }));
      }
      return this.generatedImages;
    }
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
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    triggerResultImageUpload(index) {
      this.$refs[`resultFileInput${index}`][0].click();
    },
    
    handleResultImageUpload(event, index) {
      const file = event.target.files[0];
      if (!file) return;
      
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        // 确保有足够的元素
        while (this.generatedImages.length <= index) {
          this.generatedImages.push({ url: '' });
        }
        this.generatedImages[index].url = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    generateAnimation() {
      if (!this.imageUrl) {
        alert('请先上传图片');
        return;
      }
      
      if (!this.promptText.trim()) {
        alert('请输入提示词');
        return;
      }
      
      // 模拟生成过程
      setTimeout(() => {
        // 生成4张示例图片
        this.generatedImages = [
          { url: this.imageUrl },
          { url: this.imageUrl },
          { url: this.imageUrl },
          { url: this.imageUrl }
        ];
      }, 2000);
    },
    
    previewOrUpload(index) {
      if (this.displayImages[index].url) {
        this.previewImage(index);
      } else {
        this.triggerResultImageUpload(index);
      }
    },
    
    previewImage(index) {
      if (this.displayImages[index].url) {
        this.previewImageUrl = this.displayImages[index].url;
        this.previewVisible = true;
        this.previewIndex = index;
      } else {
        this.triggerResultImageUpload(index);
      }
    },
    
    downloadImage(imageUrl, index) {
      if (!imageUrl) return;
      
      const imageTitle = index !== undefined ? `动图_${index + 1}` : '预览图片';
      
      // 模拟下载延迟
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${imageTitle}_${new Date().getTime()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 500);
    },
    
    closePreview() {
      this.previewVisible = false;
    }
  }
}
</script>

<style scoped>
.animation-container {
  height: 100%;
  padding: 16px;
}

.main-layout {
  display: flex;
  gap: 20px;
  height: calc(100% - 32px);
}

.left-panel {
  display: flex;
  flex-direction: column;
  width: 40%;
  border-radius: var(--radius-md);
  background-color: var(--bg-card);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all 0.3s ease;
}

.right-panel {
  display: flex;
  flex-direction: column;
  width: 60%;
  border-radius: var(--radius-md);
  background-color: var(--bg-card);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all 0.3s ease;
}

.upload-section, .prompt-section, .results-section {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

h3 {
  font-size: 18px;
  margin-bottom: 16px;
  font-weight: 600;
  color: var(--text-color);
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 250px;
  background-color: var(--bg-card);
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: var(--primary-color);
  background-color: var(--hover-bg);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: var(--text-secondary);
}

.upload-text {
  font-size: 16px;
}

.preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.input-wrapper {
  position: relative;
}

.prompt-textarea {
  width: 100%;
  min-height: 120px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px;
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.3s ease;
  color: var(--text-color);
  background-color: var(--bg-card);
}

.prompt-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.generate-section {
  display: flex;
  justify-content: center;
  padding: 15px;
}

.generate-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 50px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.2);
}

.generate-button:hover:not(:disabled) {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(67, 97, 238, 0.3);
}

.generate-button:disabled {
  background-color: #b3b3b3;
  cursor: not-allowed;
  box-shadow: none;
}

.result-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
  height: 100%;
  padding-bottom: 16px;
  overflow: hidden;
}

.result-image-item {
  background-color: var(--bg-card);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
}

.result-image-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.result-image-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  min-height: 0;
}

.result-image-container::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  transition: all 0.3s ease;
}

.result-image-container:hover::after {
  background-color: rgba(0, 0, 0, 0.1);
}

.result-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.upload-placeholder.small {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--text-secondary);
}

.upload-icon.small {
  font-size: 32px;
  margin-bottom: 8px;
  color: var(--text-secondary);
}

.upload-text.small {
  font-size: 14px;
}

/* 图片操作按钮 */
.image-actions {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.action-button {
  width: 100%;
}

/* 预览模态框操作按钮 */
.preview-actions {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

/* 预览弹窗样式 */
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.preview-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-large-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}

.close-preview {
  position: absolute;
  top: -40px;
  right: -40px;
  background: none;
  border: none;
  color: white;
  font-size: 32px;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
    height: auto;
  }
  
  .left-panel, .right-panel {
    width: 100%;
  }
  
  .result-images {
    grid-template-columns: repeat(2, 1fr);
    aspect-ratio: 1 / 0.6;
  }
}
</style>