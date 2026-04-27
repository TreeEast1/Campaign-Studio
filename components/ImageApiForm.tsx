"use client";

import { useState } from "react";

type Props = {
  initial: {
    provider: string;
    model?: string;
    defaultSize?: string;
    hasApiKey: boolean;
    hasBaseUrl?: boolean;
  };
};

export function ImageApiForm({ initial }: Props) {
  const [provider, setProvider] = useState(initial.provider || "openai");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState(initial.model || "gpt-image-1");
  const [defaultSize, setDefaultSize] = useState(initial.defaultSize || "1024x1536");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function save() {
    setMessage("");
    const response = await fetch("/api/settings/image-api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, apiKey, baseUrl, model, defaultSize }),
    });
    setIsError(!response.ok);
    setMessage(response.ok ? "配置已保存。API Key 不会在页面中明文回显。" : "保存失败。");
  }

  async function test() {
    const response = await fetch("/api/settings/image-api/test", { method: "POST" });
    const data = await response.json();
    setIsError(!response.ok);
    setMessage(data.message || "测试完成。");
  }

  return (
    <div className="grid">
      {message && <div className={isError ? "error" : "success"}>{message}</div>}
      <div className="warning">
        为了调用真实生图能力，请先配置生图 API。MVP 支持先生成宣传 Brief 和 Prompt；未配置 API
        时，图片生成会停留在待生成状态。请勿将 API Key 提交到 GitHub。
      </div>
      <label>
        Provider
        <select value={provider} onChange={(event) => setProvider(event.target.value)}>
          <option value="openai">OpenAI Images API</option>
          <option value="replicate">Replicate</option>
          <option value="custom">自定义 HTTP API</option>
        </select>
      </label>
      <label>
        API Key
        <input
          type="password"
          placeholder={initial.hasApiKey ? "已配置，留空会改为仅使用环境变量或空值" : "建议使用 .env.local 配置"}
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
        />
      </label>
      <div className="grid grid-2">
        <label>
          模型名称
          <input value={model} onChange={(event) => setModel(event.target.value)} />
        </label>
        <label>
          默认尺寸
          <input value={defaultSize} onChange={(event) => setDefaultSize(event.target.value)} />
        </label>
      </div>
      <label>
        Base URL
        <input placeholder="OpenAI 可留空；自定义 API 必填" value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} />
      </label>
      <div className="btn-row">
        <button className="primary" type="button" onClick={save}>
          保存配置
        </button>
        <button type="button" onClick={test}>
          测试连接
        </button>
        <a className="btn" href="/">
          返回工作台
        </a>
      </div>
    </div>
  );
}
