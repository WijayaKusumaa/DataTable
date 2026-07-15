import { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from "@tanstack/react-table";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Upload,
  Plus,
  RefreshCw,
  Eye,
  EyeOff,
  Columns,
  LayoutGrid,
  List,
  AlignJustify,
  SlidersHorizontal,
  Bookmark,
  Trash2,
  Copy,
  Archive,
  Edit3,
  CheckCircle2,
  XCircle,
  Clock,
  Minus,
  X,
  Check,
} from "lucide-react";

// ─── Data Types ───────────────────────────────────────────────────────────────

type Status = "active" | "inactive" | "pending" | "archived" | "error";
type Department = "Engineering" | "Sales" | "Marketing" | "Design" | "Finance" | "HR" | "Operations" | "Legal";
type Role = "Admin" | "Engineer" | "Manager" | "Analyst" | "Designer" | "Director" | "VP" | "Intern";

interface Employee {
  id: string;
  avatar: string;
  initials: string;
  avatarColor: string;
  name: string;
  email: string;
  company: string;
  department: Department;
  role: Role;
  country: string;
  countryCode: string;
  revenue: number;
  lastActive: string;
  status: Status;
  createdAt: string;
  verified: boolean;
  tags: string[];
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b",
  "#10b981", "#ef4444", "#6366f1", "#f97316", "#06b6d4",
];

const COMPANIES = [
  "Stripe", "Linear", "Vercel", "Supabase", "Apple", "Notion", "Datadog",
  "Atlassian", "GitHub", "GitLab", "Cloudflare", "Tailscale", "PlanetScale",
  "Railway", "Fly.io", "Turso", "Neon", "Resend", "PostHog", "Sentry",
];

const COUNTRIES = [
  { name: "United States", code: "US", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { name: "Germany", code: "DE", flag: "🇩🇪" },
  { name: "France", code: "FR", flag: "🇫🇷" },
  { name: "Canada", code: "CA", flag: "🇨🇦" },
  { name: "Australia", code: "AU", flag: "🇦🇺" },
  { name: "Japan", code: "JP", flag: "🇯🇵" },
  { name: "Netherlands", code: "NL", flag: "🇳🇱" },
  { name: "Singapore", code: "SG", flag: "🇸🇬" },
  { name: "Brazil", code: "BR", flag: "🇧🇷" },
  { name: "India", code: "IN", flag: "🇮🇳" },
  { name: "Sweden", code: "SE", flag: "🇸🇪" },
];

const DEPARTMENTS: Department[] = ["Engineering", "Sales", "Marketing", "Design", "Finance", "HR", "Operations", "Legal"];
const ROLES: Role[] = ["Admin", "Engineer", "Manager", "Analyst", "Designer", "Director", "VP", "Intern"];
const STATUSES: Status[] = ["active", "inactive", "pending", "archived", "error"];

const FIRST_NAMES = [
  "Alex", "Jordan", "Morgan", "Taylor", "Casey", "Riley", "Quinn", "Avery",
  "Blake", "Cameron", "Dakota", "Drew", "Emery", "Finley", "Harper", "Hayden",
  "Jamie", "Jesse", "Jordan", "Kendall", "Logan", "Luca", "Madison", "Marcus",
  "Natalie", "Noah", "Olivia", "Parker", "Peyton", "Phoenix", "Reese", "Rowan",
  "Ryan", "Sage", "Sam", "Sawyer", "Skyler", "Sydney", "Tyler", "Zoe",
];

const LAST_NAMES = [
  "Anderson", "Bailey", "Brooks", "Carter", "Chen", "Clark", "Cole", "Cooper",
  "Davis", "Edwards", "Evans", "Fisher", "Foster", "Garcia", "Green", "Hall",
  "Harris", "Hughes", "Jackson", "Johnson", "Jones", "Kim", "King", "Kumar",
  "Lee", "Lewis", "Martin", "Martinez", "Miller", "Mitchell", "Moore", "Morgan",
  "Nelson", "Nguyen", "Parker", "Patel", "Robinson", "Rodriguez", "Scott", "Smith",
];

const TAG_OPTIONS = ["frontend", "backend", "leadership", "design", "ml", "devops", "data", "security", "mobile", "api"];

function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateEmployee(index: number): Employee {
  const r = (offset: number) => seededRandom(index * 17 + offset);

  const recommended = [
    { name: "Wijaya Kusuma", email: "wijaya.kusuma@wijayadata.com", initials: "WK" },
    { name: "Oktavia Wulandari", email: "oktavia.wulandari@wijayadata.com", initials: "OW" },
    { name: "Farida Rachmawati", email: "farida.rachmawati@wijayadata.com", initials: "FR" },
    { name: "Rafi Ardiansyah", email: "rafi.ardiansyah@wijayadata.com", initials: "RA" },
    { name: "Pandu Akbar Swandana", email: "pandu.akbar@wijayadata.com", initials: "PA" },
    { name: "Aprilia", email: "aprilia@wijayadata.com", initials: "AP" },
    { name: "Rendra Agusta Hadi", email: "rendra.agusta@wijayadata.com", initials: "RH" },
    { name: "Sisilia Widya Safitri", email: "sisilia.widya@wijayadata.com", initials: "SS" },
  ];

  const isRecommended = index < recommended.length;
  const recItem = isRecommended ? recommended[index] : null;

  const firstName = isRecommended ? recItem!.name.split(" ")[0] : FIRST_NAMES[Math.floor(r(1) * FIRST_NAMES.length)];
  const lastName = isRecommended ? (recItem!.name.split(" ").slice(1).join(" ") || "") : LAST_NAMES[Math.floor(r(2) * LAST_NAMES.length)];
  const name = isRecommended ? recItem!.name : `${firstName} ${lastName}`;
  const company = COMPANIES[Math.floor(r(3) * COMPANIES.length)];
  const department = DEPARTMENTS[Math.floor(r(4) * DEPARTMENTS.length)];
  const role = ROLES[Math.floor(r(5) * ROLES.length)];
  const country = COUNTRIES[Math.floor(r(6) * COUNTRIES.length)];
  const status = STATUSES[Math.floor(r(7) * STATUSES.length)];
  const avatarColor = AVATAR_COLORS[Math.floor(r(8) * AVATAR_COLORS.length)];
  const revenue = Math.floor(r(9) * 980000) + 20000;
  const verified = r(10) > 0.35;
  const tagCount = Math.floor(r(11) * 3);
  const tags = TAG_OPTIONS.slice(Math.floor(r(12) * (TAG_OPTIONS.length - tagCount)), Math.floor(r(12) * (TAG_OPTIONS.length - tagCount)) + tagCount);

  const daysAgo = Math.floor(r(13) * 30);
  const hoursAgo = Math.floor(r(14) * 24);
  const lastActive = daysAgo === 0
    ? `${hoursAgo}h ago`
    : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`;

  const year = 2022 + Math.floor(r(15) * 3);
  const month = String(Math.floor(r(16) * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(r(17) * 28) + 1).padStart(2, "0");

  return {
    id: `emp-${String(index + 1).padStart(5, "0")}`,
    avatar: "",
    initials: isRecommended ? recItem!.initials : `${firstName[0]}${(lastName ? lastName[0] : "")}`,
    avatarColor,
    name,
    email: isRecommended ? recItem!.email : `${firstName.toLowerCase()}.${lastName.replace(/\s+/g, "").toLowerCase()}@${company.toLowerCase().replace(/[^a-z]/g, "")}.io`,
    company,
    department,
    role,
    country: country.name,
    countryCode: country.code,
    revenue,
    lastActive,
    status,
    createdAt: `${year}-${month}-${day}`,
    verified,
    tags,
  };
}

const ALL_DATA: Employee[] = Array.from({ length: 18426 }, (_, i) => generateEmployee(i));

// ─── Status Config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  active: {
    label: "Active",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    icon: <CheckCircle2 size={10} />,
  },
  inactive: {
    label: "Inactive",
    color: "#64748b",
    bg: "rgba(100,116,139,0.12)",
    icon: <Minus size={10} />,
  },
  pending: {
    label: "Pending",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    icon: <Clock size={10} />,
  },
  archived: {
    label: "Archived",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.10)",
    icon: <Archive size={10} />,
  },
  error: {
    label: "Error",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    icon: <XCircle size={10} />,
  },
};

const COUNTRY_FLAGS: Record<string, string> = {
  US: "🇺🇸", GB: "🇬🇧", DE: "🇩🇪", FR: "🇫🇷", CA: "🇨🇦",
  AU: "🇦🇺", JP: "🇯🇵", NL: "🇳🇱", SG: "🇸🇬", BR: "🇧🇷",
  IN: "🇮🇳", SE: "🇸🇪",
};

function formatRevenue(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium font-mono"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function Avatar({ employee, size = 28 }: { employee: Employee; size?: number }) {
  return (
    <div
      className="flex-shrink-0 rounded-full flex items-center justify-center text-white font-semibold relative"
      style={{
        width: size,
        height: size,
        background: employee.avatarColor,
        fontSize: size * 0.36,
      }}
    >
      {employee.initials}
      {employee.verified && (
        <div
          className="absolute -bottom-0.5 -right-0.5 rounded-full flex items-center justify-center"
          style={{ width: 11, height: 11, background: "#3b82f6", border: "1.5px solid #09090b" }}
        >
          <Check size={6} color="#fff" strokeWidth={3} />
        </div>
      )}
    </div>
  );
}

function Checkbox({ checked, indeterminate, onChange }: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      style={{
        background: checked || indeterminate ? "#3b82f6" : "transparent",
        border: checked || indeterminate ? "1px solid #3b82f6" : "1px solid rgba(255,255,255,0.18)",
      }}
      aria-checked={indeterminate ? "mixed" : checked}
      role="checkbox"
    >
      {indeterminate ? <Minus size={9} color="#fff" strokeWidth={3} /> : checked ? <Check size={9} color="#fff" strokeWidth={3} /> : null}
    </button>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[44, 120, 180, 200, 140, 120, 100, 100, 80, 90, 80, 90, 60].map((w, i) => (
        <td key={i} className="px-3 py-2.5">
          <div
            className="rounded animate-pulse"
            style={{ width: w, height: 12, background: "rgba(255,255,255,0.05)" }}
          />
        </td>
      ))}
    </tr>
  );
}

// ─── Inspector Panel ──────────────────────────────────────────────────────────

function Inspector({ row, onClose }: { row: Employee; onClose: () => void }) {
  const [tab, setTab] = useState<"profile" | "activity" | "audit">("profile");

  const AUDIT = [
    { action: "Email updated", user: "System", time: "2 hours ago" },
    { action: "Role changed to " + row.role, user: "admin@corp.io", time: "3 days ago" },
    { action: "Status set to " + row.status, user: "admin@corp.io", time: "1 week ago" },
    { action: "Record created", user: "import-bot", time: row.createdAt },
  ];

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#111318", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="text-xs font-medium text-[#94a3b8] uppercase tracking-widest">Record Detail</span>
        <button onClick={onClose} className="text-[#64748b] hover:text-[#f8fafc] transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Profile */}
      <div className="px-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-start gap-3 mb-3">
          <Avatar employee={row} size={40} />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#f8fafc] truncate">{row.name}</div>
            <div className="text-xs text-[#64748b] truncate">{row.email}</div>
            <div className="mt-1"><StatusBadge status={row.status} /></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {[
            { label: "Company", value: row.company },
            { label: "Role", value: row.role },
            { label: "Dept", value: row.department },
            { label: "Country", value: `${COUNTRY_FLAGS[row.countryCode] ?? ""} ${row.country}` },
            { label: "Revenue", value: formatRevenue(row.revenue) },
            { label: "Last Active", value: row.lastActive },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-[10px] uppercase tracking-wider text-[#64748b] mb-0.5">{label}</div>
              <div className="text-xs text-[#f8fafc] font-mono truncate">{value}</div>
            </div>
          ))}
        </div>
        {row.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {row.tags.map(t => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(59,130,246,0.12)", color: "#60a5fa" }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex px-4 gap-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {(["profile", "activity", "audit"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="py-2.5 text-xs font-medium capitalize transition-colors relative"
            style={{ color: tab === t ? "#3b82f6" : "#64748b" }}
          >
            {t}
            {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b82f6]" />}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 text-xs">
        {tab === "profile" && (
          <div className="space-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#64748b] mb-1.5">Permission Level</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full bg-[#3b82f6]" style={{ width: row.role === "Admin" ? "100%" : row.role === "Director" || row.role === "VP" ? "75%" : row.role === "Manager" ? "60%" : "40%" }} />
                </div>
                <span className="text-[#94a3b8] font-mono text-[10px]">{row.role}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#64748b] mb-1.5">Record ID</div>
              <code className="font-mono text-[#94a3b8] bg-[#181c23] px-2 py-1 rounded text-[10px]">{row.id}</code>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#64748b] mb-1.5">Created</div>
              <div className="text-[#94a3b8] font-mono">{row.createdAt}</div>
            </div>
          </div>
        )}
        {tab === "activity" && (
          <div className="space-y-2">
            {["Viewed record", "Updated email", "Exported data", "Logged in"].map((action, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-1 flex-shrink-0" />
                <div>
                  <div className="text-[#f8fafc] text-xs">{action}</div>
                  <div className="text-[#64748b] text-[10px] font-mono">{["1h ago", "3h ago", "Yesterday", "2d ago"][i]}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "audit" && (
          <div className="space-y-2">
            {AUDIT.map((entry, i) => (
              <div key={i} className="py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="text-[#f8fafc] text-xs mb-0.5">{entry.action}</div>
                <div className="flex items-center gap-2">
                  <span className="text-[#64748b] text-[10px]">{entry.user}</span>
                  <span className="text-[#3b4356] text-[10px]">·</span>
                  <span className="text-[#64748b] font-mono text-[10px]">{entry.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 flex gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {[
          { icon: <Edit3 size={12} />, label: "Edit" },
          { icon: <Copy size={12} />, label: "Duplicate" },
          { icon: <Archive size={12} />, label: "Archive" },
          { icon: <Trash2 size={12} />, label: "Delete", danger: true },
        ].map(({ icon, label, danger }) => (
          <button
            key={label}
            className="flex-1 flex flex-col items-center gap-1 py-2 rounded-md text-[10px] transition-colors font-medium"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: danger ? "#ef4444" : "#94a3b8",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedRow, setSelectedRow] = useState<Employee | null>(null);
  const [density, setDensity] = useState<"compact" | "default" | "relaxed">("default");
  const [isLoading, setIsLoading] = useState(false);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const filteredData = useMemo(() => {
    let data = ALL_DATA;
    if (globalFilter) {
      const q = globalFilter.toLowerCase();
      data = data.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") data = data.filter(r => r.status === statusFilter);
    if (departmentFilter !== "all") data = data.filter(r => r.department === departmentFilter);
    return data;
  }, [globalFilter, statusFilter, departmentFilter]);

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, pageIndex, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const columns = useMemo<ColumnDef<Employee>[]>(() => [
    {
      id: "select",
      size: 44,
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.toggleAllPageRowsSelected}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onChange={row.toggleSelected}
          />
        </div>
      ),
      enableSorting: false,
    },
    {
      id: "name",
      accessorFn: r => r.name,
      header: "Name",
      size: 200,
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar employee={row.original} />
          <div className="min-w-0">
            <div className="text-[#f8fafc] text-sm font-medium truncate leading-tight">{row.original.name}</div>
            <div className="text-[#64748b] text-xs truncate leading-tight font-mono">{row.original.id}</div>
          </div>
        </div>
      ),
    },
    {
      id: "email",
      accessorFn: r => r.email,
      header: "Email",
      size: 220,
      cell: ({ row }) => (
        <span className="text-[#94a3b8] text-xs font-mono truncate block">{row.original.email}</span>
      ),
    },
    {
      id: "company",
      accessorFn: r => r.company,
      header: "Company",
      size: 140,
      cell: ({ row }) => (
        <span className="text-[#f8fafc] text-sm truncate">{row.original.company}</span>
      ),
    },
    {
      id: "department",
      accessorFn: r => r.department,
      header: "Department",
      size: 130,
      cell: ({ row }) => (
        <span className="text-[#94a3b8] text-xs truncate">{row.original.department}</span>
      ),
    },
    {
      id: "role",
      accessorFn: r => r.role,
      header: "Role",
      size: 110,
      cell: ({ row }) => (
        <span className="text-xs font-medium text-[#94a3b8]">{row.original.role}</span>
      ),
    },
    {
      id: "country",
      accessorFn: r => r.country,
      header: "Country",
      size: 130,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">{COUNTRY_FLAGS[row.original.countryCode] ?? ""}</span>
          <span className="text-xs text-[#94a3b8] truncate">{row.original.country}</span>
        </div>
      ),
    },
    {
      id: "revenue",
      accessorFn: r => r.revenue,
      header: "Revenue",
      size: 100,
      cell: ({ row }) => (
        <div className="text-right">
          <span className="text-sm font-semibold font-mono" style={{ color: row.original.revenue >= 500000 ? "#22c55e" : row.original.revenue >= 200000 ? "#f8fafc" : "#94a3b8" }}>
            {formatRevenue(row.original.revenue)}
          </span>
        </div>
      ),
    },
    {
      id: "lastActive",
      accessorFn: r => r.lastActive,
      header: "Last Active",
      size: 100,
      cell: ({ row }) => (
        <span className="text-xs text-[#64748b] font-mono">{row.original.lastActive}</span>
      ),
    },
    {
      id: "status",
      accessorFn: r => r.status,
      header: "Status",
      size: 100,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "createdAt",
      accessorFn: r => r.createdAt,
      header: "Created",
      size: 100,
      cell: ({ row }) => (
        <span className="text-xs text-[#64748b] font-mono">{row.original.createdAt}</span>
      ),
    },
    {
      id: "actions",
      size: 52,
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            className="p-1 rounded text-[#64748b] hover:text-[#f8fafc] hover:bg-white/8 transition-colors"
            onClick={(e) => { e.stopPropagation(); }}
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data: paginatedData,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  const selectedCount = Object.keys(rowSelection).length;

  const rowPadding = density === "compact" ? "py-1.5" : density === "relaxed" ? "py-3.5" : "py-2.5";

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1200);
  }, []);

  const VISIBLE_COLUMNS = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "company", label: "Company" },
    { id: "department", label: "Department" },
    { id: "role", label: "Role" },
    { id: "country", label: "Country" },
    { id: "revenue", label: "Revenue" },
    { id: "lastActive", label: "Last Active" },
    { id: "status", label: "Status" },
    { id: "createdAt", label: "Created" },
  ];

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "#09090b", fontFamily: "'Inter', system-ui, sans-serif" }}
      onClick={() => setOpenDropdown(null)}
    >
      {/* ── Top Toolbar ── */}
      <div
        className="flex-shrink-0 px-4 sm:px-6 md:px-8 py-0"
        style={{ background: "#09090b", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 pt-4 pb-1">
          <span className="text-[11px] text-[#64748b]">Organization</span>
          <span className="text-[#3b4356] text-[11px]">/</span>
          <span className="text-[11px] text-[#64748b]">People</span>
          <span className="text-[#3b4356] text-[11px]">/</span>
          <span className="text-[11px] text-[#94a3b8] font-medium">Data Explorer</span>
        </div>

        {/* Title Row */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between py-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-[22px] font-semibold text-[#f8fafc] tracking-tight">Data Explorer</h1>
              {/* Live sync indicator */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                <span className="text-[10px] font-medium text-[#22c55e] font-mono">Live</span>
              </div>
            </div>
            <p className="text-[13px] text-[#64748b] mt-0.5 hidden sm:block">Manage and analyze enterprise datasets with advanced filtering, sorting, grouping, and bulk operations.</p>
          </div>

          {/* Right actions */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
              <input
                value={globalFilter}
                onChange={e => { setGlobalFilter(e.target.value); setPageIndex(0); }}
                placeholder="Search records…"
                className="pl-8 pr-3 py-1.5 text-xs rounded-md text-[#f8fafc] placeholder:text-[#64748b] outline-none transition-all w-full sm:w-48 sm:focus:w-64"
                style={{ background: "#181c23", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Saved Views */}
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-[#94a3b8] hover:text-[#f8fafc] transition-colors" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#111318" }}>
              <Bookmark size={12} />
              <span className="hidden sm:inline">Views</span>
            </button>

            {/* Column Visibility */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setColumnMenuOpen(v => !v); setOpenDropdown(null); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#111318" }}
              >
                <Columns size={12} />
                <span className="hidden sm:inline">Columns</span>
              </button>
              {columnMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-1.5 z-50 rounded-lg py-1 w-44"
                  style={{ background: "#181c23", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
                  onClick={e => e.stopPropagation()}
                >
                  {VISIBLE_COLUMNS.map(col => {
                    const isVisible = table.getColumn(col.id)?.getIsVisible() !== false;
                    return (
                      <button
                        key={col.id}
                        onClick={() => table.getColumn(col.id)?.toggleVisibility()}
                        className="flex items-center gap-2.5 w-full px-3 py-1.5 text-xs hover:bg-white/5 transition-colors"
                        style={{ color: isVisible ? "#f8fafc" : "#64748b" }}
                      >
                        {isVisible ? <Eye size={11} /> : <EyeOff size={11} />}
                        {col.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Density */}
            <div className="flex items-center rounded-md overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              {([
                { key: "compact", icon: <AlignJustify size={11} /> },
                { key: "default", icon: <List size={11} /> },
                { key: "relaxed", icon: <LayoutGrid size={11} /> },
              ] as const).map(({ key, icon }) => (
                <button
                  key={key}
                  onClick={() => setDensity(key)}
                  className="p-1.5 transition-colors"
                  style={{ background: density === key ? "rgba(59,130,246,0.2)" : "#111318", color: density === key ? "#3b82f6" : "#64748b" }}
                  title={key}
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button onClick={handleRefresh} className="p-1.5 rounded-md text-[#64748b] hover:text-[#f8fafc] transition-colors" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#111318" }}>
              <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
            </button>

            {/* Export */}
            <div className="relative">
              <button
                onClick={e => { e.stopPropagation(); setOpenDropdown(v => v === "export" ? null : "export"); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#111318" }}
              >
                <Download size={12} />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown size={11} />
              </button>
              {openDropdown === "export" && (
                <div
                  className="absolute right-0 top-full mt-1.5 z-50 rounded-lg py-1 w-36"
                  style={{ background: "#181c23", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
                  onClick={e => e.stopPropagation()}
                >
                  {["Export CSV", "Export Excel", "Export JSON"].map(opt => (
                    <button key={opt} className="w-full text-left px-3 py-1.5 text-xs text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/5 transition-colors">{opt}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Import */}
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-[#94a3b8] hover:text-[#f8fafc] transition-colors" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#111318" }}>
              <Upload size={12} />
              <span className="hidden sm:inline">Import</span>
            </button>

            {/* Add Record */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white transition-all hover:opacity-90 ml-auto sm:ml-0" style={{ background: "#3b82f6" }}>
              <Plus size={12} />
              Add <span className="hidden sm:inline">Record</span>
            </button>

            {/* Avatar */}
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white ml-1 shrink-0" style={{ background: "#8b5cf6" }}>
              AK
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col gap-2.5 py-2.5 sm:flex-row sm:items-center sm:justify-between border-t border-white/5">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 shrink-0 max-w-full">
            <SlidersHorizontal size={12} className="text-[#64748b] flex-shrink-0" />
            <span className="text-xs text-[#64748b] mr-1 shrink-0">Filters</span>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPageIndex(0); }}
              className="px-2.5 py-1 rounded text-xs text-[#94a3b8] outline-none cursor-pointer shrink-0"
              style={{ background: "#181c23", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "inherit" }}
            >
              <option value="all">All Status</option>
              {STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
            </select>

            {/* Department */}
            <select
              value={departmentFilter}
              onChange={e => { setDepartmentFilter(e.target.value); setPageIndex(0); }}
              className="px-2.5 py-1 rounded text-xs text-[#94a3b8] outline-none cursor-pointer shrink-0"
              style={{ background: "#181c23", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "inherit" }}
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* Quick filters */}
            {["Verified", "High Revenue", "Active"].map(f => (
              <button key={f} className="px-2.5 py-1 rounded text-xs text-[#64748b] hover:text-[#94a3b8] transition-colors shrink-0" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                {f}
              </button>
            ))}

            {(globalFilter || statusFilter !== "all" || departmentFilter !== "all") && (
              <button
                onClick={() => { setGlobalFilter(""); setStatusFilter("all"); setDepartmentFilter("all"); setPageIndex(0); }}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[#ef4444] hover:bg-red-900/20 transition-colors ml-1 shrink-0"
              >
                <X size={10} />
                Clear filters
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 w-full sm:w-auto">
            <span className="text-xs text-[#64748b] font-mono">
              {filteredData.length.toLocaleString()} records
            </span>
            {selectedCount > 0 && (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-md" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)" }}>
                <span className="text-xs text-[#60a5fa] font-medium">{selectedCount} selected</span>
                <span className="text-[#3b4a68] text-xs">·</span>
                <button className="text-xs text-[#ef4444] hover:underline">Delete</button>
                <button className="text-xs text-[#60a5fa] hover:underline">Archive</button>
                <button className="text-xs text-[#94a3b8] hover:underline">Export</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Table Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
            <table className="w-full border-collapse" style={{ minWidth: 1100 }}>
              {/* Sticky Header */}
              <thead style={{ position: "sticky", top: 0, zIndex: 20, background: "#111318" }}>
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {hg.headers.map(header => {
                      const canSort = header.column.getCanSort();
                      const sorted = header.column.getIsSorted();
                      return (
                        <th
                          key={header.id}
                          style={{ width: header.getSize(), minWidth: header.getSize() }}
                          className="px-3 py-2.5 text-left relative select-none"
                        >
                          <div
                            className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#64748b] ${canSort ? "cursor-pointer hover:text-[#94a3b8]" : ""} transition-colors`}
                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                          >
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort && (
                              <span className="opacity-50">
                                {sorted === "asc" ? <ChevronUp size={11} /> : sorted === "desc" ? <ChevronDown size={11} /> : <ChevronsUpDown size={11} />}
                              </span>
                            )}
                          </div>
                          {/* Resize handle */}
                          {header.column.id !== "select" && header.column.id !== "actions" && (
                            <div
                              className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 opacity-0 hover:opacity-100 cursor-col-resize"
                              style={{ background: "rgba(255,255,255,0.15)" }}
                            />
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>

              <tbody>
                {isLoading
                  ? Array.from({ length: pageSize }).map((_, i) => <SkeletonRow key={i} />)
                  : table.getRowModel().rows.length === 0
                  ? (
                    <tr>
                      <td colSpan={columns.length} className="py-24 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <Search size={20} className="text-[#64748b]" />
                          </div>
                          <div>
                            <div className="text-[#94a3b8] font-medium text-sm mb-1">No records found</div>
                            <div className="text-[#64748b] text-xs">Try adjusting your search or filter criteria</div>
                          </div>
                          <button
                            onClick={() => { setGlobalFilter(""); setStatusFilter("all"); setDepartmentFilter("all"); }}
                            className="px-3 py-1.5 rounded-md text-xs text-[#60a5fa] transition-colors hover:bg-blue-900/20"
                            style={{ border: "1px solid rgba(59,130,246,0.25)" }}
                          >
                            Reset Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                  : table.getRowModel().rows.map((row, rowIdx) => {
                    const isSelected = row.getIsSelected();
                    const isActive = selectedRow?.id === row.original.id;
                    return (
                      <tr
                        key={row.id}
                        className={`group/row cursor-pointer transition-colors duration-100`}
                        style={{
                          background: isActive
                            ? "rgba(59,130,246,0.1)"
                            : isSelected
                            ? "rgba(59,130,246,0.07)"
                            : rowIdx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.012)",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                        }}
                        onClick={() => setSelectedRow(r => r?.id === row.original.id ? null : row.original)}
                        onMouseEnter={e => {
                          if (!isActive && !isSelected) {
                            (e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.025)";
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isActive && !isSelected) {
                            (e.currentTarget as HTMLTableRowElement).style.background = rowIdx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.012)";
                          }
                        }}
                      >
                        {row.getVisibleCells().map(cell => (
                          <td
                            key={cell.id}
                            className={`px-3 ${rowPadding} max-w-0`}
                            style={{ width: cell.column.getSize() }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div
            className="flex-shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0d1117" }}
          >
            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748b]">Rows</span>
                <select
                  value={pageSize}
                  onChange={e => { setPageSize(Number(e.target.value)); setPageIndex(0); }}
                  className="px-2 py-1 rounded text-xs text-[#94a3b8] outline-none cursor-pointer"
                  style={{ background: "#181c23", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "inherit" }}
                >
                  {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <span className="text-xs font-mono text-[#64748b]">
                {(pageIndex * pageSize + 1).toLocaleString()}–{Math.min((pageIndex + 1) * pageSize, filteredData.length).toLocaleString()} of{" "}
                <span className="text-[#94a3b8]">{filteredData.length.toLocaleString()}</span>
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-1 w-full sm:w-auto">
              <div className="flex items-center gap-1">
                <button onClick={() => setPageIndex(0)} disabled={pageIndex === 0} className="p-1.5 rounded text-[#64748b] hover:text-[#f8fafc] disabled:opacity-30 transition-colors hover:bg-white/5">
                  <ChevronsLeft size={14} />
                </button>
                <button onClick={() => setPageIndex(p => Math.max(0, p - 1))} disabled={pageIndex === 0} className="p-1.5 rounded text-[#64748b] hover:text-[#f8fafc] disabled:opacity-30 transition-colors hover:bg-white/5">
                  <ChevronLeft size={14} />
                </button>

                <div className="hidden sm:flex items-center gap-0.5 mx-1">
                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 7) {
                      page = i;
                    } else if (pageIndex < 4) {
                      page = i < 5 ? i : i === 5 ? -1 : totalPages - 1;
                    } else if (pageIndex > totalPages - 5) {
                      page = i === 0 ? 0 : i === 1 ? -1 : totalPages - 5 + (i - 2);
                    } else {
                      page = i === 0 ? 0 : i === 1 ? -1 : i === 5 ? -2 : i === 6 ? totalPages - 1 : pageIndex - 1 + (i - 2);
                    }

                    if (page < 0) {
                      return <span key={i} className="px-1 text-[#64748b] text-xs">…</span>;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setPageIndex(page)}
                        className="w-7 h-7 rounded text-xs font-mono transition-colors"
                        style={{
                          background: page === pageIndex ? "#3b82f6" : "transparent",
                          color: page === pageIndex ? "#fff" : "#64748b",
                        }}
                      >
                        {page + 1}
                      </button>
                    );
                  })}
                </div>

                <button onClick={() => setPageIndex(p => Math.min(totalPages - 1, p + 1))} disabled={pageIndex >= totalPages - 1} className="p-1.5 rounded text-[#64748b] hover:text-[#f8fafc] disabled:opacity-30 transition-colors hover:bg-white/5">
                  <ChevronRight size={14} />
                </button>
                <button onClick={() => setPageIndex(totalPages - 1)} disabled={pageIndex >= totalPages - 1} className="p-1.5 rounded text-[#64748b] hover:text-[#f8fafc] disabled:opacity-30 transition-colors hover:bg-white/5">
                  <ChevronsRight size={14} />
                </button>
              </div>

              <div className="hidden md:flex items-center gap-1.5 ml-3 pl-3" style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-xs text-[#64748b]">Go to</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  className="w-12 px-2 py-0.5 rounded text-xs text-center text-[#94a3b8] outline-none font-mono"
                  style={{ background: "#181c23", border: "1px solid rgba(255,255,255,0.08)" }}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      const v = parseInt((e.target as HTMLInputElement).value);
                      if (!isNaN(v) && v >= 1 && v <= totalPages) setPageIndex(v - 1);
                    }
                  }}
                  placeholder={String(pageIndex + 1)}
                />
              </div>
            </div>

            <div className="text-[11px] text-[#64748b] font-mono hidden lg:block">
              ↑↓ navigate · Space select · Esc deselect
            </div>
          </div>
        </div>

        {/* ── Inspector Panel ── */}
        {selectedRow && (
          <>
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm transition-all duration-300"
              onClick={() => setSelectedRow(null)}
            />
            <div
              className="fixed inset-y-0 right-0 z-40 w-80 max-w-full lg:static lg:w-64 lg:z-auto lg:h-auto overflow-hidden shadow-2xl lg:shadow-none transition-transform duration-300 transform translate-x-0"
              style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Inspector row={selectedRow} onClose={() => setSelectedRow(null)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
