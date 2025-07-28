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
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null);
  const [selectedFrameRate, setSelectedFrameRate] = useState<FrameRate | null>(null);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
  const [storageCapacity, setStorageCapacity] = useState<number>(256);
  
  // 计算结果
  const [maxRecordingTime, setMaxRecordingTime] = useState<number>(0);
  const [dataRate, setDataRate] = useState<number>(0);
  const [fileSize, setFileSize] = useState<number>(0);

  // 重置选择
  const resetSelections = (level: 'device' | 'format' | 'frameRate') => {
    if (level === 'device') {
      setSelectedFormat(null);
      setSelectedFrameRate(null);
      setSelectedSetting(null);
    } else if (level === 'format') {
      setSelectedFrameRate(null);
      setSelectedSetting(null);
    } else if (level === 'frameRate') {
      setSelectedSetting(null);
    }
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

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <div className="header-title">
            <Title heading={2}>
              <IconVideoCamera style={{ marginRight: 12, position: 'relative', top: '2px' }} />
              视频数据量计算器
            </Title>
            <Switch
              checked={theme === 'dark'}
              onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              checkedIcon={<IconMoon />}
              uncheckedIcon={<IconSun />}
            />
          </div>
          <Paragraph type="secondary">
            选择录制设备和存储容量，计算最大录制时间和数据使用量
          </Paragraph>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 录制配置卡片 */}
          <Card
            title={
              <Space>
                <IconSettings />
                录制配置
              </Space>
            }
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* 设备选择 */}
              <div className="form-item">
                <div className="form-label">选择设备</div>
                <Select
                  placeholder="请选择录制设备"
                  style={{ width: '100%' }}
                  value={selectedDevice?.id}
                  onChange={(value) => {
                    const device = devices.find(d => d.id === value) || null;
                    setSelectedDevice(device);
                    resetSelections('device');
                  }}
                >
                  {devices.map(device => (
                    <Select.Option key={device.id} value={device.id}>
                      {device.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {/* 格式选择 */}
              {selectedDevice && (
                <div className="form-item">
                  <div className="form-label">录制格式</div>
                  <Select
                    placeholder="请选择录制格式"
                    style={{ width: '100%' }}
                    value={selectedFormat?.name}
                    onChange={(value) => {
                      const format = selectedDevice.formats.find(f => f.name === value) || null;
                      setSelectedFormat(format);
                      resetSelections('format');
                    }}
                  >
                    {selectedDevice.formats.map(format => (
                      <Select.Option key={format.name} value={format.name}>
                        {format.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              )}

              {/* 帧率选择 */}
              {selectedFormat && (
                <div className="form-item">
                  <div className="form-label">帧率</div>
                  <Select
                    placeholder="请选择帧率"
                    style={{ width: '100%' }}
                    value={selectedFrameRate?.fps}
                    onChange={(value) => {
                      const frameRate = selectedFormat.frameRates.find(fr => fr.fps === value) || null;
                      setSelectedFrameRate(frameRate);
                      resetSelections('frameRate');
                    }}
                  >
                    {selectedFormat.frameRates.map(frameRate => (
                      <Select.Option key={frameRate.fps} value={frameRate.fps}>
                        {frameRate.fps} fps
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              )}

              {/* 设置选择 */}
              {selectedFrameRate && (
                <div className="form-item">
                  <div className="form-label">质量设置</div>
                  <Select
                    placeholder="请选择质量设置"
                    style={{ width: '100%' }}
                    value={selectedSetting?.name}
                    onChange={(value) => {
                      const setting = selectedFrameRate.settings.find(s => s.name === value) || null;
                      setSelectedSetting(setting);
                    }}
                  >
                    {selectedFrameRate.settings.map(setting => (
                      <Select.Option key={setting.name} value={setting.name}>
                        {setting.name} ({setting.bitrate} Mbps)
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              )}

              {/* 存储容量选择 */}
              <div className="form-item">
                <div className="form-label">存储容量</div>
                <Select
                  style={{ width: '100%' }}
                  value={storageCapacity}
                  onChange={setStorageCapacity}
                >
                  {storageOptions.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </Space>
          </Card>

          {/* 计算结果卡片 */}
          <Card
            title={
              <Space>
                <IconStorage />
                计算结果
              </Space>
            }
            bordered={false}
          >
            {selectedSetting ? (
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Alert
                  type="info"
                  showIcon
                  icon={<IconInfoCircle />}
                  content={`当前配置：${selectedDevice?.name} / ${selectedFormat?.name} / ${selectedFrameRate?.fps}fps / ${selectedSetting.name}`}
                />
                <Row gutter={24}>
                  <Col span={8}>
                    <Statistic title="最大可录制" value={maxRecordingTime} suffix="分钟" />
                  </Col>
                  <Col span={8}>
                    <Statistic title="数据速率" value={dataRate.toFixed(1)} suffix="MB/s" />
                  </Col>
                  <Col span={8}>
                    <Statistic title="每分钟大小" value={fileSize.toFixed(0)} suffix="MB" />
                  </Col>
                </Row>
              </Space>
            ) : (
              <div className="result-empty">
                <IconExclamationCircle />
                <Text>请先选择录制配置</Text>
              </div>
            )}
          </Card>

        {/* 使用说明 */}
        {/* 使用说明卡片 */}
        <Card
          title={
            <Space>
              <IconApps />
              使用说明
            </Space>
          }
        >
          <Row gutter={40} justify="center">
            <Col span={8}>
              <div className="guide-item">
                <IconVideoCamera className="guide-icon" />
                <Title heading={6}>1. 选择设备</Title>
                <Text type="secondary">
                  选择录制设备、格式、帧率和质量。
                </Text>
              </div>
            </Col>
            <Col span={8}>
              <div className="guide-item">
                <IconStorage className="guide-icon" />
                <Title heading={6}>2. 选择容量</Title>
                <Text type="secondary">
                  选择你的存储卡容量大小。
                </Text>
              </div>
            </Col>
            <Col span={8}>
              <div className="guide-item">
                <IconCheck className="guide-icon" />
                <Title heading={6}>3. 查看结果</Title>
                <Text type="secondary">
                  自动计算可录制时长和数据速率。
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
        </Space>
      </div>
    </div>
  );
}

export default App;