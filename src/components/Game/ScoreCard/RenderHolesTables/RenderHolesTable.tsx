import React, { useEffect, useMemo, useRef } from 'react';
import styled from '@emotion/styled';
import { sortHoles } from '../../../Admin/Course/utils';
import { Flexbox } from '../../../commons';
import { GameHoleType, GameType } from '../../../types';
import { Score } from '../../GameBoard/GamesList/Score';
import { RenderNine } from '../../RenderNine';
import { RenderTotal } from '../RenderTotal';
import { FixedBottomToolbar } from '../../../commons/FixedBottomToolbar';
import { useExportPdfGame } from '../useExportPdfGame';
import { ButtonPill } from '../../../commons/Buttons/ButtonPill';
import { ShotTypes } from './ShotTypes';

const Root = styled.div`
  max-height: 75vh;
  overflow: auto;
  font-size: 12px;
`;

type Props = {
  holes: GameHoleType[];
  game: GameType | null;
};

export const RenderHolesTable = ({ holes, game }: Props) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { exportPDF, exportUrl, fileName } = useExportPdfGame(game);

  useEffect(() => {
    exportPDF(rootRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedHoles = useMemo(() => {
    return sortHoles(holes);
  }, [holes]);

  const frontNine = useMemo(() => {
    return sortedHoles.slice(0, 9);
  }, [sortedHoles]);

  const backNine = useMemo(() => {
    return sortedHoles.slice(9, 18);
  }, [sortedHoles]);

  return (
    <>
      <Root ref={rootRef}>
        <span
          style={{
            display: 'block',
            fontSize: '20px',
            padding: '10px',
            fontWeight: 'bold',
          }}
        >
          {game?.courseRef}
        </span>
        <Flexbox flexDirection="column">
          <RenderTotal holes={sortedHoles as GameHoleType[]} />
          <Flexbox justifyContent="space-around">
            <Score
              withLabel
              holes={(sortedHoles as any) || []}
              tagStyling={{
                width: '30px',
                height: '30px',
              }}
            />
          </Flexbox>
          <ShotTypes holes={sortedHoles as GameHoleType[]} />
          {/* <ShotsStats holes={sortedHoles as GameHoleType[]} /> */}
        </Flexbox>
        <RenderNine title="Aller" holes={frontNine as GameHoleType[]} />
        <RenderNine title="Retour" holes={backNine as GameHoleType[]} />
      </Root>
      <FixedBottomToolbar>
        <ButtonPill as="div">
          <a
            href={exportUrl}
            download={fileName}
            target="_blank"
            rel="noreferrer"
            style={{
              color: '#fff',
            }}
          >
            Télécharger
          </a>
        </ButtonPill>
      </FixedBottomToolbar>
    </>
  );
};
