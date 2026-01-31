import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import type { UserDto } from '@/types/UserDto';

export type CheckMerchantSignupStatusCredentialsDTO = {
    state: string;
};

export type CheckMerchantSignupStatusResponse = {
    data: UserDto;
    message: string;
    success: boolean;
};

export const checkMerchantSignupStatus = (data: CheckMerchantSignupStatusCredentialsDTO): Promise<CheckMerchantSignupStatusResponse> => {
    return axios.post(`/auth/merchant/check-merchant-signup-status`, {
        state: data.state,
    });
};

type UseCheckMerchantSignupStatus = {
    config?: MutationConfig<typeof checkMerchantSignupStatus>;
    onSuccess: (data: CheckMerchantSignupStatusResponse) => void;
    onError: (error: ApiError) => void;
};

export const useCheckMerchantSignupStatus = ({ config, onError, onSuccess }: UseCheckMerchantSignupStatus) => {
    return useMutation({
        ...config,
        mutationFn: checkMerchantSignupStatus,
        onSuccess: (data) => {
            onSuccess(data as CheckMerchantSignupStatusResponse);
        },
        onError: (error: ApiError) => {
            onError(error);
        },
    });
};
