/**
 * ============================================================
 * 作品集数据（Portfolio 板块 + 作品详情子页面）
 *
 * category 只能取："嵌入式" | "竞赛实践"
 * cover / screenshots 支持本地路径（public/ 下）或任意 https 图片链接
 * ============================================================
 */

export type ProjectCategory = "嵌入式" | "竞赛实践";

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  /** 唯一标识（决定详情页地址 /projects/[slug]），建议用英文短横线命名 */
  slug: string;
  title: string;
  /** 一句话简介（卡片上展示，约 2 行以内） */
  summary: string;
  category: ProjectCategory;
  year: string;
  /** 封面图 */
  cover: string;
  /** 截图轮播（详情弹窗 & 详情页展示） */
  screenshots: string[];
  /** 详细介绍（多段） */
  description: string[];
  /** 项目亮点列表 */
  highlights: string[];
  /** 技术标签 */
  tech: string[];
  /** 外部链接：GitHub / 在线演示等 */
  links?: ProjectLink[];
  /** 相关文件下载（如项目报告 PDF），没有可省略 */
  report?: { label: string; url: string };
}

export const projects: Project[] = [
  {
    slug: "stm32-measurement-platform",
    title: "基于 STM32 与 FreeRTOS 的综合电子测量平台",
    summary:
      "集示波采集、数字万用表、信号发生器及稳压电源输出监测于一体的综合测量平台，最高 500 kSa/s 实时采集。",
    category: "嵌入式",
    year: "2026",
    cover: "/images/projects/measurement-platform/hardware-scope-sine.jpg",
    screenshots: [
      "/images/projects/measurement-platform/hardware-scope-sine.jpg",
      "/images/projects/measurement-platform/hardware-scope-measure.jpg",
      "/images/projects/measurement-platform/hardware-awg-led.jpg",
      "/images/projects/measurement-platform/hardware-breadboard.jpg",
      "/images/projects/measurement-platform/code-lcd-task.png",
    ],
    description: [
      "这是一个集示波器、数字万用表（DMM）、信号发生器与稳压电源输出监测于一体的综合电子测量平台，基于 STM32F103RCT6 与 FreeRTOS 构建。系统采用 BSP / GUI / TASK 三层分层架构：通过事件组实现界面按区域按需重绘，以单槽覆盖队列向 GUI 传递最新测量值，并用二值信号量同步 SPI DMA 传输完成，显著减少轮询与无效刷新。",
      "示波采集链路由比较器—EXTI—TIM3 TRGO—ADC1—DMA 硬件触发构成，最高 500 kSa/s 采样率下连续采集 1024 点；结合 10 ms Hold-Off 抑制重复触发、100 ms 强制触发兜底无信号场景，并实现 Auto / One-Shot 两种触发模式的状态控制与单帧冻结，两种模式均通过实机验证。",
      "测量与信号输出方面：采用 ADC1 注入组以 10 Hz 周期采集 DMM 输入、VREFINT、稳压输出和触发阈值，基于 VREFINT 反推 VDDA 并结合 GPIO 挡位识别完成多量程换算；通过 TIM5 TRGO 驱动 DAC+DMA 循环输出正弦波、方波和三角波，按输出频率动态调整采样率与有效点数。期间定位并修正了低频档定时参数未更新、频率切换滞后一档两个时序问题，均完成实机运行验证。",
    ],
    highlights: [
      "BSP/GUI/TASK 分层 + 事件组按区域刷新 + 单槽覆盖队列 + 二值信号量同步 SPI DMA",
      "比较器—EXTI—TIM3 TRGO—ADC1—DMA 采集链，500 kSa/s × 1024 点",
      "10 ms Hold-Off、100 ms 强制触发与 Auto/One-Shot 状态控制，实机验证",
      "VREFINT 反推 VDDA 多量程换算 + DAC+DMA 循环输出三种波形，修正两个时序问题",
    ],
    tech: ["C", "STM32F103RCT6", "FreeRTOS", "ADC/DAC/DMA", "TIM/EXTI", "SPI"],
    links: [
      { label: "GitHub", url: "https://github.com/pby5109-ux/Multifunctional_Measuring_Instrument" },
    ],
  },
  {
    slug: "smart-farm-monitoring",
    title: "基于 STM32 与 FreeRTOS 的智慧农场环境监测与控制系统",
    summary:
      "四任务 FreeRTOS 架构的环境监测与自动控制系统：多源传感采集、阈值联动控制与蓝牙 JSON 告警闭环。",
    category: "嵌入式",
    year: "2025",
    cover: "/images/projects/smart-farm/hardware-full-setup.jpg",
    screenshots: [
      "/images/projects/smart-farm/hardware-full-setup.jpg",
      "/images/projects/smart-farm/hardware-oled-data.jpg",
      "/images/projects/smart-farm/ble-json-alerts.png",
      "/images/projects/smart-farm/code-sensor-task.png",
    ],
    description: [
      "基于 STM32F103C8T6 与 FreeRTOS 搭建的环境监测和自动控制系统：将传感采集、按键/编码器输入、OLED 显示与 BLE 通信划分为 Sensor、Input、Screen、BLE 四个任务，并以 farmState / farmSafeRange 两组共享状态解耦实时数据、界面显示与可配置安全阈值。",
      "数据采集结合 AHT20（温湿度）、BH1750（光照）及土壤湿度/雨滴传感器，使用 ADC1 扫描 + 循环 DMA、ADC2 连续转换及 I²C 完成多源数据读取；针对 AHT20 与 OLED 共享 I²C1 总线的情况，以互斥锁保护总线访问。",
      "控制与告警：基于阈值驱动水泵和 PWM 风扇，通过指针消息队列与 UART DMA 发送 JSON 告警。完善了队列满时的消息内存释放，将持续报警改为 warning / recovered 状态边沿触发，并为水泵加入 5% 滞回避免临界启停，形成「异常检测—执行器联动—蓝牙告警—恢复通知」的完整控制闭环，减少重复消息与临界抖动。以上改动均完成编译、烧录与上板验证。",
    ],
    highlights: [
      "Sensor/Input/Screen/BLE 四任务架构，farmState/farmSafeRange 解耦状态与阈值",
      "AHT20、BH1750 及土壤/雨滴多源采集：ADC1 扫描循环 DMA + ADC2 连续转换 + I²C",
      "互斥锁保护共享 I²C1 总线，指针消息队列 + UART DMA 发送 JSON 告警",
      "warning/recovered 告警边沿 + 水泵 5% 滞回，形成检测—联动—告警—恢复闭环",
    ],
    tech: ["C", "STM32F103C8T6", "FreeRTOS/CMSIS-RTOS2", "ADC/DMA", "I²C", "UART DMA", "PWM"],
    links: [{ label: "GitHub", url: "https://github.com/pby5109-ux/SmartFarm" }],
  },
  {
    slug: "lora-sensor-node",
    title: "基于 STM32 的低功耗 LoRa 环境传感节点",
    summary:
      "独立开发的环境监测节点：RTC Alarm 周期唤醒 Stop 低功耗运行，LoRa 遥测帧 + CRC16 + ACK 重试可靠上报。",
    category: "嵌入式",
    year: "2025",
    cover: "/images/projects/lora-node/hardware-lora-wiring.jpg",
    screenshots: [
      "/images/projects/lora-node/hardware-lora-wiring.jpg",
      "/images/projects/lora-node/code-main-lora.png",
    ],
    description: [
      "独立完成的低功耗环境传感节点（含需求拆分、CubeMX 配置、传感器接入、通信显示与低功耗流程集成、调试）：基于 STM32F103C8T6 采集 AHT20 温湿度、BH1750 光照与雨滴模拟量，分别适配硬件 I²C、GPIO 模拟 I²C 与 ADC 采样三种方式，实现 OLED 显示、阈值判断及红绿 LED 状态指示。",
      "低功耗设计：利用 LSE 驱动 RTC 并设置闹钟，暂停 SysTick 后进入 Stop 模式，RTC Alarm 经 EXTI Line 17 唤醒，唤醒后重新配置 PLL 恢复系统时钟，形成「采集—显示—通信—休眠—唤醒」的周期闭环，实现 5 秒周期唤醒运行（已上板验证）。",
      "通信协议：通过 USART3 TX DMA 发送 LoRa 遥测数据，自设计 18 字节遥测帧（含 Node ID / Sequence）、CRC16-CCITT 校验、ACK 匹配与一次重试机制；并编写 PC 侧串口网关完成流式组帧、CRC 校验、重复帧识别和 ACK 生成，完成离线与串口链路协议测试。",
    ],
    highlights: [
      "独立完成系统设计与应用开发：硬件 I²C + GPIO 模拟 I²C + ADC 三种采集方式适配",
      "RTC Alarm—EXTI17 唤醒、Stop 模式、唤醒后 PLL 恢复，5 秒周期运行闭环",
      "18 字节 LoRa 遥测帧 + CRC16-CCITT + Node ID/Sequence + ACK 匹配与一次重试",
      "PC 侧串口网关：流式组帧、校验、重复帧识别与 ACK 生成",
    ],
    tech: ["C", "STM32F103C8T6", "ADC", "I²C", "UART DMA", "RTC/Stop", "LoRa"],
    links: [{ label: "GitHub", url: "https://github.com/pby5109-ux/stm32-sensor-terminal" }],
  },
  {
    slug: "nec-contest-smart-device",
    title: "TI 杯 2025 全国大学生电子设计竞赛 E 题《简易自行瞄准装置》",
    summary:
      "3 人团队限时参赛：基于 TI MSPM0G3507 负责五路灰度循迹与按键/OLED 人机交互模块的开发与联调。",
    category: "竞赛实践",
    year: "2025",
    cover: "/images/projects/nec-contest/hardware-car.jpg",
    screenshots: [
      "/images/projects/nec-contest/hardware-car.jpg",
      "/images/projects/nec-contest/hardware-aiming-device.jpg",
      "/images/projects/nec-contest/hardware-control-board.jpg",
      "/images/projects/nec-contest/entry-certificate.jpg",
      "/images/projects/nec-contest/code-gray-track.png",
    ],
    description: [
      "2025 年全国大学生电子设计竞赛（TI 杯）E 题《简易自行瞄准装置》，3 人团队限时开发。装置包含自动寻迹小车，由 TI MSPM0G3507（Arm Cortex-M0+，80 MHz）负责巡迹与电机控制，通过 SysConfig 生成外设配置并基于 TI DriverLib 开发。",
      "本人负责按键 / OLED 人机交互与五路灰度循迹模块：完成四键扫描、任务模式与圈数、启停参数控制，以及主界面、姿态、五路灰度、电机状态、串口坐标和 PID 参数等多页面显示；将五路灰度输入拼接为 5 bit 状态码，根据传感器组合映射横向偏差并识别左右转标志，偏差送入位置式 PID 后形成左右轮差速 PWM 修正。循迹与整车状态逻辑由 1 ms 定时器中断周期调用，配合团队完成整车功能联调。",
    ],
    highlights: [
      "五路灰度 GPIO 采集 + 5 bit 状态编码 + 横向偏差/转向标志映射",
      "循迹误差接入位置式 PID，输出左右轮差速 PWM 修正",
      "四键扫描 + OLED 多页面显示：任务模式、圈数、启停与 PID 参数调整",
      "1 ms 定时器中断控制周期，与电机/编码器/姿态模块协同整车联调",
    ],
    tech: ["C", "TI MSPM0G3507", "DriverLib/SysConfig", "GPIO", "TIM", "OLED", "PID 接口"],
  },
  {
    slug: "stm32-line-following-car",
    title: "基于 STM32 的红外循迹避障遥控小车（开放实验）",
    summary:
      "6 人开放实验项目循迹小组负责人：五路灰度状态处理与循迹误差接口设计，整车联调验收获评优秀。",
    category: "竞赛实践",
    year: "2025",
    cover: "/images/cover-5.svg",
    screenshots: ["/images/shot-5.svg", "/images/shot-1.svg"],
    description: [
      "6 人开放实验项目，分为循迹、避障和蓝牙遥控三个小组，基于 STM32F103C8T6 完成整车软硬件开发。本人担任循迹小组负责人，带领循迹组完成五路灰度传感器的硬件接入与调试。",
      "负责五路灰度数据的接收、状态编码与偏差映射，设计循迹误差输出接口，为后级转向控制提供方向和偏差量；协同避障组与蓝牙遥控组完成整车集成、轨迹测试与参数修正。项目验收与个人评价均获评「优秀」。",
    ],
    highlights: [
      "担任 6 人项目循迹小组负责人",
      "五路灰度数据接收、状态编码与偏差映射，循迹误差接口设计",
      "协同避障、蓝牙遥控两组完成整车联调与轨迹修正",
      "项目验收与个人评价均获评优秀",
    ],
    tech: ["C", "STM32F103C8T6", "GPIO", "五路灰度传感器", "循迹误差接口", "整车联调"],
  },
];

/** 作品集筛选类别（「全部」+ 数据中出现的类别自动聚合） */
export const projectCategories = ["全部", "嵌入式", "竞赛实践"] as const;

/** 根据 slug 查找项目 */
export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
