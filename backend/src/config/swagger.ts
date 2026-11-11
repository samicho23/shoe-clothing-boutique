export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Atelier API',
    version: '0.1.0',
    description: 'API documentation for the Atelier shoe and clothing boutique.',
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Local development server',
    },
  ],
  tags: [
    { name: 'Health', description: 'Service health checks' },
    { name: 'Auth', description: 'Authentication and current user operations' },
    { name: 'Products', description: 'Product catalog operations' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        required: ['id', 'email', 'name', 'role'],
        properties: {
          id: { type: 'string', example: 'user_admin' },
          email: { type: 'string', format: 'email', example: 'admin@atelier.local' },
          name: { type: 'string', example: 'Admin User' },
          role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'CASHIER', 'INVENTORY_STAFF'], example: 'ADMIN' },
        },
      },
      Product: {
        type: 'object',
        required: ['id', 'name', 'sku', 'category', 'price', 'stock', 'status', 'createdAt'],
        properties: {
          id: { type: 'string', example: 'product_1' },
          name: { type: 'string', example: 'Classic Leather Sneaker' },
          sku: { type: 'string', example: 'SHOE-001' },
          category: { type: 'string', enum: ['Shoes', 'Clothing', 'Accessories', 'Other'] },
          price: { type: 'number', format: 'float', minimum: 0, example: 89.99 },
          stock: { type: 'integer', minimum: 0, example: 12 },
          status: { type: 'string', enum: ['In stock', 'Low stock', 'Out of stock'], example: 'In stock' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      ProductInput: {
        type: 'object',
        required: ['name', 'sku', 'category', 'price'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 120, example: 'Classic Leather Sneaker' },
          sku: { type: 'string', minLength: 2, maxLength: 40, pattern: '^[A-Za-z0-9-]+$', example: 'SHOE-001' },
          category: { type: 'string', enum: ['Shoes', 'Clothing', 'Accessories', 'Other'] },
          price: { type: 'number', format: 'float', minimum: 0, example: 89.99 },
          stock: { type: 'integer', minimum: 0, default: 0, example: 12 },
        },
      },
      Error: {
        type: 'object',
        required: ['error'],
        properties: {
          error: { type: 'string', example: 'Invalid email or password' },
        },
      },
    },
  },
  paths: {
    '/api/v1/health': {
      get: {
        tags: ['Health'],
        summary: 'Check API health',
        responses: {
          '200': {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    service: { type: 'string', example: 'boutique-backend' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'admin@atelier.local' },
                  password: { type: 'string', format: 'password', example: 'atelier-admin' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Authenticated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        token: { type: 'string' },
                        user: { $ref: '#/components/schemas/User' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '400': { description: 'Invalid request body' },
        },
      },
    },
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Create an account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', minLength: 2, maxLength: 80, example: 'Jordan Smith' },
                  email: { type: 'string', format: 'email', example: 'jordan@atelier.com' },
                  password: { type: 'string', format: 'password', minLength: 8, example: 'secure-password' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Account created successfully' },
          '400': { description: 'Invalid request body' },
          '409': { description: 'Email already registered' },
        },
      },
    },
    '/api/v1/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Log out',
        security: [{ bearerAuth: [] }],
        responses: {
          '204': { description: 'Logged out successfully' },
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get the current user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Current user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { data: { $ref: '#/components/schemas/User' } },
                },
              },
            },
          },
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/api/v1/products': {
      get: {
        tags: ['Products'],
        summary: 'List products',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'Product list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                    total: { type: 'integer', example: 1 },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Create a product',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductInput',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Product created',
            content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/Product' } } } } },
          },
          '400': { description: 'Invalid request body' },
          '401': { description: 'Authentication required' },
          '403': { description: 'Insufficient permissions' },
          '409': { description: 'SKU already exists' },
        },
      },
    },
  },
} as const
