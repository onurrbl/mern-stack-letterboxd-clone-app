declare namespace NodeJS {
  interface ProcessEnv {
    API_URL?: string
  }
}

declare const process: {
  env: NodeJS.ProcessEnv
}

export {}
