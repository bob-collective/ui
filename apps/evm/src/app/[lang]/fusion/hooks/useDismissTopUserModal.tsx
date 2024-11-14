import { useMutation } from '@gobob/react-query';

import { useGetUser } from '@/hooks';
import { fusionKeys, queryClient } from '@/lib/react-query';
import { apiClient, UserResponse } from '@/utils';

const useDismissTopUserModal = () => {
  const { data: user } = useGetUser();

  return useMutation({
    mutationKey: fusionKeys.topUserModal(user?.username),
    mutationFn: () => apiClient.dismissTopUserModal(),
    onSuccess() {
      queryClient.setQueryData(
        ['user'],
        (oldData: UserResponse): UserResponse => ({
          ...oldData,
          notices: {
            showIsFusionTopUser: false
          }
        })
      );
    },
    onSettled() {
      queryClient.refetchQueries({ queryKey: ['user'] });
    }
  });
};

export { useDismissTopUserModal };
