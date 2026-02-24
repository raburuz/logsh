export const config = {
  app: {
    name: 'Logsh.co',
    domain: 'logsh.co',
    url: "https://logsh.co",
    description: 'A comprehensive analytics dashboard',
    version: '1.0.0'
  },
  email: {
    fromAuth: 'security@notify.logsh.co',
    author: 'jean@notify.logsh.co',
    help: 'hello@notify.logsh.co'
  },
  marketing: {
    socialMedia: {
      x: {
        username: '@Jeanpacara',
        url: 'https://x.com/Jeanpacara',
      }
    },
    seo: {
      title: 'logsh.co - From blind spots to full visibility across your apps',
      description: "Your apps shouldn't fail silently. Get real-time visibility and alerts and stay in the loop with logsh.co",
      category: 'Analytics',
      keywords: ['analytics', 'dashboard', 'data visualization', 'insights', 'real-time monitoring', 'performance metrics', 'user behavior', 'data-driven decisions', 'log management', 'application monitoring'],
    }
  },
  community: {
    discord: 'https://discord.gg/DeDxTANd',
    x: 'https://x.com/Jeanpacara',
  },
  redirects: {
    toDashboard: "/dashboard",
    toOnboarding: "/onboarding",
  }
}