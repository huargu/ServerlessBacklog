// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'rr8js9sv0j'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-3r4n3x35.us.auth0.com',            // Auth0 domain
  clientId: 'veOYG79G38iZ3AU31G4VmrYCAqTFnk4L',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
