import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const ADMIN_URL = 'https://functions.poehali.dev/edd2b917-45c0-406b-877f-0e7f96206cac';

interface KeyRecord {
  id: number;
  key: string;
  email: string;
  order_id: string;
  is_active: boolean;
  created_at: string;
}

function formatDate(iso: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function Admin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [keys, setKeys] = useState<KeyRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [genEmail, setGenEmail] = useState('');
  const [genCount, setGenCount] = useState(1);
  const [generated, setGenerated] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const fetchKeys = useCallback(async (pwd: string) => {
    setLoading(true);
    const res = await fetch(ADMIN_URL, {
      headers: { 'X-Admin-Password': pwd },
    });
    if (res.status === 401) {
      setAuthError('Неверный пароль');
      setAuthed(false);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setKeys(data.keys || []);
    setLoading(false);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    const res = await fetch(ADMIN_URL, { headers: { 'X-Admin-Password': password } });
    if (res.status === 401) { setAuthError('Неверный пароль'); return; }
    const data = await res.json();
    setKeys(data.keys || []);
    setAuthed(true);
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    setGenerated([]);
    const res = await fetch(ADMIN_URL, {
      method: 'POST',
      headers: { 'X-Admin-Password': password, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate', email: genEmail, count: genCount }),
    });
    const data = await res.json();
    setGenerated(data.generated || []);
    fetchKeys(password);
    setGenerating(false);
  }

  async function handleToggle(id: number) {
    await fetch(ADMIN_URL, {
      method: 'POST',
      headers: { 'X-Admin-Password': password, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle', id }),
    });
    fetchKeys(password);
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить ключ?')) return;
    await fetch(ADMIN_URL, {
      method: 'POST',
      headers: { 'X-Admin-Password': password, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    });
    fetchKeys(password);
  }

  function copyKey(key: string) {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  const filtered = keys.filter(k =>
    k.key.includes(search.toUpperCase()) ||
    k.email.toLowerCase().includes(search.toLowerCase()) ||
    k.order_id.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: keys.length,
    active: keys.filter(k => k.is_active).length,
    withEmail: keys.filter(k => k.email).length,
    manual: keys.filter(k => k.order_id === 'manual').length,
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 mb-6">
            <Icon name="ArrowLeft" size={14} /> На главную
          </button>
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Icon name="ShieldCheck" size={22} className="text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-1">Панель управления</h1>
            <p className="text-muted-foreground text-sm mb-6">Введите пароль администратора</p>
            <form onSubmit={handleLogin} className="space-y-3">
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
              />
              {authError && <p className="text-destructive text-sm">{authError}</p>}
              <Button type="submit" className="w-full">Войти</Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
              <Icon name="ArrowLeft" size={18} />
            </button>
            <h1 className="text-2xl font-bold text-foreground">Управление ключами</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchKeys(password)} disabled={loading}>
            <Icon name="RefreshCw" size={14} className={loading ? 'animate-spin mr-1' : 'mr-1'} />
            Обновить
          </Button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Всего ключей', value: stats.total, icon: 'Key' },
            { label: 'Активных', value: stats.active, icon: 'CheckCircle' },
            { label: 'С email', value: stats.withEmail, icon: 'Mail' },
            { label: 'Ручных', value: stats.manual, icon: 'Hand' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4">
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-muted-foreground text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Генерация */}
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Icon name="Plus" size={16} className="text-primary" /> Сгенерировать ключи
          </h2>
          <form onSubmit={handleGenerate} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-48">
              <label className="text-xs text-muted-foreground mb-1 block">Email (необязательно)</label>
              <Input
                placeholder="user@example.com"
                value={genEmail}
                onChange={e => setGenEmail(e.target.value)}
              />
            </div>
            <div className="w-24">
              <label className="text-xs text-muted-foreground mb-1 block">Кол-во</label>
              <Input
                type="number"
                min={1}
                max={50}
                value={genCount}
                onChange={e => setGenCount(Number(e.target.value))}
              />
            </div>
            <Button type="submit" disabled={generating}>
              {generating ? <Icon name="Loader2" size={14} className="animate-spin mr-1" /> : null}
              Создать
            </Button>
          </form>
          {generated.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">Созданные ключи (нажми чтобы скопировать):</p>
              <div className="flex flex-wrap gap-2">
                {generated.map(k => (
                  <button
                    key={k}
                    onClick={() => copyKey(k)}
                    className="font-mono text-sm bg-muted px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors border border-border"
                  >
                    {copied === k ? '✓ Скопировано' : k}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Таблица */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <Icon name="Search" size={16} className="text-muted-foreground flex-shrink-0" />
            <Input
              placeholder="Поиск по ключу, email или order_id..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border-0 p-0 h-auto bg-transparent focus-visible:ring-0 shadow-none"
            />
            <span className="text-muted-foreground text-xs flex-shrink-0">{filtered.length} из {keys.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Ключ</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Источник</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Создан</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Статус</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                      {keys.length === 0 ? 'Ключей пока нет' : 'Ничего не найдено'}
                    </td>
                  </tr>
                )}
                {filtered.map(k => (
                  <tr key={k.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => copyKey(k.key)}
                        className="font-mono text-xs bg-muted px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                        title="Нажми чтобы скопировать"
                      >
                        {copied === k.key ? '✓' : k.key}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-foreground">{k.email || <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${k.order_id === 'manual' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                        {k.order_id === 'manual' ? 'вручную' : 'lava'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(k.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${k.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {k.is_active ? 'активен' : 'отключён'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => handleToggle(k.id)}
                          className="p-1.5 rounded hover:bg-muted transition-colors"
                          title={k.is_active ? 'Отключить' : 'Включить'}
                        >
                          <Icon name={k.is_active ? 'EyeOff' : 'Eye'} size={14} className="text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(k.id)}
                          className="p-1.5 rounded hover:bg-red-500/10 transition-colors"
                          title="Удалить"
                        >
                          <Icon name="Trash2" size={14} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
