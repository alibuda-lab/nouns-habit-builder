import { Avatar } from '@coinbase/onchainkit/identity';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';

import { Challenge } from '@/hooks/useUserChallenges';
import { SetStateAction, useState } from 'react';

import { ChallengeTypes, challenges } from '@/constants';
import { challengeToEmoji } from '@/utils/challenges';

export function ChallengesDropDown({
  setSelectedChallenge,
  selectedChallenge,
  onChoose,
}: {
  setSelectedChallenge: React.Dispatch<SetStateAction<Challenge | null>>;
  selectedChallenge: Challenge | null;
  onChoose: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className=" flex w-full items-center justify-start gap-4">
          <div className="flex justify-start rounded-md border border-solid">
            {selectedChallenge ? (
              <>
                <div className="p-2 text-2xl"> {challengeToEmoji(selectedChallenge.type)} </div>
                <button onClick={() => setOpen(true)} type="button" style={{ width: '220px' }}>
                  <div className="flex flex-col items-start justify-start p-2">
                    <p className="text-xs opacity-80">{selectedChallenge.duration}</p>
                    <p className="text-sm">{selectedChallenge.name}</p>
                  </div>
                </button>
              </>
            ) : (
              <>
                <div className="p-2 text-2xl"> + </div>
                <button onClick={() => setOpen(true)} type="button" style={{ width: '220px' }}>
                  <div className="flex flex-col items-start justify-start p-2">
                    <p className="text-sm"> Select One </p>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        {open && (
          <DropdownMenu.Content
            align="end"
            sideOffset={0}
            className={clsx(
              'w-120 inline-flex flex-col items-start justify-start',
              'bg-light rounded-lg border-solid shadow',
            )}
          >
            {challenges.map((challenge) => (
              <button
                type="button"
                style={{ borderColor: 'grey', width: '320px' }}
                className="bg-light p-2 text-center hover:opacity-80"
                // label={challenge.name}
                key={challenge.id.toString()}
                onClick={() => {
                  onChoose(challenge.id.toString());
                  setOpen(false);
                }}
              >
                <div className="flex justify-start">
                  <div className="p-2 text-2xl"> {challengeToEmoji(challenge.type)} </div>
                  <div className="flex flex-col items-start justify-start p-2">
                    <p className="text-xs opacity-80">{challenge.duration}</p>
                    <p className="text-sm">{challenge.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </DropdownMenu.Content>
        )}
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
