import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useGetUser } from '@/hooks';
import { fusionKeys } from '@/lib/react-query';
import { apiClient, UserResponse } from '@/utils';

const useDismissOPSuperuserModal = () => {
  const { data: user } = useGetUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: fusionKeys.OPSuperuserModal(user?.username),
    mutationFn: () => apiClient.dismissOPUserModal(),
    onSuccess() {
      queryClient.setQueryData(
        fusionKeys.user(),
        (oldData: UserResponse): UserResponse => ({
          ...oldData,
          notices: {
            ...oldData.notices,
            showIsOpUser: false
          }
        })
      );
    },
    onSettled() {
      queryClient.refetchQueries({ queryKey: fusionKeys.user() });
    }
  });
};

export { useDismissOPSuperuserModal };
