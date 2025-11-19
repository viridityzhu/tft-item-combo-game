import { CoachFeedback } from "../types";

const CORRECT_PHRASES = [
  "干得漂亮！",
  "这就对了，弈士！",
  "神装就位！",
  "思路清晰！",
  "完美合成！",
  "这波不亏！",
  "熟练度拉满！",
  "上分密码！"
];

const WRONG_PHRASES = [
  "再试一次。",
  "差点意思。",
  "公式背错了？",
  "这都能错？",
  "老八预定？",
  "别急，再想想。",
  "有点尴尬...",
  "不是这个哦。"
];

export const getCoachFeedback = async (
  itemName: string,
  isCorrect: boolean,
  streak: number
): Promise<CoachFeedback> => {
  // Simulate a short "thinking" delay for better UX
  await new Promise(resolve => setTimeout(resolve, 400));

  if (isCorrect) {
    const base = CORRECT_PHRASES[Math.floor(Math.random() * CORRECT_PHRASES.length)];
    // Add specific praise for high streaks
    const message = streak >= 3 ? `连胜 ${streak}！${base}` : base;
    return {
      message,
      tone: 'encouraging'
    };
  } else {
    const message = WRONG_PHRASES[Math.floor(Math.random() * WRONG_PHRASES.length)];
    return {
      message,
      tone: 'critical'
    };
  }
};

// Placeholder for compatibility if needed elsewhere
export const getAdvancedStrategy = async (itemName: string): Promise<string> => {
    return "多练习就能掌握！";
};