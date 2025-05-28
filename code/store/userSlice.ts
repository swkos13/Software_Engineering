import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../domain/User'
import { Role } from '../domain/Role'
import { SessionManager } from '../domain/SessionManager'

interface UserState {
  current?: User
  token?: string
  status: 'idle'|'loading'|'failed'
}

const initialState: UserState = { status: 'idle' }

// Async thunk for login
export const login = createAsyncThunk<
  { user: User; token: string },
  { username: string; password: string }
>(
  'user/login',
  async ({ username, password }: { username: string; password: string }) => {
    // 1. fetch hashed pwd & role from API
    // 2. new User(...)
    // 3. new SessionManager().createSession(...)
    const role = new Role('Operator')        // demo only
    const user = new User('1', username, 'you@me', password, role)
    const token = new SessionManager().createSession(user.id)
    return { user, token }
  }
)

interface LogoutAction {
    type: string
}

interface UpdateProfilePayload {
    username?: string
    email?: string
}

interface UpdateProfileAction {
    type: string
    payload: UpdateProfilePayload
}

const slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state: UserState): void {
            if (state.token && state.current) {
                new SessionManager().destroySession(state.current.id)
            }
            state.current = undefined
            state.token = undefined
        },
        updateProfile(
            state: UserState,
            action: PayloadAction<UpdateProfilePayload>
        ): void {
            state.current?.updateProfile(action.payload)
        }
    },
    extraReducers: (builder: any) => {
        builder
            .addCase(login.pending, (state: UserState) => { state.status = 'loading' })
            .addCase(login.fulfilled, (state: UserState, { payload }: PayloadAction<{ user: User; token: string }>) => {
                state.current = payload.user
                state.token = payload.token
                state.status = 'idle'
            })
            .addCase(login.rejected, (state: UserState) => { state.status = 'failed' })
    }
})

export const { logout, updateProfile } = slice.actions
export default slice.reducer
