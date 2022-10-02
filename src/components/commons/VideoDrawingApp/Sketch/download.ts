export const download = () => {
  const canvas = document.getElementById("canvas");
  const url = (canvas as any).toDataURL("image/png");
  fetch(url).then((response) => {
    response.blob().then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "image.png";
      a.click();
    });
  });
};