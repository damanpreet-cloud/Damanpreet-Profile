import { useEffect, useRef, useState } from "react";
import { Check, Copy, X } from "lucide-react";

export default function CopyButton({ getText }) {
  const [status, setStatus] = useState("idle");
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 1800);
  };

  return (
    <button className="icon-button copy-button" onClick={copy} aria-label="Copy terminal log" title="Copy terminal log">
      {status === "copied" ? <Check size={15} /> : status === "failed" ? <X size={15} /> : <Copy size={15} />}
      {status !== "idle" && <span className="copy-toast" role="status">{status === "copied" ? "Copied" : "Copy failed"}</span>}
    </button>
  );
}
