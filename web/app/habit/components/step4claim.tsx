'use client';

import { Challenge } from '@/hooks/useUserChallenges';
import Image from 'next/image';
import { SetStateAction, useEffect } from 'react';
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import trackerContract from '@/contracts/tracker.json';
import toast from 'react-hot-toast';

const img = require('../../../src/imgs/success.png') as string;

export default function Step4Claim({
  challenge,
  setSteps,
}: {
  challenge: Challenge;
  setSteps: React.Dispatch<SetStateAction<number>>;
}) {
  const {
    writeContract,
    data: dataHash,
    error: joinError,
    isPending: joinPending,
  } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: dataHash,
  });

  const onClaimClick = async () => {
    writeContract({
      address: trackerContract.address as `0x${string}`,
      abi: trackerContract.abi,
      functionName: 'withdraw',
      args: [],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Successfully Claimed!');
      // setTimeout(() => {
      //   setSteps(1);
      // }, 2000);
    }
  }, [isSuccess, setSteps]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Img and Description */}
      <div className="col-span-3 flex w-full items-center justify-center">
        <p className="p-6 pt-2 text-xl font-bold">
          {' '}
          Congratulations on Winning the Habit Building Challenge!{' '}
        </p>
      </div>

      <button
        type="button"
        className="bg-yellow mt-4 rounded-lg px-6 py-3 font-bold text-white hover:bg-yellow-600"
        onClick={onClaimClick}
      >
        Claim Rewards
      </button>

      <div className="p-4 text-xs">Get back {challenge.stake} ETH and 1 NFT Badge</div>

      <Image src={img} width="440" height="440" alt="Step 4 Image" className="mb-3 object-cover" />
    </div>
  );
}
