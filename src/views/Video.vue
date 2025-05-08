<template>
  <div class="video-generation-page">
    <div class="config-section">
      <div class="selection-area">
        <!-- Model Selection -->
        <div class="selection-box model-selection">
          <label>选择模特</label>
          <div class="placeholder-box image-placeholder" @click="triggerFileUpload('model')">
             <img v-if="selectedModelUrl" :src="selectedModelUrl" alt="Model Preview" class="preview-image">
             <span v-else>( 点击上传图片 )</span>
          </div>
          <input type="file" ref="modelInput" @change="handleFileUpload($event, 'model')" accept="image/*" style="display: none;">
        </div>

        <!-- Clothing Selection -->
        <div class="clothing-selection">
          <div class="selection-box clothing-item">
            <label>选择上衣</label>
             <div class="placeholder-box clothing-placeholder" @click="triggerFileUpload('top')">
               <img v-if="selectedTopUrl" :src="selectedTopUrl" alt="Top Preview" class="preview-image">
               <span v-else>( 点击上传 )</span>
             </div>
            <input type="file" ref="topInput" @change="handleFileUpload($event, 'top')" accept="image/*" style="display: none;">
          </div>
          <div class="selection-box clothing-item">
            <label>选择下装</label>
            <div class="placeholder-box clothing-placeholder" @click="triggerFileUpload('bottom')">
              <img v-if="selectedBottomUrl" :src="selectedBottomUrl" alt="Bottom Preview" class="preview-image">
              <span v-else>( 点击上传 )</span>
            </div>
            <input type="file" ref="bottomInput" @change="handleFileUpload($event, 'bottom')" accept="image/*" style="display: none;">
          </div>
        </div>
      </div>

      <!-- Scene Description -->
      <div class="scene-description">
        <label>请输入场景描述</label>
        <textarea placeholder="例如：模特穿着选定的服装在海边散步..." rows="4" v-model="sceneDescription"></textarea>
      </div>

      <!-- Generate Button -->
      <div class="generate-button-container">
        <BaseButton 
          class="generate-button" 
          @click="generateVideo" 
          :loading="isGenerating"
          :disabled="!selectedModelUrl"
          variant="primary"
          size="large"
        >
          生成视频
        </BaseButton>
      </div>
    </div>

    <!-- Results Section -->
    <div class="results-section">
       <h2 class="results-title">生成结果</h2>
       <div v-if="!results.length" class="empty-state">
          <span>尚未生成视频</span>
       </div>
       <div v-else class="results-container">
        <div class="results-grid">
          <div v-for="(video, index) in results" :key="index" class="video-card">
            <div class="video-placeholder" @click="replaceVideo(index)">
              <video v-if="video.isVideo" :src="video.url" controls class="video-media"></video>
              <img v-else :src="video.url || selectedModelUrl" alt="Generated Video" class="video-image">
              <div class="media-overlay">
                <span class="media-icon">{{ video.isVideo ? '更换视频' : '上传视频' }}</span>
              </div>
            </div>
            <div class="video-info">
              <span class="video-label">视频 {{ index + 1 }}</span>
              <div class="video-actions">
                <BaseButton 
                  v-if="video.isVideo" 
                  @click.stop="downloadVideo(video.url, index)"
                  variant="outline"
                  size="small"
                  class="download-btn"
                >
                  <template #icon>⬇️</template>
                  下载
                </BaseButton>
                <BaseButton 
                  @click.stop="replaceVideo(index)"
                  variant="outline"
                  size="small"
                  class="replace-btn"
                >
                  <template #icon>🔄</template>
                  替换
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载中遮罩 -->
    <div v-if="isGenerating" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">正在生成视频，请稍候...</div>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/BaseButton.vue'

export default {
  name: 'VideoPage',
  components: {
    BaseButton
  },
  data() {
    return {
      sceneDescription: '',
      selectedModel: null,
      selectedTop: null, 
      selectedBottom: null, 
      results: [], 
      selectedModelUrl: null,
      selectedTopUrl: null, 
      selectedBottomUrl: null,
      isGenerating: false
    };
  },
  methods: {
    generateVideo() {
      if (!this.selectedModelUrl) {
        alert('请先选择模特图片');
        return;
      }
      
      this.isGenerating = true;
      
      console.log('Generating video with description:', this.sceneDescription);
      
      // 模拟生成延迟
      setTimeout(() => {
        // Create 6 result items with the model's image
        this.results = Array(6).fill().map(() => ({
          url: this.selectedModelUrl,
          isVideo: false
        }));
        
        this.isGenerating = false;
        alert('已生成视频');
      }, 2000);
    },
    triggerFileUpload(type) {
      const input = this.$refs[`${type}Input`];
      if (input) {
          input.click();
      }
    },
    handleFileUpload(event, type) {
      const file = event.target.files[0];
      if (file) {
        event.target.value = null;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          if (type === 'model') {
            this.selectedModelUrl = e.target.result;
            this.selectedModel = file;
            console.log("Selected Model:", file.name);
          } else if (type === 'top') {
            this.selectedTopUrl = e.target.result;
            this.selectedTop = file;
            console.log("Selected Top:", file.name);
          } else if (type === 'bottom') {
            this.selectedBottomUrl = e.target.result;
            this.selectedBottom = file;
            console.log("Selected Bottom:", file.name);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    replaceVideo(index) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*,image/*';
      
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const isVideo = file.type.startsWith('video/');
        const reader = new FileReader();
        
        reader.onload = (e) => {
          this.results[index] = {
            url: e.target.result,
            isVideo: isVideo
          };
        };
        
        reader.readAsDataURL(file);
      };
      
      input.click();
    },
    downloadVideo(videoUrl, index) {
      if (!videoUrl) return;
      
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `生成视频_${index + 1}_${new Date().getTime()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
</script>

<style scoped>
/* General Page Styles */
.video-generation-page {
  width: 100%;
  background-color: var(--bg-color);
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 16px;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}

/* Config Section Styles */
.config-section {
  background-color: var(--bg-card);
  padding: 16px;
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100vh - 32px);
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.selection-area {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  gap: 12px;
}

.selection-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.selection-box label {
  font-size: 14px;
  color: var(--text-color);
  font-weight: 500;
  margin: 0;
}

/* Model Selection */
.model-selection {
  grid-column: 1;
  grid-row: 1;
}

/* Clothing Selection Container */
.clothing-selection {
  grid-column: 1;
  grid-row: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.clothing-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Placeholder Box base */
.placeholder-box {
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-card);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.image-placeholder {
  height: 140px;
}

.clothing-placeholder {
  height: 90px;
}

.placeholder-box:hover {
  border-color: var(--primary);
  background-color: var(--hover-bg);
}

/* Preview Image Styles */
.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.placeholder-box span {
  z-index: 1;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

[data-theme='dark'] .placeholder-box span {
  background: rgba(30, 41, 59, 0.8);
  color: var(--text-light);
}

/* Scene Description Styles */
.scene-description {
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.scene-description label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: var(--text-color);
  font-weight: 500;
}

.scene-description textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-color);
  background-color: var(--bg-card);
  box-shadow: var(--shadow-sm);
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  resize: none;
  height: 70px;
}

.scene-description textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(103, 114, 229, 0.15);
}

.scene-description textarea::placeholder {
  color: var(--text-muted);
}

/* Generate Button Styles */
.generate-button-container {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.generate-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  border: none;
  background-color: var(--primary);
  color: white;
  cursor: pointer;
}

.generate-button:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(103, 114, 229, 0.25);
}

/* Results Section Styles */
.results-section {
  background-color: var(--bg-card);
  padding: 16px;
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 32px);
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.results-title {
  font-size: 16px;
  color: var(--text-color);
  margin: 0 0 16px 0;
  font-weight: 600;
}

.empty-state {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-secondary);
  font-size: 14px;
  background-color: var(--bg-color);
  border-radius: 6px;
  border: 1px dashed var(--border-color);
}

.results-container {
  flex: 1;
  overflow: hidden;
  padding: 4px;
  display: flex;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  padding-right: 4px;
  overflow-y: auto;
}

.video-card {
  background-color: var(--bg-card);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
  cursor: pointer;
  border: 1px solid var(--border-color);
  height: 100%;
}

.video-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
  border-color: var(--primary-light);
}

.video-placeholder {
  width: 100%;
  height: 0;
  padding-bottom: 133%;
  background-color: var(--bg-color);
  position: relative;
  overflow: hidden;
}

.video-image, .video-media {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-info {
  padding: 10px;
  border-top: 1px solid var(--border-color);
  text-align: center;
  background-color: var(--bg-card);
}

.media-overlay {
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

.video-card:hover .media-overlay {
  opacity: 1;
}

.media-icon {
  color: white;
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 500;
}

.video-label {
  font-size: 14px;
  color: #24292f;
  font-weight: 500;
}

/* 加载遮罩 */
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
  z-index: 9999;
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

/* 视频操作按钮 */
.video-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.download-btn, .replace-btn {
  flex: 1;
}

/* Responsive Adjustments */
@media (max-width: 900px) {
  .video-generation-page {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: auto;
    max-height: none;
    overflow: visible;
  }
  
  .config-section, .results-section {
    height: auto;
    overflow: visible;
  }
  
  .generate-button-container {
    margin-top: 8px;
  }

  .results-container {
    overflow: visible;
  }

  .results-grid {
    overflow: visible;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .video-generation-page {
    padding: 12px;
    gap: 12px;
  }
  
  .config-section, .results-section {
    padding: 12px;
  }
  
  .clothing-selection {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .image-placeholder {
    height: 120px;
  }
  
  .clothing-placeholder {
    height: 80px;
  }
  
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style> 