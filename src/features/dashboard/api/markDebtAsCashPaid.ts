import { axios } from '@/lib/axios';
import type { MutationConfig } from '@/lib/react-query';
import type { ApiError } from '@/types/ApiError';
import { useMutation } from '@tanstack/react-query';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';

export type MarkDebtAsCashPaidCredentialsDTO = {
    debtId: string;
};

export const markDebtAsCashPaid = (data: MarkDebtAsCashPaidCredentialsDTO) => {
    const language = getLanguageFromCookie();
    return axios.get(`/merchant/mark-debt-as-cash-paid/${data.debtId}`, {
        headers: {
            'Accept-Language': language,
        },
    });
};

type UseMarkDebtAsCashPaid = {
    config?: MutationConfig<typeof markDebtAsCashPaid>;
    onSuccess: () => void;
    onError: (error: ApiError) => void;
};

export const useMarkDebtAsCashPaid = ({
    config,
    onError,
    onSuccess,
}: UseMarkDebtAsCashPaid) => {
    return useMutation({
        ...config,
        mutationFn: markDebtAsCashPaid,
        onSuccess: () => {
            onSuccess();
        },
        onError: (error: ApiError) => {
            onError(error);
        },
    });
};
