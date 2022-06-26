import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp } from '@fortawesome/pro-duotone-svg-icons';

export const shotQuality: {
  value: 'KO' | 'OK';
  icon: JSX.Element;
  color: string;
}[] = [
  {
    value: 'OK',
    icon: <FontAwesomeIcon icon={faThumbsUp} />,
    color: '#B0D959',
  },
  {
    value: 'KO',
    icon: <FontAwesomeIcon icon={faThumbsDown} />,
    color: '#d73038',
  },
];

export const shotEvaluations = [
  {
    type: 'choice',
    values: shotQuality,
  },
  {
    type: 'alignment',
    values: shotQuality,
  },
  {
    type: 'technique',
    values: shotQuality,
  },
].sort((a, b) => {
  if (a.type < b.type) {
    return -1;
  }
  if (a.type > b.type) {
    return 1;
  }
  return 0;
});
