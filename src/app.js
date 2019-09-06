const Mastodon = require('megalodon').default
const request = require('request')
const fs = require('fs')

const BASE_URL = process.env.INSTANCE
const access_token = process.env.ACCESS_TOKEN
const emojidir = process.env.EMOJIDIR

const client = new Mastodon(access_token, BASE_URL + '/api/v1')
const stream = client.stream('/streaming/direct')

stream.on('connect', event => {
  console.log('connect')
})

stream.on('update', status => {
  if(status.media_attachments.length != 0){
    console.log('find media attached toot')
    console.log(status)
    var imageurl = status.media_attachments[0].url
    console.log("image url:" + imageurl)
    var source_acct = status.account.acct
    console.log("acct:" + source_acct)
    var tag = status.tags[0].name
    console.log("tag:" + tag)

    if((filename != 'original')&&(source_acct == 'aries@mstdn.asterism.xyz')&&(tag == 'ariesadmin')) {
      filename = status.tags[1].name
      console.log("emoji name:" + filename)
      var filepath = emojidir + filename
      console.log("filepath:" + filepath)

      request(
        {method: 'GET', url: imageurl, encoding: null},
        function (error, response, body){
          if(!error && response.statusCode === 200){
            fs.writeFileSync(filepath, body, 'binary');
            console.log("get file");
          }
        }
      )
      
    }

  }
})

stream.on('error', err => {
  console.error(err)
})

stream.on('heartbeat', msg => {
  console.log('thump.')
})

stream.on('connection-limit-exceeded', err => {
  console.error(err)
})