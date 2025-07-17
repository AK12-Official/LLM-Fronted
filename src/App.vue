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
            <button :class="['tab-btn', { active: activeTab === 'audio' }]" @click="activeTab = 'audio'">
              🎵 音频
            </button>
          </div>

          <p class="description">
            AI检测系统
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
                <input type="file" ref="textFileInput" accept=".txt,.text,text/plain" style="display: none"
                  @change="handleTextFileUpload" />
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
              <img v-if="currentImageOrVideo && isImage(currentImageOrVideo)" :src="currentImageOrVideo" alt="上传的图片" />
              <video v-else-if="currentImageOrVideo && isVideo(currentImageOrVideo)" :src="currentImageOrVideo" controls
                class="video-element"></video>
              <div v-else class="image-overlay">
                <span class="image-label">点击上传图片或视频</span>
              </div>
            </div>

            <div class="upload-controls">
              <input type="file" ref="fileInput" accept="image/*,video/*" style="display: none"
                @change="handleFileUpload" />
              <div style="display: flex; gap: 12px; align-items: center;">
                <input v-model="imageUrl" placeholder="或输入图片/视频URL..." class="url-input" style="flex: 1;"
                  @keydown.enter.prevent="loadFromUrl" />
                <button @click="detect" class="detect-btn" style="white-space: nowrap;">
                  立即检测
                </button>
              </div>
            </div>
          </div>

          <!-- 音频上传区 -->
          <div v-else-if="activeTab === 'audio'" class="audio-display">
            <div class="audio-upload-area">
              <div class="audio-upload-section">
                <div v-if="!currentAudio" class="audio-drop-zone" @click="uploadAudioFile">
                  <div class="audio-icon">🎵</div>
                  <div class="audio-text">点击上传音频文件</div>
                  <div class="audio-formats">支持 MP3, WAV, M4A, AAC 格式</div>
                </div>

                <!-- 音频播放器 -->
                <div v-if="currentAudio" class="audio-player">
                  <audio :src="currentAudio" controls class="audio-element"></audio>
                  <div class="audio-info">
                    <span class="audio-name">{{ currentAudioName }}</span>
                  </div>
                </div>
              </div>

              <div class="audio-upload-controls">
                <input type="file" ref="audioFileInput" accept=".mp3,.wav,.m4a,.aac,audio/*" style="display: none"
                  @change="handleAudioFileUpload" />
                <div class="upload-buttons">
                  <button @click="uploadAudioFile" class="upload-btn">
                    🎵 上传音频文件
                  </button>
                  <button @click="detect" class="detect-btn">
                    立即检测
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧检测结果区 -->
          <div class="result-panel">
            <div class="result-header">
              <span class="status-indicator"></span>
              <span class="result-title">AI检测助手</span>
            </div>

            <!-- 对话消息区域 -->
            <div class="chat-messages" ref="chatMessages">
              <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
                <div class="message-avatar">
                  <span v-if="message.type === 'user'">👤</span>
                  <span v-else>🤖</span>
                </div>
                <div class="message-content">
                  <div class="message-text">{{ message.content }}</div>
                  <div class="message-time">{{ message.time }}</div>
                </div>
              </div>

              <!-- 空状态提示 -->
              <div v-if="messages.length === 0" class="empty-state">
                <div class="empty-icon">💬</div>
                <div class="empty-text">点击"立即检测"开始对话</div>
              </div>
            </div>

            <!-- 输入区域 -->
            <div class="chat-input-area">
              <!-- 状态提示 -->
              <div v-if="!hasDetectedOnce && messages.length === 0" class="status-tip">
                请先点击"立即检测"按钮开始使用
              </div>
              <div v-else-if="isDetecting && !hasDetectedOnce" class="status-tip detecting">
                正在进行检测，请稍候...
              </div>
              <div v-else-if="isDetecting && hasDetectedOnce" class="status-tip detecting">
                正在检测中...
              </div>
              <div v-else-if="hasDetectedOnce" class="status-tip success">
                您可以随时提问
              </div>

              <div class="input-container">
                <textarea v-model="inputMessage" placeholder="输入您的问题..." class="chat-input"
                  @keydown.enter.prevent="sendMessage" rows="1" :disabled="!hasDetectedOnce"></textarea>
                <button @click="sendMessage" class="send-btn" :disabled="!inputMessage.trim() || !hasDetectedOnce">
                  ↑
                </button>
              </div>
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
import { ref, nextTick } from 'vue';

const activeTab = ref('text');
const imageUrl = ref('');
// 移除：const audioUrl = ref('');
const currentAudio = ref('');
const currentAudioName = ref('');
const currentImageOrVideo = ref('');
const currentFileName = ref('');
const textContent = ref('');
const inputMessage = ref('');
const chatMessages = ref<HTMLElement>();
const audioFileInput = ref<HTMLInputElement>();
const textFileInput = ref<HTMLInputElement>();
const fileInput = ref<HTMLInputElement>();
const isDetectionComplete = ref(false);
const isDetecting = ref(false);
const hasDetectedOnce = ref(false);

// 消息类型定义
interface Message {
  type: 'user' | 'assistant';
  content: string;
  time: string;
}

const messages = ref<Message[]>([]);

// 新增：判断文件是否为图片
function isImage(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url) || url.startsWith('data:image/');
}

// 新增：判断文件是否为视频
function isVideo(url: string): boolean {
  return /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i.test(url) || url.startsWith('data:video/');
}

// 格式化时间
function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
    }
  });
}

// 发送消息 - 修改：只在首次检测前禁用
function sendMessage() {
  if (!inputMessage.value.trim()) return;

  // 只在从未检测过的情况下才禁用
  if (!hasDetectedOnce.value) {
    alert('请先点击"立即检测"按钮进行检测后再发送消息');
    return;
  }

  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: inputMessage.value,
    time: formatTime()
  });

  const userInput = inputMessage.value;
  inputMessage.value = '';

  // 模拟AI回复（实际项目中这里会调用API）
  setTimeout(() => {
    messages.value.push({
      type: 'assistant',
      content: `收到您的消息："${userInput}"。这是一个模拟回复，实际项目中会连接到AI服务。`,
      time: formatTime()
    });
    scrollToBottom();
  }, 1000);

  scrollToBottom();
}

// 检测函数 - 修改：移除音频URL检查
function detect() {
  let content = '';

  if (activeTab.value === 'text') {
    if (!textContent.value.trim()) {
      alert('请先输入文本内容');
      return;
    }
    content = `检测文本内容：${textContent.value.substring(0, 50)}${textContent.value.length > 50 ? '...' : ''}`;
  } else if (activeTab.value === 'imageAndVideo') {
    if (!currentImageOrVideo.value && !imageUrl.value.trim()) {
      alert('请先上传图片/视频或输入URL');
      return;
    }
    const fileSource = currentFileName.value || imageUrl.value;
    const fileType = isImage(currentImageOrVideo.value || imageUrl.value) ? '图片' : '视频';
    content = `检测${fileType}：${fileSource}`;
  } else if (activeTab.value === 'audio') {
    // 修改：只检查上传的音频文件
    if (!currentAudio.value) {
      alert('请先上传音频文件');
      return;
    }
    content = `检测音频：${currentAudioName.value}`;
  }

  // 设置检测中状态（但不影响已启用的对话框）
  isDetecting.value = true;

  // 添加检测消息
  messages.value.push({
    type: 'user',
    content: content,
    time: formatTime()
  });

  // 模拟检测结果
  setTimeout(() => {
    const isFirstDetection = !hasDetectedOnce.value;
    let detectType = '';

    if (activeTab.value === 'text') {
      detectType = '文本';
    } else if (activeTab.value === 'imageAndVideo') {
      detectType = isImage(currentImageOrVideo.value || imageUrl.value) ? '图片' : '视频';
    } else if (activeTab.value === 'audio') {
      detectType = '音频';
    }

    messages.value.push({
      type: 'assistant',
      content: `检测完成！${detectType}内容分析结果：这是一个模拟的检测结果，实际项目中会返回真实的分析数据。${isFirstDetection ? '现在您可以在下方输入框中提问相关问题了。' : ''}`,
      time: formatTime()
    });

    // 首次检测完成后，永久启用对话框
    if (!hasDetectedOnce.value) {
      hasDetectedOnce.value = true;
      isDetectionComplete.value = true;
    }

    isDetecting.value = false;
    scrollToBottom();
  }, 1500);

  scrollToBottom();
}

// 修改：实现图片/视频上传功能
function uploadImageOrVideo() {
  fileInput.value?.click();
}

// 修改：处理图片/视频文件上传
function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    // 检查文件类型
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      // 创建预览URL
      const previewUrl = URL.createObjectURL(file);

      // 直接设置为主显示图片/视频
      currentImageOrVideo.value = previewUrl;
      currentFileName.value = file.name;

      console.log('文件上传成功:', file.name);
      alert(`文件 "${file.name}" 上传成功！`);
    } else {
      alert('请选择图片或视频文件！');
    }

    // 清空文件输入，允许重复选择同一文件
    target.value = '';
  }
}

// 修改：从URL加载图片/视频
function loadFromUrl() {
  if (imageUrl.value.trim()) {
    // 设置为主显示图片/视频
    currentImageOrVideo.value = imageUrl.value;
    currentFileName.value = imageUrl.value.split('/').pop() || 'URL文件';

    console.log('从URL加载成功:', imageUrl.value);
    // 清空URL输入框
    imageUrl.value = '';
  }
}

// 新增：处理音频文件上传
function handleAudioFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    // 检查文件类型
    if (file.type.startsWith('audio/')) {
      // 创建音频URL
      const audioURL = URL.createObjectURL(file);
      currentAudio.value = audioURL;
      currentAudioName.value = file.name;

      console.log('音频文件上传成功:', file.name);
      alert(`音频文件 "${file.name}" 上传成功！`);
    } else {
      alert('请选择音频文件！');
    }
  }
}

// 修改：实现文本文件上传功能
function uploadTextFile() {
  textFileInput.value?.click();
}

// 增强版文本文件处理（可选）
function handleTextFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (file.type === 'text/plain' || fileExtension === 'txt') {
      // 处理纯文本文件
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        textContent.value = content;
        console.log('文本文件上传成功:', file.name);
        alert(`文本文件 "${file.name}" 上传成功！共 ${content.length} 个字符`);
      };

      reader.onerror = () => {
        console.error('文件读取失败');
        alert('文件读取失败，请重试！');
      };

      // 读取文件内容，尝试自动检测编码
      reader.readAsText(file, 'UTF-8');

    } else if (fileExtension === 'doc' || fileExtension === 'docx') {
      // Word 文档需要特殊处理（可选功能）
      alert('Word 文档支持功能正在开发中，请先将内容复制粘贴到文本框中，或保存为 .txt 格式后上传。');
    } else {
      alert('请选择支持的文件格式：.txt 文本文件');
    }

    // 清空文件输入，允许重复选择同一文件
    target.value = '';
  }
}

function uploadAudioFile() {
  audioFileInput.value?.click();
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
  gap: 0;
}

.tab-btn {
  padding: 12px 20px;
  /* 减少padding以适应三个按钮 */
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  /* 减小字体 */
}

.tab-btn:first-child {
  border-radius: 8px 0 0 8px;
}

.tab-btn:last-child {
  border-radius: 0 8px 8px 0;
}

.tab-btn:not(:first-child):not(:last-child) {
  border-radius: 0;
}

.tab-btn.active {
  background: #8b5cf6;
}

.tab-btn:hover:not(.active) {
  background: rgba(255, 255, 255, 0.2);
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
  width: 95%;
  height: 95%;
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
  height: 85%;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  flex-shrink: 0;
  background: #f9fafb;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image img,
.main-image video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* 有内容时改变边框样式 */
.main-image:has(img),
.main-image:has(video) {
  border-style: solid;
  border-color: #e5e7eb;
  cursor: default;
}

/* 点击区域提示 */
.main-image:not(:has(img)):not(:has(video)):hover {
  border-color: #8b5cf6;
  background: #f3f4f6;
}

/* 视频播放器样式 */
.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 改进图片覆盖层 */
.image-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  pointer-events: none;
  text-align: center;
}

.image-label {
  font-size: 16px;
  font-weight: 500;
}

.upload-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
}

/* 对话面板样式 */
.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.result-title {
  font-weight: 600;
  color: #374151;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 0 4px;
  margin-bottom: 16px;
  max-height: 400px;
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: #3b82f6;
  color: white;
}

.message-content {
  flex: 1;
  max-width: 80%;
}

.message.user .message-content {
  text-align: right;
}

.message-text {
  background: #f9fafb;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

.message.user .message-text {
  background: #3b82f6;
  color: white;
}

.message-time {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
  padding: 0 4px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
  color: #9ca3af;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  line-height: 1.5;
}

.chat-input-area {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
}

.input-container {
  display: flex;
  gap: 8px;
  align-items: stretch;
  /* 改为 stretch 使高度一致 */
}

.chat-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  /* 与其他按钮保持一致的圆角 */
  font-size: 14px;
  outline: none;
  resize: none;
  min-height: 20px;
  max-height: 80px;
  font-family: inherit;
  line-height: 1.5;
}

.chat-input:focus {
  border-color: #3b82f6;
}

.send-btn {
  padding: 12px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  height: 44px;
  /* 与输入框高度一致 */
  white-space: nowrap;
}

.send-btn:hover:not(:disabled) {
  background: #2563eb;
}

.send-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* 状态提示样式 */
.status-tip {
  padding: 8px 12px;
  margin-bottom: 12px;
  border-radius: 6px;
  font-size: 12px;
  text-align: center;
  background: #f3f4f6;
  color: #6b7280;
}

.status-tip.detecting {
  background: #fef3c7;
  color: #d97706;
}

.status-tip.success {
  background: #d1fae5;
  color: #065f46;
}

/* 禁用状态的输入框 */
.chat-input:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

/* 修改空状态提示 */
.empty-text {
  font-size: 14px;
  line-height: 1.5;
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 音频上传区样式 - 修改为与其他区域一致 */
.audio-display {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.audio-upload-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.audio-upload-section {
  flex: 1;
}

.audio-drop-zone {
  width: 100%;
  height: 100%;
  min-height: 300px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.audio-drop-zone:hover {
  border-color: #8b5cf6;
  background: #f8fafc;
}

.audio-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.audio-text {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.audio-formats {
  font-size: 12px;
  color: #9ca3af;
}

.audio-player {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.audio-element {
  width: 100%;
  margin-bottom: 12px;
}

.audio-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.audio-name {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.url-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
}

.url-input:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
}

.url-input::placeholder {
  color: #9ca3af;
}
</style>
