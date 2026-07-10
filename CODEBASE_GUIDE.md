# MERN Movie Review App - Complete Codebase Breakdown

## PART 1: SIGNUP.TSX - User Registration Page

### What is Signup.tsx?
This is a **React component** that displays a registration form where new users can create an account.

### Let's Break It Down Line by Line:

```typescript
import type { FC } from 'react'
```
- `FC` = Functional Component (a TypeScript type for React components)
- `type` keyword = just a TypeScript type, doesn't create a real import at runtime

```typescript
import { useState } from 'react'
```
- **useState** = React Hook for managing local component state
- Used here for form fields (name, email, password)

```typescript
import { useNavigate } from 'react-router-dom'
```
- **useNavigate** = React Router hook for redirecting to different pages
- After successful signup, we use this to redirect to home page

```typescript
import { useAppDispatch, useAuth } from '../redux/hooks'
```
- These are **custom Redux hooks** that let us:
  - `useAppDispatch` = send actions to Redux
  - `useAuth` = read auth state from Redux

```typescript
import { signup } from '../redux/slices/authSlice'
```
- **signup** = an async action from Redux that handles backend API call
- We'll explain this in detail later

---

### Inside the Component:

```typescript
const Signup: FC = () => {
```
- Declares a React Functional Component named Signup

#### STATE SETUP - Local Form Fields:
```typescript
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [confirmPassword, setConfirmPassword] = useState('')
const [localError, setLocalError] = useState('')
```

**What is `useState`?**
```typescript
const [value, setValue] = useState(initialValue)
```
- `value` = current state
- `setValue` = function to update state
- Example: `setName('John')` updates the name to 'John'

**What are these fields for?**
- `name`, `email`, `password` = user input from form
- `confirmPassword` = verify password matches
- `localError` = error messages specific to client (like password mismatch)

#### REDUX SETUP:
```typescript
const dispatch = useAppDispatch()
```
- `dispatch` = function to send Redux actions
- Think of it as a "messenger" that sends messages to Redux store

```typescript
const { loading, error } = useAuth()
```
- Gets auth state from Redux:
  - `loading` = is signup in progress? (show "Creating account..." button)
  - `error` = error from Redux (server response errors)

```typescript
const navigate = useNavigate()
```
- Function to navigate to different pages
- After successful signup: `navigate('/')` goes to home page

---

### The FORM SUBMISSION FLOW:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
```
- `e.preventDefault()` = stop form from refreshing page

```typescript
  setLocalError('')
```
- Clear previous errors before trying again

```typescript
  if (password !== confirmPassword) {
    setLocalError('Passwords do not match')
    return
  }
```
- **Client-side validation** = check before sending to server
- If passwords don't match, show error and stop

```typescript
  const result = await dispatch(signup({ name, email, password }))
```
- **THE KEY PART**: Sends signup action to Redux
- `await` = wait for API call to finish
- Passes user data to Redux

```typescript
  if (result.meta.requestStatus === 'fulfilled') {
    navigate('/')
  }
```
- If signup succeeds, redirect to home page
- Otherwise stay on page (error is displayed)

---

### The FORM UI:

```typescript
<form onSubmit={handleSubmit} className="auth-form">
  <input
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
```
- `onChange` = called every time user types
- `e.target.value` = the text user typed
- `setName()` = update state with new value

**Error Display:**
```typescript
{(error || localError) && <div className="auth-error">...</div>}
```
- Shows error if either Redux error OR local error exists

**Loading Button:**
```typescript
<button type="submit" disabled={loading} className="auth-button">
  {loading ? 'Creating account...' : 'Sign Up'}
</button>
```
- Button is disabled while loading
- Text changes based on loading state

---

## PART 2: LOGIN.TSX - User Login Page

The login page is **almost identical** to signup, but simpler:

### Key Differences:

**Fewer fields** - only email and password (no name, no confirm password)
```typescript
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
```

**Different Redux action** - uses `login` instead of `signup`
```typescript
const result = await dispatch(login({ email, password }))
```

**No password confirmation check**
- Login doesn't need to confirm passwords match

The rest of the flow is identical:
1. User fills form
2. Click submit
3. Dispatch Redux action
4. Wait for response
5. Redirect to home if successful
6. Show error if failed

---

## PART 3: REACT REDUX - State Management System

### What Problem Does Redux Solve?

Without Redux, auth state would be scattered everywhere:
- Login component has some state
- Navbar component has other state
- Profile component has more state
- Data might get out of sync ❌

With Redux, there's **ONE SINGLE PLACE** for all auth state:
- One source of truth ✅
- Easy to debug
- Easy to share state between components

---

### REDUX ARCHITECTURE DIAGRAM:

```
┌─────────────────────────────────────────────────────────────┐
│                     REDUX STORE (Global State)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  auth: {                                             │  │
│  │    user: { _id, name, email },                      │  │
│  │    token: "abc123def456",                           │  │
│  │    loading: false,                                   │  │
│  │    error: null,                                      │  │
│  │    isAuthenticated: true                            │  │
│  │  }                                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### How Data Flows:

```
STEP 1: USER INTERACTION
        ↓
        User clicks "Sign Up" button
        ↓
STEP 2: DISPATCH ACTION
        ↓
        dispatch(signup({ name, email, password }))
        ↓
STEP 3: ACTION GOES TO REDUCER
        ↓
        Redux processes: pending → call API → fulfilled/rejected
        ↓
STEP 4: STATE UPDATES
        ↓
        Redux store's auth state changes
        ↓
STEP 5: COMPONENT RE-RENDERS
        ↓
        useAuth() detects state change → component updates
        ↓
STEP 6: UI UPDATES
        ↓
        Button stops loading, error message appears, etc.
```

---

### AUTHSLICE.TS - Where the Magic Happens

#### WHAT IS A "SLICE"?

A **Slice** = a piece of Redux state + the functions that change it

Think of Redux Store like a cake:
```
┌─────────────────┐
│  Redux Store    │
│  ┌───────────┐  │  ← auth slice
│  │ auth: {}  │  │  (your user/login data)
│  ├───────────┤  │
│  │ movies: {}│  │  ← movies slice (for later)
│  ├───────────┤  │
│  │ reviews:{}│  │  ← reviews slice (for later)
│  └───────────┘  │
└─────────────────┘
```

#### AUTHSLICE STRUCTURE:

**1. Type Definitions** (describe the shape of state):
```typescript
interface User {
  _id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null      // either a User object or null
  token: string | null   // JWT token or null
  loading: boolean       // is something loading?
  error: string | null   // error message or null
  isAuthenticated: boolean  // are we logged in?
}
```

**2. Initial State** (starting values):
```typescript
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
}
```
- When app starts, user is not logged in
- No token, no user data
- Loading is false (nothing happening)

---

#### THE ASYNC THUNK - signup()

**What is an "Async Thunk"?**
- Thunk = a function that returns a function
- Async = involves waiting for something (API call)
- Used to: make API request, then update state

```typescript
export const signup = createAsyncThunk(
  'auth/signup',  // ← action name (for debugging)
  async (
    { name, email, password }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
```

**The Parameters:**
1. `{ name, email, password }` = input data from component
2. `{ rejectWithValue }` = utility to handle errors

**What the function does:**
```typescript
const response = await fetch(`${API_BASE}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, password }),
})
const data = await response.json()
```

- Makes API call to backend `/api/users`
- Sends user data
- Waits for response
- Converts response to JSON

**If successful:**
```typescript
if (response.ok) {
  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }))
  return data
}
```

- Save token to localStorage (so user stays logged in after refresh)
- Return the data (Redux will use this to update state)

**If failed:**
```typescript
else {
  return rejectWithValue(data.message || 'Signup failed')
}
```

- Return error message to Redux

---

### ASYNC THUNK FLOW DIAGRAM:

```
┌──────────────────────────────────────┐
│  dispatch(signup({ data }))          │  ← Component calls this
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│  signup.pending                      │  ← Redux sets loading: true
│  (starting API call)                 │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│  API Call: fetch to backend          │  ← Network request happens
│  await response                      │
└──────────────────────────────────────┘
              ↓
        Did it succeed?
       /              \
      ✓               ✗
      ↓               ↓
┌────────────┐   ┌──────────────────────┐
│ .fulfilled │   │ .rejected            │
│ loading: false  │ loading: false       │
│ user: {...}│   │ error: "message"     │
│ token: "..." │   │                      │
└────────────┘   └──────────────────────┘
      ↓               ↓
   SUCCESS        ERROR
```

---

### THE REDUCER - extraReducers

```typescript
extraReducers: (builder) => {
  builder
    .addCase(signup.pending, (state) => {
      state.loading = true
      state.error = null
    })
```

**What's happening:**
- When signup is starting (`pending`):
  - Set `loading = true` (show loading spinner)
  - Clear previous errors

```typescript
    .addCase(signup.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload         // ← data returned from thunk
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
    })
```

**When signup succeeds (`fulfilled`):**
- Set `loading = false` (stop showing spinner)
- Save user data to state
- Save token to state
- Mark as authenticated
- Clear errors

```typescript
    .addCase(signup.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string  // ← error message from thunk
      state.isAuthenticated = false
    })
```

**When signup fails (`rejected`):**
- Stop loading
- Save error message
- Mark as not authenticated

---

### REGULAR REDUCERS - logout()

```typescript
reducers: {
  logout: (state) => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    state.user = null
    state.token = null
    state.isAuthenticated = false
    state.error = null
  },
```

**What logout does:**
- Remove token from browser storage
- Remove user from browser storage
- Clear all state
- User is logged out

---

### STORE.TS - Combining Everything

```typescript
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})
```

**What's happening:**
- `configureStore` = creates the Redux store
- `reducer: { auth: authReducer }` = says "the auth piece of state is controlled by authReducer"

In the future you'll add more slices:
```typescript
{
  reducer: {
    auth: authReducer,
    movies: moviesReducer,      // ← will add this later
    reviews: reviewsReducer,    // ← will add this later
  }
}
```

---

### HOOKS.TS - Custom Hooks for Easy Access

```typescript
export const useAppDispatch = () => useDispatch<AppDispatch>()
```
- Returns a typed dispatch function
- Type-safe way to dispatch actions

```typescript
export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, token, loading, error, isAuthenticated } = useAppSelector((state) => state.auth)
  return { user, token, loading, error, isAuthenticated, dispatch }
}
```

**What this does:**
- Gets auth state from Redux store
- Returns it as one object
- Makes it super easy for components to use

Instead of:
```typescript
const user = useAppSelector((state) => state.auth.user)
const loading = useAppSelector((state) => state.auth.loading)
const error = useAppSelector((state) => state.auth.error)
```

You just do:
```typescript
const { user, loading, error } = useAuth()
```

---

## HOW IT ALL WORKS TOGETHER - COMPLETE FLOW

### When User Signs Up:

```
1. USER ENTERS DATA IN SIGNUP FORM
   ↓
2. onClick handleSubmit()
   ↓
3. dispatch(signup({ name, email, password }))
   ↓ Goes to Redux
4. signup.pending → loading: true
   ↓
5. API Call: POST /api/users (to backend)
   ↓
6. Backend responds with { _id, name, email, token }
   ↓
7. signup.fulfilled → state updates with user data
   ↓
8. localStorage saves token (user stays logged in on refresh)
   ↓
9. Component detects state change via useAuth()
   ↓
10. Re-renders with new state
    ↓
11. navigate('/') → redirects to home page
```

---

## KEY CONCEPTS TO REMEMBER

### State Flow (One Direction):

```
Component 
   ↓ (dispatch action)
Redux Slice (thunk/reducer)
   ↓ (updates state)
Redux Store
   ↓ (component subscribes with useAuth())
Component Re-renders
   ↓
UI Updates
```

### Why This Matters:

✅ **One source of truth** = state in one place  
✅ **Predictable** = always know what state will be  
✅ **Debuggable** = can track every action  
✅ **Scalable** = easy to add more slices (movies, reviews)  
✅ **Component reusability** = same state in any component  

---

## NEXT STEPS

Now that you understand:
- Signup/Login pages (components)
- Redux architecture (state management)

We can build:
1. ✅ Movies Slice - get list of movies
2. ✅ Reviews Slice - create/read reviews
3. ✅ Ratings Slice - rate movies
4. ✅ Likes Slice - like movies

Each will follow the same pattern!
