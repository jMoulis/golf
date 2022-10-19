import styled from '@emotion/styled';
import {
  faVideo,
  faSquare,
  faCameraRotate,
} from '@fortawesome/free-solid-svg-icons';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { faFilms } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SwipeableDrawer } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { theme } from '../../../style/theme';
import { generateFileName, iOS } from '../../../utils/global.utils';
import { Flexbox } from '../../commons';
import VideoSnapshot from './index';
import { DrawingApp } from '../../commons/VideoDrawingApp/DrawingApp';
import {
  RecordButton,
  SwitchCamera,
  Toolbar,
} from '../../commons/VideoDrawingApp/components';
import { LoadingType, VideoType } from './types';

const LoadingBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4000;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Preview = styled.video`
  width: auto;
  height: 100%;
  max-height: 100%;
  object-fit: cover;
`;

type Props = {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  onUpload: (video: VideoType) => void;
  onDelete: (video: VideoType) => void;
  uploadProgress: number | null;
  uploading: LoadingType;
};
interface PreviewVideoElement extends HTMLVideoElement {
  captureStream: () => MediaStream;
}
export const VideoRecorder = ({
  open,
  onClose,
  onOpen,
  onUpload,
  uploading,
  uploadProgress,
  onDelete,
}: Props) => {
  const [selectedVideo, setSelectVideo] = useState<VideoType | null>(null);
  const previewRef = useRef<PreviewVideoElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecordRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [displayLibrary, setDisplayLibrary] = useState(true);

  const handleStopRecord = () => {
    if (mediaRecordRef.current?.state === 'recording') {
      mediaRecordRef.current.stop();
    }
  };

  const destroyVideo = () => {
    if (typeof mediaStreamRef.current?.getTracks === 'function') {
      mediaStreamRef.current.getTracks().forEach((track: any) => track.stop());
    }
  };

  const initRecorder = async (
    stream: MediaStream,
    onStop: () => void,
    onStart: () => void
  ) => {
    mediaRecordRef.current = new MediaRecorder(stream);
    const data: any = [];
    mediaRecordRef.current.ondataavailable = (e) => {
      data.push(e.data);
    };
    mediaRecordRef.current.start();
    mediaRecordRef.current.onstart = () => onStart();

    const stopped = new Promise((resolve, reject) => {
      (mediaRecordRef.current as MediaRecorder).onstop = (...rest) => {
        onStop();
        resolve(...rest);
      };
      (mediaRecordRef.current as MediaRecorder).onerror = (event: any) =>
        reject(event.name);
    });
    await Promise.all([stopped]);
    return data;
  };

  const configureStreamPreview = (stream: MediaStream) => {
    if (!previewRef.current) return null;
    (previewRef.current as any).srcObject = stream;
    (previewRef.current as any).captureStream =
      (previewRef.current as any).captureStream ||
      (previewRef.current as any).mozCaptureStream;
    previewRef.current.play();
  };

  const handleStartRecord = async (stream: MediaStream | null) => {
    if (!stream) return null;
    const chunks = await initRecorder(
      stream,
      () => setIsRecording(false),
      () => setIsRecording(true)
    );
    const recordedBlob = new Blob(chunks, { type: 'video/mp4' });
    const { fileName } = generateFileName({ file: recordedBlob });
    const snapshoter = new VideoSnapshot(recordedBlob);
    try {
      const previwSrc = await snapshoter.takeSnapshot();
      const newVideo = {
        blob: recordedBlob,
        thumbnail: previwSrc,
        name: fileName,
      };
      setVideos((prev) => [...prev, newVideo]);

      onUpload(newVideo);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('ERROR', error);
    }
  };

  const onLoad = () => {
    if (navigator) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
          },
          audio: false,
        })
        .then((stream) => {
          mediaStreamRef.current = stream;
          configureStreamPreview(stream);
        });
    }
  };

  useEffect(() => {
    if (open) {
      onLoad();
    } else {
      handleStopRecord();
      destroyVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, facingMode]);

  const handleSelectVideo = (video: VideoType) => {
    destroyVideo();
    setSelectVideo(video);
  };

  const handleCloseDrawingApp = () => {
    setSelectVideo(null);
    onLoad();
  };

  const handleDelete = (incomingVideo: VideoType) => {
    setVideos((prev) =>
      prev.filter(
        (prevVideo) => prevVideo.thumbnail !== incomingVideo.thumbnail
      )
    );
    setSelectVideo(null);
    onDelete(incomingVideo);
  };

  const disabledButton = useMemo(() => {
    return uploading === 'LOADING';
  }, [uploading]);

  return (
    <>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        PaperProps={{
          style: { ...theme.swipeable.paper, height: '100vh' },
        }}
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
      >
        {uploading === 'LOADING' && uploadProgress !== null ? (
          <LoadingBackground>
            <Flexbox
              style={{
                width: '150px',
                height: '150px',
              }}
            >
              <CircularProgressbar
                value={uploadProgress}
                text={`${uploadProgress}%`}
              />
            </Flexbox>
          </LoadingBackground>
        ) : null}
        <Preview playsInline ref={previewRef} autoPlay muted />
        <Toolbar>
          {displayLibrary ? (
            <Flexbox>
              <ul>
                {videos.map((item, key) => (
                  <img
                    alt="Fuckup"
                    style={{
                      width: '50px',
                      height: '50px',
                      margin: '5px',
                      borderRadius: '5px',
                      objectFit: 'cover',
                    }}
                    onClick={() => handleSelectVideo(item)}
                    key={key}
                    src={item.thumbnail}
                  />
                ))}
              </ul>
            </Flexbox>
          ) : null}
          <Flexbox flex="1" justifyContent="space-between" alignItems="center">
            <SwitchCamera
              disabled={disabledButton}
              onClick={() => setDisplayLibrary(!displayLibrary)}
            >
              <FontAwesomeIcon icon={faFilms} />
            </SwitchCamera>
            <RecordButton
              disabled={disabledButton}
              onClick={() => {
                if (isRecording) {
                  handleStopRecord();
                } else {
                  handleStartRecord(mediaStreamRef.current);
                }
              }}
            >
              {isRecording ? (
                <FontAwesomeIcon icon={faSquare} />
              ) : (
                <FontAwesomeIcon icon={faVideo} />
              )}
            </RecordButton>
            <SwitchCamera
              disabled={disabledButton}
              onClick={() => {
                if (facingMode === 'user') {
                  setFacingMode('environment');
                } else {
                  setFacingMode('user');
                }
              }}
            >
              <FontAwesomeIcon icon={faCameraRotate} />
            </SwitchCamera>
          </Flexbox>
        </Toolbar>
      </SwipeableDrawer>
      <DrawingApp
        open={Boolean(selectedVideo)}
        onClose={handleCloseDrawingApp}
        video={selectedVideo}
        onDelete={handleDelete}
      />
    </>
  );
};
