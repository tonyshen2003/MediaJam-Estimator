// index.js
const app = getApp()

// 设备数据
const devices = [
  {
    id: 'sony-fx30',
    name: 'Sony FX30',
    brand: 'Sony',
    formats: [
      {
        name: 'XAVC S-I 4K',
        frameRates: [
          {
            fps: 24,
            settings: [
              { name: '标准', bitrate: 600, resolution: '3840x2160' },
              { name: '高质量', bitrate: 800, resolution: '3840x2160' }
            ]
          },
          {
            fps: 30,
            settings: [
              { name: '标准', bitrate: 600, resolution: '3840x2160' },
              { name: '高质量', bitrate: 800, resolution: '3840x2160' }
            ]
          }
        ]
      },
      {
        name: 'XAVC S 4K',
        frameRates: [
          {
            fps: 24,
            settings: [
              { name: '标准', bitrate: 100, resolution: '3840x2160' },
              { name: '高质量', bitrate: 150, resolution: '3840x2160' }
            ]
          },
          {
            fps: 30,
            settings: [
              { name: '标准', bitrate: 100, resolution: '3840x2160' },
              { name: '高质量', bitrate: 150, resolution: '3840x2160' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'canon-r5',
    name: 'Canon EOS R5',
    brand: 'Canon',
    formats: [
      {
        name: 'Canon RAW 8K',
        frameRates: [
          {
            fps: 30,
            settings: [
              { name: '标准', bitrate: 2600, resolution: '8192x4320' }
            ]
          }
        ]
      },
      {
        name: 'H.265 4K',
        frameRates: [
          {
            fps: 30,
            settings: [
              { name: '标准', bitrate: 230, resolution: '3840x2160' },
              { name: '高质量', bitrate: 470, resolution: '3840x2160' }
            ]
          },
          {
            fps: 60,
            settings: [
              { name: '标准', bitrate: 340, resolution: '3840x2160' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'iphone-14-pro',
    name: 'iPhone 14 Pro',
    brand: 'Apple',
    formats: [
      {
        name: 'ProRes 4K',
        frameRates: [
          {
            fps: 24,
            settings: [
              { name: 'ProRes 422', bitrate: 1100, resolution: '3840x2160' },
              { name: 'ProRes 422 HQ', bitrate: 1650, resolution: '3840x2160' }
            ]
          },
          {
            fps: 30,
            settings: [
              { name: 'ProRes 422', bitrate: 1375, resolution: '3840x2160' },
              { name: 'ProRes 422 HQ', bitrate: 2060, resolution: '3840x2160' }
            ]
          }
        ]
      },
      {
        name: 'H.265 4K',
        frameRates: [
          {
            fps: 24,
            settings: [
              { name: '标准', bitrate: 85, resolution: '3840x2160' }
            ]
          },
          {
            fps: 30,
            settings: [
              { name: '标准', bitrate: 100, resolution: '3840x2160' }
            ]
          }
        ]
      }
    ]
  }
];

// 存储容量选项
const storageOptions = [
  { value: 32, label: '32GB' },
  { value: 64, label: '64GB' },
  { value: 128, label: '128GB' },
  { value: 256, label: '256GB' },
  { value: 512, label: '512GB' },
  { value: 1024, label: '1TB' },
  { value: 2048, label: '2TB' }
];

Page({
  data: {
    theme: 'light',
    activeTab: 'device',
    devices: devices,
    storageOptions: storageOptions,
    selectedDeviceIndex: -1,
    selectedFormatIndex: -1,
    selectedFrameRateIndex: -1,
    selectedSettingIndex: -1,
    storageCapacity: 256,
    
    // 计算结果
    maxRecordingTime: 0,
    dataRate: 0,
    fileSize: 0,
    
    // 选择器数据
    deviceArray: devices.map(device => device.name),
    formatArray: [],
    frameRateArray: [],
    settingArray: [],
    storageArray: storageOptions.map(option => option.label)
  },
  
  onLoad() {
    // 获取系统主题
    wx.getSystemInfo({
      success: (res) => {
        if (res.theme) {
          this.setData({
            theme: res.theme
          });
        }
      }
    });
  },
  
  // 切换主题
  switchTheme() {
    const newTheme = this.data.theme === 'light' ? 'dark' : 'light';
    this.setData({
      theme: newTheme
    });
    app.globalData.theme = newTheme;
  },
  
  // 切换标签页
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },
  
  // 设备选择变化
  deviceChange(e) {
    const index = e.detail.value;
    const device = this.data.devices[index];
    
    // 更新格式选择器数据
    const formatArray = device.formats.map(format => format.name);
    
    this.setData({
      selectedDeviceIndex: index,
      formatArray: formatArray,
      selectedFormatIndex: -1,
      frameRateArray: [],
      selectedFrameRateIndex: -1,
      settingArray: [],
      selectedSettingIndex: -1
    });
    
    // 如果有格式，自动选择第一个
    if (formatArray.length > 0) {
      this.setData({
        selectedFormatIndex: 0
      });
      this.formatChange({ detail: { value: 0 } });
    }
  },
  
  // 格式选择变化
  formatChange(e) {
    const formatIndex = e.detail.value;
    const deviceIndex = this.data.selectedDeviceIndex;
    
    if (deviceIndex === -1) return;
    
    const format = this.data.devices[deviceIndex].formats[formatIndex];
    
    // 更新帧率选择器数据
    const frameRateArray = format.frameRates.map(fr => `${fr.fps} fps`);
    
    this.setData({
      selectedFormatIndex: formatIndex,
      frameRateArray: frameRateArray,
      selectedFrameRateIndex: -1,
      settingArray: [],
      selectedSettingIndex: -1
    });
    
    // 如果有帧率，自动选择第一个
    if (frameRateArray.length > 0) {
      this.setData({
        selectedFrameRateIndex: 0
      });
      this.frameRateChange({ detail: { value: 0 } });
    }
  },
  
  // 帧率选择变化
  frameRateChange(e) {
    const frameRateIndex = e.detail.value;
    const deviceIndex = this.data.selectedDeviceIndex;
    const formatIndex = this.data.selectedFormatIndex;
    
    if (deviceIndex === -1 || formatIndex === -1) return;
    
    const frameRate = this.data.devices[deviceIndex].formats[formatIndex].frameRates[frameRateIndex];
    
    // 更新设置选择器数据
    const settingArray = frameRate.settings.map(setting => `${setting.name} (${setting.bitrate} Mbps)`);
    
    this.setData({
      selectedFrameRateIndex: frameRateIndex,
      settingArray: settingArray,
      selectedSettingIndex: -1
    });
    
    // 如果有设置，自动选择第一个
    if (settingArray.length > 0) {
      this.setData({
        selectedSettingIndex: 0
      });
      this.settingChange({ detail: { value: 0 } });
    }
  },
  
  // 设置选择变化
  settingChange(e) {
    const settingIndex = e.detail.value;
    const deviceIndex = this.data.selectedDeviceIndex;
    const formatIndex = this.data.selectedFormatIndex;
    const frameRateIndex = this.data.selectedFrameRateIndex;
    
    if (deviceIndex === -1 || formatIndex === -1 || frameRateIndex === -1) return;
    
    this.setData({
      selectedSettingIndex: settingIndex
    });
    
    // 计算结果
    this.calculateResults();
    
    // 自动切换到结果页
    this.setData({
      activeTab: 'result'
    });
  },
  
  // 存储容量选择变化
  storageChange(e) {
    const index = e.detail.value;
    const storageCapacity = this.data.storageOptions[index].value;
    
    this.setData({
      storageCapacity: storageCapacity
    });
    
    // 如果已经选择了设置，重新计算结果
    if (this.data.selectedSettingIndex !== -1) {
      this.calculateResults();
    }
  },
  
  // 计算录制时间和数据量
  calculateResults() {
    const deviceIndex = this.data.selectedDeviceIndex;
    const formatIndex = this.data.selectedFormatIndex;
    const frameRateIndex = this.data.selectedFrameRateIndex;
    const settingIndex = this.data.selectedSettingIndex;
    
    if (deviceIndex === -1 || formatIndex === -1 || frameRateIndex === -1 || settingIndex === -1) return;
    
    const setting = this.data.devices[deviceIndex].formats[formatIndex].frameRates[frameRateIndex].settings[settingIndex];
    const bitrateMbps = setting.bitrate;
    const storageGB = this.data.storageCapacity;
    
    // 计算最大录制时间（分钟）
    const maxTimeMinutes = (storageGB * 1024 * 8) / (bitrateMbps * 60);
    
    // 计算数据速率（MB/s）
    const dataRateMBps = bitrateMbps / 8;
    
    // 计算 1 分钟文件大小（MB）
    const fileSizeMB = dataRateMBps * 60;
    
    this.setData({
      maxRecordingTime: Math.floor(maxTimeMinutes),
      dataRate: dataRateMBps.toFixed(1),
      fileSize: Math.floor(fileSizeMB)
    });
  }
})