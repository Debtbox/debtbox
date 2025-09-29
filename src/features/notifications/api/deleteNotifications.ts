    import { axios } from '@/lib/axios';
    import { useMutation } from '@tanstack/react-query';
    import type { MutationConfig } from '@/lib/react-query';
    import type { ApiError } from '@/types/ApiError';

    export const deleteNotifications = ({
    ids,
    isDeleteAll,
    }: {
    ids: string[];
    isDeleteAll: boolean;
    }) => {
    return axios.post(`/notification/delete-notifications`, {
        data: {
        ids,
        isDeleteAll,
        },
    });
    };

    type UseDeleteNotificationsOptions = {
    onSuccess: () => Promise<void>;
    onError?: (err: ApiError) => void;
    config?: MutationConfig<typeof deleteNotifications>;
    };

    export const useDeleteNotifications = ({
    onSuccess,
    onError,
    config,
    }: UseDeleteNotificationsOptions) => {
    return useMutation({
        ...config,
        mutationFn: deleteNotifications,
        onSuccess: async () => {
        await onSuccess();
        },
        onError: (err: ApiError) => {
        onError?.(err);
        },
    });
    };
