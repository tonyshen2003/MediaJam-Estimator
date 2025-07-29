import React, { useState, useEffect } from 'react';
import {
  Card,
  Select,
  Typography,
  Space,
  Grid,
  Statistic,
  Alert,
  Divider,
  Button,
  Switch
} from '@arco-design/web-react';
import {
  IconVideoCamera,
  IconStorage,
  IconClockCircle,
  IconSun,
  IconMoon,
  IconInfoCircle,
  IconCalendar,
  IconDashboard,
  IconFile,
  IconSettings,
  IconCheck,
  IconExclamationCircle,
  IconApps,
  IconSafe,
  IconThumbUp
} from '@arco-design/web-react/icon';
import './App.css';

const { Title, Text, Paragraph } = Typography;
const { Row, Col } = Grid;

// 设备数据接口
interface Device {
  id: string;
  name: string;
  brand: string;
  formats: Format[];
}

interface Format {
  name: string;
  frameRates: FrameRate[];
}

interface FrameRate {
  fps: number;
  settings: Setting[];
}

interface Setting {
  name: string;
  bitrate: number;
  resolution: string;
}

// 设备数据
const devices: Device[] = [
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

function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState<'device' | 'result'>('device');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null);
  const [selectedFrameRate, setSelectedFrameRate] = useState<FrameRate | null>(null);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
  const [storageCapacity, setStorageCapacity] = useState<number>(256);
  
  // 计算结果
  const [maxRecordingTime, setMaxRecordingTime] = useState<number>(0);
  const [dataRate, setDataRate] = useState<number>(0);
  const [fileSize, setFileSize] = useState<number>(0);

  // 自动选择和重置逻辑
  const handleDeviceChange = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId) || null;
    setSelectedDevice(device);

    if (device && device.formats.length > 0) {
      const format = device.formats[0];
      setSelectedFormat(format);
      if (format.frameRates.length > 0) {
        const frameRate = format.frameRates[0];
        setSelectedFrameRate(frameRate);
        if (frameRate.settings.length > 0) {
          setSelectedSetting(frameRate.settings[0]);
        } else {
          setSelectedSetting(null);
        }
      } else {
        setSelectedFrameRate(null);
        setSelectedSetting(null);
      }
    } else {
      setSelectedFormat(null);
      setSelectedFrameRate(null);
      setSelectedSetting(null);
    }
  };

  const handleFormatChange = (formatName: string) => {
    if (!selectedDevice) return;
    const format = selectedDevice.formats.find(f => f.name === formatName) || null;
    setSelectedFormat(format);

    if (format && format.frameRates.length > 0) {
      const frameRate = format.frameRates[0];
      setSelectedFrameRate(frameRate);
      if (frameRate.settings.length > 0) {
        setSelectedSetting(frameRate.settings[0]);
      } else {
        setSelectedSetting(null);
      }
    } else {
      setSelectedFrameRate(null);
      setSelectedSetting(null);
    }
  };

  const handleFrameRateChange = (fps: number) => {
    if (!selectedFormat) return;
    const frameRate = selectedFormat.frameRates.find(fr => fr.fps === fps) || null;
    setSelectedFrameRate(frameRate);

    if (frameRate && frameRate.settings.length > 0) {
      setSelectedSetting(frameRate.settings[0]);
    } else {
      setSelectedSetting(null);
    }
  };

  const handleSettingChange = (settingName: string) => {
    if (!selectedFrameRate) return;
    const setting = selectedFrameRate.settings.find(s => s.name === settingName) || null;
    setSelectedSetting(setting);
  };

  // 切换主题
  useEffect(() => {
    if (theme === 'dark') {
      document.body.setAttribute('arco-theme', 'dark');
    } else {
      document.body.removeAttribute('arco-theme');
    }
  }, [theme]);

  // 计算录制时间和数据量
  useEffect(() => {
    if (selectedSetting) {
      const bitrateMbps = selectedSetting.bitrate;
      const storageGB = storageCapacity;
      
      // 计算最大录制时间（分钟）
      const maxTimeMinutes = (storageGB * 1024 * 8) / (bitrateMbps * 60);
      setMaxRecordingTime(Math.floor(maxTimeMinutes));
      
      // 计算数据速率（MB/s）
      const dataRateMBps = bitrateMbps / 8;
      setDataRate(dataRateMBps);
      
      // 计算 1 分钟文件大小（MB）
      const fileSizeMB = dataRateMBps * 60;
      setFileSize(fileSizeMB);
    } else {
      setMaxRecordingTime(0);
      setDataRate(0);
      setFileSize(0);
    }
  }, [selectedSetting, storageCapacity]);

  // 当有结果时自动切换到结果页
  useEffect(() => {
    if (selectedSetting) {
      setActiveTab('result');
    }
  }, [selectedSetting]);

  // 渲染设备选择页
  const renderDeviceTab = () => {
    return (
      <div className="mini-tab-content">
        <div className="mini-form">
          {/* 设备选择 */}
          <div className="mini-form-item">
            <div className="mini-form-label">
              <IconVideoCamera className="mini-icon" />
              <span>选择设备</span>
            </div>
            <Select
              placeholder="请选择录制设备"
              style={{ width: '100%' }}
              value={selectedDevice?.id}
              onChange={handleDeviceChange}
              size="large"
            >
              {devices.map((device: Device) => (
                <Select.Option key={device.id} value={device.id}>
                  {device.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* 格式选择 */}
          {selectedDevice && (
            <div className="mini-form-item">
              <div className="mini-form-label">
                <IconFile className="mini-icon" />
                <span>录制格式</span>
              </div>
              <Select
                placeholder="请选择录制格式"
                style={{ width: '100%' }}
                value={selectedFormat?.name}
                onChange={handleFormatChange}
                size="large"
              >
                {selectedDevice.formats.map((format: Format) => (
                  <Select.Option key={format.name} value={format.name}>
                    {format.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}

          {/* 帧率选择 */}
          {selectedFormat && (
            <div className="mini-form-item">
              <div className="mini-form-label">
                <IconDashboard className="mini-icon" />
                <span>帧率</span>
              </div>
              <Select
                placeholder="请选择帧率"
                style={{ width: '100%' }}
                value={selectedFrameRate?.fps}
                onChange={handleFrameRateChange}
                size="large"
              >
                {selectedFormat.frameRates.map((frameRate: FrameRate) => (
                  <Select.Option key={frameRate.fps} value={frameRate.fps}>
                    {frameRate.fps} fps
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}

          {/* 设置选择 */}
          {selectedFrameRate && (
            <div className="mini-form-item">
              <div className="mini-form-label">
                <IconSettings className="mini-icon" />
                <span>质量设置</span>
              </div>
              <Select
                placeholder="请选择质量设置"
                style={{ width: '100%' }}
                value={selectedSetting?.name}
                onChange={handleSettingChange}
                size="large"
              >
                {selectedFrameRate.settings.map((setting: Setting) => (
                  <Select.Option key={setting.name} value={setting.name}>
                    {setting.name} ({setting.bitrate} Mbps)
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}

          {/* 存储容量选择 */}
          <div className="mini-form-item">
            <div className="mini-form-label">
              <IconStorage className="mini-icon" />
              <span>存储容量</span>
            </div>
            <Select
              style={{ width: '100%' }}
              value={storageCapacity}
              onChange={setStorageCapacity}
              size="large"
            >
              {storageOptions.map((option: { value: number; label: string }) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    );
  };

  // 渲染结果页
  const renderResultTab = () => {
    if (!selectedSetting) {
      return (
        <div className="mini-empty-result">
          <IconExclamationCircle style={{ fontSize: 48 }} />
          <Text>请先选择录制配置</Text>
          <Button 
            type="primary" 
            size="large" 
            style={{ marginTop: 16 }}
            onClick={() => setActiveTab('device')}
          >
            去选择
          </Button>
        </div>
      );
    }

    return (
      <div className="mini-result">
        <div className="mini-result-header">
          <div className="mini-device-info">
            <IconVideoCamera className="mini-device-icon" />
            <div className="mini-device-name">
              <div className="mini-device-title">{selectedDevice?.name}</div>
              <div className="mini-device-subtitle">
                {selectedFormat?.name} / {selectedFrameRate?.fps}fps / {selectedSetting.name}
              </div>
            </div>
          </div>
          <div className="mini-storage-info">
            <IconStorage className="mini-storage-icon" />
            <div className="mini-storage-value">{storageCapacity}GB</div>
          </div>
        </div>

        <div className="mini-result-cards">
          <div className="mini-result-card">
            <div className="mini-result-value">{maxRecordingTime}</div>
            <div className="mini-result-label">最大可录制（分钟）</div>
          </div>
          
          <div className="mini-result-card">
            <div className="mini-result-value">{dataRate.toFixed(1)}</div>
            <div className="mini-result-label">数据速率（MB/s）</div>
          </div>
          
          <div className="mini-result-card">
            <div className="mini-result-value">{fileSize.toFixed(0)}</div>
            <div className="mini-result-label">每分钟大小（MB）</div>
          </div>
        </div>

        <Button 
          type="primary" 
          size="large" 
          style={{ width: '100%', marginTop: 24 }}
          onClick={() => setActiveTab('device')}
        >
          重新选择
        </Button>
      </div>
    );
  };

  return (
    <div className="mini-app">
      <div className="mini-container">
        <div className="mini-header">
          <div className="mini-title">
            <IconVideoCamera style={{ marginRight: 8 }} />
            视频数据量计算器
          </div>
          <Switch
            checked={theme === 'dark'}
            onChange={(checked: boolean) => setTheme(checked ? 'dark' : 'light')}
            checkedIcon={<IconMoon />}
            uncheckedIcon={<IconSun />}
            size="small"
          />
        </div>

        <div className="mini-content">
          {activeTab === 'device' ? renderDeviceTab() : renderResultTab()}
        </div>

        <div className="mini-footer">
          <div 
            className={`mini-tab-item ${activeTab === 'device' ? 'active' : ''}`}
            onClick={() => setActiveTab('device')}
          >
            <IconSettings className="mini-tab-icon" />
            <span>设置</span>
          </div>
          <div 
            className={`mini-tab-item ${activeTab === 'result' ? 'active' : ''}`}
            onClick={() => setActiveTab('result')}
          >
            <IconStorage className="mini-tab-icon" />
            <span>结果</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;