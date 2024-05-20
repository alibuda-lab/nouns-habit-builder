/* eslint-disable jsx-a11y/anchor-is-valid */
'use client';

import { useRunVerifier } from '@/hooks/useStoredRunVerifier';
import Header from '../../habit/components/Header';
import { RunVerifier } from '@/types';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import * as stravaUtils from '@/utils/strava';
import toast from 'react-hot-toast';

const StravaImg = require('@/imgs/apps/strava.png') as string;
const NRCImg = require('@/imgs/apps/nrc.png') as string;

/**
 * This page is only used to receive the strava login callback
 * @returns
 */
export default function CallbackStrava() {
  const searchParams = useSearchParams();

  const stravaAuthToken = searchParams.get('code');

  const originalUri = searchParams.get('state');

  console.log('originPage', originalUri)

  const { updateVerifierAndSecret, secret, lastUpdated } = useRunVerifier();

  const [isPending, setIsPending] = useState<boolean>(false);

  // Upon receiving the token,
  useEffect(() => {
    const updateAccessTokenAndRefreshToken = async () => {

      console.log('update access token and refresh token')

      if (!stravaAuthToken) {
        return; // No need to proceed if token is absent
      }

      if ((Date.now() / 1000) - lastUpdated < 3600 * 5) {
        console.log('No need to refetch')
        return 
      } 

      // use our backend to use authToken to get access token and refresh token
      // need to proxy through our backend because it requires a App secret
      try {
        const { refreshToken, accessToken } = await stravaUtils.getAccessAndRefreshToken(stravaAuthToken);     
        const newSecret = stravaUtils.joinSecret(accessToken, refreshToken);

        updateVerifierAndSecret(RunVerifier.Strava, newSecret);

        toast('Successfully connected with Strava', { icon: '🚀' });

        // Redirect to the original page
        if (originalUri) window.location.href = originalUri
      } finally {
        setIsPending(false); // Always set loading state to false after the operation
      }
    };

    updateAccessTokenAndRefreshToken().catch(console.log);
  }, [stravaAuthToken, updateVerifierAndSecret, originalUri, lastUpdated]);

  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Header />

      {stravaAuthToken !== undefined && (
        <>
          <div className="py-4 text-lg font-bold"> Connecting Strava with Alibuda ... </div>
          <Image src={StravaImg} height={55} width={55} alt="Strava" />
        </>
      )}
      
      <div>
        Secret: {secret}
      </div>
    </main>
  );
}
