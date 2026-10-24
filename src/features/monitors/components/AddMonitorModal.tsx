import { useState } from 'react';
import { useCreateMonitor } from '../hooks/useMonitors';

interface Props {
  onClose: () => void;
}

export default function AddMonitorModal({ onClose }: Props) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const create = useCreateMonitor(onClose);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Service name is required.');
      return;
    }
    if (!url.trim()) {
      setError('URL is required.');
      return;
    }

    try {
      new URL(url.trim());
    } catch {
      setError('Enter a valid URL including http:// or https://');
      return;
    }

    create.mutate(
      { name: name.trim(), url: url.trim() },
      {
        onError: (err) =>
          setError(
            err instanceof Error ? err.message : 'Failed to create monitor'
          ),
      }
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Add Custom Service
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          Monitor any public URL — we'll check it every 60 seconds.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Service name
            </label>
            <input
              type="text"
              placeholder="My API"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              URL to monitor
            </label>
            <input
              type="url"
              placeholder="https://api.example.com/health"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={create.isPending}
              className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {create.isPending ? 'Adding…' : 'Add Monitor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
