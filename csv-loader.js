class CSVLoader {
    constructor() {
        this.devices = [];
        this.csvPath = 'devices-data.csv';
        this.loadCSV();
    }

    // 加载 CSV 文件
    async loadCSV() {
        try {
            const response = await fetch(this.csvPath);
            if (!response.ok) {
                throw new Error(`无法加载 CSV 文件：${response.status}`);
            }
            const csvText = await response.text();
            this.parseCSV(csvText);
            console.log('CSV 数据加载成功，共加载设备数据：', this.devices.length);
        } catch (error) {
            console.error('CSV 加载错误：', error);
            // 加载失败时使用默认数据
            this.loadDefaultData();
        }
    }

    // 解析 CSV 数据
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        
        this.devices = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= 6) {
                const device = {
                    id: i,
                    brand: values[0].trim(),
                    name: values[1].trim(),
                    format: values[2].trim(),
                    framerate: values[3].trim(),
                    setting: values[4].trim(),
                    bitrate: parseFloat(values[5].trim())
                };
                this.devices.push(device);
            }
        }
    }

    // 加载默认数据
    loadDefaultData() {
        console.log('使用默认设备数据');
        this.devices = [
            {
                id: 1,
                brand: 'Sony',
                name: 'FX30',
                format: 'XAVC HS 4K',
                framerate: '59.94p',
                setting: '200M 4:2:2 10bit',
                bitrate: 200
            },
            {
                id: 2,
                brand: 'Sony',
                name: 'FX30',
                format: 'XAVC HS 4K',
                framerate: '50p',
                setting: '200M 4:2:2 10bit',
                bitrate: 200
            },
            {
                id: 3,
                brand: 'Sony',
                name: 'FX30',
                format: 'XAVC S 4K',
                framerate: '59.94p',
                setting: '200M 4:2:2 10bit',
                bitrate: 200
            },
            {
                id: 4,
                brand: 'Sony',
                name: 'FX30',
                format: 'XAVC S-I 4K',
                framerate: '59.94p',
                setting: '600M 4:2:2 10bit',
                bitrate: 600
            },
            {
                id: 5,
                brand: 'Apple',
                name: 'iPhone 14 Pro',
                format: 'H.264 4K',
                framerate: '60p',
                setting: '标准',
                bitrate: 100
            }
        ];
    }

    // 获取设备数据 - 添加这个方法
    async loadDevices() {
        // 如果设备数据已加载，直接返回
        if (this.devices.length > 0) {
            return this.devices;
        }
        
        // 否则等待加载完成
        try {
            await this.loadCSV();
            return this.devices;
        } catch (error) {
            console.error('加载设备数据失败：', error);
            this.loadDefaultData();
            return this.devices;
        }
    }

    // 获取特定品牌的设备
    getDevicesByBrand(brand) {
        const devices = this.devices.filter(device => device.brand === brand);
        // 返回唯一的设备名称
        const uniqueDevices = [];
        const deviceNames = new Set();
        
        devices.forEach(device => {
            if (!deviceNames.has(device.name)) {
                deviceNames.add(device.name);
                uniqueDevices.push({
                    name: device.name,
                    brand: device.brand
                });
            }
        });
        
        return uniqueDevices;
    }

    // 获取设备支持的格式
    getDeviceFormats(brand, deviceName) {
        const deviceData = this.devices.filter(device => 
            device.brand === brand && 
            device.name === deviceName
        );
        
        return [...new Set(deviceData.map(device => device.format))];
    }

    // 获取格式支持的帧率
    getFormatFrameRates(brand, deviceName, format) {
        const deviceData = this.devices.filter(device => 
            device.brand === brand && 
            device.name === deviceName && 
            device.format === format
        );
        
        return [...new Set(deviceData.map(device => device.framerate))];
    }

    // 获取帧率支持的设置
    getFormatSettings(brand, deviceName, format, framerate) {
        const deviceData = this.devices.filter(device => 
            device.brand === brand && 
            device.name === deviceName && 
            device.format === format && 
            device.framerate === framerate
        );
        
        return deviceData.map(device => ({
            setting: device.setting,
            bitrate: device.bitrate
        }));
    }

    // 导出 CSV 数据
    exportCSV() {
        if (this.devices.length === 0) {
            return '厂商，设备名称，文件格式，录制帧速率，录制设置，码率';
        }
        
        const headers = '厂商，设备名称，文件格式，录制帧速率，录制设置，码率';
        const rows = this.devices.map(device => 
            `${device.brand},${device.name},${device.format},${device.framerate},${device.setting},${device.bitrate}`
        );
        
        return [headers, ...rows].join('\n');
    }
}

// 初始化 CSV 加载器
const csvLoader = new CSVLoader();