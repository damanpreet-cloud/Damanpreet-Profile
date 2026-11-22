export const expertise = [
  { group: "Cloud platforms", items: ["Amazon Web Services", "Microsoft Azure", "Google Cloud", "Hybrid cloud"] },
  { group: "Infrastructure & networking", items: ["VPC & network architecture", "Transit Gateway", "Direct Connect & VPN", "DNS, load balancing", "Windows & Linux"] },
  { group: "Automation & platforms", items: ["Terraform / IaC", "Kubernetes & EKS", "Docker", "GitHub Actions", "Argo CD"] },
  { group: "Security & operations", items: ["IAM & least privilege", "Cloud governance", "KMS & secrets", "Monitoring & incident response", "FinOps"] }
];

export const experience = [
  {
    role: "Solution Architect / Technical Advisor",
    company: "Numeris Canada",
    detail: "Supported AWS infrastructure architecture, engineering, security and production operations across five engineering teams and 30+ engineers. Contributed to multi-account governance, network architecture, Kubernetes platforms, infrastructure automation and production reliability."
  },
  {
    role: "IT Infrastructure Manager",
    company: "Numeris",
    detail: "Led enterprise infrastructure and operations across hybrid environments, supporting availability, security, networking, systems and modernization initiatives."
  },
  {
    role: "IT Manager",
    company: "GetYourSolutions",
    detail: "Managed IT infrastructure, systems administration, enterprise networking and operational technology services."
  },
  {
    role: "Network Manager",
    company: "SoftProdigy",
    detail: "Led network and infrastructure operations, including connectivity, systems and service reliability."
  },
  {
    role: "Network Engineer / Systems Administrator",
    company: "Earlier career",
    detail: "Built foundational experience in ISP connectivity, Linux-based firewalls, client networking and systems administration."
  }
];

export const projects = [
  {
    number: "01",
    title: "Secure SFTP modernization",
    category: "AWS • Storage • Cost optimization",
    summary: "Modernized a legacy EC2-based FTP/FTPS/SFTP pattern toward AWS Transfer Family and S3, using vendor-isolated prefixes, IAM roles and lifecycle controls.",
    outcome: "Reduced recurring infrastructure cost substantially while reducing server patching and maintenance overhead.",
    tags: ["AWS Transfer Family", "Amazon S3", "IAM", "Lifecycle policies"]
  },
  {
    number: "02",
    title: "Multi-account AWS governance",
    category: "AWS Organizations • Security",
    summary: "Supported an eight-account AWS Organization using Control Tower and Service Control Policies, with shared governance and account-level guardrails.",
    outcome: "A more consistent foundation for account provisioning, security controls and operational ownership.",
    tags: ["Control Tower", "Organizations", "SCPs", "IAM Identity Center"]
  },
  {
    number: "03",
    title: "Private Kubernetes platform",
    category: "EKS • Terraform • GitOps",
    summary: "Worked on private EKS environments, reusable Terraform patterns, Argo CD delivery, workload autoscaling and supporting network and storage integrations.",
    outcome: "Repeatable platform foundations for engineering teams and controlled workload delivery.",
    tags: ["Amazon EKS", "Terraform", "Argo CD", "Kubernetes"]
  },
  {
    number: "04",
    title: "GitHub Actions with AWS OIDC",
    category: "CI/CD • IAM • Security",
    summary: "Implemented federated GitHub Actions authentication using OIDC and scoped IAM roles, replacing long-lived AWS credentials across 30+ repositories.",
    outcome: "Reduced credential-management risk and improved least-privilege CI/CD access.",
    tags: ["GitHub Actions", "OIDC", "IAM", "CI/CD"]
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
    tags: ["Amazon RDS", "Kafka", "DMS", "AWS Backup"]
  }
];