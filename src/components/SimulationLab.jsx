import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity, AlertTriangle, ArrowUpRight, Boxes, Bug, Lock, Search, Shield, FolderLock, GitBranch, Github, KeyRound, Play,
  RotateCcw, ShieldAlert, ShieldCheck, Siren, Terminal as TerminalIcon, UserCheck
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

/* ---------- Scenario: SFTP vendor isolation ---------- */

const SFTP_INTRO = [
  { tone: "muted", text: "# AWS Transfer Family + S3 · vendor isolation · SIMULATION ONLY" },
  { tone: "command", text: "$ sftp vendor-a@s-xxxxxxxx.server.transfer.amazonaws.com" },
  { tone: "success", text: "Connected. Home directory mapped to vendor-a/." },
  { tone: "muted", text: "Managed service: there are no EC2 servers to patch." }
];

function SftpScenario() {
  const r = useRunner(SFTP_INTRO);
  const [vendor, setVendor] = useState("vendor-a");
  const [tally, setTally] = useState({ allowed: 0, blocked: 0 });
  const other = vendor === "vendor-a" ? "vendor-b" : "vendor-a";
  const bump = (k) => () => setTally((t) => ({ ...t, [k]: t[k] + 1 }));

  const changeVendor = (v) => {
    setVendor(v);
    r.push([
      { tone: "command", text: `$ sftp ${v}@s-xxxxxxxx.server.transfer.amazonaws.com` },
      { tone: "success", text: `Connected. Home directory mapped to ${v}/.` }
    ]);
  };

  const actions = {
    list: { label: "List my folder", cmd: `sftp> ls /${vendor}/`, steps: [{ tone: "success", text: `3 files in ${vendor}/ (sample data).`, fx: bump("allowed") }] },
    upload: { label: "Upload report.csv", cmd: `sftp> put report.csv /${vendor}/inbound/`, steps: [{ tone: "success", text: `Uploaded to s3://<bucket>/${vendor}/inbound/report.csv`, fx: bump("allowed") }] },
    cross: { label: "Open another vendor's folder", cmd: `sftp> ls /${other}/`, steps: [{ tone: "danger", text: `Permission denied: the IAM role for ${vendor} only allows the ${vendor}/ prefix.`, fx: bump("blocked") }, { tone: "muted", text: "No data from another vendor was exposed." }] },
    lifecycle: { label: "Run S3 lifecycle rule", cmd: "# S3 lifecycle evaluation (scheduled)", steps: [{ tone: "normal", text: "Evaluating objects against the retention rule..." }, { tone: "success", text: "Objects past retention were transitioned or expired automatically. No manual clean-up job." }] }
  };
  const run = (k) => { const a = actions[k]; r.push([{ tone: "command", text: a.cmd }]); r.run(a.steps.map((x) => ({ delay: 500, ...x }))); };
  const reset = () => { r.reset(); setVendor("vendor-a"); setTally({ allowed: 0, blocked: 0 }); };

  return (
    <>
      <Brief title="Managed SFTP with vendor-isolated access" summary="Modernized a legacy EC2-based FTP/FTPS/SFTP service onto AWS Transfer Family and S3. Sign in as a vendor and try to reach another vendor's data." tags={["Transfer Family", "S3", "IAM roles", "Lifecycle policies"]} />
      <Shell title="transfer-family / vendor-isolation" lines={r.lines}>
        <TerminalPane lines={r.lines} busy={r.busy} label="sftp · read-only simulation" />
        <aside className="sim-control-pane">
          <div className="control-heading"><FolderLock size={18} /><span>SIGNED IN AS</span></div>
          <label className="field">VENDOR USER
            <select value={vendor} onChange={(e) => changeVendor(e.target.value)} disabled={r.busy}>
              <option value="vendor-a">vendor-a</option>
              <option value="vendor-b">vendor-b</option>
            </select>
          </label>
          <div className="action-list">
            {Object.entries(actions).map(([k, a]) => <button key={k} className="action-btn" onClick={() => run(k)} disabled={r.busy}><span>{a.label}</span>{k === "cross" && <small className="risk">TEST</small>}</button>)}
          </div>
          <div className="tally"><div><strong>{tally.blocked}</strong><span>BLOCKED</span></div><div><strong>{tally.allowed}</strong><span>ALLOWED</span></div></div>
          <div className="sim-actions"><button className="button button-quiet button-full" onClick={reset} disabled={r.busy}><RotateCcw size={14} /> Reset</button></div>
        </aside>
      </Shell>
    </>
  );
}

/* ---------- Scenario: Entra ID SSO with group-based access ---------- */

const SSO_INTRO = [
  { tone: "muted", text: "# Entra ID → AWS IAM Identity Center · SAML + SCIM · SIMULATION ONLY" },
  { tone: "muted", text: "# Access is controlled by Active Directory / Entra group membership." },
  { tone: "normal", text: "Choose a user, change group membership, then try to sign in." }
];
const GROUP = "aws-platform-engineers";

function SsoScenario() {
  const r = useRunner(SSO_INTRO);
  const [members, setMembers] = useState({ "engineer-a": true, "contractor-b": false });
  const [user, setUser] = useState("engineer-a");
  const [outcome, setOutcome] = useState("idle");
  const isMember = members[user];

  const setMembership = (value) => {
    r.push([{ tone: "command", text: `$ ${value ? "add" : "remove"} ${user} ${value ? "to" : "from"} group ${GROUP}` }]);
    r.run([
      { delay: 500, text: "Entra ID updated the group." },
      { delay: 600, tone: "success", text: `SCIM sync: ${user} ${value ? "provisioned in" : "deprovisioned from"} IAM Identity Center.`, fx: () => { setMembers((m) => ({ ...m, [user]: value })); setOutcome("idle"); } }
    ]);
  };

  const signIn = () => {
    setOutcome("running");
    r.push([{ tone: "command", text: `$ sign in as ${user} (AWS access portal)` }]);
    const steps = [
      { delay: 500, text: "SAML request sent to Entra ID." },
      { delay: 600, tone: "warning", text: `Checking assignment: is ${user} in ${GROUP}?` }
    ];
    if (isMember) steps.push(
      { delay: 600, tone: "success", text: "SAML assertion issued. Identity Center maps the group to a permission set." },
      { delay: 500, tone: "success", text: "Signed in with a role scoped to the assigned accounts.", fx: () => setOutcome("granted") }
    );
    else steps.push(
      { delay: 600, tone: "danger", text: "Sign-in blocked: the user is not assigned to this application." },
      { delay: 400, tone: "muted", text: "No AWS session was created.", fx: () => setOutcome("denied") }
    );
    r.run(steps);
  };
  const reset = () => { r.reset(); setMembers({ "engineer-a": true, "contractor-b": false }); setUser("engineer-a"); setOutcome("idle"); };
  const cls = outcome === "denied" ? "destroyed" : outcome === "running" ? "restoring" : "";

  return (
    <>
      <Brief title="Single sign-on with group-based access" summary="Built Entra ID enterprise-application SSO (SAML, SCIM) for AWS, Salesforce and other apps, with access controlled through Active Directory groups. Change a group and watch access follow." tags={["Entra ID", "SAML", "SCIM", "IAM Identity Center", "Active Directory"]} />
      <Shell title="identity / entra-sso-aws" lines={r.lines}>
        <TerminalPane lines={r.lines} busy={r.busy} label="identity · read-only simulation" />
        <aside className="sim-control-pane">
          <div className="control-heading"><UserCheck size={18} /><span>USER AND GROUP</span></div>
          <label className="field">USER
            <select value={user} onChange={(e) => { setUser(e.target.value); setOutcome("idle"); }} disabled={r.busy}>
              <option value="engineer-a">engineer-a</option>
              <option value="contractor-b">contractor-b</option>
            </select>
          </label>
          <div className={`environment-status ${cls}`}>
            <div className="status-icon">{outcome === "denied" ? <ShieldAlert size={22} /> : <UserCheck size={22} />}</div>
            <div><strong>{outcome === "granted" ? "SIGNED IN" : outcome === "denied" ? "SIGN-IN BLOCKED" : outcome === "running" ? "AUTHENTICATING" : isMember ? "IN GROUP" : "NOT IN GROUP"}</strong><small>{GROUP}</small></div>
          </div>
          <div className="sim-actions">
            <button className="button button-primary button-full" onClick={signIn} disabled={r.busy}><Play size={15} /> Sign in to AWS</button>
            {isMember
              ? <button className="button button-danger button-full" onClick={() => setMembership(false)} disabled={r.busy}>Remove from group</button>
              : <button className="button button-muted button-full" onClick={() => setMembership(true)} disabled={r.busy}>Add to group</button>}
            <button className="button button-quiet button-full" onClick={reset} disabled={r.busy}><RotateCcw size={14} /> Reset</button>
          </div>
        </aside>
      </Shell>
    </>
  );
}

/* ---------- Scenario: EKS GitOps drift and rollback ---------- */

const GITOPS_INTRO = [
  { tone: "muted", text: "# Argo CD GitOps on private EKS · SIMULATION ONLY" },
  { tone: "command", text: "$ argocd app get web" },
  { tone: "success", text: "Sync: Synced · Health: Healthy · replicas: 3 · image: v1.0" },
  { tone: "muted", text: "Git is the source of truth for the cluster." }
];

function GitopsScenario() {
  const r = useRunner(GITOPS_INTRO);
  const [git, setGit] = useState({ replicas: 3, image: "v1.0" });
  const [cluster, setCluster] = useState({ replicas: 3, image: "v1.0", healthy: true });
  const [sync, setSync] = useState("Synced");

  const commitScale = () => {
    r.push([{ tone: "command", text: "$ git commit -m 'scale web to 5 replicas' && git push" }]);
    r.run([
      { text: "Argo CD detected a new commit.", fx: () => { setGit((g) => ({ ...g, replicas: 5 })); setSync("OutOfSync"); } },
      { tone: "warning", text: "Sync: OutOfSync. Auto-sync is applying the change..." },
      { tone: "success", text: "Cluster now matches Git: 5 replicas running.", fx: () => { setCluster((c) => ({ ...c, replicas: 5 })); setSync("Synced"); } }
    ]);
  };

  const drift = () => {
    r.push([{ tone: "command", text: "$ kubectl scale deploy/web --replicas=1   # manual change" }]);
    r.run([
      { text: "Cluster changed outside of Git.", fx: () => { setCluster((c) => ({ ...c, replicas: 1 })); setSync("OutOfSync"); } },
      { tone: "warning", text: "Argo CD: drift detected (cluster 1 vs Git).", fx: () => {} },
      { tone: "success", text: "Self-heal reverted the cluster to the Git state.", fx: () => { setCluster((c) => ({ ...c, replicas: git.replicas })); setSync("Synced"); } }
    ]);
  };

  const badDeploy = () => {
    r.push([{ tone: "command", text: "$ git commit -m 'bump image to v9.9' && git push" }]);
    r.run([
      { text: "Argo CD synced the new image tag.", fx: () => { setGit((g) => ({ ...g, image: "v9.9" })); setCluster((c) => ({ ...c, image: "v9.9", healthy: false })); setSync("Synced"); } },
      { tone: "danger", text: "Pods: ImagePullBackOff. Health: Degraded." },
      { tone: "warning", text: "Fix path: revert the commit in Git rather than patching the cluster." }
    ]);
  };

  const revert = () => {
    r.push([{ tone: "command", text: "$ git revert HEAD && git push" }]);
    r.run([
      { text: "Argo CD detected the revert commit.", fx: () => { setGit((g) => ({ ...g, image: "v1.0" })); setSync("OutOfSync"); } },
      { tone: "success", text: "Rolled back to image v1.0. Health: Healthy.", fx: () => { setCluster((c) => ({ ...c, image: "v1.0", healthy: true })); setSync("Synced"); } },
      { tone: "muted", text: "The change history lives in Git, so rollback is reviewable." }
    ]);
  };

  const reset = () => { r.reset(); setGit({ replicas: 3, image: "v1.0" }); setCluster({ replicas: 3, image: "v1.0", healthy: true }); setSync("Synced"); };
  const bad = !cluster.healthy;
  const cls = bad ? "destroyed" : sync === "OutOfSync" ? "restoring" : "";

  return (
    <>
      <Brief title="GitOps delivery on private EKS" summary="Worked on private EKS environments with Argo CD delivery. Scale through Git, try a manual change, then ship a bad image and recover with a revert." tags={["EKS", "Argo CD", "GitOps", "Kubernetes"]} repo="terraform-aws-modules" />
      <Shell title="eks / argocd-gitops" lines={r.lines}>
        <TerminalPane lines={r.lines} busy={r.busy} label="kubectl · read-only simulation" />
        <aside className="sim-control-pane">
          <div className="control-heading"><GitBranch size={18} /><span>CLUSTER VS GIT</span></div>
          <div className={`environment-status ${cls}`}>
            <div className="status-icon"><GitBranch size={22} /></div>
            <div><strong>{bad ? "DEGRADED" : sync.toUpperCase()}</strong><small>Git: {git.replicas} replicas · {git.image} &nbsp;|&nbsp; Cluster: {cluster.replicas} · {cluster.image}</small></div>
          </div>
          <div className="pod-grid" aria-label={`${cluster.replicas} pods`}>
            {Array.from({ length: cluster.replicas }).map((_, i) => <span key={i} className={bad ? "pod bad" : "pod"} />)}
          </div>
          <div className="action-list">
            <button className="action-btn" onClick={commitScale} disabled={r.busy || bad}><span>Commit: scale to 5 replicas</span></button>
            <button className="action-btn" onClick={drift} disabled={r.busy || bad}><span>Manual change: kubectl scale to 1</span><small className="risk">DRIFT</small></button>
            <button className="action-btn" onClick={badDeploy} disabled={r.busy || bad}><span>Deploy a bad image tag</span><small className="risk">BREAK</small></button>
            <button className="action-btn" onClick={revert} disabled={r.busy || !bad}><span>Recover: git revert</span><small className="ok">FIX</small></button>
          </div>
          <div className="sim-actions"><button className="button button-quiet button-full" onClick={reset} disabled={r.busy}><RotateCcw size={14} /> Reset</button></div>
        </aside>
      </Shell>
    </>
  );
}

/* ---------- Scenario: Incident triage ---------- */

const INCIDENTS = {
  deploy: { label: "5xx spike after a deployment", steps: [
    { tone: "danger", text: "[CloudWatch] Alarm: ALB HTTPCode_Target_5XX_Count above threshold." },
    { text: "[ALB] Target health: new targets unhealthy, old targets healthy." },
    { text: "[Pipeline] Correlating: a deployment finished 6 minutes before the alarm." },
    { tone: "warning", text: "Decision: roll back first, investigate second." },
    { tone: "success", text: "[Pipeline] Rolled back to the previous release. 5xx rate returning to baseline." },
    { tone: "muted", text: "Follow-up: post-incident review, add a health check to the pipeline gate, update the runbook." }
  ] },
  db: { label: "Database connections exhausted", steps: [
    { tone: "danger", text: "[CloudWatch] Alarm: RDS DatabaseConnections near the instance limit." },
    { text: "[App] Timeouts increasing; connection pool errors in the logs." },
    { text: "[RDS] Checking recent change: an application release raised its pool size per instance." },
    { tone: "warning", text: "Decision: restore the pool setting and recycle the affected tasks." },
    { tone: "success", text: "[App] Connections drop; latency recovers." },
    { tone: "muted", text: "Follow-up: add a connection-count alert with headroom and document pool sizing in the runbook." }
  ] },
  iam: { label: "AccessDenied after an IAM change", steps: [
    { tone: "danger", text: "[App] Jobs failing with AccessDenied on s3:GetObject." },
    { text: "[CloudTrail] Looking up recent IAM policy changes for the role." },
    { text: "[Git] The change came from a reviewed Terraform pull request that tightened the policy too far." },
    { tone: "warning", text: "Decision: restore the missing permission through code, not a console edit." },
    { tone: "success", text: "[Terraform] Applied the corrected least-privilege policy. Jobs succeed again." },
    { tone: "muted", text: "Follow-up: add a policy test to the pull-request checks." }
  ] }
};
const INCIDENT_INTRO = [
  { tone: "muted", text: "# 24x7 incident triage · SIMULATION ONLY" },
  { tone: "muted", text: "# Pick an incident and walk through detect → diagnose → mitigate → learn." }
];

function IncidentScenario() {
  const r = useRunner(INCIDENT_INTRO);
  const [key, setKey] = useState("deploy");
  const [phase, setPhase] = useState("idle");

  const start = () => {
    setPhase("running");
    r.push([{ tone: "command", text: `$ incident start "${INCIDENTS[key].label}"` }]);
    r.run(INCIDENTS[key].steps.map((s) => ({ delay: 700, ...s })), () => setPhase("resolved"));
  };
  const reset = () => { r.reset(); setPhase("idle"); };
  const cls = phase === "running" ? "destroying" : "";

  return (
    <>
      <Brief title="Incident response that feeds back into runbooks" summary="Provided 24x7 incident response with CloudWatch, Datadog and Jira ITSM, then ran post-incident reviews. Pick a scenario to see the order of thinking. The incidents are illustrative." tags={["CloudWatch", "Datadog", "Jira ITSM", "Runbooks"]} />
      <Shell title="operations / incident-triage" lines={r.lines}>
        <TerminalPane lines={r.lines} busy={r.busy} label="ops · read-only simulation" />
        <aside className="sim-control-pane">
          <div className="control-heading"><Siren size={18} /><span>INCIDENT</span></div>
          <label className="field">SCENARIO
            <select value={key} onChange={(e) => { setKey(e.target.value); setPhase("idle"); }} disabled={r.busy}>
              {Object.entries(INCIDENTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </label>
          <div className={`environment-status ${cls}`}>
            <div className="status-icon"><Siren size={22} /></div>
            <div><strong>{phase === "idle" ? "STANDBY" : phase === "running" ? "INCIDENT ACTIVE" : "RESOLVED"}</strong><small>{phase === "resolved" ? "Review and runbook update queued" : "Ready for a scenario"}</small></div>
          </div>
          <div className="sim-actions">
            <button className="button button-danger button-full" onClick={start} disabled={r.busy}><Play size={15} /> Start incident</button>
            <button className="button button-quiet button-full" onClick={reset} disabled={r.busy}><RotateCcw size={14} /> Reset</button>
          </div>
        </aside>
      </Shell>
    </>
  );
}


/* ---------- Security scenarios (data-driven) ---------- */

function ActionScenario({ cfg }) {
  const r = useRunner(cfg.intro);
  const [tally, setTally] = useState([0, 0]);
  const attempt = (a) => {
    r.push([{ tone: "command", text: `$ ${a.cmd}` }]);
    r.run(a.steps.map((s) => ({ delay: 550, ...s })), () => setTally((t) => t.map((n, i) => (i === a.k ? n + 1 : n))));
  };
  const reset = () => { r.reset(); setTally([0, 0]); };
  const Icon = cfg.Icon;
  return (
    <>
      <Brief title={cfg.title} summary={cfg.summary} tags={cfg.tags} />
      <Shell title={cfg.shell} lines={r.lines}>
        <TerminalPane lines={r.lines} busy={r.busy} label="security · read-only simulation" />
        <aside className="sim-control-pane">
          <div className="control-heading"><Icon size={18} /><span>{cfg.heading}</span></div>
          <div className="action-list">
            {cfg.actions.map((a) => <button key={a.label} className="action-btn" onClick={() => attempt(a)} disabled={r.busy}><span>{a.label}</span><small className={a.tone}>{a.badge}</small></button>)}
          </div>
          <p className="sim-note">{cfg.note}</p>
          <div className="tally">{cfg.tallyLabels.map((l, i) => <div key={l}><strong>{tally[i]}</strong><span>{l}</span></div>)}</div>
          <div className="sim-actions"><button className="button button-quiet button-full" onClick={reset} disabled={r.busy}><RotateCcw size={14} /> Reset</button></div>
        </aside>
      </Shell>
    </>
  );
}

function PlaybookScenario({ cfg }) {
  const r = useRunner(cfg.intro);
  const [key, setKey] = useState(Object.keys(cfg.items)[0]);
  const [phase, setPhase] = useState("idle");
  const start = () => {
    setPhase("running");
    r.push([{ tone: "command", text: `$ ${cfg.startCmd} "${cfg.items[key].label}"` }]);
    r.run(cfg.items[key].steps.map((s) => ({ delay: 700, ...s })), () => setPhase("resolved"));
  };
  const reset = () => { r.reset(); setPhase("idle"); };
  const Icon = cfg.Icon;
  return (
    <>
      <Brief title={cfg.title} summary={cfg.summary} tags={cfg.tags} />
      <Shell title={cfg.shell} lines={r.lines}>
        <TerminalPane lines={r.lines} busy={r.busy} label="security · read-only simulation" />
        <aside className="sim-control-pane">
          <div className="control-heading"><Icon size={18} /><span>{cfg.heading}</span></div>
          <label className="field">FINDING
            <select value={key} onChange={(e) => { setKey(e.target.value); setPhase("idle"); }} disabled={r.busy}>
              {Object.entries(cfg.items).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </label>
          <div className={`environment-status ${phase === "running" ? "destroying" : ""}`}>
            <div className="status-icon"><Icon size={22} /></div>
            <div><strong>{phase === "idle" ? "MONITORING" : phase === "running" ? "INVESTIGATING" : "CONTAINED"}</strong><small>{phase === "resolved" ? "Findings documented, follow-ups queued" : "Ready for a finding"}</small></div>
          </div>
          <p className="sim-note">{cfg.note}</p>
          <div className="sim-actions">
            <button className="button button-danger button-full" onClick={start} disabled={r.busy}><Play size={15} /> Investigate</button>
            <button className="button button-quiet button-full" onClick={reset} disabled={r.busy}><RotateCcw size={14} /> Reset</button>
          </div>
        </aside>
      </Shell>
    </>
  );
}

const VULN_CFG = {
  Icon: Bug, shell: "security / vulnerability-triage", heading: "FINDINGS QUEUE", tallyLabels: ["REMEDIATED", "TRACKED"],
  title: "Vulnerability triage and remediation",
  summary: "Worked with security teams on vulnerability management across AWS, Windows and Linux, triaging findings from Wiz, Security Hub and Inspector and coordinating patching with engineering owners. Work a finding from detection to verified fix.",
  tags: ["Wiz", "Inspector", "Security Hub", "Patch management"],
  note: "Findings and priorities are illustrative. Real prioritization follows each organization's risk policy and SLAs.",
  intro: [
    { tone: "muted", text: "# Vulnerability management · SIMULATION ONLY" },
    { tone: "muted", text: "# Priority comes from exposure, exploitability and asset criticality, not CVSS score alone." },
    { tone: "normal", text: "Pick a finding to take from detect → prioritize → remediate → verify." }
  ],
  actions: [
    { label: "Internet-facing server, known-exploited CVE", badge: "P1", tone: "risk", k: 0, cmd: "triage open finding-01", steps: [
      { tone: "warning", text: "Finding: critical CVE on an internet-exposed EC2 instance with public exploit activity." },
      { text: "Priority P1: exposure and exploitability outrank the raw score. Owner notified." },
      { text: "Fix: patch through the standard pipeline (Ansible or Systems Manager) in the emergency window." },
      { tone: "success", text: "Rescan: finding no longer detected. Ticket closed with evidence." }] },
    { label: "Public S3 bucket flagged by AWS Config", badge: "P1", tone: "risk", k: 0, cmd: "triage open finding-02", steps: [
      { tone: "warning", text: "Security Hub / Config: bucket allows public read." },
      { text: "CloudTrail: the change traces back to a manual console edit." },
      { text: "Fix: enable Block Public Access through a reviewed Terraform change, not another console edit." },
      { tone: "success", text: "Config rule compliant. A guardrail is added to prevent a repeat." }] },
    { label: "Internal Windows server, missing security update", badge: "P2", tone: "risk", k: 0, cmd: "triage open finding-03", steps: [
      { tone: "warning", text: "Finding: security update missing on an internal server with no internet exposure." },
      { text: "Priority P2: deploy to a pilot collection first, then production in the maintenance window." },
      { text: "SCCM/WSUS: pilot servers patched and healthy after reboot." },
      { tone: "success", text: "Production collection patched. Compliance report updated." }] },
    { label: "Low severity on an isolated test host", badge: "P3", tone: "ok", k: 1, cmd: "triage open finding-04", steps: [
      { text: "Finding: low severity, no network path from the internet, no sensitive data." },
      { tone: "warning", text: "Decision: don't interrupt the team; fix it in the next routine patch cycle." },
      { tone: "muted", text: "Tracked with an owner and a review date so it isn't forgotten." }] }
  ]
};

const ALERT_CFG = {
  Icon: Search, shell: "security / alert-investigation", heading: "SECURITY ALERT", startCmd: "investigate",
  title: "Security alert investigation",
  summary: "Used GuardDuty, Security Hub, CloudTrail and Athena to investigate findings and support root-cause analysis with the security team. Pick an alert and follow the order of thinking: detect, scope, contain, document.",
  tags: ["GuardDuty", "CloudTrail", "Athena", "Security Hub"],
  note: "Scenarios are illustrative. Real investigations depend on the logs, tooling and incident process in place.",
  intro: [
    { tone: "muted", text: "# Alert investigation · SIMULATION ONLY" },
    { tone: "muted", text: "# Detect → scope with logs → contain → document." }
  ],
  items: {
    ssh: { label: "SSH brute force against an EC2 instance", steps: [
      { tone: "danger", text: "[GuardDuty] Repeated failed SSH logins against an instance." },
      { text: "[Security Hub] Finding aggregated with severity and affected resource." },
      { text: "[Athena] Query CloudTrail: a manual change opened port 22 to 0.0.0.0/0 yesterday." },
      { tone: "warning", text: "Contain: close the rule, move the instance to a quarantine security group, snapshot for review." },
      { tone: "success", text: "Rule closed through Terraform. Logs show no successful login from the source." },
      { tone: "muted", text: "Follow-up: add a Config rule against open SSH, update the runbook, share findings with the security team." }] },
    key: { label: "Unusual API calls from an IAM access key", steps: [
      { tone: "danger", text: "[GuardDuty] API calls from an unusual location using an IAM user's access key." },
      { text: "[Athena] Query CloudTrail by access key ID: calls made, source IPs, resources touched." },
      { text: "Scope: read-only calls found; no IAM changes and no data downloads." },
      { tone: "warning", text: "Contain: deactivate the key first, then rotate it and revoke active sessions." },
      { tone: "success", text: "Replaced with short-lived access through IAM Identity Center. Old key deleted." },
      { tone: "muted", text: "Follow-up: find where the key leaked, enable secret scanning, document the timeline." }] },
    s3: { label: "S3 bucket made public", steps: [
      { tone: "danger", text: "[Config / GuardDuty] Bucket policy changed to allow public access." },
      { text: "[CloudTrail] Change made by a deployment role during a pipeline run." },
      { text: "[Athena] Query S3 access logs: no external reads since the change." },
      { tone: "warning", text: "Contain: enable Block Public Access at the account level." },
      { tone: "success", text: "Policy corrected in code. No exposure confirmed." },
      { tone: "muted", text: "Follow-up: add an SCP against disabling Block Public Access and a pipeline check." }] }
  }
};

const EDGE_CFG = {
  Icon: Shield, shell: "security / waf-network-firewall", heading: "SEND TRAFFIC", tallyLabels: ["BLOCKED", "ALLOWED"],
  title: "Layered network defense: WAF and Network Firewall",
  summary: "Supported AWS WAF and AWS Network Firewall alongside VPC and perimeter work. Send inbound and outbound traffic and see which layer responds.",
  tags: ["AWS WAF", "Network Firewall", "Rate limiting", "Egress filtering"],
  note: "Rules are illustrative. Real behavior depends on the rule groups, thresholds and scope-down statements configured. WAF is a layer, not a replacement for secure application code.",
  intro: [
    { tone: "muted", text: "# AWS WAF (inbound) + Network Firewall (outbound) · SIMULATION ONLY" },
    { tone: "normal", text: "Choose a request to send." }
  ],
  actions: [
    { label: "Normal customer request", badge: "SAFE", tone: "ok", k: 1, cmd: "curl https://app.example.com/orders?id=1042", steps: [
      { tone: "warning", text: "Evaluating WAF rules..." }, { tone: "success", text: "No rule matched. Request allowed to the load balancer." }] },
    { label: "Request with a SQL-injection-style string", badge: "RISKY", tone: "risk", k: 0, cmd: "curl 'https://app.example.com/search?q=%27+OR+1%3D1--'", steps: [
      { tone: "warning", text: "Evaluating WAF rules..." }, { tone: "danger", text: "403: blocked by a managed SQL-injection rule group." }, { tone: "muted", text: "Logged for review. The application never saw the request." }] },
    { label: "Burst of requests from one IP", badge: "RISKY", tone: "risk", k: 0, cmd: "load-test --source 203.0.113.9 --rate high", steps: [
      { tone: "warning", text: "Evaluating WAF rules..." }, { tone: "danger", text: "Rate-based rule triggered: source IP blocked temporarily." }, { tone: "muted", text: "Users on other IPs are unaffected." }] },
    { label: "Outbound call to an approved domain", badge: "SAFE", tone: "ok", k: 1, cmd: "curl https://api.partner.example/status   # from a workload", steps: [
      { tone: "warning", text: "Network Firewall: checking the domain allow list..." }, { tone: "success", text: "Domain approved. Egress allowed." }] },
    { label: "Outbound call to an unknown domain", badge: "RISKY", tone: "risk", k: 0, cmd: "curl https://unknown-host.example/upload   # from a workload", steps: [
      { tone: "warning", text: "Network Firewall: checking the domain allow list..." }, { tone: "danger", text: "Domain not on the allow list. Egress dropped and logged." }, { tone: "muted", text: "Limits data exfiltration and command-and-control paths from a compromised workload." }] }
  ]
};

const KMS_CFG = {
  Icon: Lock, shell: "security / kms-secrets-access", heading: "TRY AN ACTION", tallyLabels: ["BLOCKED", "ALLOWED"],
  title: "Encryption, secrets and separation of duties",
  summary: "Implemented KMS encryption, Secrets Manager and least-privilege IAM. Try actions as different roles and see where key policies and guardrails say no.",
  tags: ["KMS", "Secrets Manager", "IAM", "Least privilege"],
  note: "Simplified. The real result depends on IAM policies, the key policy, grants and any SCPs.",
  intro: [
    { tone: "muted", text: "# KMS + Secrets Manager · key policies and separation of duties · SIMULATION ONLY" },
    { tone: "normal", text: "Choose an action to attempt as a given role." }
  ],
  actions: [
    { label: "App role reads its own secret", badge: "SAFE", tone: "ok", k: 1, cmd: "aws secretsmanager get-secret-value --secret-id prod/app/db   # app-role", steps: [
      { tone: "warning", text: "Checking IAM policy, key policy and secret policy..." }, { tone: "success", text: "Allowed: app-role may read this secret and use its KMS key. The call is logged in CloudTrail." }] },
    { label: "Analyst role reads the same secret", badge: "RISKY", tone: "risk", k: 0, cmd: "aws secretsmanager get-secret-value --secret-id prod/app/db   # analyst-role", steps: [
      { tone: "danger", text: "AccessDeniedException: analyst-role is not permitted to read this secret or use its key." }, { tone: "muted", text: "Least privilege: access to logs does not imply access to secrets." }] },
    { label: "Key administrator tries to decrypt data", badge: "RISKY", tone: "risk", k: 0, cmd: "aws kms decrypt --key-id alias/prod-data   # key-admin-role", steps: [
      { tone: "danger", text: "AccessDenied: the key policy grants management, not usage, to key-admin-role." }, { tone: "muted", text: "Separation of duties: the people who manage keys cannot use them to read data." }] },
    { label: "Rotate a secret on a schedule", badge: "SAFE", tone: "ok", k: 1, cmd: "aws secretsmanager rotate-secret --secret-id prod/app/db", steps: [
      { text: "Rotation creates a new credential, tests it, then promotes it." }, { tone: "success", text: "Applications read the current version. No credentials in code or config files." }] },
    { label: "Schedule deletion of the encryption key", badge: "RISKY", tone: "risk", k: 0, cmd: "aws kms schedule-key-deletion --key-id alias/prod-data   # developer-role", steps: [
      { tone: "warning", text: "Evaluating SCPs and key policy..." }, { tone: "danger", text: "Denied by an organization guardrail (illustrative SCP)." }, { tone: "muted", text: "Key deletion becomes irreversible after the waiting period, so it stays tightly restricted." }] }
  ]
};

const VulnScenario = () => <ActionScenario cfg={VULN_CFG} />;
const AlertScenario = () => <PlaybookScenario cfg={ALERT_CFG} />;
const EdgeScenario = () => <ActionScenario cfg={EDGE_CFG} />;
const KmsScenario = () => <ActionScenario cfg={KMS_CFG} />;

/* ---------- Lab wrapper ---------- */

const scenarios = [
  { id: "terraform", label: "Terraform lifecycle", Icon: Boxes, Component: TerraformSimulator, brief: { title: "Repeatable infrastructure through IaC", summary: "Destroy and rebuild an environment from code. This is the core idea behind the reusable Terraform patterns I worked on for private EKS and landing zones.", tags: ["Terraform", "IaC", "EKS", "Repeatability"], repo: "terraform-aws-modules" } },
  { id: "oidc", label: "Keyless CI/CD", Icon: KeyRound, Component: OidcScenario },
  { id: "scp", label: "Org guardrails", Icon: ShieldAlert, Component: ScpScenario },
  { id: "vuln", label: "Vulnerability triage", Icon: Bug, Component: VulnScenario },
  { id: "alert", label: "Alert investigation", Icon: Search, Component: AlertScenario },
  { id: "edge", label: "WAF & Network Firewall", Icon: Shield, Component: EdgeScenario },
  { id: "kms", label: "KMS & secrets", Icon: Lock, Component: KmsScenario },
  { id: "dr", label: "AZ failover drill", Icon: Activity, Component: DrScenario },
  { id: "sftp", label: "Vendor-isolated SFTP", Icon: FolderLock, Component: SftpScenario },
  { id: "sso", label: "Entra SSO access", Icon: UserCheck, Component: SsoScenario },
  { id: "gitops", label: "EKS GitOps", Icon: GitBranch, Component: GitopsScenario },
  { id: "incident", label: "Incident triage", Icon: Siren, Component: IncidentScenario }
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
          <p className="section-intro">Click through scripted scenarios based on my project work: infrastructure as code, keyless CI/CD, organization guardrails, vulnerability triage, security alert investigation, WAF and Network Firewall, KMS and secrets, failover drills, managed SFTP, SSO, GitOps and incident response. Everything runs in your browser and nothing connects to AWS, GitHub or Terraform.</p>
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
