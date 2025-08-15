"use client";
import { useState, useEffect } from "react";
import Settings from "../components/settings";

type BackgroundSettings = {
  mode: string;
  morningColor: string;
  middayColor: string;
  eveningColor: string;
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
    eveningColor: "#FFA500", // 夕方の色 (オレンジ)
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
      if (currentHour >= 5 && currentHour < 10) {
        // 朝 (5時〜10時): 朝の色から昼の色へ
        const factor = ((currentHour - 5) * 60 + currentMinute) / (5 * 60); // 5時から10時までの進行度
        const gradientColor = interpolateColor(backgroundSettings.morningColor, backgroundSettings.middayColor, factor);
        return `linear-gradient(to right, ${backgroundSettings.morningColor}, ${gradientColor}, ${backgroundSettings.middayColor})`;
      } else if (currentHour >= 10 && currentHour < 16) {
        // 昼 (10時〜16時): 昼の色から夕方の色へ
        const factor = ((currentHour - 10) * 60 + currentMinute) / (6 * 60); // 10時から16時までの進行度
        const gradientColor = interpolateColor(backgroundSettings.middayColor, backgroundSettings.eveningColor, factor);
        return `linear-gradient(to right, ${backgroundSettings.middayColor}, ${gradientColor}, ${backgroundSettings.eveningColor})`;
      } else if (currentHour >= 16 && currentHour < 19) {
        // 夕方 (16時〜19時): 夕方の色から夜の色へ
        const factor = ((currentHour - 16) * 60 + currentMinute) / (3 * 60); // 16時から19時までの進行度
        const gradientColor = interpolateColor(backgroundSettings.eveningColor, backgroundSettings.nightColor, factor);
        return `linear-gradient(to right, ${backgroundSettings.eveningColor}, ${gradientColor}, ${backgroundSettings.nightColor})`;
      } else if (currentHour >= 19 && currentHour < 23) {
        // 夜 (19時〜23時): 夜の色から真夜中の色へ
        const factor = ((currentHour - 19) * 60 + currentMinute) / (4 * 60); // 19時から23時までの進行度
        const gradientColor = interpolateColor(backgroundSettings.nightColor, backgroundSettings.midnightColor, factor);
        return `linear-gradient(to right, ${backgroundSettings.nightColor}, ${gradientColor}, ${backgroundSettings.midnightColor})`;
      } else {
        // 真夜中 (23時〜5時): 真夜中の色から朝の色へ
        const adjustedHour = currentHour < 5 ? currentHour + 24 : currentHour;
        const factor = ((adjustedHour - 23) * 60 + currentMinute) / (6 * 60); // 23時から5時までの進行度
        const gradientColor = interpolateColor(backgroundSettings.midnightColor, backgroundSettings.morningColor, factor);
        return `linear-gradient(to right, ${backgroundSettings.midnightColor}, ${gradientColor}, ${backgroundSettings.morningColor})`;
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
