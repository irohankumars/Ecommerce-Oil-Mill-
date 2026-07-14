// Adds client-side deterrents and reports repeated suspicious activity.
import { useEffect, useRef, useState } from "react";
import { reportSecurityActivity } from "../../../services/securityService.js";

const blockedKeys = new Set(["F12"]);
const blockedCombos = [
  (event) => event.ctrlKey && event.shiftKey && ["I", "J", "C"].includes(event.key.toUpperCase()),
  (event) => event.ctrlKey && ["U", "S", "P"].includes(event.key.toUpperCase()),
];

export default function SecurityAwareness() {
  const [warning, setWarning] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const reportCountRef = useRef(0);
  const lastReportRef = useRef(0);

  useEffect(() => {
    const report = async (signal) => {
      const now = Date.now();
      if (now - lastReportRef.current < 1200) return;
      lastReportRef.current = now;
      reportCountRef.current += 1;
      if (reportCountRef.current < 2) return;
      const response = await reportSecurityActivity(signal).catch(() => null);
      if (response?.restricted) setRestricted(true);
    };

    const blockContextMenu = (event) => {
      event.preventDefault();
      report("context_menu");
    };
    const blockDrag = (event) => event.preventDefault();
    const blockKeyboard = (event) => {
      if (blockedKeys.has(event.key) || blockedCombos.some((match) => match(event))) {
        event.preventDefault();
        report(`key_${event.key}`);
      }
    };
    const checkDevTools = () => {
      const opened = window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160;
      setWarning(opened);
      if (opened) report("devtools_size");
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("dragstart", blockDrag);
    document.addEventListener("keydown", blockKeyboard);
    const interval = window.setInterval(checkDevTools, 1200);
    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("dragstart", blockDrag);
      document.removeEventListener("keydown", blockKeyboard);
      window.clearInterval(interval);
    };
  }, []);

  if (restricted) {
    return (
      <div className="fixed inset-0 z-[220] grid place-items-center bg-cream px-5 text-center text-ink">
        <div className="max-w-md rounded-3xl bg-white p-8 shadow-soft">
          <h1 className="font-serif text-4xl font-semibold">Access Restricted</h1>
          <p className="mt-4 leading-7 text-ink/65">Unusual browser activity was detected. Please return later or contact support if this was a mistake.</p>
        </div>
      </div>
    );
  }

  if (!warning) return null;

  return (
    <div className="fixed left-1/2 top-4 z-[130] w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border border-clay/20 bg-white p-4 text-center text-sm font-semibold text-ink shadow-soft">
      Developer tools appear to be open. Avoid sharing private customer or payment data.
    </div>
  );
}
