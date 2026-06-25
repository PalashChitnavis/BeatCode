import { createSlice } from "@reduxjs/toolkit"

const outputSlice = createSlice({
  name: "output",
  initialState: {
    stdout: null,
    stderr: null,
    runtime: null,
    status: null,
    isRunning: false,
  },
  reducers: {
    setRunning: (state) => {
      state.isRunning = true
      state.stdout = null
      state.stderr = null
      state.runtime = null
      state.status = null
    },
    setOutput: (state, action) => {
      state.stdout   = action.payload.stdout   ?? null
      state.stderr   = action.payload.stderr   ?? null
      state.runtime  = action.payload.runtime  ?? null
      state.status   = action.payload.status   ?? null
      state.isRunning = false
    },
    clearOutput: (state) => {
      state.stdout = null
      state.stderr = null
      state.runtime = null
      state.status = null
      state.isRunning = false
    },
  },
})

export const { setRunning, setOutput, clearOutput } = outputSlice.actions
export default outputSlice.reducer