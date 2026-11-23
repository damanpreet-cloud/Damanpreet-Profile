import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, Cloud, FileCheck2, Play, RotateCcw, ShieldCheck,
  Terminal as TerminalIcon, Trash2, Zap
} from "lucide-react";
import CopyButton from "./CopyButton.jsx";

const initialLines = [
  { tone: "muted", text: "# Terraform lifecycle console · SIMULATION ONLY" },
  { tone: "command", text: "$ terraform plan" },
  { tone: "success", text: "Plan: 4 to add, 0 to change, 0 to destroy." },
  { tone: "muted", text: "No cloud provider is connected and nothing is provisioned yet." },
  { tone: "muted", text: "Run apply to simulate provisioning." }
];

const resources = ["IAM execution role", "S3 website bucket", "CloudFront distribution", "Route 53 record"];

const applySteps = [
  "aws_iam_role.portfolio: Creating...",
  "aws_s3_bucket.portfolio: Creating...",
  "aws_cloudfront_distribution.portfolio: Creating...",
  "aws_route53_record.portfolio: Creating...",
  "Apply complete! Resources: 4 added, 0 changed, 0 destroyed."
];

const destroySteps = [
  "aws_route53_record.portfolio: Destroying...",
  "aws_cloudfront_distribution.portfolio: Destroying...",
  "aws_s3_bucket.portfolio: Destroying...",
  "aws_iam_role.portfolio: Destroying...",
  "Destroy complete! Resources: 4 destroyed."
];

const statusInfo = {
  PLANNED: { label: "PLAN READY", note: "Nothing provisioned yet", cls: "planned" },
  APPLYING: { label: "APPLYING", note: "Provisioning in progress", cls: "restoring" },
  ACTIVE: { label: "ACTIVE", note: "Environment available", cls: "active" },
  DESTROYING: { label: "DESTROYING", note: "Teardown in progress", cls: "destroying" },
  DESTROYED: { label: "DESTROYED", note: "Simulated resources removed", cls: "destroyed" }
};

export default function TerraformSimulator() {
  const [state, setState] = useState("PLANNED");
  const [lines, setLines] = useState(initialLines);
  const [confirm, setConfirm] = useState(false);
  const [step, setStep] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const terminalRef = useRef(null);

  const isBusy = state === "APPLYING" || state === "DESTROYING";
  const info = statusInfo[state];

  // Each tick logs one message. All state changes happen in this timer callback,
  // never inside a state-updater function, so it is safe under React Strict Mode.
  useEffect(() => {
    if (!isBusy) return undefined;
    const sequence = state === "APPLYING" ? applySteps : destroySteps;
    const timer = window.setTimeout(() => {
      const isLast = step === sequence.length - 1;
      const tone = isLast ? (state === "APPLYING" ? "success" : "danger") : "normal";
      setLines((old) => [...old, { tone, text: sequence[step] }]);
      if (isLast) {
        setState(state === "APPLYING" ? "ACTIVE" : "DESTROYED");
        setStep(0);
      } else {
        setStep(step + 1);
      }
    }, 850);
    return () => window.clearTimeout(timer);
  }, [state, step, isBusy]);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [lines]);

  // Deployment progress = share of the four resources currently deployed.
  const progress = useMemo(() => {
    if (state === "ACTIVE") return 100;
    if (state === "PLANNED" || state === "DESTROYED") return 0;
    const done = Math.max(0, Math.min(4, step - 1));
    return state === "APPLYING" ? Math.round((done / 4) * 100) : 100 - Math.round((done / 4) * 100);
  }, [state, step]);

  const rowStatus = (index) => {
    if (state === "ACTIVE") return "ready";
    if (state === "PLANNED") return "planned";
    if (state === "DESTROYED") return "removed";
    if (state === "APPLYING") {
      if (step - 1 > index) return "ready";
      return step - 1 === index ? "creating" : "planned";
    }
    const order = 3 - index; // destroy runs in reverse order
    if (step - 1 > order) return "removed";
    return step - 1 === order ? "removing" : "ready";
  };
  const indicator = { ready: "on", planned: "planned", removed: "off", creating: "changing", removing: "changing" };
  const rowLabel = { ready: "READY", planned: "PLANNED", removed: "REMOVED", creating: "CREATING", removing: "REMOVING" };

  const startApply = () => {
    setStep(0);
    setState("APPLYING");
    setLines((old) => [...old, { tone: "command", text: "$ terraform apply -auto-approve" }, { tone: "warning", text: "Simulation started. Provisioning illustrative resources..." }]);
  };

  const startDestroy = () => {
    setConfirm(false);
    setStep(0);
    setState("DESTROYING");
    setLines((old) => [...old, { tone: "command", text: "$ terraform destroy" }, { tone: "warning", text: "Simulation started. Destroying illustrative resources..." }]);
  };

  const reset = () => {
    setState("PLANNED");
    setStep(0);
    setConfirm(false);
    setLines(initialLines);
  };

  return (
    <>
      <div className="simulator-shell">
        <div className="sim-topbar">
          <div className="window-controls"><i /><i /><i /></div>
          <div className="terminal-title"><TerminalIcon size={14} /> infrastructure-control / terraform</div>
          <CopyButton getText={() => lines.map((line) => line.text).join("\n")} />
        </div>

        <div className="sim-grid">
          <div className="terminal-pane">
            <div className="terminal-meta"><span>TERMINAL OUTPUT</span><span>bash · read-only simulation</span></div>
            <div className="terminal-output" ref={terminalRef} aria-live="polite">
              {lines.map((line, index) => (
                <div className={`terminal-line ${line.tone}`} key={`${index}-${line.text}`}>{line.text}</div>
              ))}
              {isBusy && <div className="terminal-line cursor-line">▌</div>}
            </div>
            <div className="terminal-foot"><span className="live-dot" /> SESSION LOCAL TO THIS BROWSER</div>
          </div>

          <aside className="sim-control-pane">
            <div className="control-heading"><Cloud size={18} /><span>ENVIRONMENT STATUS</span></div>
            <div className={`environment-status ${info.cls}`}>
              <div className="status-icon">
                {state === "PLANNED" ? <FileCheck2 size={22} /> : state === "DESTROYED" ? <Trash2 size={22} /> : state === "DESTROYING" ? <Zap size={22} /> : state === "APPLYING" ? <RotateCcw size={22} /> : <ShieldCheck size={22} />}
              </div>
              <div><strong>{info.label}</strong><small>{info.note}</small></div>
            </div>
            <div className="progress-label"><span>Deployment progress</span><strong>{progress}%</strong></div>
            <div className="progress-track"><motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} /></div>
            <div className="resource-list">
              {resources.map((resource, index) => {
                const status = rowStatus(index);
                return (
                  <div className="resource-row" key={resource}>
                    <span className={`resource-indicator ${indicator[status]}`} />
                    <span>{resource}</span>
                    <small>{rowLabel[status]}</small>
                  </div>
                );
              })}
            </div>
            <div className="sim-actions">
              {(state === "PLANNED" || state === "DESTROYED") && <button className="button button-primary button-full" onClick={startApply}><Play size={15} /> {state === "PLANNED" ? "terraform apply" : "terraform apply / restore"}</button>}
              {state === "ACTIVE" && <button className="button button-danger button-full" onClick={() => setConfirm(true)}><Trash2 size={16} /> terraform destroy</button>}
              {isBusy && <button className="button button-muted button-full" disabled><span className="spinner" /> {state === "DESTROYING" ? "Destroying resources..." : "Provisioning resources..."}</button>}
              <button className="button button-quiet button-full" onClick={reset} disabled={isBusy}><RotateCcw size={14} /> Reset simulation</button>
            </div>
            <button className="help-toggle" onClick={() => setShowHelp((v) => !v)}>{showHelp ? "Hide" : "How this works"}</button>
            <AnimatePresence>
              {showHelp && <motion.p className="sim-help" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>This front-end demo changes local React state and prints scripted terminal messages. It does not call Terraform, AWS, GitHub Actions or any external service. Refreshing the page resets the demonstration.</motion.p>}
            </AnimatePresence>
          </aside>
        </div>
        <div className="sim-disclaimer"><AlertTriangle size={14} /><span>Safe demo only: no infrastructure is provisioned, modified or deleted. Terminal output is illustrative.</span></div>
      </div>

      <AnimatePresence>
        {confirm && (
          <motion.div className="confirm-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirm(false); }}>
            <motion.div className="confirm-dialog" initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
              <div className="confirm-icon"><AlertTriangle size={24} /></div>
              <span className="eyebrow">CONFIRM SIMULATION</span>
              <h3>Destroy the demo environment?</h3>
              <p>This will run a scripted visual sequence only. It will not execute Terraform or affect this website.</p>
              <div className="confirm-actions">
                <button className="button button-quiet" onClick={() => setConfirm(false)}>Cancel</button>
                <button className="button button-danger" onClick={startDestroy}><Trash2 size={15} /> Start destroy</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
