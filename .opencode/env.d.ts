declare module "*.txt" {
  const content: string
  export default content
}

declare const Bun: {
  env: Record<string, string | undefined>
}
