"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PromptItem = {
  id: string;
  materialName: string;
  materialType: string;
  size: string;
  visualPrompt: string;
  copyPrompt: string;
  negativePrompt: string | null;
};

export function PromptWorkspace({
  campaignId,
  prompts,
  apiConfigured,
}: {
  campaignId: string;
  prompts: PromptItem[];
  apiConfigured: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState(prompts);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function update(id: string, key: keyof PromptItem, value: string) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  }

  async function copy(item: PromptItem) {
    await navigator.clipboard.writeText([item.visualPrompt, item.copyPrompt, item.negativePrompt].join("\n\n"));
    setIsError(false);
    setMessage(`已复制 ${item.materialName} Prompt。`);
  }

  async function generate(promptPackageId: string) {
    if (!apiConfigured) {
      setIsError(true);
      setMessage("尚未配置生图 API。请前往 /settings/image-api 配置后再生成图片。");
    }

    const response = await fetch(`/api/campaigns/${campaignId}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptPackageId }),
    });
    const data = await response.json();
    setIsError(!response.ok);
    setMessage(response.ok ? "已调用真实生图 API，结果已写入结果页。" : data.error);
    router.refresh();
  }

  async function save(item: PromptItem) {
    const response = await fetch(`/api/campaigns/${campaignId}/prompts`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    setIsError(!response.ok);
    setMessage(response.ok ? `${item.materialName} Prompt 已保存。` : "Prompt 保存失败。");
  }

  async function batchGenerate() {
    for (const item of items) {
      await generate(item.id);
      if (!apiConfigured) break;
    }
  }

  return (
    <div className="grid">
      {message && <div className={isError ? "error" : "success"}>{message}</div>}
      <div className="btn-row">
        <button className="primary" type="button" onClick={batchGenerate}>
          批量调用生图 API 生成
        </button>
        <a className="btn" href={`/campaigns/${campaignId}/assets`}>
          进入结果页
        </a>
      </div>
      {items.map((item) => (
        <div className="card grid" key={item.id}>
          <div>
            <h3>
              {item.materialName} <span className="muted">{item.size}</span>
            </h3>
            <p className="muted">物料类型：{item.materialType}</p>
          </div>
          <label>
            视觉设计 Prompt
            <textarea value={item.visualPrompt} onChange={(event) => update(item.id, "visualPrompt", event.target.value)} />
          </label>
          <label>
            文案排版 Prompt
            <textarea value={item.copyPrompt} onChange={(event) => update(item.id, "copyPrompt", event.target.value)} />
          </label>
          <label>
            负面 Prompt
            <textarea
              value={item.negativePrompt || ""}
              onChange={(event) => update(item.id, "negativePrompt", event.target.value)}
            />
          </label>
          <div className="btn-row">
            <button type="button" onClick={() => copy(item)}>
              复制 Prompt
            </button>
            <button type="button" onClick={() => save(item)}>
              保存 Prompt
            </button>
            <button className="primary" type="button" onClick={() => generate(item.id)}>
              调用生图 API 生成
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
