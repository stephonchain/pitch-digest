'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, Copy, ExternalLink, Plus, Sparkles } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

interface Digest {
  id: string;
  videoId: string;
  videoTitle: string;
  markdown: string;
  createdAt: string;
}

interface QuotaResponse {
  freeRemaining: number;
  paidRemaining: number;
  totalRemaining: number;
}

export default function Dashboard() {
  const { user } = useUser();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [digests, setDigests] = useState<Digest[]>([]);
  const [quota, setQuota] = useState<QuotaResponse | null>(null);
  const [loadingDigests, setLoadingDigests] = useState(true);

  useEffect(() => {
    if (user) {
      loadDigests();
      loadQuota();
    }
  }, [user]);

  const loadDigests = async () => {
    try {
      const response = await fetch('/api/digests');
      if (response.ok) {
        const data = await response.json();
        setDigests(data);
      }
    } catch (error) {
      console.error('Failed to load digests:', error);
    } finally {
      setLoadingDigests(false);
    }
  };

  const loadQuota = async () => {
    try {
      const response = await fetch('/api/quota');
      if (response.ok) {
        const data = await response.json();
        setQuota(data);
      }
    } catch (error) {
      console.error('Failed to load quota:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Digest created successfully!');
        setUrl('');
        loadDigests();
        setQuota(data.quota);
      } else if (response.status === 402) {
        toast.error('No digests remaining. Please purchase more.');
      } else {
        toast.error(data.error || 'Failed to create digest');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
      });

      if (response.ok) {
        const { url: checkoutUrl } = await response.json();
        window.location.href = checkoutUrl;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error('Error:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600">Transform YouTube videos into actionable summaries</p>
        </div>
        <UserButton />
      </div>

      {/* Quota Card */}
      {quota && (
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Your Digests
                </CardTitle>
                <CardDescription>Current usage and remaining quota</CardDescription>
              </div>
              {quota.totalRemaining === 0 && (
                <Button onClick={handlePurchase} className="bg-gradient-to-r from-emerald-600 to-green-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Buy 30 More
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Badge variant={quota.freeRemaining > 0 ? "default" : "secondary"} className="px-3 py-1">
                Free: {quota.freeRemaining}/3
              </Badge>
              <Badge variant={quota.paidRemaining > 0 ? "default" : "secondary"} className="px-3 py-1">
                Paid: {quota.paidRemaining}
              </Badge>
              {quota.totalRemaining > 0 && (
                <Button onClick={handlePurchase} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Buy More
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Form */}
      <Card className="mb-8 border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Create New Digest</CardTitle>
          <CardDescription>
            Paste any YouTube URL to generate a 5-bullet summary with timestamps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Input
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              disabled={loading}
            />
            <Button 
              type="submit" 
              disabled={loading || !quota || quota.totalRemaining === 0}
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Summarize'
              )}
            </Button>
          </form>
          {quota && quota.totalRemaining === 0 && (
            <p className="text-sm text-red-600 mt-2">
              No digests remaining. Purchase a pack to continue.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Digests History */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Your Digests</CardTitle>
          <CardDescription>
            All your previous summaries, ready to copy and share
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingDigests ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading your digests...</span>
            </div>
          ) : digests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No digests yet. Create your first one above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {digests.map((digest) => (
                <div key={digest.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {digest.videoTitle}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(digest.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://youtube.com/watch?v=${digest.videoId}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(digest.markdown)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="prose prose-sm max-w-none">
                    <div className="text-gray-700 whitespace-pre-wrap font-mono text-sm bg-gray-50 p-3 rounded border-l-4 border-blue-200">
                      {digest.markdown.split('\n').slice(0, 2).join('\n')}
                      {digest.markdown.split('\n').length > 2 && '\n...'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}