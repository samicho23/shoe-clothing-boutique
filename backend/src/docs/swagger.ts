export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Boutique API',
    version: '0.1.0',
    description: 'API documentation for Atelier shoe and clothing boutique operations.',
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
    { name: 'Categories', description: 'Product category operations' },
    { name: 'Customers', description: 'Customer operations' },
    { name: 'Dashboard', description: 'Dashboard summaries' },
    { name: 'Inventory', description: 'Inventory operations' },
    { name: 'Payments', description: 'Payment operations' },
    { name: 'Purchases', description: 'Purchase operations' },
    { name: 'Reports', description: 'Business reports' },
    { name: 'Sales', description: 'Sales operations' },
    { name: 'Suppliers', description: 'Supplier operations' },
    { name: 'Users', description: 'User operations' },
    { name: 'Public', description: 'Public storefront and contact operations' },
    { name: 'Meta', description: 'Public application metadata' },
    { name: 'Admin', description: 'Administrator-only operations' },
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
        required: ['id', 'name', 'role', 'status'],
        properties: {
          id: { type: 'string', example: 'user_admin' },
          email: { type: 'string', format: 'email', nullable: true, example: 'admin@boutique.local' },
          name: { type: 'string', example: 'Abebe Bekele' },
          firstName: { type: 'string', example: 'Abebe' },
          lastName: { type: 'string', example: 'Bekele' },
          phoneNumber: { type: 'string', nullable: true, example: '+251900000000' },
          status: { type: 'string', enum: ['PENDING', 'ACTIVE', 'SUSPENDED'], example: 'ACTIVE' },
          role: { type: 'string', example: 'ADMIN', description: 'Primary role returned by the authentication API' },
          roles: { type: 'array', items: { $ref: '#/components/schemas/Role' } },
          emailVerified: { type: 'boolean', example: true },
          phoneVerified: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Role: {
        type: 'object',
        required: ['id', 'name', 'isSystem'],
        properties: {
          id: { type: 'string', example: 'role_admin' },
          name: { type: 'string', example: 'ADMIN' },
          description: { type: 'string', nullable: true },
          isSystem: { type: 'boolean', example: true },
          permissions: { type: 'array', items: { $ref: '#/components/schemas/Permission' } },
        },
      },
      Permission: {
        type: 'object',
        required: ['id', 'name', 'resource', 'action'],
        properties: {
          id: { type: 'string', example: 'permission_products_read' },
          name: { type: 'string', example: 'products.read' },
          resource: { type: 'string', example: 'products' },
          action: { type: 'string', enum: ['read', 'create', 'update', 'delete'], example: 'read' },
          description: { type: 'string', nullable: true },
        },
      },
      AuditLog: {
        type: 'object',
        required: ['id', 'action', 'resource', 'createdAt'],
        properties: {
          id: { type: 'string' },
          userId: { type: 'string', nullable: true },
          action: { type: 'string', example: 'CREATE' },
          resource: { type: 'string', example: 'products' },
          resourceId: { type: 'string', nullable: true },
          details: { type: 'object', nullable: true, additionalProperties: true },
          ipAddress: { type: 'string', nullable: true },
          userAgent: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Category: {
        type: 'object',
        required: ['id', 'name', 'slug'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: 'Shoes' },
          slug: { type: 'string', example: 'shoes' },
          productCount: { type: 'integer', example: 24 },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Customer: {
        type: 'object',
        required: ['id', 'name', 'status'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: 'Hana Tesfaye' },
          email: { type: 'string', format: 'email', nullable: true },
          phone: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['Active', 'Inactive'], example: 'Active' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Supplier: {
        type: 'object',
        required: ['id', 'name', 'status'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: 'Sheger Leather Supply' },
          email: { type: 'string', format: 'email', nullable: true },
          phone: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['Active', 'Inactive'], example: 'Active' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Payment: {
        type: 'object',
        required: ['id', 'saleReference', 'method', 'amount'],
        properties: {
          id: { type: 'string' },
          saleReference: { type: 'string', example: 'AT-1048' },
          reference: { type: 'string', nullable: true },
          method: { type: 'string', enum: ['CASH', 'BANK_TRANSFER', 'CARD', 'MOBILE_MONEY'] },
          amount: { type: 'number', format: 'float', example: 189 },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Sale: {
        type: 'object',
        required: ['id', 'reference', 'total', 'status'],
        properties: {
          id: { type: 'string' },
          reference: { type: 'string', example: 'AT-1048' },
          customer: { type: 'string', example: 'Hana Tesfaye' },
          cashier: { type: 'string', example: 'Abebe Bekele' },
          total: { type: 'number', format: 'float', example: 318 },
          status: { type: 'string', enum: ['PENDING', 'PARTIAL', 'PAID', 'REFUNDED'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Purchase: {
        type: 'object',
        required: ['id', 'reference', 'supplier', 'total', 'status'],
        properties: {
          id: { type: 'string' },
          reference: { type: 'string', example: 'PO-204' },
          supplier: { type: 'string', example: 'Sheger Leather Supply' },
          items: { type: 'integer', example: 8 },
          total: { type: 'number', format: 'float', example: 1250 },
          status: { type: 'string', enum: ['DRAFT', 'ORDERED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      InventoryItem: {
        type: 'object',
        required: ['id', 'product', 'sku', 'available', 'minimum', 'status'],
        properties: {
          id: { type: 'string' },
          product: { type: 'string', example: 'Siena leather loafer' },
          sku: { type: 'string', example: 'SH-00248' },
          category: { type: 'string', example: 'Shoes' },
          available: { type: 'integer', example: 24 },
          minimum: { type: 'integer', example: 5 },
          costValue: { type: 'number', format: 'float', example: 2400 },
          status: { type: 'string', enum: ['In stock', 'Low stock', 'Out of stock'] },
        },
        NewsArticle: {
          type: 'object',
          required: ['id', 'title', 'slug', 'content', 'isPublished'],
          properties: {
            id: { type: 'string' },
            title: { type: 'string', example: 'New autumn collection' },
            slug: { type: 'string', example: 'new-autumn-collection' },
            excerpt: { type: 'string', nullable: true },
            content: { type: 'string' },
            imageUrl: { type: 'string', format: 'uri', nullable: true },
            isPublished: { type: 'boolean' },
            publishedAt: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        GalleryItem: {
          type: 'object',
          required: ['id', 'title', 'imageUrl', 'isVisible'],
          properties: {
            id: { type: 'string' },
            title: { type: 'string', example: 'Siena loafer collection' },
            imageUrl: { type: 'string', format: 'uri' },
            altText: { type: 'string', nullable: true },
            sortOrder: { type: 'integer', example: 1 },
            isVisible: { type: 'boolean', example: true },
          },
        },
        ContactSubmission: {
          type: 'object',
          required: ['name', 'email', 'message'],
          properties: {
            name: { type: 'string', example: 'Hana Tesfaye' },
            email: { type: 'string', format: 'email', example: 'hana.tesfaye@example.com' },
            subject: { type: 'string', nullable: true },
            message: { type: 'string', minLength: 10 },
          },
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
                  email: { type: 'string', format: 'email', example: 'admin@boutique.local' },
                  password: { type: 'string', format: 'password', example: 'boutique-admin' },
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
                required: ['firstName', 'lastName', 'email', 'phoneNumber', 'password'],
                properties: {
                  firstName: { type: 'string', minLength: 1, maxLength: 40, example: 'Abebe' },
                  lastName: { type: 'string', minLength: 1, maxLength: 40, example: 'Bekele' },
                  email: { type: 'string', format: 'email', example: 'admin@boutique.local' },
                  phoneNumber: { type: 'string', example: '+251911234567' },
                  password: { type: 'string', format: 'password', minLength: 8, example: 'secure-password' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Account created successfully' },
          '400': { description: 'Invalid request body' },
          '409': { description: 'Email or phone number already registered' },
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
    '/api/v1/categories': crudPath('Categories', 'categories'),
    '/api/v1/categories/{id}': crudItemPath('Categories', 'categories'),
    '/api/v1/customers': crudPath('Customers', 'customers'),
    '/api/v1/customers/{id}': crudItemPath('Customers', 'customers'),
    '/api/v1/inventory': crudPath('Inventory', 'inventory'),
    '/api/v1/inventory/{id}': crudItemPath('Inventory', 'inventory'),
    '/api/v1/payments': crudPath('Payments', 'payments'),
    '/api/v1/payments/{id}': crudItemPath('Payments', 'payments'),
    '/api/v1/purchases': crudPath('Purchases', 'purchases'),
    '/api/v1/purchases/{id}': crudItemPath('Purchases', 'purchases'),
    '/api/v1/sales': crudPath('Sales', 'sales'),
    '/api/v1/sales/{id}': crudItemPath('Sales', 'sales'),
    '/api/v1/suppliers': crudPath('Suppliers', 'suppliers'),
    '/api/v1/suppliers/{id}': crudItemPath('Suppliers', 'suppliers'),
    '/api/v1/users': crudPath('Users', 'users'),
    '/api/v1/users/{id}': crudItemPath('Users', 'users'),
    '/api/v1/dashboard': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get dashboard summary',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Dashboard metrics and recent sales' },
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/api/v1/reports/sales': {
      get: {
        tags: ['Reports'],
        summary: 'Get sales report',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Sales report with totals' },
          '401': { description: 'Authentication required' },
        },
      },
    },
      '/api/v1/public/catalog': {
        get: {
          tags: ['Public'],
          summary: 'Get the public product catalog',
          responses: {
            '200': { description: 'Published catalog with categories and available products' },
          },
        },
      },
      '/api/v1/public/news': {
        get: {
          tags: ['Public'],
          summary: 'List published news articles',
          responses: {
            '200': { description: 'Published boutique news' },
          },
        },
      },
      '/api/v1/public/gallery': {
        get: {
          tags: ['Public'],
          summary: 'List visible gallery items',
          responses: {
            '200': { description: 'Visible gallery items' },
          },
        },
      },
      '/api/v1/public/contact': {
        post: {
          tags: ['Public'],
          summary: 'Send a contact message',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactSubmission' } } },
          },
          responses: {
            '201': { description: 'Contact message received' },
            '400': { description: 'Invalid contact message' },
          },
        },
      },
      '/api/v1/meta': {
        get: {
          tags: ['Meta'],
          summary: 'Get public application metadata',
          responses: {
            '200': { description: 'Boutique metadata, categories, roles, and enum values' },
          },
        },
      },
      '/api/v1/admin/overview': {
        get: {
          tags: ['Admin'],
          summary: 'Get administrator overview',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Administrator metrics' },
            '401': { description: 'Authentication required' },
            '403': { description: 'Administrator role required' },
          },
        },
      },
      '/api/v1/admin/audit-logs': {
        get: {
          tags: ['Admin'],
          summary: 'List audit logs',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 50 } }],
          responses: {
            '200': { description: 'Recent audit logs' },
            '401': { description: 'Authentication required' },
            '403': { description: 'Administrator role required' },
          },
        },
      },
      '/api/v1/admin/users': {
        get: {
          tags: ['Admin'],
          summary: 'List and search users',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'search', in: 'query', schema: { type: 'string' } }],
          responses: { '200': { description: 'Users with assigned roles' }, '401': { description: 'Authentication required' }, '403': { description: 'Administrator role required' } },
        },
      },
      '/api/v1/admin/users/{id}': {
        patch: {
          tags: ['Admin'],
          summary: 'Update user status or roles',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['PENDING', 'ACTIVE', 'SUSPENDED'] }, roleIds: { type: 'array', items: { type: 'string' } } } } } } },
          responses: { '200': { description: 'User updated' }, '404': { description: 'User not found' } },
        },
      },
      '/api/v1/admin/news': {
        get: { tags: ['Admin'], summary: 'List all news articles', security: [{ bearerAuth: [] }], responses: { '200': { description: 'News articles' } } },
        post: { tags: ['Admin'], summary: 'Create a news article', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/NewsArticle' } } } }, responses: { '201': { description: 'News article created' } } },
      },
      '/api/v1/admin/news/{id}': {
        patch: { tags: ['Admin'], summary: 'Update a news article', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/NewsArticle' } } } }, responses: { '200': { description: 'News article updated' }, '404': { description: 'News article not found' } } },
        delete: { tags: ['Admin'], summary: 'Delete a news article', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '204': { description: 'News article deleted' }, '404': { description: 'News article not found' } } },
      },
      '/api/v1/admin/gallery': {
        get: { tags: ['Admin'], summary: 'List all gallery items', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Gallery items' } } },
        post: { tags: ['Admin'], summary: 'Create a gallery item', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/GalleryItem' } } } }, responses: { '201': { description: 'Gallery item created' } } },
      },
      '/api/v1/admin/gallery/{id}': {
        patch: { tags: ['Admin'], summary: 'Update a gallery item', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/GalleryItem' } } } }, responses: { '200': { description: 'Gallery item updated' }, '404': { description: 'Gallery item not found' } } },
        delete: { tags: ['Admin'], summary: 'Delete a gallery item', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '204': { description: 'Gallery item deleted' }, '404': { description: 'Gallery item not found' } } },
      },
      '/api/v1/admin/contacts': {
        get: { tags: ['Admin'], summary: 'List contact submissions', security: [{ bearerAuth: [] }], parameters: [{ name: 'resolved', in: 'query', schema: { type: 'boolean' } }], responses: { '200': { description: 'Contact submissions' } } },
      },
      '/api/v1/admin/contacts/{id}/resolve': {
        patch: { tags: ['Admin'], summary: 'Resolve a contact submission', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Contact submission resolved' }, '404': { description: 'Contact submission not found' } } },
      },
      '/api/v1/admin/roles': {
        get: { tags: ['Admin'], summary: 'List roles and permissions', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Roles' } } },
        post: { tags: ['Admin'], summary: 'Create a role', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Role' } } } }, responses: { '201': { description: 'Role created' } } },
      },
      '/api/v1/admin/roles/{id}': {
        patch: { tags: ['Admin'], summary: 'Update a role and permissions', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Role' } } } }, responses: { '200': { description: 'Role updated' }, '404': { description: 'Role not found' } } },
      },
      '/api/v1/admin/permissions': {
        get: { tags: ['Admin'], summary: 'List permissions', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Permissions' } } },
        post: { tags: ['Admin'], summary: 'Create a permission', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Permission' } } } }, responses: { '201': { description: 'Permission created' } } },
      },
    },
} as const

function crudPath(tag: string, resource: string) {
  const schema = resourceSchema(resource)
  return {
    get: {
      tags: [tag],
      summary: `List ${resource}`,
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'search', in: 'query', schema: { type: 'string' } }],
      responses: {
        '200': {
          description: `${resource} list`,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { type: 'array', items: { $ref: `#/components/schemas/${schema}` } },
                  total: { type: 'integer', example: 1 },
                },
              },
            },
          },
        },
        '401': { description: 'Authentication required' },
      },
    },
    post: {
      tags: [tag],
      summary: `Create ${resource.slice(0, -1)}`,
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { type: 'object', additionalProperties: true } } },
      },
      responses: {
        '201': { description: `${resource.slice(0, -1)} created` },
        '401': { description: 'Authentication required' },
      },
    },
  }
}

function crudItemPath(tag: string, resource: string) {
  const schema = resourceSchema(resource)
  return {
    patch: {
      tags: [tag],
      summary: `Update ${resource.slice(0, -1)}`,
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { type: 'object', additionalProperties: true } } },
      },
      responses: {
        '200': {
          description: `${resource.slice(0, -1)} updated`,
          content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: `#/components/schemas/${schema}` } } } } },
        },
        '401': { description: 'Authentication required' },
        '404': { description: `${resource.slice(0, -1)} not found` },
      },
    },
    delete: {
      tags: [tag],
      summary: `Delete ${resource.slice(0, -1)}`,
      security: [{ bearerAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        '204': { description: `${resource.slice(0, -1)} deleted` },
        '401': { description: 'Authentication required' },
        '404': { description: `${resource.slice(0, -1)} not found` },
      },
    },
  }
}

function resourceSchema(resource: string) {
  const schemas: Record<string, string> = {
    categories: 'Category',
    customers: 'Customer',
    inventory: 'InventoryItem',
    payments: 'Payment',
    purchases: 'Purchase',
    sales: 'Sale',
    suppliers: 'Supplier',
    users: 'User',
  }
  return schemas[resource] ?? 'Error'
}
