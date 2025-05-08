<template>
  <div class="propaganda">
    <!-- 加载中遮罩 -->
    <div v-if="isGenerating" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">生成中...</div>
    </div>
    
    <div class="page-card">
      <div class="steps-container">
        <div class="steps-row">
          <!-- 第一步：上传图片 -->
          <div class="step-section">
            <div class="step-header">
              <div class="step-indicator">
                <span class="step-number">1</span>
              </div>
              <h2 class="step-title">上传产品图片</h2>
            </div>
            
            <div class="step-content">
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
          </div>
          
          <!-- 生成按钮区 -->
          <div class="generate-section">
            <button class="generate-button" @click="generateContent" :disabled="!imageUrl">
              <span class="button-icon">✨</span>
              <span class="button-text">生成话术</span>
            </button>
          </div>
          
          <!-- 第二步：话术结果 -->
          <div class="step-section">
            <div class="step-header">
              <div class="step-indicator">
                <span class="step-number">2</span>
              </div>
              <h2 class="step-title">查看生成的话术</h2>
            </div>
            
            <div class="step-content">
              <div class="text-result-wrapper">
                <textarea 
                  v-model="generatedText" 
                  class="result-textarea"
                  placeholder="生成的话术将显示在这里，您可以进行编辑..."
                ></textarea>
              </div>
              <div class="text-actions">
                <button class="update-button" @click="updateContent">
                  <span class="button-icon">🔄</span>
                  <span class="button-text">更新</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PropagandaPage',
  data() {
    return {
      imageUrl: '',
      generatedText: '',
      isGenerating: false
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
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    generateContent() {
      if (!this.imageUrl) {
        alert('请先上传图片');
        return;
      }
      
      // 这里模拟生成话术文本的过程
      // 实际应用中可以对接AI API
      this.isGenerating = true;
      setTimeout(() => {
        this.generatedText = "这是根据您上传的图片智能生成的宣传话术内容示例。实际应用中，这里会展示根据图片分析生成的产品营销话术。您可以基于此内容进一步调整，使其更符合您的营销需求。\n\n该产品设计美观，功能实用，适合各种场景使用。采用优质材料制作，经久耐用，是您理想的选择。";
        this.isGenerating = false;
      }, 1500);
    },
    
    updateContent() {
      if (!this.generatedText) {
        alert('没有内容可以更新');
        return;
      }
      
      // 这里可以添加更新逻辑，例如保存到服务器或应用更改
      alert('内容已更新');
    }
  }
}
</script>

<style scoped>
.propaganda {
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
  background-image: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  height: 100vh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.page-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
  width: calc(100% - 60px);
  height: calc(100% - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px auto;
  position: relative;
}

.page-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4361ee, #7b5eff);
}

.steps-container {
  padding: 40px;
  width: 100%;
  max-width: 1200px;
}

.steps-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 40px;
}

.step-section {
  flex: 1;
  margin-bottom: 0;
  min-width: 0;
  position: relative;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
  padding: 30px;
  transition: all 0.3s ease;
}

.step-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.06);
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.step-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4361ee 0%, #7b5eff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  box-shadow: 0 4px 10px rgba(67, 97, 238, 0.2);
}

.step-number {
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.step-title {
  color: #1e293b;
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(135deg, #1e293b 0%, #4361ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
}

.step-content {
  padding: 10px 0;
  width: 100%;
}

.upload-area {
  border: 2px dashed #4361ee;
  height: 300px;
  width: 100%;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all 0.4s ease;
  background-color: rgba(67, 97, 238, 0.03);
}

.upload-area:hover {
  border-color: #7b5eff;
  background-color: rgba(67, 97, 238, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(67, 97, 238, 0.1);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #4361ee;
}

.upload-icon {
  font-size: 60px;
  margin-bottom: 16px;
  font-style: normal;
  opacity: 0.8;
  background: linear-gradient(135deg, #4361ee 0%, #7b5eff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.upload-text {
  font-size: 18px;
  color: #64748b;
  font-weight: 500;
}

.preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.generate-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0;
  padding: 0 10px;
  align-self: center;
  position: relative;
  z-index: 5;
}

.generate-section::before,
.generate-section::after {
  display: none;
}

.generate-button {
  background: linear-gradient(135deg, #4361ee 0%, #7b5eff 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 18px 36px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 16px rgba(67, 97, 238, 0.2);
  transform: rotate(0deg);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.generate-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%);
  transition: all 0.3s ease;
}

.generate-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(67, 97, 238, 0.3);
}

.generate-button:hover::before {
  transform: translateY(100%);
}

.generate-button:active {
  transform: translateY(0);
  box-shadow: 0 6px 12px rgba(67, 97, 238, 0.2);
}

.generate-button:disabled {
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
  cursor: not-allowed;
  box-shadow: none;
}

.button-icon {
  font-size: 22px;
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2));
}

.text-result-wrapper {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  width: 100%;
  height: 300px;
  overflow: hidden;
  background-color: #ffffff;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.text-result-wrapper:focus-within {
  border-color: #4361ee;
  box-shadow: 0 0 0 3px rgba(123, 94, 255, 0.1);
}

.result-textarea {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 24px;
  font-size: 16px;
  line-height: 1.8;
  color: #1e293b;
  font-family: inherit;
  background-color: #ffffff;
}

.result-textarea::placeholder {
  color: #64748b;
  opacity: 0.7;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(123, 94, 255, 0.2);
  border-top: 3px solid #7b5eff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  box-shadow: 0 8px 16px rgba(123, 94, 255, 0.15);
}

.loading-text {
  margin-top: 20px;
  color: #4361ee;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.5px;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.text-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.update-button {
  background: linear-gradient(135deg, #4361ee 0%, #7b5eff 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 16px rgba(67, 97, 238, 0.2);
  position: relative;
  overflow: hidden;
}

.update-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%);
  transition: all 0.3s ease;
}

.update-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(67, 97, 238, 0.3);
}

.update-button:hover::before {
  transform: translateY(100%);
}

.update-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .propaganda {
    padding: 16px;
  }
  
  .page-card {
    width: 100%;
    height: 100%;
    margin: 0;
    border-radius: 0;
  }
  
  .steps-container {
    padding: 20px;
  }
  
  .steps-row {
    flex-direction: column;
    gap: 30px;
  }
  
  .step-section {
    padding: 20px;
  }
  
  .step-content {
    padding: 5px 0;
  }
  
  .upload-area {
    height: 200px;
  }
  
  .text-result-wrapper {
    height: 200px;
  }
  
  .generate-button {
    padding: 15px 30px;
    font-size: 16px;
  }
}
</style> 