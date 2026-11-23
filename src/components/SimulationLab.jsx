import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity, AlertTriangle, ArrowUpRight, Boxes, Github, KeyRound, Play,
  RotateCcw, ShieldAlert, ShieldCheck, Terminal as TerminalIcon
} from "lucide-react";
import TerraformSimulator from "./TerraformSimulator.jsx";
import CopyButton from "./CopyButton.jsx";

/* ---------- shared helpers ---------- */

function useRunner(initial = []) {
  const [lines, setLines] = useState(initial);
  const [busy, setBusy] = useState(false);
  const timers = useRef([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);

  const run = (steps, onDone) => {
    clear();
    setBusy(true);
    let t = 0;
    steps.forEach((step, i) => {
      t += step.delay ?? 650;
      timers.current.push(setTimeout(() => {
        setLines((old) => [...old, { tone: step.tone || "normal", text: step.text }]);
        if (step.fx) step.fx();
        if (i === steps.length - 1) { setBusy(false); if (onDone) onDone(); }
      }, t));
    });
  };
  const push = (items) => setLines((old) => [...old, ...items]);
  const reset = () => { clear(); setBusy(false); setLines(initial); };
  return { lines, busy, run, push, reset };
}

function TerminalPane({ lines, busy, label = "bash · read-only simulation" }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [lines]);
  return (
    <div className="terminal-pane">
      <div className="terminal-meta"><span>TERMINAL OUTPUT</span><span>{label}</span></div>
      <div className="terminal-output" ref={ref} aria-live="polite">
        {lines.map((line, i) => <div className={`terminal-line ${line.tone}`} key={`${i}-${line.text}`}>{line.text}</div>)}
        {busy && <div className="terminal-line cursor-line">▌</div>}
      </div>
      <div className="terminal-foot"><span className="live-dot" /> SESSION LOCAL TO THIS BROWSER</div>
    </div>
  );
}

function Shell({ title, lines, children }) {
  return (
    <div className="simulator-shell">
      <div className="sim-topbar">
        <div className="window-controls"><i /><i /><i /></div>
        <div className="terminal-title"><TerminalIcon size={14} /> {title}</div>
        <CopyButton getText={() => lines.map((l) => l.text).join("\n")} />
      </div>
      <div className="sim-grid">{children}</div>
      <div className="sim-disclaimer"><AlertTriangle size={14} /><span>Safe demo only: nothing here connects to AWS, GitHub or Terraform. Output is scripted and illustrative.</span></div>
    </div>
  );
}

function Brief({ title, summary, tags, repo }) {
  return (
    <div className="scenario-brief">
      <div>
        <span className="kind-badge concept">CONCEPTUAL DEMONSTRATION</span>
        <strong>{title}</strong>
        <p>{summary}</p>
        <div className="tag-list">{tags.map((t) => <span key={t}>{t}</span>)}</div>
      </div>
      {repo && <a className="repo-link" href={`https://github.com/damanpreet-cloud/${repo}`} target="_blank" rel="noreferrer"><Github size={14} /> {repo} <ArrowUpRight size={13} /></a>}
    </div>
  );
}

/* ---------- Scenario: GitHub Actions OIDC ---------- */

const TRUSTED_REPO = "damanpreet-cloud/github-actions-oidc-aws";
const OIDC_INTRO = [
  { tone: "muted", text: "# GitHub Actions → AWS via OIDC · SIMULATION ONLY" },
  { tone: "muted", text: "# Pick a repository and branch, then run the workflow." },
  { tone: "normal", text: "No AWS access keys are stored in the repository." }
];

function OidcScenario() {
  const [repo, setRepo] = useState(TRUSTED_REPO);
  const [branch, setBranch] = useState("main");
  const [outcome, setOutcome] = useState("idle");
  const r = useRunner(OIDC_INTRO);
  const sub = `repo:${repo}:ref:refs/heads/${branch}`;

  const runWorkflow = () => {
    const allowed = repo === TRUSTED_REPO && branch === "main";
    setOutcome("running");
    r.push([{ tone: "command", text: "$ gh workflow run deploy.yml" }]);
    const steps = [
      { text: `Workflow started: ${repo} @ ${branch}` },
      { text: "Requesting OIDC token from token.actions.githubusercontent.com..." },
      { text: `Token issued · sub = ${sub}` },
      { text: "Calling sts:AssumeRoleWithWebIdentity (role/github-deploy-role)..." },
      { tone: "warning", text: `Checking trust policy: sub must equal repo:${TRUSTED_REPO}:ref:refs/heads/main` }
    ];
    if (allowed) {
      steps.push(
        { tone: "success", text: "Trust policy matched." },
        { tone: "success", text: "Short-lived credentials issued. They expire automatically." },
        { tone: "success", text: "Deploy job authenticated with a scoped, least-privilege role.", fx: () => setOutcome("granted") }
      );
    } else {
      steps.push(
        { tone: "danger", text: "AccessDenied: not authorized to perform sts:AssumeRoleWithWebIdentity" },
        { tone: "warning", text: "Subject claim did not match the trust policy. No credentials issued.", fx: () => setOutcome("denied") }
      );
    }
    r.run(steps);
  };

  const reset = () => { r.reset(); setOutcome("idle"); };
  const cls = outcome === "denied" ? "destroyed" : outcome === "running" ? "restoring" : "";

  return (
    <>
      <Brief title="Keyless CI/CD with scoped IAM roles" summary="Replaced long-lived AWS credentials with federated GitHub Actions authentication across 30+ repositories. Try a trusted run, then an untrusted one." tags={["OIDC", "IAM", "GitHub Actions", "STS"]} repo="github-actions-oidc-aws" />
      <Shell title="ci-cd / github-actions-oidc" lines={r.lines}>
        <TerminalPane lines={r.lines} busy={r.busy} />
        <aside className="sim-control-pane">
          <div className="control-heading"><KeyRound size={18} /><span>WORKFLOW CONTEXT</span></div>
          <label className="field">REPOSITORY
            <select value={repo} onChange={(e) => setRepo(e.target.value)} disabled={r.busy}>
              <option value={TRUSTED_REPO}>{TRUSTED_REPO}</option>
              <option value="unknown-org/forked-repo">unknown-org/forked-repo</option>
            </select>
          </label>
          <label className="field">BRANCH
            <select value={branch} onChange={(e) => setBranch(e.target.value)} disabled={r.busy}>
              <option value="main">main</option>
              <option value="feature/test">feature/test</option>
            </select>
          </label>
          <div className={`environment-status ${cls}`}>
            <div className="status-icon">{outcome === "denied" ? <ShieldAlert size={22} /> : <ShieldCheck size={22} />}</div>
            <div><strong>{outcome === "idle" ? "READY" : outcome === "running" ? "EVALUATING" : outcome === "granted" ? "ACCESS GRANTED" : "ACCESS DENIED"}</strong><small>{outcome === "granted" ? "Temporary credentials issued" : outcome === "denied" ? "Trust policy rejected the token" : "Waiting for a workflow run"}</small></div>
          </div>
          <pre className="claim-box">{`# illustrative trust-policy condition\nsub: ${sub}\naud: sts.amazonaws.com`}</pre>
          <p className="sim-note">Simplified for the demo. A real trust policy would also pin the audience, and may restrict environments or workflow files.</p>
          <div className="sim-actions">
            <button className="button button-primary button-full" onClick={runWorkflow} disabled={r.busy}><Play size={15} /> Run workflow</button>
            <button className="button button-quiet button-full" onClick={reset} disabled={r.busy}><RotateCcw size={14} /> Reset</button>
          </div>
        </aside>
      </Shell>
    </>
  );
}

/* ---------- Scenario: SCP guardrails ---------- */

const SCP_ACTIONS = [
  { id: "iam", cmd: "aws iam create-user --user-name temp-admin", label: "Create an IAM user", op: "CreateUser", allowed: false, guard: "Identity guardrail: people sign in through IAM Identity Center" },
  { id: "region", cmd: "aws ec2 run-instances --region us-west-2 ...", label: "Launch EC2 in an unapproved region", op: "RunInstances", allowed: false, guard: "Region guardrail: approved regions only" },
  { id: "trail", cmd: "aws cloudtrail stop-logging --name org-trail", label: "Stop CloudTrail logging", op: "StopLogging", allowed: false, guard: "Audit guardrail: logging cannot be disabled" },
  { id: "leave", cmd: "aws organizations leave-organization", label: "Leave the AWS Organization", op: "LeaveOrganization", allowed: false, guard: "Organization guardrail: accounts cannot leave" },
  { id: "s3", cmd: "aws s3api create-bucket --region ca-central-1 ...", label: "Create an S3 bucket in an approved region", op: "CreateBucket", allowed: true },
  { id: "ec2", cmd: "aws ec2 run-instances --region ca-central-1 ...", label: "Launch EC2 in an approved region", op: "RunInstances", allowed: true }
];
const SCP_INTRO = [
  { tone: "muted", text: "# AWS Organizations · Service Control Policies · SIMULATION ONLY" },
  { tone: "muted", text: "# Member account: workload-prod (111122223333, placeholder)" },
  { tone: "normal", text: "Choose an action to attempt from inside the member account." }
];

function ScpScenario() {
  const r = useRunner(SCP_INTRO);
  const [tally, setTally] = useState({ allowed: 0, blocked: 0 });

  const attempt = (a) => {
    r.push([{ tone: "command", text: `$ ${a.cmd}` }]);
    const steps = a.allowed
      ? [{ delay: 500, tone: "warning", text: "Evaluating SCPs and IAM permissions..." }, { delay: 600, tone: "success", text: `${a.op}: not blocked by the example SCPs. IAM permissions would still apply.`, fx: () => setTally((t) => ({ ...t, allowed: t.allowed + 1 })) }]
      : [{ delay: 500, tone: "warning", text: "Evaluating SCPs and IAM permissions..." }, { delay: 600, tone: "danger", text: `An error occurred (AccessDenied) when calling ${a.op}: blocked by an example guardrail SCP (illustrative).` }, { delay: 300, tone: "muted", text: a.guard, fx: () => setTally((t) => ({ ...t, blocked: t.blocked + 1 })) }];
    r.run(steps);
  };
  const reset = () => { r.reset(); setTally({ allowed: 0, blocked: 0 }); };

  return (
    <>
      <Brief title="Multi-account governance guardrails" summary="Supported an eight-account AWS Organization using Control Tower and SCPs. Try risky and safe actions and see which guardrails respond. The policies shown are illustrative." tags={["Control Tower", "Organizations", "SCPs", "IAM Identity Center"]} repo="aws-landing-zone-terraform" />
      <Shell title="aws-organizations / scp-guardrails" lines={r.lines}>
        <TerminalPane lines={r.lines} busy={r.busy} />
        <aside className="sim-control-pane">
          <div className="control-heading"><ShieldAlert size={18} /><span>ATTEMPT AN ACTION</span></div>
          <div className="action-list">
            {SCP_ACTIONS.map((a) => <button key={a.id} className="action-btn" onClick={() => attempt(a)} disabled={r.busy}><span>{a.label}</span><small className={a.allowed ? "ok" : "risk"}>{a.allowed ? "SAFE" : "RISKY"}</small></button>)}
          </div>
          <p className="sim-note">The real result depends on which SCPs are attached and on the caller&apos;s IAM permissions. An action can also be denied by IAM without any SCP involved.</p>
          <div className="tally"><div><strong>{tally.blocked}</strong><span>BLOCKED</span></div><div><strong>{tally.allowed}</strong><span>ALLOWED</span></div></div>
          <div className="sim-actions"><button className="button button-quiet button-full" onClick={reset} disabled={r.busy}><RotateCcw size={14} /> Reset</button></div>
        </aside>
      </Shell>
    </>
  );
}

/* ---------- Scenario: Multi-AZ failover ---------- */

const AZS = ["ca-central-1a", "ca-central-1b", "ca-central-1d"];
const DR_INTRO = [
  { tone: "muted", text: "# Multi-AZ resilience drill · SIMULATION ONLY" },
  { tone: "command", text: "$ aws elbv2 describe-target-health" },
  { tone: "success", text: "All targets healthy in ca-central-1a, 1b and 1d." },
  { tone: "muted", text: "RDS Multi-AZ: primary in 1a, standby in 1b." }
];

function DrScenario() {
  const r = useRunner(DR_INTRO);
  const [phase, setPhase] = useState("healthy"); // healthy | failing | degraded | recovering
  const [azA, setAzA] = useState("up");
  const [traffic, setTraffic] = useState([33, 33, 34]);
  const [rds, setRds] = useState({ primary: 0, standby: 1 });
  const [lb, setLb] = useState("balanced");
  const [db, setDb] = useState("primary 1a");

  const failAz = () => {
    setPhase("failing");
    r.push([{ tone: "command", text: "$ simulate az-impairment --az ca-central-1a" }]);
    r.run([
      { tone: "warning", text: "AZ ca-central-1a impaired (simulated)." },
      { tone: "danger", text: "[ALB] Targets in 1a failing health checks.", fx: () => setAzA("down") },
      { text: "[ALB] Deregistering unhealthy targets, shifting traffic to 1b and 1d.", fx: () => { setTraffic([0, 50, 50]); setLb("rerouted"); } },
      { tone: "warning", text: "[RDS] Primary in 1a unreachable. Database failover is separate from load-balancer routing.", fx: () => setDb("failing over") },
      { tone: "success", text: "[RDS] Standby in 1b promoted to primary.", fx: () => { setRds({ primary: 1, standby: null }); setDb("promoted"); } },
      { tone: "success", text: "Application serving from 1b and 1d. Error rate back to baseline.", fx: () => setPhase("degraded") },
      { tone: "muted", text: "Runbook step recorded: AZ impairment drill." }
    ]);
  };

  const restoreAz = () => {
    setPhase("recovering");
    r.push([{ tone: "command", text: "$ simulate az-recovery --az ca-central-1a" }]);
    r.run([
      { text: "ca-central-1a capacity restored.", fx: () => setAzA("up") },
      { tone: "success", text: "[ALB] Targets registered, health checks passing.", fx: () => { setTraffic([33, 33, 34]); setLb("balanced"); } },
      { tone: "success", text: "[RDS] New standby established in 1a.", fx: () => { setRds({ primary: 1, standby: 0 }); setDb("standby restored"); } },
      { tone: "success", text: "Environment healthy across all three AZs.", fx: () => setPhase("healthy") },
      { tone: "muted", text: "Next: post-incident review, then update the runbook." }
    ]);
  };

  const reset = () => { r.reset(); setPhase("healthy"); setAzA("up"); setTraffic([33, 33, 34]); setRds({ primary: 0, standby: 1 }); setLb("balanced"); setDb("primary 1a"); };
  const cls = { healthy: "", failing: "destroying", degraded: "destroyed", recovering: "restoring" }[phase];
  const label = { healthy: "HEALTHY", failing: "FAILING OVER", degraded: "AZ DOWN · SERVING", recovering: "RECOVERING" }[phase];

  return (
    <>
      <Brief title="Resilience you can test" summary="Supported AWS Elastic Disaster Recovery, Veeam backups and Multi-AZ failover testing, with post-incident reviews feeding back into runbooks. Fail an AZ and watch traffic and the database move." tags={["Multi-AZ", "RDS", "ALB", "Runbooks"]} repo="aws-dr-resilience-toolkit" />
      <Shell title="resilience / multi-az-drill" lines={r.lines}>
        <TerminalPane lines={r.lines} busy={r.busy} />
        <aside className="sim-control-pane">
          <div className="control-heading"><Activity size={18} /><span>AVAILABILITY ZONES</span></div>
          <div className={`environment-status ${cls}`}>
            <div className="status-icon"><Activity size={22} /></div>
            <div><strong>{label}</strong><small>{phase === "degraded" ? "Traffic shifted, database promoted" : phase === "healthy" ? "All zones serving traffic" : "Drill in progress"}</small></div>
          </div>
          <div className="az-list">
            {AZS.map((az, i) => {
              const down = i === 0 && azA === "down";
              const role = rds.primary === i ? "RDS PRIMARY" : rds.standby === i ? "RDS STANDBY" : "APP ONLY";
              return (
                <div className="az-row" key={az}>
                  <div className="az-head"><span className={`resource-indicator ${down ? "off" : "on"}`} /><strong>{az}</strong><small>{down ? "IMPAIRED" : role}</small></div>
                  <div className="progress-track az-track"><motion.div className="progress-fill" animate={{ width: `${traffic[i]}%` }} transition={{ duration: 0.5 }} /></div>
                  <span className="az-pct">{traffic[i]}%</span>
                </div>
              );
            })}
          </div>
          <div className="two-lane">
            <div><span>LOAD BALANCER</span><strong>{lb}</strong><small>Health checks route traffic</small></div>
            <div><span>DATABASE</span><strong>{db}</strong><small>RDS Multi-AZ failover</small></div>
          </div>
          <p className="sim-note">These are two separate mechanisms: the load balancer reacts to health checks within seconds, while the database promotes its standby on its own timeline.</p>
          <div className="sim-actions">
            {phase === "healthy" && <button className="button button-danger button-full" onClick={failAz} disabled={r.busy}><Play size={15} /> Fail ca-central-1a</button>}
            {phase === "degraded" && <button className="button button-primary button-full" onClick={restoreAz} disabled={r.busy}><RotateCcw size={15} /> Restore ca-central-1a</button>}
            {(phase === "failing" || phase === "recovering") && <button className="button button-muted button-full" disabled><span className="spinner" /> Working...</button>}
            <button className="button button-quiet button-full" onClick={reset} disabled={r.busy}><RotateCcw size={14} /> Reset</button>
          </div>
        </aside>
      </Shell>
    </>
  );
}

/* ---------- Lab wrapper ---------- */

const scenarios = [
  { id: "terraform", label: "Terraform lifecycle", Icon: Boxes, Component: TerraformSimulator, brief: { title: "Repeatable infrastructure through IaC", summary: "Destroy and rebuild an environment from code. This is the core idea behind the reusable Terraform patterns I worked on for private EKS and landing zones.", tags: ["Terraform", "IaC", "EKS", "Repeatability"], repo: "terraform-aws-modules" } },
  { id: "oidc", label: "Keyless CI/CD", Icon: KeyRound, Component: OidcScenario },
  { id: "scp", label: "Org guardrails", Icon: ShieldAlert, Component: ScpScenario },
  { id: "dr", label: "AZ failover drill", Icon: Activity, Component: DrScenario }
];

export default function SimulationLab() {
  const [active, setActive] = useState("terraform");
  const current = scenarios.find((s) => s.id === active);
  const Current = current.Component;

  return (
    <section className="section section-wrap simulator-section" id="simulator">
      <div className="section-heading">
        <div>
          <span className="eyebrow"><span className="eyebrow-dot" /> INTERACTIVE DEMONSTRATIONS</span>
          <h2>Simulation <span className="gradient-text">Lab</span></h2>
          <p className="section-intro">Click through scripted scenarios based on my project work: infrastructure as code, keyless CI/CD, organization guardrails and failover drills. Everything runs in your browser and nothing connects to AWS, GitHub or Terraform.</p>
        </div>
        <span className="simulation-pill"><span /> SIMULATION MODE</span>
      </div>

      <div className="lab-tabs" role="tablist" aria-label="Simulation scenarios">
        {scenarios.map(({ id, label, Icon }) => (
          <button key={id} role="tab" aria-selected={active === id} className={active === id ? "lab-tab active" : "lab-tab"} onClick={() => setActive(id)}><Icon size={16} />{label}</button>
        ))}
      </div>

      {current.brief && <Brief {...current.brief} />}
      <Current key={active} />
    </section>
  );
}
