import React, { useEffect, useMemo, useRef } from 'react';
import { sortHoles } from '../Admin/Course/utils';
import { Flexbox } from '../commons';
import { GameHoleType, GameType } from '../types';
import { Avatar } from '../User/Avatar';
import { Score } from './GameBoard/GamesList/Score';
import { RenderNine } from './RenderNine';
import { RenderTotal } from './ScoreCard/RenderTotal';
import { FixedBottomToolbar } from '../commons/FixedBottomToolbar';
import { useExportPdfGame } from './ScoreCard/useExportPdfGame';
import { ButtonPill } from '../commons/ButtonPill';

type Props = {
  holes: GameHoleType[];
  game: GameType | null;
};

export const RenderHolesTable = ({ holes, game }: Props) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { exportPDF, exportUrl, fileName } = useExportPdfGame(game);

  useEffect(() => {
    exportPDF(rootRef.current);
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
      <div ref={rootRef}>
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
        {game?.player ? (
          <Flexbox
            justifyContent="space-between"
            alignItems="center"
            style={{
              padding: '10px',
            }}
          >
            <Flexbox alignItems="center">
              <Avatar
                styling={{
                  width: '30px',
                  height: '30px',
                  marginRight: '10px',
                }}
                onDisplayDetail={() => {}}
                user={game.player}
              />
              <span
                style={{
                  fontWeight: 'bold',
                }}
              >
                {game.player?.firstname}
              </span>
            </Flexbox>
            <Flexbox flexDirection="column" alignItems="center">
              <div>
                {sortedHoles.reduce(
                  (acc, hole) => acc + ((hole as any).shots?.length || 0),
                  0
                ) - sortedHoles.reduce((acc, hole) => acc + hole.par, 0)}
              </div>
              <div>BRUT</div>
            </Flexbox>
          </Flexbox>
        ) : null}
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
        <RenderNine title="Aller" holes={frontNine as GameHoleType[]} />
        <RenderNine title="Retour" holes={backNine as GameHoleType[]} />
        <RenderTotal holes={sortedHoles as GameHoleType[]} />
      </div>
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
