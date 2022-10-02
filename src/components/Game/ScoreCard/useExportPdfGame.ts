import { drawDOM, exportPDF } from "@progress/kendo-drawing";
import { useMemo, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebaseConfig/firebase";
import { useFileStorage } from "../../../hooks/useFileStorage";
import { GameType } from "../../types";
import { useGames } from "../useGames";

export const useExportPdfGame = (game: GameType | null) => {
  const [url, setUrl] = useState<string>('');
  const [user] = useAuthState(auth);
  const dateFormat = useRef<Intl.DateTimeFormat>(new Intl.DateTimeFormat());
  const { onEditGame } = useGames();
  const { getFileURL, updloadBase64File } = useFileStorage();

  const fileName = useMemo(() => {
    if (!game) return '';
    const gameDate = dateFormat.current.format(game.date).replaceAll('/', '-');
    const fileUrl = game.scoreCardPDF ? game?.scoreCardPDF :
      `${user?.uid}/${game?.id}/scoreCard-${game?.courseRef}-${gameDate}.pdf`.replaceAll(
        ' ',
        ''
      );
    return fileUrl
  }, [game, user?.uid]);

  const exportPDFWithMethod = async (element: any) => {
    if (!element) return null;
    if (!game) return null;

    if (game?.scoreCardPDF) {
      const fileUrl = await getFileURL(fileName)
      if (fileUrl) {
        setUrl(fileUrl)
      }
    } else {
      drawDOM(element, { paperSize: 'A4' })
        .then((group) => exportPDF(group))
        .then((dataUri) => {
          const base64 = dataUri.split(';base64,')[1];
          updloadBase64File(fileName, base64, 'application/pdf').then((snapshot) => {
            onEditGame(game.id, { scoreCardPDF: snapshot.metadata.fullPath });
            getFileURL(fileName).then((fileUrl) => {
              if (fileUrl) {
                setUrl(fileUrl)
              } else {
                setUrl('')
              }
            })
          });
        });
    }
  };

  return { exportPDF: exportPDFWithMethod, exportUrl: url, fileName }
}