const revokedTokens = new Set();

const revokeToken = (token) => {
    if (typeof token !== "string" || token.trim() === "") {
        return false;
    }

    revokedTokens.add(token);
    return true;
};

const isTokenRevoked = (token) => {
    if (typeof token !== "string" || token.trim() === "") {
        return false;
    }

    return revokedTokens.has(token);
};

const clearRevokedTokens = () => {
    revokedTokens.clear();
};

export default {
    revokeToken,
    isTokenRevoked,
    clearRevokedTokens,
};
