import React, { useMemo, useRef, useState } from 'react';
import { drawDOM, exportPDF } from '@progress/kendo-drawing';
import { sortHoles } from '../Admin/Course/utils';
import { Flexbox } from '../commons';
import { GameHoleType, GameType } from '../types';
import { Avatar } from '../User/Avatar';
import { Score } from './GameBoard/GamesList/Score';
import { RenderNine } from './RenderNine';
import { RenderTotal } from './ScoreCard/RenderTotal';

type Props = {
  holes: GameHoleType[];
  game: GameType | null;
};

export const RenderHolesTable = ({ holes, game }: Props) => {
  const [url, setUrl] = useState<string | null>(null);

  const exportPDFWithMethod = () => {
    if (!rootRef.current) return null;
    const gridElement = rootRef.current;
    drawDOM(gridElement, { paperSize: 'A4' })
      .then((group) => {
        return exportPDF(group);
      })
      .then((dataUri) => {
        setUrl(dataUri.split(';base64,')[1]);
      });
  };
  const sortedHoles = useMemo(() => {
    return sortHoles(holes);
  }, [holes]);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const frontNine = useMemo(() => {
    return sortedHoles.slice(0, 9);
  }, [sortedHoles]);

  const backNine = useMemo(() => {
    return sortedHoles.slice(9, 18);
  }, [sortedHoles]);

  return (
    <>
      <button onClick={exportPDFWithMethod} type='button'>
        Export
      </button>
      {url ? (
        <a href={`data:application/pdf;base64,${url}`} download='test.pdf'>
          Download
        </a>
      ) : null}
      <div ref={rootRef}>
        <span
          style={{
            display: 'block',
            fontSize: '20px',
            padding: '10px',
            fontWeight: 'bold',
          }}>
          {game?.courseRef}
        </span>
        {game?.player ? (
          <Flexbox
            justifyContent='space-between'
            alignItems='center'
            style={{
              padding: '10px',
            }}>
            <Flexbox alignItems='center'>
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
                }}>
                {game.player?.firstname}
              </span>
            </Flexbox>
            <Flexbox flexDirection='column' alignItems='center'>
              <div>
                {sortedHoles.reduce(
                  (acc, hole) => acc + ((hole as any).shots?.length || 0),
                  0,
                ) - sortedHoles.reduce((acc, hole) => acc + hole.par, 0)}
              </div>
              <div>BRUT</div>
            </Flexbox>
          </Flexbox>
        ) : null}
        <Flexbox justifyContent='space-around'>
          <Score
            withLabel
            holes={(sortedHoles as any) || []}
            tagStyling={{
              width: '30px',
              height: '30px',
            }}
          />
        </Flexbox>
        <RenderNine title='Aller' holes={frontNine as GameHoleType[]} />
        <RenderNine title='Retour' holes={backNine as GameHoleType[]} />
        <RenderTotal holes={sortedHoles as GameHoleType[]} />
      </div>
    </>
  );
};
