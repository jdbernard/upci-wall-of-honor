const OktaJwtVerifier = require('@okta/jwt-verifier');

const environments = require('./environments.config.json');

function generatePolicy(principalId, methodArn) {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: methodArn
      }]
    }
  }
}

exports.handler = async function(event, context, callback) {
  const token = event.authorizationToken;

  try {
    const apiId = event.methodArn.match(/^([^:]+:){5}([^:/]+)\//)[2];

    const oktaJwtVerifier = new OktaJwtVerifier({
      issuer: environments[apiId].issuer
    });
  
    const jwt = await oktaJwtVerifier.verifyAccessToken(token, 'api://default');
    return generatePolicy(jwt.claims.sub, event.methodArn);
  } catch (err) {
    console.log("Auth error: " + JSON.stringify(err));
    throw('Error: Invalid token');
  }
}
