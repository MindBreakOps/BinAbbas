import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

// Define the shape of our Workspace data
interface Workspace {
  id: string;
  name: string;
  domain: string;
  logo_url: string | null;
  theme_colors: {
	primary: string;
	secondary: string;
  } | null;
}

interface TenantContextType {
  workspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
	const fetchTenantData = async () => {
	  setIsLoading(true);
	  try {
		// 1. Get the current authenticated user
		const { data: { session }, error: authError } = await supabase.auth.getSession();
		
		if (authError || !session) {
		  setIsLoading(false);
		  return; // User is not logged in, wait for Auth to handle redirection
		}

		// 2. Fetch the user's profile to get their workspace_id
		const { data: profile, error: profileError } = await supabase
		  .from('profiles')
		  .select('workspace_id')
		  .eq('id', session.user.id)
		  .single();

		if (profileError || !profile) throw new Error('Could not load user profile.');

		// 3. Fetch the actual workspace details
		const { data: workspaceData, error: workspaceError } = await supabase
		  .from('workspaces')
		  .select('*')
		  .eq('id', profile.workspace_id)
		  .single();

		if (workspaceError || !workspaceData) throw new Error('Could not load workspace data.');

		setWorkspace(workspaceData);

		// 4. Optionally: Inject custom theme colors into the document root
		if (workspaceData.theme_colors) {
		  document.documentElement.style.setProperty('--green', workspaceData.theme_colors.primary);
		  document.documentElement.style.setProperty('--gold', workspaceData.theme_colors.secondary);
		}

	  } catch (err: any) {
		setError(err.message);
	  } finally {
		setIsLoading(false);
	  }
	};

	fetchTenantData();

	// Listen for auth changes (login/logout) to refetch or clear workspace
	const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
	  if (event === 'SIGNED_IN') {
		fetchTenantData();
	  } else if (event === 'SIGNED_OUT') {
		setWorkspace(null);
	  }
	});

	return () => {
	  authListener.subscription.unsubscribe();
	};
  }, []);

  return (
	<TenantContext.Provider value={{ workspace, isLoading, error }}>
	  {children}
	</TenantContext.Provider>
  );
};

// Custom hook for easy access in components
export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
	throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};