/**
 * ============================================================
 * 技能数据（Skills 板块）
 * level 为百分比进度条（0-100），对应简历中「熟悉 / 使用过」的能力描述
 * ============================================================
 */

/** 技术技能（左侧进度条） */
export interface TechSkill {
  name: string;
  level: number;
}

export const techSkills: TechSkill[] = [
  { name: "C 语言（指针 / 结构体 / 位运算 / 动态内存）", level: 85 },
  { name: "STM32F103 / HAL 库", level: 85 },
  { name: "UART / I²C / SPI / ADC / DMA / TIM 外设", level: 85 },
  { name: "FreeRTOS / CMSIS-RTOS2", level: 80 },
  { name: "Keil / CMake / GCC / OpenOCD / Git 工具链", level: 75 },
  { name: "TI MSPM0G3507 / DriverLib", level: 65 },
];

/** 软技能（右侧卡片，icon 对应 lucide-react 图标名） */
export interface SoftSkill {
  icon: "Users" | "MessageSquare" | "Lightbulb" | "Clock";
  title: string;
  desc: string;
}

export const softSkills: SoftSkill[] = [
  {
    icon: "Users",
    title: "团队协作",
    desc: "担任校学生会科创部部长，统筹约 50 名成员；开放实验项目中担任循迹小组负责人，熟悉任务分工与跨组联调。",
  },
  {
    icon: "MessageSquare",
    title: "沟通表达",
    desc: "组织电赛、蓝桥杯等校级宣讲与 200 余人大型活动的设备保障，能把技术方案和现场流程讲清楚、落到位。",
  },
  {
    icon: "Lightbulb",
    title: "问题定位",
    desc: "习惯结合原理图、芯片手册与调试工具（ST-Link、示波器、万用表），从引脚信号、外设寄存器到任务逻辑分层排查软硬件问题。",
  },
  {
    icon: "Clock",
    title: "现场执行",
    desc: "课业、项目、实习与社团并行推进；大型活动中建立设备主备预案，突发故障按预案快速恢复、保障流程继续。",
  },
];

/** 语言能力（右侧圆点评分，满分 5） */
export const languageSkills = [
  { name: "中文（普通话）", level: 5, note: "母语" },
  { name: "英语", level: 3, note: "CET-4 · 可阅读英文数据手册与文档" },
];

/** 常用工具标签 */
export const tools = [
  "Keil",
  "STM32CubeMX",
  "VS Code",
  "CLion",
  "CMake / GCC",
  "OpenOCD",
  "Git",
  "ST-Link",
  "示波器",
  "万用表",
  "WPS / Office",
];
