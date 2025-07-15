import { request } from 'undici'

export default async function invite ({ org, token, email, channel }, fn){
  try {
    let data = { email, token }

    if (channel) {
      data.channels = channel
      data.ultra_restricted = 1
      data.set_active = true
    }

    const formData = new URLSearchParams(data)

    const { body, statusCode } = await request(`https://${org}.slack.com/api/users.admin.invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })

    if (statusCode !== 200) {
      return fn(new Error(`Invalid response ${statusCode}.`))
    }

    const result = await body.json()

    // If the account that owns the token is not admin, Slack will oddly
    // return `200 OK`, and provide other information in the body. So we
    // need to check for the correct account scope and call the callback
    // with an error if it's not high enough.
    let {ok, error: providedError, needed} = result
    if (!ok) {
      if (providedError === 'missing_scope' && needed === 'admin') {
        fn(new Error(`Missing admin scope: The token you provided is for an account that is not an admin. You must provide a token from an admin account in order to invite users through the Slack API.`))
      } else if (providedError === 'already_invited') {
        fn(new Error('You have already been invited to Slack. Check for an email from feedback@slack.com.'))
      } else if (providedError === 'already_in_team') {
        fn(new Error(`Sending you to Slack...`))
      } else {
        fn(new Error(providedError))
      }
      return
    }

    fn(null)
  } catch (err) {
    fn(err)
  }
}
