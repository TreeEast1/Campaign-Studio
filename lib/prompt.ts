import type { BrandProfile, Campaign } from "@prisma/client";
import type { CampaignBrief } from "./brief";
import { getMaterial } from "./materials";

function parseList(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.join("、") : value;
  } catch {
    return value;
  }
}

export function buildPromptPackage(campaign: Campaign, brief: CampaignBrief, brand: BrandProfile, materialType: string) {
  const material = getMaterial(materialType);
  if (!material) {
    throw new Error(`未知物料类型：${materialType}`);
  }

  const brandStyle = [
    `Brand name: ${brand.brandName}`,
    `Primary color: ${brand.primaryColor}`,
    `Secondary color: ${brand.secondaryColor || "not specified"}`,
    `Style: ${parseList(brand.styleKeywords)}`,
    `Tone: ${parseList(brand.toneKeywords)}`,
    `Layout habits: ${parseList(brand.layoutHabits)}`,
  ].join("\n");

  const textContent = [
    `主标题：${brief.headline}`,
    `副标题：${brief.subheadline}`,
    `核心卖点：${brief.keyPoints.map((item) => `\n- ${item}`).join("")}`,
    `价格：${brief.priceBlock}`,
    `时间：${brief.scheduleBlock}`,
    `流程：${brief.processBlock}`,
    `CTA：${brief.cta}`,
  ].join("\n");

  const negativePrompt = [
    "Avoid cluttered layout, cheap sales style, exaggerated claims, messy typography, wrong Chinese characters, wrong prices, distorted QR code.",
    `Do not include banned claims: ${parseList(brand.bannedClaims)}.`,
  ].join(" ");

  return {
    materialType,
    materialName: material.name,
    size: material.size,
    visualPrompt: [
      "Role / Design Goal:",
      "You are designing a premium Chinese education marketing visual for an internal campaign workflow.",
      "",
      "Brand Style:",
      brandStyle,
      "",
      "Material Type:",
      `Type: ${material.name}`,
      `Size: ${material.size}`,
      `Scenario: ${material.scenario}`,
      "",
      "Layout Requirements:",
      material.layout,
      "",
      "Text Content:",
      textContent,
      "",
      "Visual Requirements:",
      `Use ${campaign.stylePreference || parseList(brand.styleKeywords)} visual direction. Keep whitespace, hierarchy, professional education consulting feeling, and reserve a clear QR code placeholder where appropriate.`,
      "",
      "Chinese Typography Requirements:",
      "Chinese text must be clear, readable, and accurate. Do not distort numbers, dates, prices, course hours, or school names. Avoid fake unreadable text.",
      "",
      "Compliance and Risk Requirements:",
      brief.riskNotes.join(" "),
    ].join("\n"),
    copyPrompt: [
      "Copywriting and layout prompt:",
      "Use short Chinese poster copy, not long paragraphs. Prioritize headline, 3-5 key points, price/schedule block, and CTA.",
      `For ${material.name}, adapt content density to the scenario: ${material.scenario}.`,
      "Split complex information into visual modules instead of placing all source text on one image.",
    ].join("\n"),
    negativePrompt,
  };
}
