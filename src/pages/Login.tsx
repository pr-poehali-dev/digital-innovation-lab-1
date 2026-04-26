import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccess, clearAccess } from '@/hooks/use-access';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

export default function Login() {
  const { hasAccess, isLoading, activate, logout } = useAccess();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [activating, setActivating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    clearAccess();
  }, []);

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;
    setActivating(true);
    setError('');
    const result = await activate(key);
    if (result.success) {
      navigate('/bot-builder');
    } else {
      setError(result.error || 'Неверный ключ');
    }
    setActivating(false);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="KeyRound" size={28} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Вход</h1>
            <p className="text-muted-foreground text-sm">Введите ключ доступа</p>
          </div>

          <form onSubmit={handleActivate} className="space-y-4">
            <div>
              <Input
                placeholder="Например: ADMIN-2026"
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                className="text-center font-mono tracking-widest"
                autoFocus
              />
              {error && (
                <p className="text-destructive text-sm mt-2 text-center">{error}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={activating || !key.trim()}>
              {activating
                ? <><Icon name="Loader2" size={16} className="animate-spin mr-2" />Проверяем...</>
                : 'Войти'
              }
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
