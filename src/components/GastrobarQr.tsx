import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { permanentMenuUrl } from "../lib/menu";

export default function GastrobarQr() {
  const [image, setImage] = useState("");
  useEffect(() => {
    QRCode.toDataURL(permanentMenuUrl(), {
      width: 400,
      margin: 4,
      errorCorrectionLevel: "H",
    })
      .then(setImage)
      .catch(() => {});
  }, []);
  return image ? (
    <img
      src={image}
      alt="Código QR de nuestra carta digital"
      className="w-48 h-48 object-contain"
    />
  ) : (
    <span>Ver nuestra carta digital</span>
  );
}
