<template>
  <div class="model-training-container">
    <h1>模型训练</h1>
    <div class="content-section">
      <div class="upload-section">
        <h3>上传训练数据</h3>
        <div class="upload-box">
          <div class="upload-inner">
            <i class="upload-icon">📁</i>
            <p>点击或拖拽文件至此处上传</p>
            <button class="upload-btn">选择文件</button>
          </div>
        </div>
        <div class="upload-info">
          <p>支持的文件格式: JPG, PNG (大小不超过10MB)</p>
          <p>推荐上传不少于100张高质量图片以获得更好的训练效果</p>
        </div>
      </div>
      
      <div class="params-section">
        <h3>训练参数设置</h3>
        <div class="params-form">
          <div class="form-group">
            <label>学习率</label>
            <input type="range" min="0.0001" max="0.01" step="0.0001" value="0.001">
            <span>0.001</span>
          </div>
          <div class="form-group">
            <label>批次大小</label>
            <select>
              <option>16</option>
              <option selected>32</option>
              <option>64</option>
              <option>128</option>
            </select>
          </div>
          <div class="form-group">
            <label>训练轮次</label>
            <input type="number" min="1" max="1000" value="100">
          </div>
          <div class="form-group">
            <label>模型类型</label>
            <select>
              <option selected>基础模型</option>
              <option>高级模型</option>
              <option>专业模型</option>
            </select>
          </div>
          <button class="start-train-btn">开始训练</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModelTrainingPage'
}
</script>

<style scoped>
.model-training-container {
  padding: 20px;
}

.model-training-container h1 {
  color: #e74c3c;
  margin-bottom: 30px;
  font-size: 28px;
}

.content-section {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.upload-section, .params-section {
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  flex: 1;
  min-width: 300px;
}

.upload-section h3, .params-section h3 {
  margin-bottom: 20px;
  font-size: 20px;
  color: #333;
}

.upload-box {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  margin-bottom: 20px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-box:hover {
  border-color: #e74c3c;
}

.upload-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.upload-inner p {
  margin-bottom: 15px;
  color: #666;
}

.upload-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background-color: #c0392b;
}

.upload-info p {
  color: #777;
  font-size: 14px;
  margin-bottom: 8px;
}

.params-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #444;
}

.form-group input, .form-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.start-train-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.start-train-btn:hover {
  background-color: #c0392b;
}
</style> 