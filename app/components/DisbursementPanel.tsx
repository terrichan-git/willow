"use client";

import { useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = {
  id: string; name: string; relationship: string; location: string; currency: string;
  gross: number; fee: number; net: number;
  status?: string; accountId?: string; accountUrl?: string; transferId?: string | null; transferUrl?: string | null;
};

function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount / 100);
}

const STATUS_LABEL: Record<string, string> = {
  transferred: "Transferred",
  account_created: "Account created · payout pending",
  computed: "Computed",
};

export default function DisbursementPanel() {
  const [plan, setPlan] = useState<Row[]>([]);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/disburse").then((r) => r.json()).then((d) => {
      setPlan(d.beneficiaries || []);
      if (d.last) setResult(d.last);
    });
  }, []);

  async function disburse() {
    setLoading(true);
    try {
      const res = await fetch("/api/disburse", { method: "POST" });
      setResult(await res.json());
    } finally {
      setLoading(false);
    }
  }

  const rows: Row[] = result?.results || plan;
  const totalFee: Record<string, number> = result?.totalFeeByCurrency
    || plan.reduce((a: Record<string, number>, r) => ((a[r.currency] = (a[r.currency] || 0) + r.fee), a), {});

  return (
    <section className="rounded-2xl border border-hairline bg-paper p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-[23px] font-medium text-onyx">Settle &amp; disburse estate</h2>
          <p className="mt-1 text-sm text-ink-muted">Executor view · cross-border transfers via Stripe Connect, with a 0.5% Willow fee.</p>
        </div>
        <button onClick={disburse} disabled={loading} className="rounded-full bg-teal px-5 py-2.5 text-sm font-medium text-chalk transition hover:bg-teal-deep disabled:opacity-50">
          {loading ? "Disbursing…" : result ? "Re-run disbursement" : "Disburse to beneficiaries"}
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-hairline">
        <table className="w-full text-sm">
          <thead className="bg-chalk text-left text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-2.5 font-medium">Beneficiary</th>
              <th className="px-4 py-2.5 font-medium">Share</th>
              <th className="px-4 py-2.5 font-medium">Willow fee</th>
              <th className="px-4 py-2.5 font-medium">Net transfer</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-onyx">{r.name}</p>
                  <p className="text-xs text-ink-muted">{r.relationship} · {r.location}</p>
                </td>
                <td className="px-4 py-3 text-ink">{money(r.gross, r.currency)}</td>
                <td className="px-4 py-3 text-ink-muted">{money(r.fee, r.currency)}</td>
                <td className="px-4 py-3 font-medium text-onyx">{money(r.net, r.currency)}</td>
                <td className="px-4 py-3">
                  {r.status ? (
                    <div className="flex flex-col gap-1">
                      <span className={"inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-medium " + (r.status === "transferred" ? "bg-teal-soft text-teal-deep" : "bg-pending-soft text-pending")}>
                        {STATUS_LABEL[r.status] || r.status}
                      </span>
                      <div className="flex gap-2 text-xs">
                        {r.accountUrl && <a href={r.accountUrl} target="_blank" rel="noreferrer" className="text-teal hover:underline">account ↗</a>}
                        {r.transferUrl && <a href={r.transferUrl} target="_blank" rel="noreferrer" className="text-teal hover:underline">transfer ↗</a>}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-ink-faint">ready</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
        <span>Willow platform fee collected: {Object.entries(totalFee).map(([c, a]) => money(a as number, c)).join(" + ") || "—"}</span>
        {result?.connectEnabled && <span className="font-medium text-teal">● Live Stripe Connect transfers</span>}
        {result?.note && <span className={result.connectEnabled ? "text-ink-muted" : "text-pending"}>{result.note}</span>}
        {result && !result.connectEnabled && !result.note && (
          <span className="text-pending">Connect not enabled — numbers shown are computed.</span>
        )}
      </div>
    </section>
  );
}
