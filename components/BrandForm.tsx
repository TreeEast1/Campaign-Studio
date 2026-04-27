"use client";

import { useState } from "react";

type Brand = {
  brandName: string;
  primaryColor: string;
  secondaryColor: string | null;
  styleKeywords: string;
  toneKeywords: string;
  layoutHabits: string;
  bannedClaims: string;
};

function parse(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.join("\n") : value;
  } catch {
    return value;
  }
}

function lines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function BrandForm({ initial }: { initial: Brand }) {
  const [brandName, setBrandName] = useState(initial.brandName);
  const [primaryColor, setPrimaryColor] = useState(initial.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(initial.secondaryColor || "");
  const [styleKeywords, setStyleKeywords] = useState(parse(initial.styleKeywords));
  const [toneKeywords, setToneKeywords] = useState(parse(initial.toneKeywords));
  const [layoutHabits, setLayoutHabits] = useState(parse(initial.layoutHabits));
  const [bannedClaims, setBannedClaims] = useState(parse(initial.bannedClaims));
  const [message, setMessage] = useState("");

  async function save() {
    const response = await fetch("/api/brand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandName,
        primaryColor,
        secondaryColor,
        styleKeywords: lines(styleKeywords),
        toneKeywords: lines(toneKeywords),
        layoutHabits: lines(layoutHabits),
        bannedClaims: lines(bannedClaims),
      }),
    });
    setMessage(response.ok ? "品牌配置已保存。" : "品牌配置保存失败。");
  }

  return (
    <div className="grid">
      {message && <div className="success">{message}</div>}
      <div className="grid grid-2">
        <label>
          品牌名称
          <input value={brandName} onChange={(event) => setBrandName(event.target.value)} />
        </label>
        <label>
          主色
          <input value={primaryColor} onChange={(event) => setPrimaryColor(event.target.value)} />
        </label>
      </div>
      <label>
        辅色
        <input value={secondaryColor} onChange={(event) => setSecondaryColor(event.target.value)} />
      </label>
      <label>
        风格关键词
        <textarea value={styleKeywords} onChange={(event) => setStyleKeywords(event.target.value)} />
      </label>
      <label>
        语气关键词
        <textarea value={toneKeywords} onChange={(event) => setToneKeywords(event.target.value)} />
      </label>
      <label>
        版式习惯
        <textarea value={layoutHabits} onChange={(event) => setLayoutHabits(event.target.value)} />
      </label>
      <label>
        禁用宣称
        <textarea value={bannedClaims} onChange={(event) => setBannedClaims(event.target.value)} />
      </label>
      <button className="primary" type="button" onClick={save}>
        保存品牌配置
      </button>
    </div>
  );
}
