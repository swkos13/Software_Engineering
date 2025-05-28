import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Robot } from '../domain/Robot'
import { RobotRegistry } from '../domain/RobotRegistry'

// Suppose you fetch an array of raw robot objects from your API:
export const fetchRobots = createAsyncThunk<Robot[]>(
  'robots/fetchAll',
  async () => {
    // e.g. const data = await api.get('/robots')
    // return data.map(r => new Robot(...))
    return []  // stub
  }
)

interface RobotsState {
  list: Robot[]
  status: 'idle'|'loading'|'failed'
}

const initialState: RobotsState = { list: [], status: 'idle' }

interface UpdateStatusPayload {
  id: string;
  status: string;
}

interface SliceReducers {
    addRobot: (state: RobotsState, action: PayloadAction<Robot>) => void;
    updateStatus: (state: RobotsState, action: PayloadAction<UpdateStatusPayload>) => void;
}

interface SliceExtraReducers {
    (builder: import('@reduxjs/toolkit').ActionReducerMapBuilder<RobotsState>): void;
}

const slice = createSlice({
    name: 'robots',
    initialState,
    reducers: {
        addRobot(state: RobotsState, action: PayloadAction<Robot>) {
            new RobotRegistry().registerRobot(action.payload)
            state.list.push(action.payload)
        },
        updateStatus(
            state: RobotsState,
            action: PayloadAction<UpdateStatusPayload>
        ) {
            const robot = state.list.find((r: Robot) => r.id === action.payload.id)
            if (robot) robot.updateStatus(action.payload.status)
        }
    } as SliceReducers,
    extraReducers: (builder: import('@reduxjs/toolkit').ActionReducerMapBuilder<RobotsState>) => {
        builder
            .addCase(fetchRobots.pending, (state: RobotsState) => { state.status = 'loading' })
            .addCase(fetchRobots.fulfilled, (state: RobotsState, { payload }: PayloadAction<Robot[]>) => {
                state.list = payload
                state.status = 'idle'
            })
            .addCase(fetchRobots.rejected, (state: RobotsState) => { state.status = 'failed' })
    }
})

export const { addRobot, updateStatus } = slice.actions
export default slice.reducer
