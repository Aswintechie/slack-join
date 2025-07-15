import { request } from 'undici'
import { EventEmitter } from 'events'

export default class SlackData extends EventEmitter {

  constructor ({ token, interval, org: host }){
    super()
    this.host = host
    this.token = token
    this.interval = interval
    this.ready = false
    this.org = {}
    this.users = {}
    this.channelsByName = {}
    this.init()
    this.fetch()
  }

  async init (){
    try {
      // Get channels list
      const channelsUrl = `https://${this.host}.slack.com/api/channels.list?token=${encodeURIComponent(this.token)}`
      const { body: channelsBody } = await request(channelsUrl)
      const channelsData = await channelsBody.json()
      
      if (channelsData.channels) {
        channelsData.channels.forEach(channel => {
          this.channelsByName[channel.name] = channel
        })
      }

      // Get team info
      const teamUrl = `https://${this.host}.slack.com/api/team.info?token=${encodeURIComponent(this.token)}`
      const { body: teamBody } = await request(teamUrl)
      const teamData = await teamBody.json()
      
      const team = teamData.team
      if (!team) {
        throw new Error('Bad Slack response. Make sure the team name and API keys are correct')
      }
      this.org.name = team.name
      if (!team.icon.image_default) {
        this.org.logo = team.icon.image_132
      }
    } catch (err) {
      console.error('Error initializing Slack data:', err)
      throw err
    }
  }

  async fetch (){
    try {
      const url = `https://${this.host}.slack.com/api/users.list?token=${encodeURIComponent(this.token)}&presence=1`
      const { body } = await request(url)
      const data = await body.json()
      this.onres(null, { body: data })
    } catch (err) {
      this.onres(err, null)
    }
    this.emit('fetch')
  }

  getChannelId (name){
    let channel = this.channelsByName[name]
    return channel ? channel.id: null
  }

  retry (){
    let interval = this.interval * 2
    setTimeout(this.fetch.bind(this), interval)
    this.emit('retry')
  }

  onres (err, res){
    if (err) {
      this.emit('error', err)
      return this.retry()
    }

    let users = res.body.members

    if (!users || (users && !users.length)) {
      let err = new Error(`Invalid Slack response: ${res.status || 'Unknown error'}`)
      this.emit('error', err)
      return this.retry()
    }

    // remove slackbot and bots from users
    // slackbot is not a bot, go figure!
    users = users.filter(x => {
      return x.id != 'USLACKBOT' && !x.is_bot && !x.deleted
    })

    let total = users.length
    let active = users.filter(user => {
      return 'active' === user.presence
    }).length

    if (this.users) {
      if (total != this.users.total) {
        this.emit('change', 'total', total)
      }
      if (active != this.users.active) {
        this.emit('change', 'active', active)
      }
    }

    this.users.total = total
    this.users.active = active

    if (!this.ready) {
      this.ready = true
      this.emit('ready')
    }

    setTimeout(this.fetch.bind(this), this.interval)
    this.emit('data')
  }

}
