import { fetchFromAuthApi } from "@/services/fetch-api";

export enum ReportType {
  SPAM = "SPAM",
  INAPPROPRIATE_CONTENT = "INAPPROPRIATE_CONTENT",
  HARASSMENT = "HARASSMENT",
  HATE_SPEECH = "HATE_SPEECH",
  FALSE_INFORMATION = "FALSE_INFORMATION",
  OFFENSIVE_LANGUAGE = "OFFENSIVE_LANGUAGE",
  OTHER = "OTHER",
}

interface reportReviewProps {
  reviewId: number;
  content: string;
  reportType: ReportType;
}

// 리뷰 신고
export async function reportReview({
  reviewId,
  content,
  reportType,
}: reportReviewProps) {
  return await fetchFromAuthApi(
    `/api/reports/${reviewId}`,
    { content, reportType },
    "POST"
  );
}

// 신고 리뷰 조회
export async function checkReports() {
  return await fetchFromAuthApi(`/api/reports`, null, "GET");
}
