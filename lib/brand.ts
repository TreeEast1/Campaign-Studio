import { defaultBrandProfile } from "./defaults";
import { prisma } from "./prisma";

export async function getBrandProfile() {
  const existing = await prisma.brandProfile.findFirst({ orderBy: { updatedAt: "desc" } });
  if (existing) return existing;

  return prisma.brandProfile.create({
    data: {
      brandName: defaultBrandProfile.brandName,
      primaryColor: defaultBrandProfile.primaryColor,
      secondaryColor: defaultBrandProfile.secondaryColor,
      styleKeywords: JSON.stringify(defaultBrandProfile.styleKeywords),
      toneKeywords: JSON.stringify(defaultBrandProfile.toneKeywords),
      layoutHabits: JSON.stringify(defaultBrandProfile.layoutHabits),
      bannedClaims: JSON.stringify(defaultBrandProfile.bannedClaims),
    },
  });
}
