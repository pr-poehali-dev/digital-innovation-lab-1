import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { Link } from "react-router-dom";

const ANALYZE_URL = "https://functions.poehali.dev/6b3b5ed1-cd4c-4a57-ac59-41705a974cd2";

interface AnalysisResult {
  meta: { bots: string[]; assets: string[]; date_from: string | null; date_to: string | null };
  summary: {
    trades_total: number; trades_wins: number; trades_losses: number;
    win_rate_pct: number; total_pnl: number; avg_roi_pct: number;
    best_trade: { pnl: number; roi: number; time: string } | null;
    worst_trade: { pnl: number; roi: number; time: string } | null;
  };
  cascades: {
    count: number; profitable_count: number; profitable_pct: number;
    total_pnl: number; total_bet: number; total_roi_pct: number;
    hedges_total: number; hedges_wins: number; hedges_losses: number; hedges_wr_pct: number;
  };
  hedges: {
    h2: HedgeStat | null; h3: HedgeStat | null;
    pip_distribution: { pips: string; count: number }[];
  };
  comparison: {
    with: { count: number; wr: number; pnl: number; avg_roi: number };
    without: { count: number; wr: number; pnl: number; avg_roi: number };
  };
  hours: { hour: string; count: number; wins: number; wr: number; pnl: number }[];
  recommendations: { type: string; icon: string; title: string; detail: string }[];
  errors_count: number;
}

interface HedgeStat {
  count: number; avg_pips: number; min_pips: number; max_pips: number;
  avg_pct: number; avg_pullback: number; avg_time_pct: number; avg_multiplier: number;
}

export default function BotReport() {
  const [content, setContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [drag, setDrag] = useState(false);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(e.target?.result || "");
      setContent(text);
    };
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const analyze = async () => {
    if (!content) return;
    setLoading(true);
    setError("");
    try {
      const r = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await r.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setContent("");
    setFileName("");
    setResult(null);
    setError("");
  };

  const recColor = (type: string) => {
    if (type === "positive") return "border-green-500/50 bg-green-500/10";
    if (type === "warning") return "border-orange-500/50 bg-orange-500/10";
    return "border-blue-500/50 bg-blue-500/10";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">📊 Анализ отчёта бота</h1>
            <p className="text-muted-foreground mt-1">
              Загрузи JSONL-файл из папки <code className="text-primary">reports/</code> и получи разбор с рекомендациями
            </p>
          </div>
          <Link to="/bot-builder">
            <Button variant="outline"><Icon name="ArrowLeft" size={16} className="mr-2"/>К конструктору</Button>
          </Link>
        </div>

        {!result && (
          <Card
            className={`p-12 border-2 border-dashed transition-colors ${
              drag ? "border-primary bg-primary/10" : "border-muted-foreground/30"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
          >
            <div className="text-center">
              <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground"/>
              <h2 className="text-xl font-semibold mb-2">
                {fileName ? `📄 ${fileName}` : "Перетащи файл .jsonl сюда"}
              </h2>
              <p className="text-muted-foreground mb-4">
                Файл лежит у тебя в папке <code>reports/trades_YYYY-MM-DD.jsonl</code>
              </p>
              <input
                type="file"
                accept=".jsonl,.json,.txt"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
                id="file-input"
              />
              <div className="flex gap-3 justify-center">
                <label htmlFor="file-input">
                  <Button asChild><span><Icon name="FolderOpen" size={16} className="mr-2"/>Выбрать файл</span></Button>
                </label>
                {content && (
                  <Button onClick={analyze} disabled={loading}>
                    {loading ? <Icon name="Loader2" size={16} className="mr-2 animate-spin"/> : <Icon name="Sparkles" size={16} className="mr-2"/>}
                    Анализировать
                  </Button>
                )}
              </div>
              {error && <div className="mt-4 text-red-500">{error}</div>}
            </div>
          </Card>
        )}

        {result && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Бот: <b className="text-foreground">{result.meta.bots.join(", ")}</b> |{" "}
                Актив: <b className="text-foreground">{result.meta.assets.join(", ")}</b>
                {result.meta.date_from && (
                  <> | Период: <b className="text-foreground">{result.meta.date_from?.slice(0, 16)}</b> → <b className="text-foreground">{result.meta.date_to?.slice(0, 16)}</b></>
                )}
              </div>
              <Button variant="outline" onClick={reset}><Icon name="RotateCcw" size={16} className="mr-2"/>Загрузить другой</Button>
            </div>

            {/* Сводка */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-muted-foreground">Всего сделок</div>
                <div className="text-2xl font-bold">{result.summary.trades_total}</div>
                <div className="text-xs mt-1">✅{result.summary.trades_wins} / ❌{result.summary.trades_losses}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground">Win Rate</div>
                <div className="text-2xl font-bold">{result.summary.win_rate_pct}%</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground">Итого P&L</div>
                <div className={`text-2xl font-bold ${result.summary.total_pnl > 0 ? "text-green-500" : "text-red-500"}`}>
                  {result.summary.total_pnl > 0 ? "+" : ""}{result.summary.total_pnl}
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground">Сред. ROI</div>
                <div className={`text-2xl font-bold ${result.summary.avg_roi_pct > 0 ? "text-green-500" : "text-red-500"}`}>
                  {result.summary.avg_roi_pct > 0 ? "+" : ""}{result.summary.avg_roi_pct}%
                </div>
              </Card>
            </div>

            {/* Лучшая/худшая */}
            {(result.summary.best_trade || result.summary.worst_trade) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.summary.best_trade && (
                  <Card className="p-4 border-green-500/30">
                    <div className="text-sm text-muted-foreground">🥇 Лучшая сделка</div>
                    <div className="text-xl font-bold text-green-500">+{result.summary.best_trade.pnl} (ROI {result.summary.best_trade.roi}%)</div>
                    <div className="text-xs text-muted-foreground">{result.summary.best_trade.time?.slice(0, 16)}</div>
                  </Card>
                )}
                {result.summary.worst_trade && (
                  <Card className="p-4 border-red-500/30">
                    <div className="text-sm text-muted-foreground">📉 Худшая сделка</div>
                    <div className="text-xl font-bold text-red-500">{result.summary.worst_trade.pnl} (ROI {result.summary.worst_trade.roi}%)</div>
                    <div className="text-xs text-muted-foreground">{result.summary.worst_trade.time?.slice(0, 16)}</div>
                  </Card>
                )}
              </div>
            )}

            {/* Рекомендации */}
            {result.recommendations.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">💡 Рекомендации (с доказательной базой)</h2>
                <div className="space-y-3">
                  {result.recommendations.map((r, i) => (
                    <div key={i} className={`p-4 rounded-lg border ${recColor(r.type)}`}>
                      <div className="font-semibold flex items-center gap-2">
                        <span className="text-2xl">{r.icon}</span>{r.title}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{r.detail}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Каскады */}
            {result.cascades.count > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">🛡 Каскадное хеджирование</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <div className="text-xs text-muted-foreground">Запусков</div>
                    <div className="text-xl font-bold">{result.cascades.count}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Прибыльных</div>
                    <div className="text-xl font-bold">{result.cascades.profitable_count} ({result.cascades.profitable_pct}%)</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Хеджей всего (WR)</div>
                    <div className="text-xl font-bold">{result.cascades.hedges_total} ({result.cascades.hedges_wr_pct}%)</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">P&L каскадов</div>
                    <div className={`text-xl font-bold ${result.cascades.total_pnl > 0 ? "text-green-500" : "text-red-500"}`}>
                      {result.cascades.total_pnl > 0 ? "+" : ""}{result.cascades.total_pnl}
                    </div>
                  </div>
                </div>

                {/* H2/H3 пипсы */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.hedges.h2 && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="font-semibold mb-2">📐 ХЕДЖ-2 ({result.hedges.h2.count} срабат.)</div>
                      <div className="text-sm space-y-1">
                        <div>Сред. дистанция: <b>{result.hedges.h2.avg_pips} пип</b> ({result.hedges.h2.avg_pct}%)</div>
                        <div>Диапазон: {result.hedges.h2.min_pips}—{result.hedges.h2.max_pips} пип</div>
                        <div>Сред. откат от пика: <b>{result.hedges.h2.avg_pullback} пип</b></div>
                        <div>Сред. время до триггера: <b>{result.hedges.h2.avg_time_pct}%</b> экспирации</div>
                        <div>Множитель M2: <b>{result.hedges.h2.avg_multiplier}x</b></div>
                      </div>
                    </div>
                  )}
                  {result.hedges.h3 && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="font-semibold mb-2">📐 ХЕДЖ-3 ({result.hedges.h3.count} срабат.)</div>
                      <div className="text-sm space-y-1">
                        <div>Сред. дистанция: <b>{result.hedges.h3.avg_pips} пип</b></div>
                        <div>Диапазон: {result.hedges.h3.min_pips}—{result.hedges.h3.max_pips} пип</div>
                        <div>Множитель M3: <b>{result.hedges.h3.avg_multiplier}x</b></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Распределение пипсов */}
                {result.hedges.pip_distribution.length > 0 && (
                  <div className="mt-6">
                    <div className="font-semibold mb-2">Распределение дистанций H2 (в пипах)</div>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={result.hedges.pip_distribution}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                        <XAxis dataKey="pips"/>
                        <YAxis/>
                        <Tooltip/>
                        <Bar dataKey="count" fill="#3b82f6"/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            )}

            {/* С каскадом vs без */}
            {result.comparison.with.count > 0 && result.comparison.without.count > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">⚖️ Сравнение: с каскадом vs без каскада</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="font-semibold">🛡 С каскадом ({result.comparison.with.count})</div>
                    <div className="text-sm mt-2 space-y-1">
                      <div>WR: <b>{result.comparison.with.wr}%</b></div>
                      <div>P&L: <b className={result.comparison.with.pnl > 0 ? "text-green-500" : "text-red-500"}>
                        {result.comparison.with.pnl > 0 ? "+" : ""}{result.comparison.with.pnl}
                      </b></div>
                      <div>Avg ROI: <b>{result.comparison.with.avg_roi}%</b></div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="font-semibold">📉 Без каскада ({result.comparison.without.count})</div>
                    <div className="text-sm mt-2 space-y-1">
                      <div>WR: <b>{result.comparison.without.wr}%</b></div>
                      <div>P&L: <b className={result.comparison.without.pnl > 0 ? "text-green-500" : "text-red-500"}>
                        {result.comparison.without.pnl > 0 ? "+" : ""}{result.comparison.without.pnl}
                      </b></div>
                      <div>Avg ROI: <b>{result.comparison.without.avg_roi}%</b></div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* График по часам */}
            {result.hours.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">⏰ Прибыль по часам</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={result.hours}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                    <XAxis dataKey="hour"/>
                    <YAxis yAxisId="left"/>
                    <YAxis yAxisId="right" orientation="right"/>
                    <Tooltip/>
                    <Legend/>
                    <Line yAxisId="left" type="monotone" dataKey="pnl" stroke="#10b981" name="P&L" strokeWidth={2}/>
                    <Line yAxisId="right" type="monotone" dataKey="wr" stroke="#3b82f6" name="WR %" strokeWidth={2}/>
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
