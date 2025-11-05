## Architecture

### 1. Routes Layer (`routes/`)
- **Purpose**: Define API endpoints and map them to controllers
- **Responsibilities**:
  - Define HTTP methods (GET, POST, PUT, DELETE)
  - Map URL paths to controller methods
  - Minimal logic - just routing


### 2. Controllers Layer (`controllers/`)
- **Purpose**: Handle HTTP request/response cycle
- **Responsibilities**:
  - Extract data from requests (params, body, query)
  - Call appropriate service methods
  - Format responses (success/error)
  - Handle HTTP status codes
  - Error handling and logging

### 3. Services Layer (`services/`)
- **Purpose**: Business logic
- **Responsibilities**:
  - Business logic implementation
  - Data validation
  - Business rules enforcement

### 4. Models Layer (`models/`)
- **Purpose**: Data access layer
- **Responsibilities**:
  - Database queries
  - SQL/MongoDB operations
  - Data persistence
  - Data retrieval


## Data Flow

```
HTTP Request
    ↓
Routes (route definition)
    ↓
Controllers (HTTP handling)
    ↓
Services (business logic & validation)
    ↓
Models (data access)
    ↓
Database (MySQL/MongoDB)
    ↓
Response flows back up through layers
```

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a single, well-defined responsibility
2. **Testability**: Each layer can be tested independently
3. **Maintainability**: Changes in one layer don't affect others
4. **Scalability**: Easy to add new features without touching existing code
5. **Reusability**: Services can be reused across different controllers
6. **Error Handling**: Centralized error handling at each layer