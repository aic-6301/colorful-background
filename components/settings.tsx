import React, { useState, useEffect } from 'react';

type BackgroundSettings = {
  mode: string;
  morningColor: string;
  middayColor: string;
  nightColor: string;
  midnightColor: string;
  singleColor: string;
  gradientColors: string[];
};

type SettingsProps = {
  settings: BackgroundSettings;
  onClose: () => void;
  onApply: (settings: BackgroundSettings) => void;
};

const Settings: React.FC<SettingsProps> = ({ settings, onClose, onApply }) => {
  const [mode, setMode] = useState(settings.mode);
  const [morningColor, setMorningColor] = useState(settings.morningColor);
  const [middayColor, setMiddayColor] = useState(settings.middayColor);
  const [nightColor, setNightColor] = useState(settings.nightColor);
  const [midnightColor, setMidnightColor] = useState(settings.midnightColor);
  const [singleColor, setSingleColor] = useState(settings.singleColor);
  const [gradientColors, setGradientColors] = useState(settings.gradientColors);

  // 設定が変更されたときに状態を更新
  useEffect(() => {
    setMode(settings.mode);
    setMorningColor(settings.morningColor);
    setMiddayColor(settings.middayColor);
    setNightColor(settings.nightColor);
    setMidnightColor(settings.midnightColor);
    setSingleColor(settings.singleColor);
    setGradientColors(settings.gradientColors);
  }, [settings]);

  // 設定を保存して適用する
  const handleSave = () => {
    const newSettings: BackgroundSettings = {
      mode,
      morningColor,
      middayColor,
      nightColor,
      midnightColor,
      singleColor,
      gradientColors,
    };
    onApply(newSettings);
    onClose();
  };

  // 背景をクリックしても設定が閉じないようにする
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center text-black z-50" onClick={handleContainerClick}>
      <div className="bg-white p-6 rounded-lg w-80 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">背景設定</h2>
        
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            モード:
            <select
              className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="time-sync">時間同期</option>
              <option value="single-color">単色</option>
              <option value="gradient">単色グラデーション</option>
            </select>
          </label>
        </div>
        
        {mode === 'time-sync' && (
          <div className="mb-4 space-y-3">
            <h3 className="font-medium">時間ごとの色設定</h3>
            
            <div className="p-3 border border-gray-200 rounded">
              <label className="block mb-2">
                <span className="font-medium">朝の色 (5時〜12時):</span>
                <div className="flex items-center mt-1">
                  <input
                    type="color"
                    className="w-12 h-8 mr-2"
                    value={morningColor}
                    onChange={(e) => setMorningColor(e.target.value)}
                  />
                  <span className="text-sm">{morningColor}</span>
                </div>
              </label>
            </div>
            
            <div className="p-3 border border-gray-200 rounded">
              <label className="block mb-2">
                <span className="font-medium">昼間の色 (12時〜18時):</span>
                <div className="flex items-center mt-1">
                  <input
                    type="color"
                    className="w-12 h-8 mr-2"
                    value={middayColor}
                    onChange={(e) => setMiddayColor(e.target.value)}
                  />
                  <span className="text-sm">{middayColor}</span>
                </div>
              </label>
            </div>
            
            <div className="p-3 border border-gray-200 rounded">
              <label className="block mb-2">
                <span className="font-medium">夜の色 (18時〜23時):</span>
                <div className="flex items-center mt-1">
                  <input
                    type="color"
                    className="w-12 h-8 mr-2"
                    value={nightColor}
                    onChange={(e) => setNightColor(e.target.value)}
                  />
                  <span className="text-sm">{nightColor}</span>
                </div>
              </label>
            </div>
            
            <div className="p-3 border border-gray-200 rounded">
              <label className="block">
                <span className="font-medium">真夜中の色 (23時〜5時):</span>
                <div className="flex items-center mt-1">
                  <input
                    type="color"
                    className="w-12 h-8 mr-2"
                    value={midnightColor}
                    onChange={(e) => setMidnightColor(e.target.value)}
                  />
                  <span className="text-sm">{midnightColor}</span>
                </div>
              </label>
            </div>
          </div>
        )}
        
        {mode === 'single-color' && (
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              単色:
              <div className="flex items-center mt-1">
                <input
                  type="color"
                  className="w-12 h-8 mr-2"
                  value={singleColor}
                  onChange={(e) => setSingleColor(e.target.value)}
                />
                <span className="text-sm">{singleColor}</span>
              </div>
            </label>
          </div>
        )}
        
        {mode === 'gradient' && (
          <div className="mb-4 space-y-3">
            <h3 className="font-medium">グラデーション設定</h3>
            
            <div className="p-3 border border-gray-200 rounded">
              <label className="block mb-2">
                <span className="font-medium">開始色:</span>
                <div className="flex items-center mt-1">
                  <input
                    type="color"
                    className="w-12 h-8 mr-2"
                    value={gradientColors[0]}
                    onChange={(e) => setGradientColors([e.target.value, gradientColors[1]])}
                  />
                  <span className="text-sm">{gradientColors[0]}</span>
                </div>
              </label>
            </div>
            
            <div className="p-3 border border-gray-200 rounded">
              <label className="block">
                <span className="font-medium">終了色:</span>
                <div className="flex items-center mt-1">
                  <input
                    type="color"
                    className="w-12 h-8 mr-2"
                    value={gradientColors[1]}
                    onChange={(e) => setGradientColors([gradientColors[0], e.target.value])}
                  />
                  <span className="text-sm">{gradientColors[1]}</span>
                </div>
              </label>
            </div>
            
            <div className="h-12 rounded overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(to right, ${gradientColors[0]}, ${gradientColors[1]})`
                }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            onClick={handleSave}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;