<template>
  <div class="coming-soon-container">
    <h1>{{ title }}</h1>
    <div class="content-box">
      <p>{{ description }}</p>
      <div class="coming-soon">
        <h3>功能即将上线</h3>
        <p>我们正在开发这个功能，敬请期待...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComingSoon',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: '此功能正在开发中'
    }
  }
}
</script>

<style scoped>
.coming-soon-container {
  padding: 20px;
}

.coming-soon-container h1 {
  color: #e74c3c;
  margin-bottom: 30px;
  font-size: 28px;
}

.content-box {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}

.content-box > p {
  font-size: 18px;
  color: #555;
  margin-bottom: 30px;
}

.coming-soon {
  text-align: center;
  padding: 50px 0;
  color: #777;
}

.coming-soon h3 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #e74c3c;
}

.coming-soon p {
  font-size: 16px;
}
</style> 