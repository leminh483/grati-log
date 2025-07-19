import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { createActor } from '../utils/backend';

interface AuthContextType {
  isAuthenticated: boolean;
  identity: Identity | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  principal: string | null;
  actor: any;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [actor, setActor] = useState<any>(null);

  // Internet Identity provider URL
  const identityProvider = process.env.DFX_NETWORK === 'ic' 
    ? 'https://identity.ic0.app'
    : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`;

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const client = await AuthClient.create();
      setAuthClient(client);

      const authenticated = await client.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const identity = client.getIdentity();
        setIdentity(identity);
        setPrincipal(identity.getPrincipal().toString());
        
        // Create actor with authenticated identity
        const backendActor = createActor(identity);
        setActor(backendActor);
      } else {
        // Create anonymous actor
        const backendActor = createActor();
        setActor(backendActor);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      // Still create anonymous actor on error
      const backendActor = createActor();
      setActor(backendActor);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    if (!authClient) return;

    try {
      setLoading(true);
      
      await authClient.login({
        identityProvider,
        onSuccess: () => {
          const identity = authClient.getIdentity();
          setIdentity(identity);
          setIsAuthenticated(true);
          setPrincipal(identity.getPrincipal().toString());
          
          // Create authenticated actor
          const backendActor = createActor(identity);
          setActor(backendActor);
          
          console.log('Login successful, Principal:', identity.getPrincipal().toString());
        },
        onError: (error) => {
          console.error('Login failed:', error);
        },
        windowOpenerFeatures: 'toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100',
      });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!authClient) return;

    try {
      setLoading(true);
      await authClient.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      
      // Create anonymous actor
      const backendActor = createActor();
      setActor(backendActor);
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    identity,
    login,
    logout,
    loading,
    principal,
    actor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};