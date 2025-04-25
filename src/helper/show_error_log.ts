export function showErrorLog(endpoint: string) {
    return (err: unknown) => {
      const border = "=".repeat(90)
      const pink = "\x1B[35m"
      const reset = "\x1B[0m"
  
      console.log(`
  ${pink}${border}${reset}
  ${reset} 🌐 Endpoint: ${endpoint}
  ${reset} ❌ Error: ${err}
  ${pink}${border}${reset}
      `)
    }
  }
  