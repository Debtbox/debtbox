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

/** Merchant registration: ID document + nationalId (per registration API). */
export type MerchantFallbackRegistrationStartPayload = {
  variant: 'registration';
  startPath: string;
  nationalId: string;
  email: string;
  idCardAttachment: File;
};

/** Merchant password reset: email only, no attachment; uses commercialRegister in form data. */
export type MerchantFallbackPasswordResetStartPayload = {
  variant: 'password_reset';
  startPath: string;
  commercialRegister: string;
  email: string;
};

export type MerchantFallbackStartPayload =
  | MerchantFallbackRegistrationStartPayload
  | MerchantFallbackPasswordResetStartPayload;

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
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
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

export const startMerchantFallbackRegistration = async (
  payload: MerchantFallbackStartPayload,
): Promise<MerchantFallbackResponse<MerchantFallbackSession>> => {
  const language = getLanguageFromCookie();
  const formData = new FormData();

  if (payload.variant === 'password_reset') {
    formData.append('commercialRegister', payload.commercialRegister);
    formData.append('email', payload.email);
    formData.append('isForgetPassword', 'true');
  } else {
    formData.append('nationalId', payload.nationalId);
    formData.append('email', payload.email);
    formData.append('idCardAttachment', payload.idCardAttachment);
  }

  return axios.post(normalizeFallbackPath(payload.startPath), formData, {
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
