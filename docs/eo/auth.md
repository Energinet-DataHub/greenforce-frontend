# Authentication in Energy Track And Trace

## Overview

Energy Track And Trace implements authentication using Azure Active Directory B2C with the **oidc-client-ts** library. This approach was chosen over MSAL (used in DataHub) for its:

- Simpler integration pattern
- Cleaner codebase
- Better maintainability with Angular version updates
- Reduced dependency on external maintenance

> **Development Note**: Local and demo environments use an **oidc-mock** implementation. This means certain authentication flows (like user terms acceptance) can only be fully tested against production, as claims like **TOS_ACCEPTED** are hardcoded in the mock.

## Authentication Flows

### 1. First-time User Login

When a user logs in for the first time, they must accept terms of service before gaining full access:

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend App
    participant B2C as Azure B2C
    participant API as Backend API

    U->>FE: Click Login
    FE->>B2C: Redirect to B2C Login Page
    B2C-->>U: Display Login Form
    U->>B2C: Enter Credentials
    B2C->>B2C: Validate Credentials
    B2C->>FE: Return Initial ID Token & Access Token

    Note over FE: Check token claims<br/>for terms acceptance

    FE->>FE: Detect first-time login
    FE-->>U: Redirect to Terms Page
    U->>FE: Accept Terms
    FE->>API: POST /api/terms-acceptance
    API-->>FE: Terms Acceptance Confirmed

    Note over FE: Initiate revalidation<br/>with B2C

    FE->>B2C: Login attempt after terms acceptance
    B2C->>FE: Return Expected Error
    Note over FE: Frontend catches error<br/>as part of normal flow

    FE->>B2C: Initiate New Login
    B2C->>B2C: Generate New Tokens<br/>with Updated Claims
    B2C->>FE: Return Updated Tokens (Success)
    FE->>FE: Store New Tokens
    FE-->>U: Redirect to Main Application
```

### 2. Standard Login

Subsequent logins follow a simpler flow after terms have been accepted:

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend App
    participant B2C as Azure B2C
    participant API as Backend API

    U->>FE: Click Login
    FE->>B2C: Redirect to B2C Login Page
    B2C-->>U: Display Login Form
    U->>B2C: Enter Credentials

    alt Valid Credentials
        B2C->>B2C: Validate Credentials
        B2C->>FE: Return ID Token & Access Token
        FE->>FE: Store Tokens
        FE->>API: API Request with Access Token
        API-->>FE: Protected Resource Response
        FE-->>U: Show Protected Content
    else Invalid Credentials
        B2C-->>U: Show Error Message
        B2C->>FE: Return Error
        FE-->>U: Display Error Message
    end
```

## Core Components

### 1. Authorization Interceptor

Manages HTTP request authentication and token handling:

#### Features

- Automatic Bearer token injection
- Smart token refresh on mutations (PUT/POST/DELETE)
- API endpoint filtering
- Comprehensive error handling

````mermaid
sequenceDiagram
    participant C as Component
    participant I as EoAuthInterceptor
    participant AS as AuthService
    participant API as API
    participant T as ToastService

    C->>I: HTTP Request

    rect rgb(240, 240, 240)
        Note over I: Check if URL starts with<br/>apiBase or wallet-apiBase
        alt Non-API Request
            I-->>C: Forward Unchanged
        end
    end

    rect rgb(240, 240, 240)
        Note over I: Add Authorization Header
        I->>AS: Get access_token
        AS-->>I: Return token
        I->>I: Clone request with<br/>Authorization header
    end

    I->>API: Send Authorized Request

    alt Successful Response
        API-->>I: Response 200

        rect rgb(240, 240, 240)
            Note over I: Check token refresh condition
            alt Should Refresh Token (PUT/POST/DELETE && not ignored URL)
                I->>AS: renewToken()
            end
        end

        I-->>C: Return Response
    else Error Response
        alt 403 Forbidden
            API-->>I: Response 403
            I->>T: Display Permission Error
            I-->>C: Return Error
        else 401 Unauthorized
            API-->>I: Response 401
            I->>AS: logout()
            I-->>C: Return Error
        else Other Error
            API-->>I: Error Response
            I-->>C: Return Error
        end
    end
````

### 2. Scope Guard

Protects routes and manages authentication state:

#### Key Functions

- Route protection
- Authentication validation
- Terms acceptance verification
- Language-aware redirects

```mermaid
sequenceDiagram
    participant R as Router
    participant G as EoScopeGuard
    participant AS as AuthService
    participant T as TranslocoService

    R->>G: Route Access Attempt
    
    rect rgb(240, 240, 240)
        Note over G: Check skipGuard data
        alt Route has skipGuard
            G-->>R: Allow Access (true)
        end
    end

    G->>T: Get Active Language
    T-->>G: Current Language

    rect rgb(240, 240, 240)
        Note over G: Build redirect URL<br/>with language and query params
    end

    G->>AS: Check isLoggedIn()
    
    alt Not Logged In
        AS-->>G: false
        G->>AS: login(redirectUrl)
        G-->>R: Deny Access (false)
    else Logged In
        AS-->>G: true
        
        G->>AS: Get user profile
        AS-->>G: User data
        
        alt Terms Not Accepted
            G->>R: Navigate to terms page<br/>with redirectUrl
            G-->>R: Deny Access (false)
        else Terms Accepted
            G-->>R: Allow Access (true)
        end
    end
```

### 3. Organization ID Interceptor

Manages organizational context for API calls:

#### Responsibilities

- Organization ID injection
- Request filtering
- Context preservation

```mermaid
sequenceDiagram
    participant C as Component
    participant I as OrgIdInterceptor
    participant AS as ActorService
    participant API as API

    C->>I: HTTP Request
    
    rect rgb(240, 240, 240)
        Note over I: Check if URL starts with<br/>apiBase or wallet-apiBase
        alt Non-API Request
            I-->>C: Forward Unchanged
        end
    end

    I->>AS: Get current actor
    AS-->>I: Actor info

    alt No Current Actor
        I-->>C: Forward Unchanged
    else Has Actor
        rect rgb(240, 240, 240)
            Note over I: Clone request and<br/>add organizationId param
        end
        
        I->>API: Modified Request
        API-->>I: Response
        I-->>C: Return Response
    end
```

### 4. Actor Self Guard

Controls access based on user context:

#### Features

- Self-context verification
- Smart redirects
- Language preservation

```mermaid
sequenceDiagram
    participant R as Router
    participant G as ActorSelfGuard
    participant AS as ActorService
    participant T as TranslocoService

    R->>G: Route Access Attempt
    
    G->>AS: isSelf()
    AS-->>G: Check Result

    alt Not Acting as Self
        G->>T: Get Active Language
        T-->>G: Current Language
        G->>R: Navigate to dashboard<br/>with current language
        G-->>R: Deny Access (false)
    else Acting as Self
        G-->>R: Allow Access (true)
    end
```

### 5. Idle Timer Service

Manages session timeouts and user activity:

#### Behavior

- 15-minute inactivity warning
- 5-minute grace period
- Multi-tab support
- Activity monitoring

```mermaid
sequenceDiagram
    participant App as Application
    participant ITS as IdleTimerService
    participant DOM as Document Events
    participant MD as Modal Dialog
    participant AS as AuthService

    App->>ITS: startMonitor()
    
    rect rgb(240, 240, 240)
        Note over ITS: Setup Activity Monitoring<br/>mousemove, mousedown, keydown,<br/>wheel, touchstart, touchmove
    end

    par Activity Monitoring
        DOM-->>ITS: User Activity Events
        Note over ITS: Debounce 15 minutes
    and Tab Visibility
        DOM-->>ITS: visibilitychange Event
        Note over ITS: Check last activity
    end

    alt 15 Minutes Inactivity
        ITS->>MD: Show Warning Dialog
        
        rect rgb(240, 240, 240)
            Note over MD: Start 5 minute countdown
        end
        
        alt User Interaction
            MD->>ITS: Dialog Closed
            ITS->>ITS: Reset Monitoring
        else Timeout or Manual Logout
            MD->>ITS: Request Logout
            ITS->>AS: logout()
            ITS->>MD: Show Logout Confirmation
        end
    end

    alt Tab Return After Timeout
        DOM-->>ITS: visibilitychange (visible)
        ITS->>ITS: Check last activity time
        alt Exceeded Warning Threshold
            ITS->>MD: Show Warning Dialog
        end
    end
```

## Security Features

### Token Management

- Automatic token refresh for mutations
- Secure token storage
- Token validation
- Clear token lifecycle

### Error Handling

1. **Authentication Errors**
   - 401: Automatic logout
   - 403: Permission notifications
   - Generic errors: Proper propagation

2. **Session Management**
   - Inactivity detection
   - Grace period warnings
   - Secure logout process

### Context Security

- Organization isolation
- Self-context protection
- Route guards
- API request filtering

## Best Practices

### Development Guidelines

1. Always use appropriate guards for protected routes
2. Implement proper error handling
3. Consider organizational context
4. Test thoroughly against production B2C

### Common Pitfalls

- Testing limitations with oidc-mock
- Token refresh timing
- Multi-tab synchronization
- Organization context switching

## Integration Points

### External Systems

- Azure AD B2C
- Backend API
- Wallet API

### Internal Services

- Translation Service
- Toast Notifications
- Modal Service
- Router Service
