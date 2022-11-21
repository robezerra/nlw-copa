import { useState, useEffect, createContext, ReactNode } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import { api } from '../services/api';

interface UserProps {
	name: string;
	avatarUrl: string;
}

export interface AuthContextDataProps {
	user: UserProps;
	isUserLoading;
	signIn: () => Promise<void>;
}

interface AuthContextProviderProps {
	children: ReactNode;
}

WebBrowser.maybeCompleteAuthSession();

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
	const [user, setUser] = useState<UserProps>({} as UserProps);
	const [isUserLoading, setIsUserLoading] = useState(false);

	const [request, response, promptAsync] = Google.useAuthRequest({
		clientId:
			'237649924481-ebfh5u3u3p1sscvg8ldaje6f91899cp1.apps.googleusercontent.com',
		redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
		scopes: ['profile', 'email'],
	});

	async function signIn() {
		try {
			setIsUserLoading(true);
			await promptAsync();
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			setIsUserLoading(false);
		}
	}

	async function signInWithGoogle(access_token: string) {
		try {
			setIsUserLoading(true);

			const tokenResponse = await api.post('/users', {
				access_token,
			});

			api.defaults.headers.common[
				'Authorization'
			] = `Bearer ${tokenResponse.data.token}`;

			const userInfoResponse = await api.get('/me');

			setUser(userInfoResponse.data.user);
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			setIsUserLoading(false);
		}
	}

	useEffect(() => {
		if (response?.type === 'success' && response.authentication?.accessToken) {
			signInWithGoogle(response.authentication.accessToken);
		}
	}, [response]);

	return (
		<AuthContext.Provider
			value={{
				user,
				signIn,
				isUserLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
