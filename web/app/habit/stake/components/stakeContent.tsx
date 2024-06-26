/* eslint-disable react-perf/jsx-no-new-function-as-prop */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { useCapabilities } from 'wagmi/experimental';
import { Input } from '@nextui-org/input';

import { EXPECTED_CHAIN } from '@/constants';
import * as testTokenContract from '@/contracts/testToken';
import * as trackerContract from '@/contracts/tracker';
import useChallenge from '@/hooks/useChallenge';
import useMintERC20 from '@/hooks/transaction/useMintERC20';
import useApproveERC20 from '@/hooks/transaction/useApproveERC20';
import useJoinChallenge from '@/hooks/transaction/useJoinChallenge';
import { useReadErc20Allowance } from '@/hooks/ERC20Hooks';
import { getCheckInDescription } from '@/utils/challenges';
import { ChallengeBoxFilled } from 'app/habit/components/ChallengeBox';
import Loading from 'app/habit/components/Loading';
import JoinedPopup from './JoinedPopup';
import InsufficientBalancePopup from './InsufficientBalancePopup';
import DepositPopup from './DepositPopup';
import { Button } from '@nextui-org/button';
import useUserJoined from '@/hooks/useUserJoined';
import Link from 'next/link';

export default function StakeChallenge() {
  const { push } = useRouter();

  const { challengeId } = useParams<{ challengeId: string }>();

  const searchParams = useSearchParams();
  const attachedCode = searchParams.get('code') ?? '';

  const [inputAccessCode, setInputAccessCode] = useState<string>(attachedCode);

  const { challenge, loading: loadingChallenge } = useChallenge(Number(challengeId));

  const { address: smartWallet } = useAccount();
  const { joined } = useUserJoined(smartWallet, BigInt(challengeId));

  const hasAccess = useMemo(
    () => challenge?.public === true || challenge?.accessCode === inputAccessCode || joined,
    [challenge?.public, challenge?.accessCode, inputAccessCode, joined],
  );

  const { data: capabilities } = useCapabilities();
  const currentChainSupportBatchTx =
    capabilities?.[EXPECTED_CHAIN.id.toString() as unknown as keyof typeof capabilities]
      ?.atomicBatch.supported;

  const { data: testTokenBalance } = useBalance({
    address: smartWallet,
    token: testTokenContract.address,
  });

  const hasEnoughBalance =
    challenge &&
    testTokenBalance &&
    Number(testTokenBalance.value.toString()) >= Number(challenge.stake.toString());

  const { data: allowance } = useReadErc20Allowance({
    address: testTokenContract.address,
    args: [smartWallet as `0x${string}`, trackerContract.address],
  });

  const hasEnoughAllowance = allowance ? challenge && allowance >= challenge.stake : false;

  const [isCheckinPopupOpen, setIsCheckinPopupOpen] = useState(false);
  const [isInsufficientBalancePopupOpen, setIsInsufficientBalancePopupOpen] = useState(false);
  const [isDepositPopupOpen, setIsDepositPopupOpen] = useState(false);

  const handleOpenCheckinPopup = () => setIsCheckinPopupOpen(true);
  const handleCloseCheckinPopup = () => setIsCheckinPopupOpen(false);
  const handleOpenInsufficientBalancePopup = () => setIsInsufficientBalancePopupOpen(true);
  const handleCloseInsufficientBalancePopup = () => setIsInsufficientBalancePopupOpen(false);
  const handleOpenDepositPopup = () => setIsDepositPopupOpen(true);
  const handleCloseDepositPopup = () => setIsDepositPopupOpen(false);
  const handleCheckInPageClick = () => {
    // Logic to navigate to the check-in page
    push(`/habit/checkin/${challengeId}`);
  };

  const {
    onSubmitTransaction: onMintTx,
    isPreparing: isMintPreparing,
    isLoading: isMintLoading,
  } = useMintERC20(
    testTokenContract.address as `0x${string}`,
    smartWallet as `0x${string}`,
    500_000000n, // mint 500 USDC
  );

  const onMintTestTokenClick = async () => {
    if (!challenge) return;
    onMintTx();
  };

  const {
    onSubmitTransaction: onApproveTx,
    isPreparing: isApprovePreparing,
    isLoading: isApproveLoading,
  } = useApproveERC20(
    testTokenContract.address as `0x${string}`,
    trackerContract.address,
    challenge?.stake ?? BigInt(0),
  );

  const onApproveTestTokenClick = async () => {
    if (!challenge) return;
    onApproveTx();
  };

  const {
    onSubmitTransaction: onJoinTx,
    isPreparing: isJoinPreparing,
    isLoading: isJoinLoading,
  } = useJoinChallenge(
    BigInt(challenge?.id ?? 0),
    currentChainSupportBatchTx,
    challenge?.stake ?? BigInt(0),
    () => {
      handleOpenCheckinPopup(); // trigger pop up window
    },
  );

  const onJoinButtonClick = () => {
    if (!challenge) {
      toast.error('Loading Challenge');
      return;
    }
    if (hasEnoughBalance) {
      onJoinTx();
      return;
    }
    handleOpenInsufficientBalancePopup();
  };

  return (
    <main className="flex h-screen flex-col items-center px-4 text-center">
      <div className="flex max-w-96 flex-col items-center justify-center">
        <p className="pb-4 text-center font-londrina text-xl font-bold">
          {' '}
          Stake and Commit to It!{' '}
        </p>

        {challenge && (
          <>
            <ChallengeBoxFilled challenge={challenge} />

            {hasAccess && (
              <>
                {/* goal description */}
                <div className="w-full justify-start p-6 py-2 text-start">
                  <div className="pb-2 text-xl font-bold text-dark"> Goal </div>
                  <div className="text-sm text-primary"> {challenge.description} </div>
                </div>

                {/* checkIn description */}
                <div className="w-full justify-start p-6 py-2 text-start">
                  <div className="pb-2 text-xl font-bold text-dark"> Check In </div>
                  <div className="text-sm text-primary">
                    {' '}
                    {getCheckInDescription(challenge.type)}{' '}
                  </div>
                </div>

                <div className="w-full justify-start p-6 py-2 text-start">
                  <div className="pb-2 text-xl font-bold text-dark"> Stake Amount </div>
                  <div className="flex text-sm text-primary">
                    {' '}
                    {`${formatUnits(challenge.stake, 6)} USDC`}{' '}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* if no access, show text + button for access code */}
        {challenge && !hasAccess && (
          <div className="w-full justify-center p-6 py-2 text-center">
            <div className="pb-2 text-xl font-bold text-dark"> Private Challenge </div>
            <div className="pt-4 text-sm text-primary">
              This is a private challenge! Please enter the access code to join.
            </div>
            <Input
              type="text"
              placeholder="Access Code"
              className="my-4 w-full py-4 text-center"
              description="Example Code: 130M8L"
              value={inputAccessCode}
              onChange={(e) => setInputAccessCode(e.target.value)}
            />
          </div>
        )}

        {/**
         * Disable button when challenge hasn't selected or when not enough balance
         * If support batch tx -> Join with Batch Tx (Approve -> Join)
         * If doesn't support batch tx, has enough balance, has enough allowance -> Stake Tx
         * If doesn't support batch tx, has enough balance, not enough allowance -> Approve Tx
         */}
        {/* //TODO @ryanycw: There is some error after minting test token */}
        {hasAccess && !joined && challenge && (
          <Button
            color="primary"
            type="button"
            className="mt-14 min-h-12 w-3/4 max-w-56 px-6 py-3 font-bold"
            onClick={
              currentChainSupportBatchTx || hasEnoughAllowance
                ? onJoinButtonClick
                : onApproveTestTokenClick
            }
            isDisabled={
              isJoinPreparing ||
              isMintPreparing ||
              isApprovePreparing ||
              isJoinLoading ||
              isMintLoading ||
              isApproveLoading
            }
            isLoading={
              isJoinPreparing ||
              isMintPreparing ||
              isApprovePreparing ||
              isJoinLoading ||
              isMintLoading ||
              isApproveLoading
            }
          >
            {/**
             * Display only when challenge is selected
             * If doesn't have enough balance -> Display Approve
             * If has enough allowance -> Display Stake
             */}
            {hasEnoughAllowance || currentChainSupportBatchTx ? `Join This Challenge` : 'Approve'}
          </Button>
        )}

        {joined && (
          <Button
            type="button"
            color="default"
            className="mt-14 min-h-12 w-3/4 max-w-56"
            onClick={handleCheckInPageClick}
            aria-description="You already joined the challenge"
          >
            Check In
          </Button>
        )}

        {isCheckinPopupOpen && hasEnoughBalance && (
          <JoinedPopup
            challenge={challenge}
            onClose={handleCloseCheckinPopup}
            onCheckInPageClick={handleCheckInPageClick}
          />
        )}
        {isInsufficientBalancePopupOpen && !hasEnoughBalance && (
          <InsufficientBalancePopup
            onClose={handleCloseInsufficientBalancePopup}
            onDepositClick={handleOpenDepositPopup}
          />
        )}

        {isDepositPopupOpen && <DepositPopup onClose={handleCloseDepositPopup} />}

        {loadingChallenge ? (
          <Loading />
        ) : (
          challenge === null && (
            <div className="p-4 text-sm">
              <p>Challenge not found</p>
              <Link href="/" type="button">
                <Button color="default" className="mt-4">
                  Back
                </Button>
              </Link>
            </div>
          )
        )}

        {/**
         * If doesn't have enough balance -> Mint first
         * If has enough balance -> Show balance
         */}
        {hasAccess && (
          <div className="p-4 text-xs">
            {testTokenBalance && !hasEnoughBalance ? (
              <p>
                {' '}
                🚨 Insufficient Balance:{' '}
                {testTokenBalance ? formatUnits(testTokenBalance.value, 6) : 0} USDC.{' '}
                <span className="font-bold hover:underline" onClick={onMintTestTokenClick}>
                  {' '}
                  Mint Test Token now{' '}
                </span>{' '}
              </p>
            ) : (
              <p>
                {' '}
                💰 Smart Wallet Balance:{' '}
                {testTokenBalance ? formatUnits(testTokenBalance.value, 6) : 0} USDC{' '}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
