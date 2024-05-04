import { Avatar } from '@coinbase/onchainkit/identity';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';

import { Challenge } from '@/hooks/useUserChallenges';
import { SetStateAction, useState } from 'react';

import { ActivityTypes, challenges } from '@/constants';

export function ChallengesDropDown({
  setSelectedChallenge,
  selectedChallenge,
  onChoose,
}: {
  setSelectedChallenge: React.Dispatch<SetStateAction<Challenge>>;
  selectedChallenge: Challenge;
  onChoose: (challengeArx: string) => void;
}) {

  const [open, setOpen] = useState(true)

  return (
    <DropdownMenu.Root >
      <DropdownMenu.Trigger asChild>
        <div className=" flex w-full items-center justify-start gap-6">
        <div className="flex justify-start rounded-md border-solid border">
          <div className="p-2 text-2xl">
            {' '}
            {selectedChallenge.type === ActivityTypes.Mental ? '💚' : '💪🏻'}{' '}
          </div>
          <button onClick={() => setOpen(true)} type="button">
          <div className="flex flex-col items-start justify-start p-2">
            <p className="text-xs opacity-80">{selectedChallenge.duration}</p>
            <p className='text-sm'>{selectedChallenge.name}</p>
          </div>
          </button>
        </div>
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        {open && <DropdownMenu.Content
          align="end"
          sideOffset={0}
          className={clsx(
            'w-120 inline-flex flex-col items-start justify-start',
            'bg-light rounded-lg border-solid px-6 pb-2 pt-6 shadow',
          )}
        >
          {challenges.map((challenge) =>  challenge.arxAddress !== selectedChallenge.arxAddress ? (
            <button
              type="button"
              style={{ borderColor: 'grey' }}
              className="bg-light w-full border-b-2 border-dotted p-2 text-center hover:opacity-80"
              // label={challenge.name}
              key={challenge.arxAddress}
              onClick={() => {
                onChoose(challenge.arxAddress)
                setOpen(false)
              }}
            >
              <div className="flex justify-start">
                <div className="p-2 text-2xl">
                  {' '}
                  {challenge.type === ActivityTypes.Mental ? '💚' : '💪🏻'}{' '}
                </div>
                <div className="flex flex-col items-start justify-start p-2">
                  <p className="text-xs opacity-80">{challenge.duration}</p>
                  <p className='text-sm'>{challenge.name}</p>
                </div>
              </div>
            </button>
          ) : <> </>)}
        </DropdownMenu.Content>}
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
