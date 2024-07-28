import s from './QrGenerator.module.scss'
import QRCode from "react-qr-code";
import React,{useState,useEffect,useRef} from 'react'
import domtoimage from 'dom-to-image';
import { Typewriter,Cursor } from 'react-simple-typewriter'
import { toPng } from 'html-to-image';

const QrGenerator = () => {
	const [value,setValue] = useState("")
const qrCodeRef = useRef(null);

  const saveQrCode = () => {
    if (qrCodeRef.current === null) {
      return;
    }

    toPng(qrCodeRef.current, { quality: 1.0 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'qr-code.png';
        link.click();
      })
      .catch((err) => {
        console.error('Ошибка при сохранении QR-кода:', err);
      });
  };

  const shareToTelegram = () => {
    if (qrCodeRef.current === null) {
      return;
    }

    toPng(qrCodeRef.current, { quality: 1.0 })
      .then((dataUrl) => {
        const blob = dataURLToBlob(dataUrl);
        const file = new File([blob], 'qr-code.png', { type: 'image/png' });
        const url = URL.createObjectURL(file);

        // Формируем ссылку для обмена через Telegram
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Смотрите мой QR-код')}`;
        window.open(telegramUrl, '_blank');
      })
      .catch((err) => {
        console.error('Ошибка при создании QR-кода:', err);
      });
  };

  const dataURLToBlob = (dataUrl) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

	return (
		<div className={s.megaContainer}>
		<div className={s.content}>
		<Typewriter 
	     words={[`Qr code generator: type text or link`]} 
		  loop={1}
          cursor
          cursorStyle=':'
          cursorColor="white"
		  typeSpeed={150}
          deleteSpeed={30}
          delaySpeed={1000}
          />
          </div>
		<div className={s.content1}>
			<input placeholder="Type text or link..." type="text" value={value} onChange={(e)=>{setValue(e.target.value)}}/>
		</div>
	<div className={s.content2} ref={qrCodeRef}>
			 <QRCode
    size={155}
    style={{ height: "auto", maxWidth: "100%", width: "200px" }}
    value={value}
    viewBox={`0 0 256 256`}
  />
  	23
  </div>
  <div className={s.content3}>
  	<button onClick={saveQrCode}>Download QR-code</button>
  	<button onClick={shareToTelegram}>Share to Telegram</button>
  </div>
		</div>
		)
}

export default QrGenerator