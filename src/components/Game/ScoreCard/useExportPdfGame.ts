import { drawDOM, exportPDF } from "@progress/kendo-drawing";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useMemo, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, storage } from "../../../firebase";
import { GameType } from "../../types";
import { useGames } from "../useGames";

export const useExportPdfGame = (game: GameType | null) => {
  const [url, setUrl] = useState<string>('');
  const [user] = useAuthState(auth);
  const dateFormat = useRef<Intl.DateTimeFormat>(new Intl.DateTimeFormat());
  const { onEditGame } = useGames();

  const fileName = useMemo(() => {
    if (!game) return '';
    const gameDate = dateFormat.current.format(game.date).replaceAll('/', '-');
    const fileUrl = game.scoreCardPDF ? game?.scoreCardPDF :
      `${user?.uid}/${game?.id}/scoreCard-${game?.courseRef}-${gameDate}.pdf`.replaceAll(
        ' ',
        ''
      );
    return fileUrl
  }, [game]);

  const exportPDFWithMethod = async (element: any) => {
    const storageRef = ref(storage, fileName);
    if (!element) return null;
    if (!game) return null;
    if (game?.scoreCardPDF) {
      getDownloadURL(storageRef).then((refUrl) => {
        setUrl(refUrl);
      });
    } else {
      drawDOM(element, { paperSize: 'A4' })
        .then((group) => {
          return exportPDF(group);
        })
        .then((dataUri) => {
          const base64 = dataUri.split(';base64,')[1];
          uploadString(storageRef, base64, 'base64', {
            contentType: 'application/pdf'
          }).then((snapshot) => {
            onEditGame(game.id, { scoreCardPDF: snapshot.metadata.fullPath });
            getDownloadURL(storageRef).then((refUrl) => {
              setUrl(refUrl);
            });
          });
        });
    }
  };

  return { exportPDF: exportPDFWithMethod, exportUrl: url, fileName }
}