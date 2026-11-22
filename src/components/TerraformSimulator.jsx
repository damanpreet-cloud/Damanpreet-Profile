import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, CheckCircle2, Cloud, Copy, RotateCcw, ShieldCheck,
  Terminal as TerminalIcon, Trash2, Zap
} from "lucide-react";

const initialLines = [
  { tone: "muted", text: "# Terraform lifecycle console · SIMULATION ONLY" },
  { tone: "command", text: "$ terraform plan" },
  { tone: "normal", text: "Planning infrastructure changes..." },
  { tone: "success", text: "Plan: 4 to add, 0 to change, 0 to destroy." },
  { tone: "muted", text: "No cloud provider is connected. No resources exist." }
];

const destroySteps = [
  "aws_route53_record.portfolio: Destroying...",
  "aws_cloudfront_distribution.portfolio: Destroying...",
  "aws_s3_bucket.portfolio: Destroying...",
  "aws_iam_role.portfolio: Destroying...",
  "Destroy complete! Resources: 4 destroyed."
];

const restoreSteps = [
  "aws_iam_role.portfolio: Creating...",
  "aws_s3_bucket.portfolio: Creating...",
  "aws_cloudfront_distribution.portfolio: Creating...",
  "aws_route53_record.portfolio: Creating...",
  "Apply complete! Resources: 4 added, 0 changed, 0 destroyed."
];

export default function TerraformSimulator() {
  const [state, setState] = useState("ACTIVE");
  const [lines, setLines] = useState(initialLines);
  const [confirm, setConfirm] = useState(false);
  const [step, setStep] = useState(0);
  const [sound, setSound] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const terminalRef = useRef(null);

  const isBusy = state === "DESTROYING" || state === "RESTORING";
  const progress = useMemo(() => {
    if (state === "ACTIVE") return 100;
    if (state === "DESTROYED") return 0;
    return Math.min(100, Math.round((step / 5) * 100));
  }, [state, step]);

  useEffect(() => {
    if (!isBusy) return;
    const sequence = state === "DESTROYING" ? destroySteps : restoreSteps;
    const timer = window.setInterval(() => {
      setStep((current) => {
        const next = current + 1;
        if (next >= sequence.length) {
          window.clearInterval(timer);
          setLines((old) => [...old, { tone: state === "DESTROYING" ? "danger" : "success", text: sequence[sequence.length - 1] }]);
          setState(state === "DESTROYING" ? "DESTROYED" : "ACTIVE");
          return sequence.length;
        }
        setLines((old) => [...old, { tone: "normal", text: sequence[current] }]);
        return next;
      });
    }, 850);
    return () => window.clearInterval(timer);
  }, [state, isBusy]);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [lines]);

  const startDestroy = () => {
    setConfirm(false);
    setStep(0);
    setState("DESTROYING");
    setLines((old) => [...old, { tone: "command", text: "$ terraform destroy" }, { tone: "warning", text: "Simulation started. Destroying illustrative resources..." }]);
  };

  const startRestore = () => {
    setStep(0);
    setState("RESTORING");
    setLines((old) => [...old, { tone: "command", text: "$ terraform apply -auto-approve" }, { tone: "warning", text: "Simulation started. Recreating illustrative resources..." }]);
  };

  const reset = () => {
    setState("ACTIVE");
    setStep(0);
    setConfirm(false);
    setLines(initialLines);
  };

  const copyLog = async () => {
    const text = lines.map((line) => line.text).join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard access can be unavailable in some browser contexts.
    }
  };

  return (
    <section className="section simulator-section" id="simulator">
      <div className="section-heading">
        <div>
          <span className="eyebrow"><span className="eyebrow-dot" /> INTERACTIVE DEMONSTRATION</span>
          <h2>Terraform <span className="gradient-text">Lifecycle Lab</span></h2>
          <p className="section-intro">Explore a simulated infrastructure teardown and recovery workflow. The commands and resource events are illustrative, not executed.</p>
        </div>
        <span className="simulation-pill"><span /> SIMULATION MODE</span>
      </div>

      <div className="simulator-shell">
        <div className="sim-topbar">
          <div className="window-controls"><i /><i /><i /></div>
          <div className="terminal-title"><TerminalIcon size={14} /> infrastructure-control / terraform</div>
          <button className="icon-button" onClick={copyLog} aria-label="Copy terminal log" title="Copy terminal log"><Copy size={15} /></button>
        </div>

        <div className="sim-grid">
          <div className="terminal-pane">
            <div className="terminal-meta"><span>TERMINAL OUTPUT</span><span>bash · read-only simulation</span></div>
            <div className="terminal-output" ref={terminalRef} aria-live="polite">
              {lines.map((line, index) => (
                <div className={`terminal-line ${line.tone}`} key={`${index}-${line.text}`}>
                  {line.text}
                </div>
              ))}
              {isBusy && <div className="terminal-line cursor-line">▌</div>}
            </div>
            <div className="terminal-foot"><span className="live-dot" /> SESSION LOCAL TO THIS BROWSER</div>
          </div>

          <aside className="sim-control-pane">
            <div className="control-heading"><Cloud size={18} /><span>ENVIRONMENT STATUS</span></div>
            <div className={`environment-status ${state.toLowerCase()}`}>
              <div className="status-icon">
                {state === "DESTROYED" ? <Trash2 size={22} /> : state === "DESTROYING" ? <Zap size={22} /> : state === "RESTORING" ? <RotateCcw size={22} /> : <ShieldCheck size={22} />}
              </div>
              <div><strong>{state}</strong><small>{state === "ACTIVE" ? "Environment available" : state === "DESTROYED" ? "Simulated resources removed" : state === "DESTROYING" ? "Teardown in progress" : "Provisioning in progress"}</small></div>
            </div>
            <div className="progress-label"><span>Lifecycle progress</span><strong>{progress}%</strong></div>
            <div className="progress-track"><motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} /></div>
            <div className="resource-list">
              {["IAM execution role", "S3 website bucket", "CloudFront distribution", "Route 53 record"].map((resource) => (
                <div className="resource-row" key={resource}>
                  <span className={`resource-indicator ${state === "DESTROYED" ? "off" : state === "DESTROYING" && step > 0 ? "changing" : state === "RESTORING" && step > 0 ? "changing" : "on"}`} />
                  <span>{resource}</span>
                  <small>{state === "DESTROYED" ? "REMOVED" : state === "RESTORING" && step > 0 ? "CREATING" : state === "DESTROYING" && step > 0 ? "REMOVING" : "READY"}</small>
                </div>
              ))}
            </div>
            <div className="sim-actions">
              {state === "ACTIVE" && <button className="button button-danger button-full" onClick={() => setConfirm(true)}><Trash2 size={16} /> terraform destroy</button>}
              {state === "DESTROYED" && <button className="button button-primary button-full" onClick={startRestore}><RotateCcw size={16} /> terraform apply / restore</button>}
              {isBusy && <button className="button button-muted button-full" disabled><span className="spinner" /> {state === "DESTROYING" ? "Destroying resources..." : "Restoring resources..."}</button>}
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
    </section>
  );
}