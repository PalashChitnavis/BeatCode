import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as os from 'os'
import { ApiError } from '../../utils/apiError'
import { Language } from '../../models/Submission'

const execAsync = promisify(exec)

const TIMEOUT_MS   = 5000
const MEMORY_LIMIT = '128m'
const CPU_LIMIT    = '0.5'

interface RunResult {
  stdout:  string
  stderr:  string
  runtime: number
}

interface TestResult {
  passed:         boolean
  input:          string
  expectedOutput: string
  actualOutput:   string
  runtime:        number
  stderr:         string
}

interface ExecutionResult {
  status:  'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error'
  results: TestResult[]
  runtime: number
  stderr:  string
}

const languageConfig: Record<Language, {
  image:     string
  filename:  string
  buildCmd?: string
  runCmd:    string
}> = {
  python: {
    image:    'beatcode-python:v1',
    filename: 'solution.py',
    runCmd:   'python3 solution.py',
  },
  cpp: {
    image:    'beatcode-cpp:v1',
    filename: 'solution.cpp',
    buildCmd: 'g++ -O2 -o solution solution.cpp',
    runCmd:   './solution',
  },
  java: {
    image:    'beatcode-java:v1',
    filename: 'Solution.java',
    buildCmd: 'javac Solution.java',
    runCmd:   'java Solution',
  },
  javascript: {
    image:    'beatcode-node:v1',
    filename: 'solution.js',
    runCmd:   'node solution.js',
  },
}

const runInContainer = async (
  image:   string,
  codeDir: string,
  cmd:     string,
  stdin:   string,
): Promise<RunResult> => {
  const start    = Date.now()
  const stdinFile = path.join(codeDir, '_stdin.txt')

  await fs.writeFile(stdinFile, stdin, 'utf8')

  const dockerCmd = [
    'docker run --rm',
    '--network none',
    `--memory ${MEMORY_LIMIT}`,
    `--cpus ${CPU_LIMIT}`,
    `--ulimit nofile=64:64`,
    `-v ${codeDir}:/code`,
    `-w /code`,
    image,
    `sh -c ${JSON.stringify(`${cmd} < /code/_stdin.txt`)}`,
  ].join(' ')

  try {
    const { stdout, stderr } = await execAsync(dockerCmd, { timeout: TIMEOUT_MS })
    return { stdout: stdout.trim(), stderr: stderr.trim(), runtime: Date.now() - start }
  } catch (err: any) {
    if (err.killed || err.signal === 'SIGTERM') {
      throw { type: 'tle' }
    }
    return {
      stdout:  (err.stdout ?? '').trim(),
      stderr:  (err.stderr ?? '').trim(),
      runtime: Date.now() - start,
    }
  }
}

export const executeCode = async (
  code:      string,
  language:  Language,
  testCases: { input: string; expectedOutput: string }[],
): Promise<ExecutionResult> => {
  const config  = languageConfig[language]
  if (!config) throw new ApiError(400, 'Unsupported language')

  const tmpDir  = await fs.mkdtemp(path.join(os.tmpdir(), 'beatcode-'))
  const codeFile = path.join(tmpDir, config.filename)

  try {
    await fs.writeFile(codeFile, code, 'utf8')

    if (config.buildCmd) {
      try {
        await runInContainer(config.image, tmpDir, config.buildCmd, '')
      } catch (err: any) {
        if (err.type === 'tle') {
          return { status: 'compilation_error', results: [], runtime: 0, stderr: 'Compilation timed out' }
        }
        const result = err as RunResult
        if (result.stderr) {
          return { status: 'compilation_error', results: [], runtime: 0, stderr: result.stderr }
        }
      }
    }

    const results: TestResult[] = []
    let totalRuntime = 0

    for (const tc of testCases) {
      try {
        const { stdout, stderr, runtime } = await runInContainer(
          config.image,
          tmpDir,
          config.runCmd,
          tc.input,
        )

        totalRuntime += runtime

        const passed = stdout === tc.expectedOutput.trim()

        results.push({
          passed,
          input:          tc.input,
          expectedOutput: tc.expectedOutput.trim(),
          actualOutput:   stdout,
          runtime,
          stderr,
        })

        if (stderr && !stdout) {
          return {
            status:  'runtime_error',
            results,
            runtime: totalRuntime,
            stderr,
          }
        }

        if (!passed) {
          return {
            status:  'wrong_answer',
            results,
            runtime: totalRuntime,
            stderr:  '',
          }
        }

      } catch (err: any) {
        if (err.type === 'tle') {
          return {
            status:  'time_limit_exceeded',
            results,
            runtime: totalRuntime,
            stderr:  '',
          }
        }
        throw err
      }
    }

    return { status: 'accepted', results, runtime: totalRuntime, stderr: '' }

  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true })
  }
}

export const runCode = async (
  code:     string,
  language: Language,
  stdin:    string,
): Promise<{ stdout: string; stderr: string; runtime: number }> => {
  const config = languageConfig[language]
  if (!config) throw new ApiError(400, 'Unsupported language')

  const tmpDir   = await fs.mkdtemp(path.join(os.tmpdir(), 'beatcode-'))
  const codeFile = path.join(tmpDir, config.filename)

  try {
    await fs.writeFile(codeFile, code, 'utf8')

    if (config.buildCmd) {
      const buildResult = await runInContainer(config.image, tmpDir, config.buildCmd, '')
      if (buildResult.stderr) {
        return { stdout: '', stderr: buildResult.stderr, runtime: 0 }
      }
    }

    const result = await runInContainer(config.image, tmpDir, config.runCmd, stdin)
    return result

  } catch (err: any) {
    if (err.type === 'tle') {
      return { stdout: '', stderr: 'Time limit exceeded', runtime: TIMEOUT_MS }
    }
    throw err
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true })
  }
}