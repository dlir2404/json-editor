import { PresetItem } from '../types/json';

export const SAMPLE_PRESETS: PresetItem[] = [
  {
    id: 'user-profile',
    name: 'User Profile',
    category: 'User',
    description: 'Deeply nested user profile payload with settings and permissions',
    data: {
      userId: "usr_94820148",
      username: "alex_dev",
      email: "alex@example.com",
      status: "active",
      profile: {
        firstName: "Alex",
        lastName: "Morgan",
        avatar: "https://avatar.iran.liara.run/public/boy",
        bio: "Senior Full Stack Architect passionate about UI/UX design.",
        tags: ["React", "TypeScript", "Node.js", "Tailwind"]
      },
      preferences: {
        theme: "dark",
        notifications: {
          email: true,
          push: false,
          frequency: "daily"
        },
        language: "en-US"
      },
      roles: ["administrator", "editor"],
      lastLogin: "2026-07-31T09:24:12Z"
    }
  },
  {
    id: 'api-response',
    name: 'REST API Payload',
    category: 'API',
    description: 'Standard REST API response with pagination and metadata',
    data: {
      status: 200,
      success: true,
      message: "Data retrieved successfully",
      meta: {
        page: 1,
        perPage: 10,
        totalItems: 42,
        totalPages: 5
      },
      data: [
        {
          id: "prod_01",
          title: "Pro Mechanical Keyboard",
          price: 149.99,
          inStock: true
        },
        {
          id: "prod_02",
          title: "Ergonomic Wireless Mouse",
          price: 79.50,
          inStock: false
        }
      ]
    }
  },
  {
    id: 'ecommerce-catalog',
    name: 'E-Commerce Catalog',
    category: 'Commerce',
    description: 'Product catalog inventory with pricing variants',
    data: {
      store: "TechGear Direct",
      currency: "USD",
      categories: ["Peripherals", "Displays", "Accessories"],
      products: {
        featured: [
          {
            sku: "TG-MON-27",
            name: "27-inch 4K HDR Monitor",
            specs: {
              resolution: "3840x2160",
              refreshRate: 144,
              panel: "IPS"
            },
            price: 499.00
          }
        ]
      }
    }
  },
  {
    id: 'app-config',
    name: 'Application Config',
    category: 'Config',
    description: 'Feature flags, API keys, and environment settings',
    data: {
      environment: "production",
      debugMode: false,
      apiEndpoints: {
        auth: "https://auth.api.domain.com/v1",
        data: "https://data.api.domain.com/v2"
      },
      featureFlags: {
        enableAiAssist: true,
        enableBetaUI: true,
        maxUploadMB: 50
      }
    }
  }
];
