"use client";

/**
 * 打字机效果 Hook：循环输入 / 删除一组词语
 * prefers-reduced-motion 时直接返回第一个词，不做动画
 */
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function useTypewriter(words: readonly string[], typeSpeed = 110, deleteSpeed = 45, pause = 1800) {
  const reduced = useReducedMotion();
  const [text, setText] = useState("");
  const state = useRef({ wordIndex: 0, charIndex: 0, deleting: false });

  useEffect(() => {
    if (reduced) {
      setText(words[0] ?? "");
      return;
    }
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const s = state.current;
      const word = words[s.wordIndex] ?? "";

      if (!s.deleting) {
        s.charIndex++;
        setText(word.slice(0, s.charIndex));
        if (s.charIndex >= word.length) {
          s.deleting = true;
          timer = setTimeout(tick, pause); // 输入完成后停顿
          return;
        }
        timer = setTimeout(tick, typeSpeed);
      } else {
        s.charIndex--;
        setText(word.slice(0, s.charIndex));
        if (s.charIndex <= 0) {
          s.deleting = false;
          s.wordIndex = (s.wordIndex + 1) % words.length;
          timer = setTimeout(tick, 400); // 删除完稍作停顿
          return;
        }
        timer = setTimeout(tick, deleteSpeed);
      }
    };

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [words, typeSpeed, deleteSpeed, pause, reduced]);

  return text;
}
