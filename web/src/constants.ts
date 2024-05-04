import { baseSepolia } from 'viem/chains';
import { Challenge } from './hooks/useUserChallenges';

export const EXPECTED_CHAIN = baseSepolia;

export enum ActivityTypes {
  'Mental',
  'Physical',
}

export enum VerificationType {
  'NFC',
  'Strava',
}

export const challenges: Challenge[] = [
  {
    name: 'Run at Sydney Park 10 times',
    duration: 'May 1 - 27',
    arxAddress: '0x883167E6b5d489B82cB97bEf9C7967afe3A3D299',
    stake: 0.0001,
    icon: '🏃🏻‍♂️',
    donationOrg: 'Gitcoin',
    type: ActivityTypes.Mental,
    verificationType: VerificationType.NFC,
    mapKey:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4538.887349249702!2d151.18208387288763!3d-33.91119650996505!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b04b8d42ec9f%3A0x2f847bc8689ddf4e!2sSydney%20Park!5e0!3m2!1sen!2sau!4v1714808662978!5m2!1sen!2sau',
    targetNum: 10,
  },
  {
    name: 'Run 30 mins 10 times',
    duration: 'May 6 - 26',
    arxAddress: '0x883167E6b5d489B82cB97bEf9C7967afe3A3D210',
    stake: 0.001,
    icon: '🏃🏻‍♂️',
    donationOrg: 'Gitcoin',
    type: ActivityTypes.Physical,
    verificationType: VerificationType.Strava,
    targetNum: 10,
  },
  {
    name: 'Go coworking with cool devs at ETHSydney',
    duration: 'May 3 - 7',
    arxAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    stake: 0.003,
    icon: '🤝🏻',
    donationOrg: 'Gitcoin',
    type: ActivityTypes.Mental,
    verificationType: VerificationType.NFC,
    mapKey:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1544.6353424376618!2d151.1926899112038!3d-33.91546028732731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b1ae0360049d%3A0x2e2b1515500087a0!2sThe%20Venue%20Alexandria!5e0!3m2!1sen!2sau!4v1714808818093!5m2!1sen!2sau',
    targetNum: 5,
  },
];
