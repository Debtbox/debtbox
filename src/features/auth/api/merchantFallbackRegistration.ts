import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type MerchantFallbackSession = {
  sessionId: string;
  status: string;
  email: string;
  expiresAt: string;
  resendAvailableAt: string;
};

type MerchantFallbackResponse<TData> = {
  data: TData;
  message: string;
  success: boolean;
};

export type MerchantFallbackStartPayload = {
  nationalId: string;
  email: string;
  idCardAttachment: File;
  startPath: string;
};

export type MerchantFallbackVerifyOtpPayload = {
  sessionId: string;
  code: string;
  verifyPath: string;
};

export type MerchantFallbackResendOtpPayload = {
  sessionId: string;
  resendPath: string;
};

export type MerchantFallbackVerifyOtpResult = {
  accountId: number;
  status: string;
  accountActive: boolean;
};

const FALLBACK_PREFIX_REGEX = /^\/?v\d+\.\d+\.\d+\/api/;

export const normalizeFallbackPath = (path: string) => {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    const parsedUrl = new URL(path);
    return parsedUrl.pathname;
  }

  const leadingSlashPath = path.startsWith('/') ? path : `/${path}`;
  return leadingSlashPath.replace(FALLBACK_PREFIX_REGEX, '');
};

export const startMerchantFallbackRegistration = async ({
  nationalId,
  email,
  idCardAttachment,
  startPath,
}: MerchantFallbackStartPayload): Promise<
  MerchantFallbackResponse<MerchantFallbackSession>
> => {
  const language = getLanguageFromCookie();
  const formData = new FormData();
  formData.append('nationalId', nationalId);
  formData.append('email', email);
  formData.append('idCardAttachment', idCardAttachment);

  return axios.post(normalizeFallbackPath(startPath), formData, {
    headers: {
      'Accept-Language': language,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const resendMerchantFallbackOtp = ({
  sessionId,
  resendPath,
}: MerchantFallbackResendOtpPayload): Promise<
  MerchantFallbackResponse<MerchantFallbackSession>
> => {
  const language = getLanguageFromCookie();

  return axios.post(
    normalizeFallbackPath(resendPath),
    { sessionId },
    {
      headers: {
        'Accept-Language': language,
      },
    },
  );
};

export const verifyMerchantFallbackOtp = ({
  sessionId,
  code,
  verifyPath,
}: MerchantFallbackVerifyOtpPayload): Promise<
  MerchantFallbackResponse<MerchantFallbackVerifyOtpResult>
> => {
  const language = getLanguageFromCookie();

  return axios.post(
    normalizeFallbackPath(verifyPath),
    { sessionId, code },
    {
      headers: {
        'Accept-Language': language,
      },
    },
  );
};

type UseMerchantFallbackStart = {
  config?: MutationConfig<typeof startMerchantFallbackRegistration>;
  onSuccess: (
    data: MerchantFallbackResponse<MerchantFallbackSession>,
  ) => void;
  onError: (error: ApiError) => void;
};

export const useMerchantFallbackStart = ({
  config,
  onError,
  onSuccess,
}: UseMerchantFallbackStart) =>
  useMutation({
    ...config,
    mutationFn: startMerchantFallbackRegistration,
    onSuccess: (data) => {
      onSuccess(data as MerchantFallbackResponse<MerchantFallbackSession>);
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });

type UseMerchantFallbackVerifyOtp = {
  config?: MutationConfig<typeof verifyMerchantFallbackOtp>;
  onSuccess: (
    data: MerchantFallbackResponse<MerchantFallbackVerifyOtpResult>,
  ) => void;
  onError: (error: ApiError) => void;
};

export const useMerchantFallbackVerifyOtp = ({
  config,
  onError,
  onSuccess,
}: UseMerchantFallbackVerifyOtp) =>
  useMutation({
    ...config,
    mutationFn: verifyMerchantFallbackOtp,
    onSuccess: (data) => {
      onSuccess(data as MerchantFallbackResponse<MerchantFallbackVerifyOtpResult>);
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });

type UseMerchantFallbackResendOtp = {
  config?: MutationConfig<typeof resendMerchantFallbackOtp>;
  onSuccess: (
    data: MerchantFallbackResponse<MerchantFallbackSession>,
  ) => void;
  onError: (error: ApiError) => void;
};

export const useMerchantFallbackResendOtp = ({
  config,
  onError,
  onSuccess,
}: UseMerchantFallbackResendOtp) =>
  useMutation({
    ...config,
    mutationFn: resendMerchantFallbackOtp,
    onSuccess: (data) => {
      onSuccess(data as MerchantFallbackResponse<MerchantFallbackSession>);
    },
    onError: (error: ApiError) => {
      onError(error);
    },
  });
