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

// Cria e faz bind do admin client sempre que for usado
async function getAdminClient() {
  const client = new Client({ url: LDAP_URL! });
  await client.bind(LDAP_BIND_DN!, LDAP_PWD!);
  return client;
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

        let adminClient: Client | null = null;
        try {
          // 🔹 Conecta com a conta administrativa
          adminClient = await getAdminClient();

          // 🔹 Busca o DN do usuário
          const { searchEntries } = await adminClient.search(LDAP_BASE_DN!, {
            scope: "sub",
            filter: `(sAMAccountName=${username})`,
            attributes: ["dn", "cn", "mail"],
            sizeLimit: 1,
          });

          if (searchEntries.length === 0) {
            console.warn(`[LDAP] Usuário não encontrado: ${username}`);
            return null;
          }

          const user = searchEntries[0];
          const userDN = user.dn;

          // 🔹 Tenta autenticar com o DN do usuário e senha informada
          const userClient = new Client({ url: LDAP_URL! });
          await userClient.bind(userDN, password);
          await userClient.unbind();

          // 🔹 Retorna dados do usuário autenticado
          return {
            id: username,
            name: user.cn,
            email: user.mail,
            dn: userDN,
          };
        } catch (error: any) {
          const msg = error?.message || error;
          if (msg.includes("InvalidCredentialsError")) {
            console.warn(`[LDAP] Credenciais inválidas para ${username}`);
          } else if (msg.includes("InvalidClientError")) {
            console.error("[LDAP] Sessão administrativa expirada — rebind necessário");
          } else {
            console.error("[LDAP] Erro inesperado:", msg);
          }
          return null;
        } finally {
          if (adminClient) {
            try {
              await adminClient.unbind();
            } catch (err) {
              console.warn("[LDAP] Falha ao unbind admin:", err);
            }
          }
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8h
  },

  jwt: {
    secret: AUTH_SECRET,
  },

  pages: {
    signIn: "/login",
  },

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
