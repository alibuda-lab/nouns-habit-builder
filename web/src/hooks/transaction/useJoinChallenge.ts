import toast from 'react-hot-toast';

import * as testTokenContract from '@/contracts/testToken';
import * as trackerContract from '@/contracts/tracker';
import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';

/**
 * @description This fill was learned in https://github.com/guildxyz/guild.xyz/blob/3b150b2b9b9c3bf816cf0bc915753df432274399/src/requirements/Payment/components/WithdrawButton/hooks/useWithdraw.ts
 * useShowErrorToast and useToast was removed
 */

const useJoinChallenge = (
  challengeId: bigint,
  batchTx?: boolean,
  approveAmt?: bigint,
  onSuccess?: () => void,
) => {
  const txConfig = batchTx
    ? {
        contracts: [
          {
            address: testTokenContract.address,
            abi: testTokenContract.abi,
            functionName: 'approve',
            args: [trackerContract.address, approveAmt],
          },
          {
            address: trackerContract.address,
            abi: trackerContract.abi,
            functionName: 'join',
            args: [challengeId],
          },
        ],
      }
    : {
        address: trackerContract.address,
        abi: trackerContract.abi,
        functionName: 'join',
        args: [challengeId],
      };

  return useSubmitTransaction(txConfig, {
    batchTx,
    onError: () => {
      toast.error('Error joining the challenge. Please try again');
    },
    onSuccess: () => {
      //In the orginal file they refetch after success refetch();
      toast.success('Joined! Directing to checkIn!');

      onSuccess?.();
    },
  });
};

export default useJoinChallenge;
