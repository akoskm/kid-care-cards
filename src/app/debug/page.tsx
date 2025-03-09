"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [authStatus, setAuthStatus] = useState('Checking...');
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});

  useEffect(() => {
    async function checkAuth() {
      try {
        // Get current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setAuthStatus(`Error: ${error.message}`);
          return;
        }
        
        setSession(data.session);
        setAuthStatus(data.session ? 'Authenticated' : 'Not authenticated');
        
        // Collect debug info
        setDebugInfo({
          session: data.session,
          url: window.location.href,
          localStorage: Object.keys(localStorage).filter(key => 
            key.includes('supabase') || key.includes('auth')
          ),
          cookies: document.cookie,
        });
      } catch (err: any) {
        setAuthStatus(`Exception: ${err?.message || 'Unknown error'}`);
      }
    }
    
    checkAuth();
  }, []);

  const handleManualRedirect = () => {
    window.location.href = '/';
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleClearStorage = () => {
    // Clear any supabase related items
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('auth')) {
        localStorage.removeItem(key);
      }
    });
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">Status: {authStatus}</h2>
            </div>
            
            <div className="space-x-2">
              <Button onClick={handleManualRedirect}>
                Manual Redirect to Home
              </Button>
              
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
              
              <Button variant="destructive" onClick={handleClearStorage}>
                Clear Storage
              </Button>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Debug Information</h3>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
