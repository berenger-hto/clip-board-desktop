type ContentInputType = 'TEXT' | 'CODE' | 'URL'

export function contentType(input: string): ContentInputType {
    const trimmedInput = input.trim()

    // 1. Détection URL
    const urlRegex = /^((https?|ftp):\/\/)?(www\.)?([a-z0-9-]+(\.[a-z0-9-]+)+)(:[0-9]+)?(\/[^\s]*)?$/i
    if (urlRegex.test(trimmedInput)) {
        return 'URL'
    }

    // 2. Détection CODE
    const codePatterns = [
        /[{}<>\[\];]/,
        /^(const|let|var|function|export|import|class|if|for|while)\s/,
        /<\/?[a-z][\s\S]*>/i,
        /=>/,
        /console\.log/
    ]

    const isCode = codePatterns.some(pattern => pattern.test(trimmedInput))

    if (isCode || trimmedInput.includes('\n')) {
        return 'CODE'
    }
    
    return 'TEXT'
}