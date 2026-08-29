/**
 * ============================================================
 * 经历时间线数据（Experience 板块）
 * type 可选："education" | "intern" | "project" | "award"（决定节点图标）
 * ============================================================
 */

export interface ExperienceItem {
  period: string;
  org: string;
  role: string;
  type: "education" | "intern" | "project" | "award";
  description: string;
  tags?: string[];
}

export const experiences: ExperienceItem[] = [
  {
    period: "2025.10 — 2025.11",
    org: "烟台东方威思顿电气有限公司",
    role: "智能电表软硬件测试实习生",
    type: "intern",
    description:
      "学习智能电表及用电信息采集终端的原理图、PCBA 布局与主要元器件，梳理电源、采样、计量、通信和安全防护单元的接口关系；参加电能表开发板软硬件讲解与上手操作，学习工况事件、远程费控和主动上报等功能，并围绕终端采集异常建立「供电接线—信号输入—通信参数—软件逻辑」的分层排查方法。",
    tags: ["智能电表", "软硬件测试", "分层排查"],
  },
  {
    period: "2023.09 — 2025.06",
    org: "山东建筑大学校学生会科创部",
    role: "部长",
    type: "project",
    description:
      "统筹约 50 名成员，参与组织电赛、西门子杯、蓝桥杯及国产 MCU 产品等校级宣讲，负责人员分工、跨部门协调、宣传物料、会场布置与流程安排，保障活动按计划落地；为文艺晚会、校园歌手大赛等 200 余人活动设置双麦克风及主备音响保障方案，音频设备突发故障后按预案切换备用设备，保障活动继续进行。",
    tags: ["团队统筹", "活动组织", "现场保障"],
  },
  {
    period: "2025",
    org: "第十六届蓝桥杯（单片机设计与开发大学组）",
    role: "山东赛区三等奖",
    type: "award",
    description:
      "参加第十六届全国软件和信息技术专业人才大赛单片机设计与开发大学组，获山东赛区三等奖。",
    tags: ["蓝桥杯", "省级奖项", "单片机开发"],
  },
  {
    period: "2023.09 — 2027.06",
    org: "山东建筑大学",
    role: "物联网工程 · 本科",
    type: "education",
    description:
      "专业综合测评前 20%。具备 STM32F103 与 FreeRTOS 项目开发经历，熟悉 C 语言、HAL 库及 ADC/DAC/DMA、UART、I²C、SPI、TIM 等常用外设，能够结合原理图、数据手册和调试工具完成模块开发、系统联调与故障定位。",
    tags: ["综合测评前 20%", "物联网工程", "嵌入式方向"],
  },
];
