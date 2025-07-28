// 视频录制设备和规格数据库
const VIDEO_DATA = {
    // 录制设备
    devices: [
        { id: 1, name: "iPhone 14 Pro", brand: "Apple" },
        { id: 2, name: "iPhone 15 Pro", brand: "Apple" },
        { id: 3, name: "Canon EOS R5", brand: "Canon" },
        { id: 4, name: "Canon EOS R6", brand: "Canon" },
        { id: 5, name: "Sony A7S III", brand: "Sony" },
        { id: 6, name: "Sony FX3", brand: "Sony" },
        { id: 7, name: "GoPro Hero 11", brand: "GoPro" },
        { id: 8, name: "GoPro Hero 12", brand: "GoPro" },
        { id: 9, name: "DJI Pocket 2", brand: "DJI" },
        { id: 10, name: "DJI Action 2", brand: "DJI" },
        { id: 11, name: "普通摄像头", brand: "通用" },
        { id: 12, name: "专业摄像机", brand: "通用" }
    ],

    // 分辨率选项
    resolutions: [
        { id: 1, name: "720p", width: 1280, height: 720, displayName: "HD 720p (1280×720)" },
        { id: 2, name: "1080p", width: 1920, height: 1080, displayName: "Full HD 1080p (1920×1080)" },
        { id: 3, name: "1440p", width: 2560, height: 1440, displayName: "2K 1440p (2560×1440)" },
        { id: 4, name: "4K", width: 3840, height: 2160, displayName: "4K UHD (3840×2160)" },
        { id: 5, name: "5.3K", width: 5312, height: 2988, displayName: "5.3K (5312×2988)" },
        { id: 6, name: "6K", width: 6016, height: 3384, displayName: "6K (6016×3384)" },
        { id: 7, name: "8K", width: 7680, height: 4320, displayName: "8K UHD (7680×4320)" }
    ],

    // 帧率选项
    frameRates: [
        { id: 1, fps: 24, displayName: "24fps (电影标准)" },
        { id: 2, fps: 25, displayName: "25fps (PAL 标准)" },
        { id: 3, fps: 30, displayName: "30fps (标准)" },
        { id: 4, fps: 50, displayName: "50fps (高帧率)" },
        { id: 5, fps: 60, displayName: "60fps (高帧率)" },
        { id: 6, fps: 120, displayName: "120fps (慢动作)" },
        { id: 7, fps: 240, displayName: "240fps (超慢动作)" }
    ],

    // 编码格式
    codecs: [
        { id: 1, name: "H.264", displayName: "H.264 (AVC)", multiplier: 1.0 },
        { id: 2, name: "H.265", displayName: "H.265 (HEVC)", multiplier: 0.6 },
        { id: 3, name: "XAVC S", displayName: "XAVC S", multiplier: 1.2 },
        { id: 4, name: "XAVC HS", displayName: "XAVC HS", multiplier: 0.7 },
        { id: 5, name: "XAVC S-I", displayName: "XAVC S-I (无压缩)", multiplier: 3.0 },
        { id: 6, name: "ProRes", displayName: "Apple ProRes", multiplier: 2.5 },
        { id: 7, name: "RAW", displayName: "RAW (无压缩)", multiplier: 4.0 }
    ],

    // 码率预设 (Mbps)
    bitratePresets: {
        "720p": { low: 5, medium: 10, high: 15 },
        "1080p": { low: 15, medium: 25, high: 40 },
        "1440p": { low: 30, medium: 50, high: 80 },
        "4K": { low: 60, medium: 100, high: 150 },
        "5.3K": { low: 80, medium: 120, high: 180 },
        "6K": { low: 120, medium: 200, high: 300 },
        "8K": { low: 200, medium: 400, high: 600 }
    }
};

// 获取所有设备
function getAllDevices() {
    return VIDEO_DATA.devices;
}

// 获取所有分辨率
function getAllResolutions() {
    return VIDEO_DATA.resolutions;
}

// 获取所有帧率
function getAllFrameRates() {
    return VIDEO_DATA.frameRates;
}

// 获取所有编码格式
function getAllCodecs() {
    return VIDEO_DATA.codecs;
}

// 根据分辨率获取码率预设
function getBitratePresets(resolutionName) {
    return VIDEO_DATA.bitratePresets[resolutionName] || { low: 10, medium: 25, high: 50 };
}

// 根据 ID 查找设备
function getDeviceById(id) {
    return VIDEO_DATA.devices.find(device => device.id === parseInt(id));
}

// 根据 ID 查找分辨率
function getResolutionById(id) {
    return VIDEO_DATA.resolutions.find(resolution => resolution.id === parseInt(id));
}

// 根据 ID 查找帧率
function getFrameRateById(id) {
    return VIDEO_DATA.frameRates.find(frameRate => frameRate.id === parseInt(id));
}

// 根据 ID 查找编码格式
function getCodecById(id) {
    return VIDEO_DATA.codecs.find(codec => codec.id === parseInt(id));
}

// 计算基础码率
function calculateBaseBitrate(resolution, frameRate) {
    const resolutionData = getResolutionById(resolution);
    const frameRateData = getFrameRateById(frameRate);
    
    if (!resolutionData || !frameRateData) return 25;
    
    // 基础计算：像素数 × 帧率 × 压缩比
    const pixels = resolutionData.width * resolutionData.height;
    const baseRate = (pixels * frameRateData.fps) / 1000000; // 转换为Mbps
    
    return Math.round(baseRate * 0.1); // 应用压缩比
}
