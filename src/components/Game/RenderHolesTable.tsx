import { useMemo, useRef } from 'react';
import { PDFExport } from '@progress/kendo-react-pdf';
import { sortHoles } from '../Admin/Course/utils';
import { Flexbox } from '../commons';
import { GameHoleType, GameType } from '../types';
import { Avatar } from '../User/Avatar';
import { Score } from './GameBoard/GamesList/Score';
import { RenderNine } from './RenderNine';
import { RenderTotal } from './ScoreCard/RenderTotal';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/pro-duotone-svg-icons';
import { FixedBottomToolbar } from '../commons/FixedBottomToolbar';

const ExportButton = styled.button`
  border: none;
  height: 40px;
  width: 40px;
  border-radius: 4px;
  font-size: 20px;
`;

const CustomFixedFooter = styled(FixedBottomToolbar)`
  justify-content: flex-end;
`;

type Props = {
  holes: GameHoleType[];
  game: GameType | null;
};

export const RenderHolesTable = ({ holes, game }: Props) => {
  const pdfExportComponent = useRef<PDFExport>(null);

  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };

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
      <PDFExport ref={pdfExportComponent} paperSize="A4">
        <div>
          <span
            style={{
              display: 'block',
              fontSize: '20px',
              padding: '10px',
              fontWeight: 'bold'
            }}
          >
            {game?.courseRef}
          </span>
          {game?.player ? (
            <Flexbox
              justifyContent="space-between"
              alignItems="center"
              style={{
                padding: '10px'
              }}
            >
              <Flexbox alignItems="center">
                <Avatar
                  styling={{
                    width: '30px',
                    height: '30px',
                    marginRight: '10px'
                  }}
                  onDisplayDetail={() => {}}
                  user={game.player}
                />
                <span
                  style={{
                    fontWeight: 'bold'
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
                height: '30px'
              }}
            />
          </Flexbox>
          <RenderNine title="Aller" holes={frontNine as GameHoleType[]} />
          <RenderNine title="Retour" holes={backNine as GameHoleType[]} />
          <RenderTotal holes={sortedHoles as GameHoleType[]} />
        </div>
      </PDFExport>
      <CustomFixedFooter>
        <ExportButton onClick={exportPDFWithComponent} type="button">
          <FontAwesomeIcon icon={faDownload} />
        </ExportButton>
      </CustomFixedFooter>
    </>
  );
};
