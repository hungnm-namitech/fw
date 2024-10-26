export const tokenExpirationTime = (tokenExp: number | undefined) => {
    const dateNow = new Date()
    if (!tokenExp) {
        return false
    }
    return tokenExp < dateNow.getTime() / 1000
}