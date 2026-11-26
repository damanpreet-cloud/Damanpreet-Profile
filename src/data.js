export const expertise = [
  { group: "Cloud platforms", items: ["Amazon Web Services", "Microsoft Azure", "Google Cloud", "Hybrid cloud"] },
  { group: "Infrastructure & networking", items: ["VPC & network architecture", "Transit Gateway", "Direct Connect & VPN", "DNS, load balancing", "Palo Alto (Panorama), Cisco & WAF", "Windows & Linux"] },
  { group: "Automation & platforms", items: ["Terraform / IaC", "Kubernetes, EKS, ECS, AKS, GKE", "Docker", "GitHub Actions", "Argo CD", "Ansible & PowerShell"] },
  { group: "Security & operations", items: ["IAM & least privilege", "Cloud governance", "KMS & Secrets Manager", "GuardDuty, Security Hub & Inspector", "Wiz & Darktrace", "Vulnerability management & patching", "CloudTrail & Athena investigation", "Monitoring & incident response", "FinOps"] },
  { group: "Identity & endpoint", items: ["Entra ID SSO (SAML, SCIM)", "Active Directory", "Group Policy", "ADFS", "Intune", "SCCM & WSUS", "Microsoft 365"] },
  { group: "Resilience & recovery", items: ["AWS Elastic Disaster Recovery", "Veeam", "Multi-AZ failover testing", "Backup & recovery planning", "Runbooks", "Post-incident reviews"] }
];

export const experience = [
  {
    role: "Network & Systems Administrator | AWS Cloud Infrastructure & Operations",
    company: "Numeris",
    link: "https://www.linkedin.com/in/damanpreet-singh-chadha/",
    dates: "May 2022 – September 2026 · North York, Ontario, Canada",
    detail: "Designed and supported an eight-account AWS Organization, built reusable Terraform modules across 3 environments, and replaced long-lived AWS credentials with GitHub Actions OIDC across 30+ repositories. Supported EKS and ECS platforms and Entra ID SSO, worked with security teams on vulnerability management, patching and remediation using Wiz, Darktrace, Security Hub, GuardDuty and Inspector, and covered 24x7 on-call (about 10 incidents and 8–10 daily Jira requests a week) for five engineering teams and 30+ engineers."
  },
  {
    role: "Information Technology Manager",
    company: "Get Your Solutions",
    dates: "January 2012 – April 2022 · Panchkula, India",
    detail: "Led IT support and development teams, managed on-premises and cloud infrastructure, established cybersecurity protocols and security audits, and delivered disaster recovery, business continuity and IT budget management."
  },
  {
    role: "Network Manager",
    company: "Soft Prodigy System Solutions",
    dates: "March 2010 – January 2012 · Punjab, India",
    detail: "Managed AWS, Rackspace and Scaler services, VMware and Hyper-V platforms, firewalls and core services such as DNS, web proxies and FTP."
  },
  {
    role: "Senior Network Administrator",
    company: "Cogniter Technologies",
    dates: "April 2009 – March 2010 · Chandigarh, India",
    detail: "Deployed Nagios, MRTG and SNMP monitoring, configured Linux firewalls with iptables, and managed NFS, NAS, MySQL, Apache and Tomcat."
  },
  {
    role: "Network Administrator",
    company: "Conjoinix Total Solutions",
    dates: "February 2006 – April 2009 · Chandigarh, India",
    detail: "Planned LAN and fibre infrastructure, configured Cisco routers with QoS and ACLs, implemented OpenVPN and Linux firewalls, and managed bandwidth for leased-line clients."
  }
];

export const projects = [
  {
    number: "01",
    title: "Secure SFTP modernization",
    category: "AWS • Storage • Cost optimization",
    summary: "Contributed to modernizing a legacy FTP migration toward AWS Transfer Family and S3, using vendor-isolated prefixes, IAM roles and lifecycle controls.",
    outcome: "About a 70% cost reduction in that environment, with less server patching and maintenance overhead.",
    caseStudy: [
      { label: "Problem", text: "A legacy EC2-based FTP/FTPS/SFTP pattern that required ongoing server patching and maintenance." },
      { label: "Architecture", text: "AWS Transfer Family in front of Amazon S3, with IAM roles for access and S3 lifecycle policies for retention." },
      { label: "Security", text: "Vendor-isolated S3 prefixes and controlled, role-based access so each vendor reaches only its own data." },
      { label: "Operations", text: "Removed the self-managed servers, which reduced patching and routine maintenance overhead." },
      { label: "Financial impact", text: "About a 70% cost reduction in that environment." },
      // Optional: add verified monthly before and after figures to the line above.
      { label: "My contribution", text: "Contributed to the migration and its ongoing operational support." }
    ],
    tags: ["AWS Transfer Family", "Amazon S3", "IAM", "Lifecycle policies"]
  },
  {
    number: "02",
    title: "Multi-account AWS governance",
    category: "AWS Organizations • Security",
    summary: "Designed and supported an eight-account AWS Organization using Control Tower, Organizations and Service Control Policies, with shared governance and account-level guardrails.",
    outcome: "A more consistent foundation for account provisioning, security controls and operational ownership.",
    caseStudy: [
      { label: "Problem", text: "Multiple AWS accounts needed consistent provisioning, security controls and clear operational ownership." },
      { label: "Architecture", text: "An eight-account AWS Organization using Control Tower, organizational units, Service Control Policies and IAM Identity Center." },
      { label: "Security", text: "Account-level guardrails applied through SCPs, with shared governance across accounts." },
      { label: "Operations", text: "A more predictable path for new accounts and a clearer split of responsibility between teams." },
      { label: "My contribution", text: "Designed and supported the governance model and guardrails. The linked repository is my separate reference implementation." }
    ],
    tags: ["Control Tower", "Organizations", "SCPs", "IAM Identity Center"],
    repo: "aws-landing-zone-terraform"
  },
  {
    number: "03",
    title: "Private Kubernetes platform",
    category: "EKS • Terraform • GitOps",
    summary: "Worked on private EKS and ECS environments, reusable Terraform modules across 3 environments, Argo CD delivery, workload autoscaling and supporting network and storage integrations.",
    outcome: "Repeatable platform foundations for engineering teams and controlled workload delivery.",
    caseStudy: [
      { label: "Problem", text: "Engineering teams needed repeatable, controlled foundations for running workloads on Kubernetes." },
      { label: "Architecture", text: "Private EKS clusters built from reusable Terraform patterns (VPC, EKS with IRSA, IAM service roles), with Argo CD for GitOps delivery." },
      { label: "Security", text: "Private cluster networking and IAM roles for service accounts, so workloads get scoped AWS permissions." },
      { label: "Operations", text: "Workload autoscaling, persistent storage and network integrations, delivered through Git-driven deployments. Terraform modules were reused across 3 environments." },
      { label: "My contribution", text: "Worked on the private EKS environments and the reusable Terraform patterns." }
    ],
    tags: ["Amazon EKS", "Terraform", "Argo CD", "Kubernetes"],
    repo: "terraform-aws-modules"
  },
  {
    number: "04",
    title: "GitHub Actions with AWS OIDC",
    category: "CI/CD • IAM • Security",
    summary: "Implemented federated GitHub Actions authentication using OIDC and scoped IAM roles, replacing long-lived AWS credentials across 30+ repositories.",
    outcome: "Reduced credential-management risk and improved least-privilege CI/CD access.",
    caseStudy: [
      { label: "Problem", text: "CI/CD pipelines relied on long-lived AWS credentials stored in repositories, which are hard to rotate and audit." },
      { label: "Architecture", text: "GitHub Actions requests an OIDC token and assumes a scoped IAM role through AWS STS, with trust policies tied to the calling repository and branch." },
      { label: "Security", text: "No stored AWS keys, short-lived credentials and least-privilege roles per pipeline." },
      { label: "Operations", text: "Rolled out across 30+ repositories, removing the need to rotate stored secrets." },
      { label: "My contribution", text: "Implemented the federation pattern and the roles across the repositories." }
    ],
    tags: ["GitHub Actions", "OIDC", "IAM", "CI/CD"],
    repo: "github-actions-oidc-aws"
  },
  {
    number: "05",
    title: "Hybrid infrastructure modernization",
    category: "Migration • Networking",
    summary: "Contributed to on-premises VMware-to-AWS modernization, including infrastructure planning, connectivity, network design and Terraform-based provisioning.",
    outcome: "A structured path from legacy infrastructure toward cloud-managed services.",
    tags: ["VMware", "AWS", "Terraform", "Hybrid networking"]
  },
  {
    number: "06",
    title: "Resilient data platform foundations",
    category: "Data • Availability • Operations",
    summary: "Supported data platform components including Kafka, RDS Multi-AZ, backups, DMS and managed storage integrations, with attention to recovery and operational support.",
    outcome: "Improved resilience and maintainability through managed services and repeatable operations.",
    tags: ["Amazon RDS", "Kafka", "DMS", "Elastic Disaster Recovery"]
  },
  {
    number: "07",
    title: "Disaster recovery & resilience",
    category: "Resilience • Backup • Operations",
    summary: "Supported AWS Elastic Disaster Recovery, Veeam backups and recovery planning, and validated Multi-AZ failover through regular resilience testing, with post-incident reviews feeding back into runbooks.",
    outcome: "Recovery procedures that are written down, tested and improved after each incident.",
    tags: ["Elastic Disaster Recovery", "Veeam", "Multi-AZ", "Runbooks"],
    repo: "aws-dr-resilience-toolkit"
  },
  {
    number: "08",
    title: "Hybrid identity & endpoint management",
    category: "Identity • Microsoft • Security",
    summary: "Built Entra ID enterprise-application SSO (SAML, SCIM) for AWS, Salesforce and other applications with access managed through AD groups, and supported Active Directory, Group Policy, ADFS, Intune, SCCM and WSUS.",
    outcome: "Single sign-on with group-based access and managed Windows endpoints.",
    tags: ["Entra ID", "ADFS", "Intune", "SCCM", "WSUS"]
  },
  {
    number: "09",
    title: "Vulnerability management & security posture",
    category: "Security • AWS • Operations",
    summary: "Worked with security teams on vulnerability management and remediation across AWS, Windows and Linux, using Wiz, Darktrace, Security Hub, GuardDuty, Inspector, Config, CloudTrail and Athena for posture review and investigation, and coordinating patching with engineering owners.",
    outcome: "Security findings that are prioritized, assigned, fixed and verified instead of sitting in a queue.",
    tags: ["Wiz", "Darktrace", "Security Hub", "GuardDuty", "Inspector", "Athena"]
  }
];

export const repos = [
  { name: "aws-landing-zone-terraform", summary: "Multi-account AWS Organization with OUs, SCP guardrails, organization CloudTrail and delegated security services.", tags: ["Terraform", "SCPs", "CloudTrail"] },
  { name: "github-actions-oidc-aws", summary: "Keyless GitHub Actions deployments with least-privilege roles and short-lived credentials.", tags: ["OIDC", "IAM", "GitHub Actions"] },
  { name: "terraform-aws-modules", summary: "Reusable Terraform modules for a secure VPC, EKS with IRSA, and IAM service roles.", tags: ["VPC", "EKS", "IRSA"] },
  { name: "aws-cost-optimizer", summary: "Read-only Python CLI that finds idle and orphaned AWS resources and estimates monthly savings.", tags: ["FinOps", "Python", "Rightsizing"] },
  { name: "aws-dr-resilience-toolkit", summary: "Multi-AZ failover test, AZ spread check, and runbooks for Elastic Disaster Recovery drills and Veeam restore tests.", tags: ["Elastic DR", "Veeam", "Multi-AZ"] },
  { name: "ai-agent-guardrails-aws", summary: "Guardrails for running AI coding agents headlessly in CI: short-lived read-only credentials, protected-path approval gates and usage and cost logging. A template with unit-tested tooling, not a production deployment.", tags: ["OIDC", "Approval gates", "Cost tracking"], personal: true }
];

export const recommendations = [
  { name: "Punitkumar Tandel", role: "Solution architect · Worked together at Numeris", text: "I had the pleasure of working closely with Damanpreet on multiple projects and applications, and their technical expertise in AWS infrastructure and Cloud Operations was instrumental to our success. When a critical incident arose, Damanpreet stepped in with immediate, professional assistance. He rapidly diagnosed the issue, stabilized our environment, and established clear response protocols to resolve the incident with impressive turnaround time. Beyond incident management, Damanpreet built and streamlined our AWS deployment pipeline, greatly improving our team\u2019s deployment velocity and platform reliability. Their responsiveness, deep infrastructure knowledge, and calm demeanor under pressure make them an incredible asset to any engineering or cloud team. I would welcome the opportunity to work with Damanpreet again anytime." },
  { name: "Alexander Tkachenko", role: "Senior Software Engineer · Numeris", text: "I had a great experience working with Damanpreet on several complex AWS solutions involving Lambda, API Gateway, ELB, ECS, SQS, and other AWS services. He consistently demonstrated strong AWS infrastructure expertise, followed architectural best practices, and was always quick to respond when application or infrastructure issues arose. I was also impressed by his ability to learn new technologies quickly and turn that knowledge into practical solutions. Damanpreet is knowledgeable, dependable, and a great person to collaborate with. I highly recommend him." },
  { name: "Randy Kolenko", role: "Creator of Maestro, the open source workflow engine and Senior Solutions Architect", text: "I had the absolute pleasure of working with Damanpreet at Numeris where he led the IT team for incident support, AWS architecture and all of the deployment pipelines for our custom written business application. No matter what the issue was, Damanpreet was on it. Coming up with solutions to problems that involved security, connectivity and accessibility. Without Damanpreet\u2019s AWS knowledge, the site would not have been able to run nearly as good as it did, providing expert knowledge on AWS, SSO, networking, databases and multiple operating systems. I hope I have the opportunity to work with Damanpreet again in the future! He\u2019s not only an exceptional AWS cloud architect, he\u2019s also an exceptional person." }
];

export const education = [
  { title: "Master of Computer Applications (MCA)", detail: "Punjab Technical University", year: "2007–2009" },
  { title: "Bachelor of Computer Applications (BCA)", detail: "Panjab University", year: "2004–2006" }
];

// Add ONLY examinations you have successfully passed. While this list is empty, the section is hidden.
export const certifications = [
  { title: "AWS Certified Solutions Architect – Professional", detail: "Amazon Web Services · certification exam passed", year: "2026", url: "https://www.credly.com/badges/9c557a99-e420-433a-94c6-8925423825b4/" },
  { title: "AWS Serverless Demonstrated", detail: "Amazon Web Services · hands-on AWS environment exam passed", year: "2026",url: "https://www.credly.com/badges/d6bb6324-52be-4d2f-8c92-7f79265b6fba" },
  { title: "AWS Certified Solutions Architect – Associate", detail: "Amazon Web Services · certification exam passed", year: "2022",url: "https://www.credly.com/badges/4bfa5b0b-1dd3-43f4-bdab-e3f988cdf168" }
];

export const learningCredentials = [  
  { title: "AWS Knowledge: Serverless – Training Badge", detail: "AWS training badge (not a certification exam)", year: "2026",url: "https://www.credly.com/badges/6b921b1b-c608-4a2f-8386-1b45ff59f914/" },
  { title: "Build Infrastructure with Terraform on Google Cloud", detail: "Google Cloud skill badge", year: "2026",url: "https://www.credly.com/badges/6793eb01-6a21-4541-8dc5-728ef9f039b7/" },
  { title: "Connecting Cloud Networks with NCC", detail: "Google Cloud learning credential", year: "Learning",url: "https://www.credly.com/badges/77f4c717-0604-4311-a819-312537b45d57/" }
];

export const architectureTraining = [
  { title: "TOGAF Foundation and Practitioner", detail: "Training completed.", year: "Training" }
];

// Keep this list short: recruiters rarely wait for a long ticker to loop.
// The $100K+ figure is cumulative across initiatives (not annual); keep it conservative until a breakdown is documented.
export const highlights = [
  { tag: "EXPERIENCE", text: "18+ years in IT", href: "#experience" },
  { tag: "CERTIFIED", text: "AWS Solutions Architect – Professional and AWS Serverless Demonstrated", href: "#education" },
  { tag: "AWS", text: "AWS infrastructure in Canada since 2022", href: "#experience" },
  { tag: "GOVERNANCE", text: "Multi-account AWS governance with Control Tower and SCPs", href: "#projects" },
  { tag: "PLATFORM", text: "Terraform and private EKS platforms", href: "#projects" },
  { tag: "SECURITY", text: "GitHub Actions OIDC across 30+ repositories", href: "#projects" },
  { tag: "VULN MGMT", text: "Vulnerability remediation with Wiz, Security Hub and Inspector", href: "#simulator" },
  { tag: "COST", text: "$100K+ cumulative savings across initiatives (not annual)", href: "#about" }
];
