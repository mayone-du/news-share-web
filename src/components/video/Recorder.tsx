import { Button } from "@mantine/core";
import { useEffect, VFC } from "react";

// WIP

const handleStartRecord = () => {
  navigator.mediaDevices.getDisplayMedia({ audio: false, video: true }).then((stream) => {
    const tracks = [...stream.getTracks()];
    const mediaStream = new MediaStream(tracks);
    const rec = new MediaRecorder(mediaStream, { mimeType: "video/webm; codecs=vp9" });
    const chunks: BlobPart[] = [];

    rec.ondataavailable = (ev) => chunks.push(ev.data);
    rec.start();
    rec.onstop = () => {
      console.log("onstop");
      const webm = new Blob(chunks, { type: "video/webm" });
      const url = window.URL.createObjectURL(webm);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", "rec.webm");
      a.click();
    };

    setTimeout(() => {
      console.log("stop");
      rec.stop();
    }, 10000);
  });
};

export const Recorder: VFC = () => {
  return (
    <div>
      <Button onClick={handleStartRecord}>Start Recording!</Button>
    </div>
  );
};
