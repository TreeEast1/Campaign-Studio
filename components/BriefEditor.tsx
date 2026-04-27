"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CampaignBrief } from "@/lib/brief";
import { MATERIALS } from "@/lib/materials";

export function BriefEditor({ campaignId, initialBrief }: { campaignId: string; initialBrief: CampaignBrief }) {
  const router = useRouter();
  const [brief, setBrief] = useState(initialBrief);
  const [message, setMessage] = useState("");

  function update<K extends keyof CampaignBrief>(key: K, value: CampaignBrief[K]) {
    setBrief((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    const response = await fetch(`/api/campaigns/${campaignId}/brief`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brief }),
    });
    setMessage(response.ok ? "Brief 已保存。" : "保存失败。");
  }

  async function next() {
    await save();
    await fetch(`/api/campaigns/${campaignId}/prompts`, { method: "POST" });
    router.push(`/campaigns/${campaignId}/prompts`);
  }

  return (
    <div className="grid">
      {message && <div className="success">{message}</div>}
      <div className="grid grid-2">
        <label>
          主标题
          <input value={brief.headline} onChange={(event) => update("headline", event.target.value)} />
        </label>
        <label>
          副标题
          <input value={brief.subheadline} onChange={(event) => update("subheadline", event.target.value)} />
        </label>
      </div>
      <label>
        核心卖点
        <textarea
          value={brief.keyPoints.join("\n")}
          onChange={(event) => update("keyPoints", event.target.value.split("\n").filter(Boolean))}
        />
      </label>
      <div className="grid grid-2">
        <label>
          价格区
          <textarea value={brief.priceBlock} onChange={(event) => update("priceBlock", event.target.value)} />
        </label>
        <label>
          时间安排
          <textarea value={brief.scheduleBlock} onChange={(event) => update("scheduleBlock", event.target.value)} />
        </label>
      </div>
      <label>
        流程说明
        <textarea value={brief.processBlock} onChange={(event) => update("processBlock", event.target.value)} />
      </label>
      <label>
        CTA
        <input value={brief.cta} onChange={(event) => update("cta", event.target.value)} />
      </label>
      <label>
        风险表达提醒
        <textarea
          value={brief.riskNotes.join("\n")}
          onChange={(event) => update("riskNotes", event.target.value.split("\n").filter(Boolean))}
        />
      </label>
      <div>
        <h3>适合生成的物料建议</h3>
        <div className="checkbox-grid">
          {MATERIALS.map((item) => (
            <label className="check" key={item.type}>
              <input
                checked={brief.recommendedMaterials.includes(item.type)}
                type="checkbox"
                onChange={(event) => {
                  update(
                    "recommendedMaterials",
                    event.target.checked
                      ? [...brief.recommendedMaterials, item.type]
                      : brief.recommendedMaterials.filter((value) => value !== item.type),
                  );
                }}
              />
              {item.name}
            </label>
          ))}
        </div>
      </div>
      <div className="warning">不要直接把用户长文本塞进图片。复杂信息应拆成课程安排图、价格说明图、活动流程图等不同物料。</div>
      <div className="btn-row">
        <a className="btn" href="/campaigns/new">
          返回修改产品信息
        </a>
        <button type="button" onClick={save}>
          保存修改
        </button>
        <button className="primary" type="button" onClick={next}>
          进入 Prompt 生成
        </button>
      </div>
    </div>
  );
}
