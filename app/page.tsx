import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Clock, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          Pitch Digest
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Turn any YouTube video into a concise 5-bullet summary with timestamps. 
          Perfect for entrepreneurs screening pitches, podcasts, and talks.
        </p>
        
        <SignedOut>
          <SignInButton mode="modal">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <Link href="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </SignedIn>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Lightning Fast</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              Get your 5-bullet summary in under 10 seconds. No more watching entire videos to find key insights.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle className="text-xl">Smart Timestamps</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              Every bullet point includes precise timestamps, plus quick links to the most important moments.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-xl">Privacy First</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              Transcripts are processed in memory only. We store just your final summaries, never the raw video data.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Pricing */}
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Simple, Fair Pricing</h2>
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Freemium Model</CardTitle>
            <CardDescription className="text-lg">
              Start free, scale as needed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Free digests for new users</span>
              <span className="font-semibold text-blue-600">3 digests</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Additional digest pack</span>
              <span className="font-semibold text-emerald-600">30 digests for €3</span>
            </div>
            <p className="text-sm text-gray-500 pt-4">
              One-time purchase, no subscription required
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}