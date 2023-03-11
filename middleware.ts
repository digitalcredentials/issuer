import { getStatusListManager } from './status';

// retrieves status list manager
export async function getCredentialStatusListManager(req, res, next) {
    try {
      req.statusListManager = await getStatusListManager();
      next();
    } catch (error) {
      return res.send('Failed to retrieve credential status list manager');
    }
}

// extracts access token from request header
function extractAccessToken(headers) {
  if (!headers.authorization) {
    return;
  }
  const [scheme, token] = headers.authorization.split(' ');
  if (scheme === 'Bearer') {
    return token;
  }
}

// verifies whether issuer client has access to status repo
export const verifyStatusRepoAccess = async (req, res, next) => {
    const { headers } = req;
    // Verify that access token was included in request
    const accessToken = extractAccessToken(headers);
    if (!accessToken) {
      return res.send('Failed to provide access token in request');
    }
    // Check if issuer client has access to status repo
    const hasAccess = await req.credStatusClient.hasStatusRepoAccess(accessToken);
    if (!hasAccess) {
      return res.send('Issuer is unauthorized to access status repo');
    }
    next();
};
