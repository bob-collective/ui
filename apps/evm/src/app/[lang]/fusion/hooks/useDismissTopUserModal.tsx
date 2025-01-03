import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useGetUser } from '@/hooks';
import { fusionKeys } from '@/lib/react-query';
import { apiClient, UserResponse } from '@/utils';

const useDismissTopUserModal = () => {
  const { data: user } = useGetUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: fusionKeys.topUserModal(user?.username),
    mutationFn: () => apiClient.dismissTopUserModal(),
    onSuccess() {
      queryClient.setQueryData(
        fusionKeys.user(),
        (oldData: UserResponse): UserResponse => ({
          ...oldData,
          notices: {
            ...oldData.notices,
            showIsFusionTopUser: false
          }
        })
      );
    },
    onSettled() {
      queryClient.refetchQueries({ queryKey: fusionKeys.user() });
    }
  });
};

export { useDismissTopUserModal };
