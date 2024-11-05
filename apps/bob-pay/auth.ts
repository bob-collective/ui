// import NextAuth, { AuthOptions } from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';

// import { validateJWT } from '@/lib/authHelpers';

// type User = {
//   id: string;
//   name: string;
//   email: string;
//   // Add other fields as needed
// };

// export const config = {
//   theme: {
//     logo: 'https://next-auth.js.org/img/logo/logo-sm.png'
//   },
//   providers: [
//     Credentials({
//       name: 'Credentials',
//       credentials: {
//         token: { label: 'Token', type: 'text' }
//       },
//       async authorize(credentials): Promise<User | null> {
//         const token = credentials?.token;

//         if (typeof token !== 'string' || !token) {
//           throw new Error('Token is required');
//         }
//         const jwtPayload = await validateJWT(token);

//         if (jwtPayload) {
//           // Transform the JWT payload into your user object
//           const user: User = {
//             id: jwtPayload.sub || '', // Assuming 'sub' is the user ID
//             name: jwtPayload.name || '', // Replace with actual field from JWT payload
//             email: jwtPayload.email || '' // Replace with actual field from JWT payload
//             // Map other fields as needed
//           };

//           return user;
//         } else {
//           return null;
//         }
//       }
//     })
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       if (token) {
//         session.user = {
//           image: token.picture as string,
//           name: token.name as string,
//           email: token.email as string
//         };
//       }

//       return session;
//     }
//   }
// } satisfies AuthOptions;

// export const { handlers, auth, signIn, signOut } = NextAuth(config);
