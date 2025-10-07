import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { Client } from "ldapts";

const {
  LDAP_URL,
  LDAP_BIND_DN,
  LDAP_PWD,
  LDAP_BASE_DN,
  AUTH_SECRET,
} = process.env;

let adminClient: Client | null = null;

async function getAdminClient() {
  if (!adminClient) {
    adminClient = new Client({ url: LDAP_URL! });
    await adminClient.bind(LDAP_BIND_DN!, LDAP_PWD!);
  }
  return adminClient;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Active Directory",
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;

        if (!username || !password) return null;

        try {
          const client = await getAdminClient();

          const { searchEntries } = await client.search(LDAP_BASE_DN!, {
            scope: "sub",
            filter: `(sAMAccountName=${username})`,
            attributes: ["dn", "cn", "mail"],
            sizeLimit: 1,
          });

          if (searchEntries.length === 0) return null;

          const user = searchEntries[0];
          const userDN = user.dn;

          const userClient = new Client({ url: LDAP_URL! });
          await userClient.bind(userDN, password);
          await userClient.unbind();

          return {
            id: username,
            name: user.cn,
            email: user.mail,
            dn: userDN,
          };
        } catch (error) {
          console.error("[LDAP] Erro de autenticação:", error);
          return null;
        }
      },
    }),
  ],

  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  jwt: { secret: AUTH_SECRET },

  pages: { signIn: "/login" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
