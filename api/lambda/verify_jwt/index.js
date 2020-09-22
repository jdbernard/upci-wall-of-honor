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
  console.log('api-endpoint=' + event.methodArn);
  const headerVal = event.authorizationToken;

  if (!headerVal.startsWith('Bearer ')) {
    throw('Error: Invalid Token (not a bearer token)');
  }

  const token = headerVal.substr(7);
  const methodArnMatcher = event.methodArn.match(/^(([^:]+:){5}([^:/]+))\//)
  const apiId = methodArnMatcher[3];
  const methodPrefix = methodArnMatcher[1] + '/*';

  const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: environments[apiId].issuer
  });
  
  try {
    const jwt = await oktaJwtVerifier.verifyAccessToken(token, 'api://default');
    console.log('Valid token. email=' + jwt.claims.sub + ' allowedMethods=' + methodPrefix);
    return generatePolicy(jwt.claims.sub, methodPrefix);
  } catch (err) {
    console.log("Auth error: " + JSON.stringify(err));
    throw('Error: Invalid token');
  }
}
