class VideoDataCalculator {
    constructor() {
        this.devices = [];
        this.currentBrand = null;
        this.currentDevice = null;
        this.currentFormat = null;
        this.currentFramerate = null;
        this.currentSetting = null;
        this.formatOptions = [];
        this.framerateOptions = [];
        this.settingOptions = [];
        this.formatIndex = 0;
        this.framerateIndex = 0;
        this.settingIndex = 0;
        
        this.loadDevices();
        this.initEventListeners();
    }
    
    // 加载设备数据
    async loadDevices() {
        try {
            // 等待 CSV 加载器初始化完成
            if (!csvLoader) {
                console.log('等待 CSV 加载器初始化...');
                setTimeout(() => this.loadDevices(), 500);
                return;
            }
            
            // 获取设备数据
            this.devices = csvLoader.deviceConfigs;
            console.log('设备数据加载成功，共加载：', this.devices.length, '条配置');
            this.renderBrands();
        } catch (error) {
            console.error('加载设备数据失败：', error);
        }
    }
    
    // 初始化事件监听器
    initEventListeners() {
        // 录制时长输入框事件
        const durationInput = document.getElementById('duration-input');
        if (durationInput) {
            durationInput.addEventListener('input', () => this.updateCalculations());
            durationInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.updateCalculations();
                }
            });
        }
        
        // 存储容量选择事件
        const storageSelect = document.getElementById('storage-select');
        if (storageSelect) {
            storageSelect.addEventListener('change', () => this.updateCalculations());
        }
        
        // 厂商按钮事件
        document.querySelectorAll('[data-brand]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectBrand(e.target.dataset.brand);
            });
        });
    }
    
    // 渲染品牌按钮
    renderBrands() {
        // 品牌按钮已经在 HTML 中静态定义，无需动态渲染
        console.log('品牌按钮已准备就绪');
    }
    
    // 选择品牌
    selectBrand(brand) {
        // 更新按钮状态
        document.querySelectorAll('[data-brand]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.brand === brand) {
                btn.classList.add('active');
            }
        });
        
        this.currentBrand = brand;
        this.currentDevice = null;
        this.currentFormat = null;
        this.currentFramerate = null;
        this.currentSetting = null;
        
        // 重置选择索引
        this.formatIndex = 0;
        this.framerateIndex = 0;
        this.settingIndex = 0;
        
        // 显示该品牌的设备
        this.renderDevices();
        
        // 隐藏后续选择
        document.getElementById('format-section').style.display = 'none';
        document.getElementById('framerate-section').style.display = 'none';
        document.getElementById('settings-section').style.display = 'none';
    }
    
    // 渲染设备按钮
    renderDevices() {
        const deviceGrid = document.getElementById('device-grid');
        if (!deviceGrid) return;
        
        deviceGrid.innerHTML = '';
        
        // 获取当前品牌的所有设备
        const devices = csvLoader.getDevicesByBrand(this.currentBrand);
        
        if (devices.length === 0) {
            deviceGrid.innerHTML = '<div class="placeholder-text">该品牌暂无设备数据</div>';
            return;
        }
        
        devices.forEach(device => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = device.name;
            button.addEventListener('click', () => this.selectDevice(device.name));
            deviceGrid.appendChild(button);
        });
    }
    
    // 选择设备
    selectDevice(deviceName) {
        document.querySelectorAll('#device-grid .option-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent === deviceName) {
                btn.classList.add('active');
            }
        });
        
        this.currentDevice = deviceName;
        this.currentFormat = null;
        this.currentFramerate = null;
        this.currentSetting = null;
        
        // 重置选择索引
        this.formatIndex = 0;
        this.framerateIndex = 0;
        this.settingIndex = 0;
        
        // 准备格式选项
        this.prepareFormatOptions();
        
        // 显示格式选择
        this.showFormatWheel();
        
        // 隐藏后续选择
        document.getElementById('framerate-section').style.display = 'none';
        document.getElementById('settings-section').style.display = 'none';
    }
    
    // 准备格式选项
    prepareFormatOptions() {
        // 获取当前设备支持的所有格式
        this.formatOptions = csvLoader.getDeviceFormats(this.currentBrand, this.currentDevice);
    }
    
    // 显示格式波轮选择器
    showFormatWheel() {
        const formatSection = document.getElementById('format-section');
        const formatDisplay = document.getElementById('format-display');
        
        formatSection.style.display = 'block';
        
        if (this.formatOptions.length === 0) {
            formatDisplay.textContent = '该设备暂无格式数据';
            return;
        }
        
        // 显示当前选择的格式
        this.updateFormatDisplay();
    }
    
    // 更新格式显示
    updateFormatDisplay() {
        const formatDisplay = document.getElementById('format-display');
        if (this.formatOptions.length > 0) {
            formatDisplay.textContent = this.formatOptions[this.formatIndex];
            this.currentFormat = this.formatOptions[this.formatIndex];
            
            // 准备帧率选项
            this.prepareFramerateOptions();
            
            // 显示帧率选择
            this.showFramerateWheel();
        } else {
            formatDisplay.textContent = '无可用格式';
        }
    }
    
    // 调整选择
    adjustSelection(type, direction) {
        switch (type) {
            case 'format':
                this.adjustFormatSelection(direction);
                break;
            case 'framerate':
                this.adjustFramerateSelection(direction);
                break;
            case 'settings':
                this.adjustSettingsSelection(direction);
                break;
        }
    }
    
    // 调整格式选择
    adjustFormatSelection(direction) {
        if (this.formatOptions.length === 0) return;
        
        this.formatIndex = (this.formatIndex + direction + this.formatOptions.length) % this.formatOptions.length;
        this.updateFormatDisplay();
    }
    
    // 准备帧率选项
    prepareFramerateOptions() {
        // 获取当前格式支持的所有帧率
        this.framerateOptions = csvLoader.getFormatFrameRates(this.currentBrand, this.currentDevice, this.currentFormat);
        this.framerateIndex = 0;
    }
    
    // 显示帧率波轮选择器
    showFramerateWheel() {
        const framerateSection = document.getElementById('framerate-section');
        const framerateDisplay = document.getElementById('framerate-display');
        
        framerateSection.style.display = 'block';
        
        if (this.framerateOptions.length === 0) {
            framerateDisplay.textContent = '该格式暂无帧率数据';
            return;
        }
        
        // 显示当前选择的帧率
        this.updateFramerateDisplay();
    }
    
    // 更新帧率显示
    updateFramerateDisplay() {
        const framerateDisplay = document.getElementById('framerate-display');
        if (this.framerateOptions.length > 0) {
            framerateDisplay.textContent = this.framerateOptions[this.framerateIndex];
            this.currentFramerate = this.framerateOptions[this.framerateIndex];
            
            // 准备设置选项
            this.prepareSettingsOptions();
            
            // 显示设置选择
            this.showSettingsWheel();
        } else {
            framerateDisplay.textContent = '无可用帧率';
        }
    }
    
    // 调整帧率选择
    adjustFramerateSelection(direction) {
        if (this.framerateOptions.length === 0) return;
        
        this.framerateIndex = (this.framerateIndex + direction + this.framerateOptions.length) % this.framerateOptions.length;
        this.updateFramerateDisplay();
    }
    
    // 准备设置选项
    prepareSettingsOptions() {
        // 获取当前帧率支持的所有设置
        const settings = csvLoader.getFormatSettings(this.currentBrand, this.currentDevice, this.currentFormat, this.currentFramerate);
        this.settingOptions = settings.map(setting => `${setting.setting} (${setting.bitrate}Mbps)`);
        this.settingIndex = 0;
    }
    
    // 显示设置波轮选择器
    showSettingsWheel() {
        const settingsSection = document.getElementById('settings-section');
        const settingsDisplay = document.getElementById('settings-display');
        
        settingsSection.style.display = 'block';
        
        if (this.settingOptions.length === 0) {
            settingsDisplay.textContent = '该帧率暂无设置数据';
            return;
        }
        
        // 显示当前选择的设置
        this.updateSettingsDisplay();
    }
    
    // 更新设置显示
    updateSettingsDisplay() {
        const settingsDisplay = document.getElementById('settings-display');
        if (this.settingOptions.length > 0) {
            settingsDisplay.textContent = this.settingOptions[this.settingIndex];
            
            // 获取当前设置的码率
            const settings = csvLoader.getFormatSettings(this.currentBrand, this.currentDevice, this.currentFormat, this.currentFramerate);
            this.currentSetting = settings[this.settingIndex].setting;
            this.currentBitrate = settings[this.settingIndex].bitrate;
            
            // 更新计算结果
            this.updateCalculations();
        } else {
            settingsDisplay.textContent = '无可用设置';
        }
    }
    
    // 调整设置选择
    adjustSettingsSelection(direction) {
        if (this.settingOptions.length === 0) return;
        
        this.settingIndex = (this.settingIndex + direction + this.settingOptions.length) % this.settingOptions.length;
        this.updateSettingsDisplay();
    }
    
    // 更新计算结果
    updateCalculations() {
        if (!this.currentBitrate) return;
        
        const storageSelect = document.getElementById('storage-size');
        const dataRateElement = document.getElementById('max-rate');
        const recordTimeElement = document.getElementById('min-time');
        
        if (!storageSelect || !dataRateElement || !recordTimeElement) return;
        
        const storageGB = parseFloat(storageSelect.value) || 0;
        
        // 使用设备的实际码率
        const bitrateInMbps = this.currentBitrate;
        
        // 计算数据速率 (MB/s)
        const dataRateMBps = bitrateInMbps / 8;
        
        // 计算录制时间 (分钟)
        const recordTimeMinutes = (storageGB * 1024 * 8) / (bitrateInMbps * 60);
        
        // 更新显示
        dataRateElement.textContent = dataRateMBps.toFixed(1);
        
        // 格式化录制时间
        const hours = Math.floor(recordTimeMinutes / 60);
        const minutes = Math.floor(recordTimeMinutes % 60);
        recordTimeElement.textContent = `${hours}小时${minutes}分钟`;
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new VideoDataCalculator();
});