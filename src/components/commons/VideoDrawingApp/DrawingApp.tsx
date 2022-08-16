import styled from '@emotion/styled';
import {
  faPause,
  faPlay,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SwipeableDrawer } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { theme } from '../../../style/theme';
import { iOS } from '../../../utils/global.utils';
import { Flexbox } from '..';
import { SwitchCamera, Toolbar } from './components';
import { WhiteBoard } from './WhiteBoard/WhiteBoard';
import { VideoType } from '../../Training/Session/types';

const Image = styled.img`
  max-width: 100%;
  height: auto;
  object-fit: contain;
`;

const Root = styled.div`
  display: flex;
  background-color: #000;
  position: relative;
  flex: 1;
`;

const Video = styled.video<{ displayed: boolean }>`
  display: block;
  max-width: 100%;
  flex: 1;
  height: ${({ displayed }) => displayed && '0'};
`;

type Props = {
  video: VideoType | null;
  open: boolean;
  onClose: () => void;
  onDelete: (video: VideoType) => void;
};

const isSafari =
  typeof navigator !== 'undefined' &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const DrawingApp = ({ video, onClose, open, onDelete }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playingStatus, setPlayingStatus] = useState('UNSET');

  useEffect(() => {
    if (!open) {
      setPlayingStatus('UNSET');
    } else {
      if (videoRef.current) {
        videoRef.current.play();
      }
    }
  }, [open]);

  const handlePlay = () => {
    setPlayingStatus('PLAY');
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handlePause = () => {
    setPlayingStatus('PAUSE');
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const videoURL = useMemo(() => {
    if (!video?.blob) return '';
    return URL.createObjectURL(video.blob);
  }, [video?.blob]);

  const handleClose = () => {
    onClose();
    setPlayingStatus('UNSET');
  };

  const handleDelete = () => {
    onClose();
    if (video) {
      onDelete(video);
    }
  };
  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      PaperProps={{
        style: theme.swipeable.paper,
      }}
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
    >
      <Root>
        {isSafari && playingStatus === 'UNSET' ? (
          <Image src={video?.thumbnail} />
        ) : null}
        <Video
          preload="metadata"
          id="video"
          playsInline
          ref={videoRef}
          src={videoURL}
          muted
          displayed={isSafari && playingStatus === 'UNSET'}
        />
        <div
          style={{
            position: 'absolute',
          }}
        >
          <WhiteBoard />
        </div>
        <Toolbar>
          <Flexbox flex="1" justifyContent="space-between" alignItems="center">
            <SwitchCamera onClick={handleClose}>
              <FontAwesomeIcon icon={faTimes} />
            </SwitchCamera>
            <SwitchCamera
              onClick={() =>
                playingStatus === 'PAUSE' || playingStatus === 'UNSET'
                  ? handlePlay()
                  : handlePause()
              }
            >
              <FontAwesomeIcon
                icon={
                  playingStatus === 'PAUSE' || playingStatus === 'UNSET'
                    ? faPlay
                    : faPause
                }
              />
            </SwitchCamera>

            <SwitchCamera onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} />
            </SwitchCamera>
          </Flexbox>
        </Toolbar>
      </Root>
    </SwipeableDrawer>
  );
};
