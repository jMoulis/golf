import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp } from '@fortawesome/pro-duotone-svg-icons';

export const shotQuality = [
  {
    value: 'ok',
    icon: <FontAwesomeIcon icon={faThumbsUp} />,
    color: '#B0D959',
  },
  {
    value: 'ko',
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
];
