export { default } from 'next-auth/middleware'

export const config = { matcher: ['/', '/((?!login|register).*)'] } // Prevents the possitbility to access these routes for unauthorized users