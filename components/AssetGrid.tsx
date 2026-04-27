"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Asset = {
  id: string;
  promptPackageId: string | null;
  materialName: string;
  materialType: string;
  size: string;
  imageUrl: string | null;
  status: string;
  errorMessage: string | null;
  qualityReport: string | null;
  isFinal: boolean;
  promptPackage?: {
    visualPrompt: string;
    copyPrompt: string;
    negativePrompt: string | null;
  } | null;
};

export function AssetGrid({ campaignId, assets }: { campaignId: string; assets: Asset[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function regenerate(asset: Asset) {
    if (!asset.promptPackageId) return;
    const response = await fetch(`/api/campaigns/${campaignId}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptPackageId: asset.promptPackageId }),
    });
    const data = await response.json();
    setIsError(!response.ok);
    setMessage(response.ok ? "已重新调用真实生图 API。" : data.error);
    router.refresh();
  }

  async function copyPrompt(asset: Asset) {
    const prompt = asset.promptPackage
      ? [asset.promptPackage.visualPrompt, asset.promptPackage.copyPrompt, asset.promptPackage.negativePrompt].join("\n\n")
      : "";
    await navigator.clipboard.writeText(prompt);
    setIsError(false);
    setMessage("Prompt 已复制。");
  }

  async function markFinal(asset: Asset) {
    const response = await fetch(`/api/assets/${asset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFinal: !asset.isFinal }),
    });
    setIsError(!response.ok);
    setMessage(response.ok ? "最终版状态已更新。" : "最终版状态更新失败。");
    router.refresh();
  }

  return (
    <div className="grid">
      {message && <div className={isError ? "error" : "success"}>{message}</div>}
      <div className="grid grid-3">
        {assets.map((asset) => (
          <div className="card grid" key={asset.id}>
            <div className="asset-preview">
              {asset.status === "success" && asset.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset.imageUrl} alt={asset.materialName} />
              ) : (
                <div>
                  <strong>待生成</strong>
                  <p>API 未配置或尚未成功生成，当前仅展示物料预览占位。</p>
                </div>
              )}
            </div>
            <div>
              <h3>{asset.materialName}</h3>
              <p className="muted">{asset.size}</p>
              <p>生成状态：{asset.status}</p>
              {asset.errorMessage && <div className="error">{asset.errorMessage}</div>}
              {asset.qualityReport && <p className="muted">{asset.qualityReport}</p>}
            </div>
            <details>
              <summary>Prompt 折叠预览</summary>
              <div className="pre">
                {asset.promptPackage
                  ? [asset.promptPackage.visualPrompt, asset.promptPackage.copyPrompt, asset.promptPackage.negativePrompt].join("\n\n")
                  : "无 Prompt"}
              </div>
            </details>
            <div className="btn-row">
              {asset.status === "success" && asset.imageUrl ? (
                <a className="btn" href={asset.imageUrl} download>
                  下载
                </a>
              ) : (
                <button type="button" disabled>
                  下载
                </button>
              )}
              <button type="button" onClick={() => regenerate(asset)}>
                重新调用 API
              </button>
              <button type="button" onClick={() => copyPrompt(asset)}>
                复制 Prompt
              </button>
              <button type="button" disabled={asset.status !== "success"} onClick={() => markFinal(asset)}>
                {asset.isFinal ? "已标记最终版" : "标记最终版"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
