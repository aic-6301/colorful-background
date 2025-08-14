"use client";
import { useState, useEffect } from "react";
import Settings from "../components/settings";

type BackgroundSettings = {
  mode: string;
  morningColor: string;
  middayColor: string;
  nightColor: string;
  midnightColor: string;
  singleColor: string;
  gradientColors: string[];
};

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
    mode: "time-sync",
    morningColor: "#FFD700", // 朝の色 (ゴールド)
    middayColor: "#FFFF00", // 昼の色 (黄色)
    nightColor: "#1E90FF", // 夜の色 (青)
    midnightColor: "#00008B", // 真夜中の色 (濃紺)
    singleColor: "#FFFFFF",
    gradientColors: ["#FF7F50", "#6A5ACD"],
  });

  // ページ読み込み時に設定をlocalStorageから読み込む
  useEffect(() => {
    const savedSettings = localStorage.getItem('backgroundSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setBackgroundSettings({
          ...backgroundSettings,
          ...parsedSettings
        });
      } catch (e) {
        console.error("設定の読み込みに失敗しました", e);
      }
    }
  }, []);

  // 色を滑らかに補間する関数
  const interpolateColor = (color1: string, color2: string, factor: number): string => {
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);

    const r1 = (c1 >> 16) & 0xff;
    const g1 = (c1 >> 8) & 0xff;
    const b1 = c1 & 0xff;

    const r2 = (c2 >> 16) & 0xff;
    const g2 = (c2 >> 8) & 0xff;
    const b2 = c2 & 0xff;

    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // 時間に基づいて背景色を取得する関数
  const getBackgroundColor = () => {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    
    if (backgroundSettings.mode === "time-sync") {
      // 時間帯に応じた色の変化
      if (currentHour >= 5 && currentHour < 12) {
        // 朝 (5時〜12時): 朝の色から昼の色へ
        const factor = ((currentHour - 5) * 60 + currentMinute) / (7 * 60); // 5時から12時までの進行度
        return interpolateColor(backgroundSettings.morningColor, backgroundSettings.middayColor, factor);
      } else if (currentHour >= 12 && currentHour < 18) {
        // 昼 (12時〜18時): 昼の色から夜の色へ
        const factor = ((currentHour - 12) * 60 + currentMinute) / (6 * 60); // 12時から18時までの進行度
        return interpolateColor(backgroundSettings.middayColor, backgroundSettings.nightColor, factor);
      } else if (currentHour >= 18 && currentHour < 23) {
        // 夜 (18時〜23時): 夜の色から真夜中の色へ
        const factor = ((currentHour - 18) * 60 + currentMinute) / (5 * 60); // 18時から23時までの進行度
        return interpolateColor(backgroundSettings.nightColor, backgroundSettings.midnightColor, factor);
      } else {
        // 真夜中 (23時〜5時): 真夜中の色から朝の色へ
        const adjustedHour = currentHour < 5 ? currentHour + 24 : currentHour;
        const factor = ((adjustedHour - 23) * 60 + currentMinute) / (6 * 60); // 23時から5時までの進行度
        return interpolateColor(backgroundSettings.midnightColor, backgroundSettings.morningColor, factor);
      }
    } else if (backgroundSettings.mode === "single-color") {
      return backgroundSettings.singleColor;
    } else if (backgroundSettings.mode === "gradient") {
      return `linear-gradient(to right, ${backgroundSettings.gradientColors[0]}, ${backgroundSettings.gradientColors[1]})`;
    }
    
    return "#FFFFFF"; // デフォルト色
  };

  // 設定画面以外の部分をクリックしたときに設定を閉じる
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowSettings(true);
    }
  };

  // 設定が適用されたときの処理
  const handleSettingsApply = (settings: BackgroundSettings) => {
    setBackgroundSettings(settings);
    localStorage.setItem('backgroundSettings', JSON.stringify(settings));
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{
        background: getBackgroundColor(),
        transition: "background 1s ease",
      }}
      onClick={handleBackgroundClick}
    >
      
      {showSettings && (
        <Settings
          settings={backgroundSettings}
          onClose={() => setShowSettings(false)}
          onApply={handleSettingsApply}
        />
      )}
    </div>
  );
}
