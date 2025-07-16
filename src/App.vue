<template>
  <div class="app">
    <!-- 头部导航 -->
    <header class="header">
      <div class="nav-container">
        <div class="logo">
          不知道叫什么，占位先
        </div>
        <nav class="nav-menu">
          <a href="#" class="nav-item active">AI检测</a>
          <a href="#" class="nav-item active">大模型对话（存疑）</a>
          <!-- <a href="#" class="nav-item">文本分析</a>
          <a href="#" class="nav-item">图像识别</a>
          <a href="#" class="nav-item">帮助中心</a> -->
        </nav>
        <div class="user-actions">
          <!-- <span class="user-icon">👤</span>
          <span class="lang-switch">中文</span> -->
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="hero-section">
        <h1 class="main-title">在线AI检测助手</h1>

        <div class="upload-section">
          <div class="upload-tabs">
            <button :class="['tab-btn', { active: activeTab === 'text' }]" @click="activeTab = 'text'">
              📄 文本
            </button>
            <button :class="['tab-btn', { active: activeTab === 'imageAndVideo' }]"
              @click="activeTab = 'imageAndVideo'">
              🖼️ 图片/视频
            </button>
          </div>

          <p class="description">
            辅助大模型系统
          </p>
        </div>

        <div class="content-area">
          <!-- 文本上传区 -->
          <div v-if="activeTab === 'text'" class="text-display">
            <div class="text-upload-area">
              <div class="text-input-section">
                <textarea v-model="textContent" placeholder="请在此处输入或粘贴需要检测的文本内容..." class="text-input"></textarea>
              </div>

              <div class="text-upload-controls">
                <input type="file" ref="textFileInput" accept=".txt,.doc,.docx" style="display: none" />
                <div class="upload-buttons">
                  <button @click="uploadTextFile" class="upload-btn">
                    📄 上传文本文件
                  </button>
                  <button @click="detect" class="detect-btn">
                    立即检测
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 图片/视频上传区 -->
          <div v-else-if="activeTab === 'imageAndVideo'" class="image-display">
            <div class="main-image" @click="uploadImageOrVideo">
              <div class="image-overlay">
                <span class="image-label">点击上传图片</span>
              </div>
            </div>

            <div class="thumbnail-list">
              <div v-for="(thumb, index) in thumbnails" :key="index" :class="['thumbnail']">
                <img :src="thumb" :alt="`缩略图${index + 1}`" />
              </div>
            </div>

            <div class="upload-controls">
              <input type="file" ref="fileInput" accept="image/*,video/*" style="display: none" />
              <div style="display: flex; gap: 12px; align-items: center;">
                <input v-model="imageUrl" placeholder="http://php-xgwg/wp-content/cache/all/" class="url-input"
                  style="flex: 1;" />
                <button @click="detect" class="detect-btn" style="white-space: nowrap;">
                  立即检测
                </button>
              </div>
            </div>
          </div>

          <!-- 右侧检测结果区 -->
          <div class="result-panel">
            <div class="result-header">
              <span class="status-indicator"></span>
              <span class="status-text">检测结果</span>
            </div>

            <div class="confidence-score">
              <!-- <span class="label"></span> -->
              <!-- <span class="score"></span> -->
            </div>

            <div class="action-buttons">

            </div>
          </div>
        </div>

        <div class="footer-note">

        </div>
      </div>
    </main>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('text');
const imageUrl = ref('');
const textContent = ref('');
const imgurl = 'https://ts1.tc.mm.bing.net/th/id/R-C.dadd2b0bbd26056749d0340552be7678?rik=be%2fKyUTFnEy%2bng&riu=http%3a%2f%2fn.sinaimg.cn%2ftranslate%2f20170319%2f3rWp-fycnyhk9610873.jpg&ehk=OfCvVf3hPtcdeGPkTgOafi1OXw%2fqJKk8ShcejPzFPl0%3d&risl=&pid=ImgRaw&r=0';
const thumbnails = ref([
  imgurl, imgurl, imgurl, imgurl, imgurl, imgurl
]);

//TODO：显示上传的图片

function detect() {
  // TODO: 实现图片检测逻辑
  alert('检测功能待实现');
}


function uploadTextFile() {
  // TODO: 实现文本检测逻辑
  alert('上传文本功能待实现');
}
function uploadImageOrVideo() {
  // TODO: 实现文本检测逻辑
  alert('上传图片、视频功能待实现');
}

</script>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #87CEEB 0%, #B0E0E6 60%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  color: white;
  font-weight: 600;
}

.nav-menu {
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px;
}

.nav-item {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.nav-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.main-content {
  padding: 40px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
}

.main-title {
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin-bottom: 40px;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.upload-section {
  margin-bottom: 40px;
}

.upload-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.tab-btn {
  padding: 12px 24px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;
}

.tab-btn:first-child {
  border-radius: 8px 0 0 8px;
}

.tab-btn:last-child {
  border-radius: 0 8px 8px 0;
}

.tab-btn.active {
  background: #8b5cf6;
}

.description {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  font-size: 14px;
}

.content-area {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  margin-top: 40px;
  align-items: stretch;
  min-height: 500px;
}

/* 通用面板样式 */
.text-display,
.image-display,
.result-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.text-upload-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.text-input-section {
  flex: 1;
}

.text-input {
  width: 100%;
  height: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  resize: none;
}

.text-input:focus {
  border-color: #8b5cf6;
}

.text-upload-controls {
  margin-top: auto;
}

.upload-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 16px;
}

/* 通用按钮样式 */
.upload-btn,
.detect-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  flex: 0 0 auto;
  color: white;
}

.upload-btn {
  background: #6b7280;
}

.upload-btn:hover {
  background: #4b5563;
}

.detect-btn {
  background: #3b82f6;
}

.detect-btn:hover {
  background: #2563eb;
}

.main-image {
  position: relative;
  width: 100%;
  height: 70%;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  pointer-events: none;
}

.thumbnail-list {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.thumbnail {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.thumbnail.active {
  border-color: #8b5cf6;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
}

.url-input {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.url-input:focus {
  border-color: #8b5cf6;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.confidence-score {
  margin-bottom: 24px;
  flex: 1;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
}

@media (max-width: 768px) {
  .content-area {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .main-title {
    font-size: 32px;
  }

  .thumbnail-list {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
