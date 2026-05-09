import { getToken } from "@/lib/auth";

const UPLOAD_URL =
  `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://aya-sweets.vercel.app/api"}/upload`;

export async function uploadImage(file: File): Promise<string> {
  const token = getToken();
  const formData = new FormData();

  formData.append("image", file);

  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  const bodyText = await response.text();

  if (!response.ok) {
    throw new Error(bodyText || "تعذر رفع الصورة");
  }

  return bodyText;
}
