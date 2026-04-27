import type { GenerateImageInput, GenerateImageResult, ImageApiConfig } from "@/services/image/types";

export async function generateWithReplicate(
  _input: GenerateImageInput,
  _config: ImageApiConfig,
): Promise<GenerateImageResult> {
  throw new Error("Replicate Provider 已预留接口，MVP 暂未启用真实调用。请接入模型版本后再生成。");
}
