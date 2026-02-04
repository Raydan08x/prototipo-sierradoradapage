export const API_URL = 'http://localhost:3000/api';

export const api = {
    auth: {
        signUp: async (data: any) => {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw result;
            return { data: { user: result.user }, error: null };
        },
        signInWithPassword: async (data: any) => {
            const response = await fetch(`${API_URL}/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw result;

            // Store token
            if (result.access_token) {
                localStorage.setItem('sb-access-token', result.access_token);
            }

            return { data: { user: result.user, session: { access_token: result.access_token } }, error: null };
        },
        getUser: async () => {
            const token = localStorage.getItem('sb-access-token');
            if (!token) return { data: { user: null }, error: null };

            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            const result = await response.json();
            if (!response.ok) {
                return { data: { user: null }, error: result };
            }
            return { data: { user: result.user }, error: null };
        },
        signOut: async () => {
            localStorage.removeItem('sb-access-token');
            return { error: null };
        },
        onAuthStateChange: (_callback: any) => {
            // Mock subscription for compatibility
            return { data: { subscription: { unsubscribe: () => { } } } };
        }
    },
    from: (table: string) => {
        let queryParams = new URLSearchParams();
        let bodyData: any = null;
        let method = 'GET';

        // Define interface for the builder to satisfy PromiseLike compatibility
        interface PostgrestBuilder extends PromiseLike<{ data: any; error: any }> {
            select(columns?: string): PostgrestBuilder;
            eq(column: string, value: any): PostgrestBuilder;
            order(column: string, options?: { ascending?: boolean }): PostgrestBuilder;
            limit(count: number): PostgrestBuilder;
            single(): Promise<{ data: any; error: any }>;
            insert(data: any): PostgrestBuilder;
            update(data: any): PostgrestBuilder;
            delete(): PostgrestBuilder;
        }

        const builder = {
            select: (columns = '*') => {
                queryParams.append('select', columns);
                return builder;
            },
            eq: (column: string, value: any) => {
                queryParams.append(column, value);
                return builder;
            },
            order: (column: string, options?: { ascending?: boolean }) => {
                const dir = options?.ascending ? 'asc' : 'desc';
                queryParams.append('order', `${column}.${dir}`);
                return builder;
            },
            limit: (count: number) => {
                queryParams.append('limit', count.toString());
                return builder;
            },
            single: async () => {
                // We can't await 'builder' here easily due to recursion issues in some envs,
                // so we manually call the execute logic via a new promise or similar, 
                // but re-using .then() is easiest if we are careful.
                const res = await builder.then();
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    return { data: res.data[0], error: null };
                }
                return { data: null, error: { message: 'No rows found' } };
            },
            insert: (data: any) => {
                method = 'POST';
                bodyData = data;
                return builder;
            },
            update: (data: any) => {
                method = 'PATCH';
                bodyData = data;
                return builder;
            },
            delete: () => {
                method = 'DELETE';
                return builder;
            },
            then: (onfulfilled?: ((value: any) => any) | null, onrejected?: ((reason: any) => any) | null) => {
                const queryString = queryParams.toString();
                const url = `${API_URL}/data/${table}?${queryString}`;

                const execute = async () => {
                    try {
                        const options: RequestInit = {
                            method,
                            headers: { 'Content-Type': 'application/json' },
                        };

                        if (bodyData) {
                            options.body = JSON.stringify(bodyData);
                        }

                        const response = await fetch(url, options);
                        const result = await response.json();

                        if (!response.ok) {
                            return { data: null, error: { message: result.error || 'API Error' } };
                        }

                        return { data: result, error: null };
                    } catch (e) {
                        return { data: null, error: e };
                    }
                };

                return execute().then(onfulfilled, onrejected);
            }
        };
        // Cast to strictly typed interface
        return builder as unknown as PostgrestBuilder;
    }
};
