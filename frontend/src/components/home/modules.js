const getSongsFree = (spotifyApi, length, customLength, selectedFriends) => {
  let trackCount = Math.floor((length || customLength)/(selectedFriends.length+1))

  let getTopAndRecs = spotifyApi.getMyTopTracks({
      limit: 50
    })
    .then(data => {
      //get's random top songs
      let topSongsArr = []
      let nums = []

      //assures every song is different
      while(topSongsArr.length < Math.floor(trackCount/3)){
        let num = Math.floor(Math.random()*(data.items.length-1)) + 1;
        if(nums.indexOf(num) > -1) {
          continue
        }
        topSongsArr.push(data.items[num]);
        nums.push(num);
      }

      //get's ids for first 5 top songs
      let topTrackIDs = []
      for(let i=0; i<5; i++) {
        topTrackIDs.push(data.items[i].id)
      }

      //returns tops songs and recommended songs
      return spotifyApi.getRecommendations({
          limit: Math.floor(trackCount/3) + Math.floor(trackCount%3),
          seed_tracks: topTrackIDs
        })
        .then(data => [...topSongsArr, ...data.tracks])
        .catch(err => {console.log('Something went wrong!', err)});
    })
    .catch(err => {console.log('Something went wrong!', err)});

    let artistTopTracks = spotifyApi.getMyTopArtists({
        limit: Math.floor(trackCount/3)
      })
      .then(data => {
        let topArtistsIDs = data.items.map(v => v.id)
        let songs = []

        //get's the top song for each top artist
        topArtistsIDs.forEach (v => {
          spotifyApi.getArtistTopTracks(v, 'US')
            .then(data => {songs.push(data.tracks[0])})
            .catch(err => {console.log('Something went wrong!', err)});
        })
        //waits for all songs then returns
        return Promise.all([songs]).then(values => values)
      })
      .catch(err => {console.log('Something went wrong!', err)});

    //returns all songs
    return Promise.all([getTopAndRecs, artistTopTracks]).then(data => {
      return [...data[0], ...data[1][0]]
    })
}


const getOnlyTopSongs = (spotifyApi, length) => {
  return spotifyApi.getMyTopTracks({
      limit: 50
    })
    .then(data => {
      let songs = []
      let nums = []
      while(length > songs.length){
        let num = Math.floor(Math.random()*(data.items.length-1)) + 1;
        if(nums.indexOf(num) > -1) {
          continue
        }
        songs.push(data.items[num]);
        nums.push(num);
      }
      return songs
    })
}

const getSongs = (spotifyApi, length, customLength, selectedFriends) => {
    let trackCount = Math.floor((length || customLength)/(selectedFriends.length+1))
    let savedSongsCount =  Math.floor(trackCount*.7)
    let savedSongs = []

    if(length < 4) {
      return getOnlyTopSongs(spotifyApi, trackCount)
    }

    let getTopAndRecs = _ => {
      return spotifyApi.getMyTopTracks({
          limit: 50
        })
        .then(data => {
          //get's random top songs
          let topSongsArr = []
          let nums = []
          let topAmount = Math.ceil((trackCount - savedSongsCount)/2)
          let recAmount = Math.floor((trackCount - savedSongsCount)/2)

          //assures every song is different
          while(topSongsArr.length < topAmount){
            let num = Math.floor(Math.random()*(data.items.length-1)) + 1;
            if(nums.indexOf(num) > -1) {
              continue
            }
            topSongsArr.push(data.items[num]);
            nums.push(num);
          }

          //gets ids for first five tracks
          let topTrackIDs = []
          for(let i=0; i<5; i++) {
            topTrackIDs.push(data.items[i].id)
          }

          //returns tops songs and recommended songs
          return spotifyApi.getRecommendations({
              limit: recAmount,
              seed_tracks: topTrackIDs
            })
              .then(data => [...topSongsArr, ...data.tracks])
              .catch(err => {console.log('Something went wrong!', err)})
        })
        .catch(err => {console.log(err)})
    }

    let getSavedTracks = spotifyApi.getMySavedTracks({
        limit: 50
      })
      .then(data => {
        if(data.total >= savedSongsCount*2){
          let maxPossibleIterations = Math.ceil(data.total/50)
          let maxAdds = Math.ceil(savedSongsCount/maxPossibleIterations)
          //for the first set of 50 add the max amount of songs
          let nums = []
          //assures every song is different
          while(savedSongs.length < maxAdds){
            let num = Math.floor(Math.random()*(data.items.length-1)) + 1;
            if(nums.indexOf(num) > -1) {
              continue
            }
            savedSongs.push(data.items[num].track);
            nums.push(num);
          }
          //if I need to add more than 1 at any period
          if(maxAdds > 1){
            let  p = Promise.resolve();
            for(let i=1; i<maxPossibleIterations; i++) {
              p = p.then(_ => new Promise(resolve => {
              let nums = []
              spotifyApi.getMySavedTracks({
                  limit: 50,
                  offset: 50*i
                })
                .then(data => {
                  //if at the end of loop && the amount of songs left to add is less than the max
                  if(i === maxPossibleIterations-1 && savedSongsCount-savedSongs.length < maxAdds) {
                    while(savedSongsCount-savedSongs.length>0){
                      let num = Math.floor(Math.random()*(data.items.length-1)) + 1;
                      if(nums.indexOf(num) > -1) {
                        continue
                      }
                      savedSongs.push(data.items[num].track);
                      nums.push(num);
                      resolve()
                    }
                  //if i need to add the max amount of songs
                  } else if(savedSongsCount-savedSongs.length > maxPossibleIterations-i && maxAdds < savedSongsCount-savedSongs.length){
                    for(let i=0; i<maxAdds; i++){
                      let num = Math.floor(Math.random()*(data.items.length-1)) + 1;
                      if(nums.indexOf(num) > -1) {
                        continue
                      }
                      savedSongs.push(data.items[num].track);
                      nums.push(num);
                      resolve()
                    }
                  //otherwise just add one
                  } else {
                    let num = Math.floor(Math.random()*(data.items.length-1)) + 1;
                    savedSongs.push(data.items[num].track);
                    resolve()
                  }
                })
                .catch(err => { console.log(err)})
          }))

        }

          let topAndRecs = getTopAndRecs()

          return Promise.all([p, topAndRecs]).then(data => [...savedSongs, ...data[1]])
        } else {
          let  p = Promise.resolve();
          for(let i=1; i<savedSongsCount; i++) {
            p = p.then(_ => new Promise(resolve => {
              spotifyApi.getMySavedTracks({
                  limit: 50,
                  offset: 50*i
                })
                .then(data => {
                  let num = Math.floor(Math.random()*(data.items.length-1)) + 1;
                  savedSongs.push(data.items[num].track);
                  resolve()
                })
            }))
          }

          let topAndRecs = getTopAndRecs()

          return Promise.all([p, topAndRecs]).then(data => [...savedSongs, ...data[1]])
        }
      } else {
        return getSongsFree(spotifyApi, length, customLength, selectedFriends)
      }
    })
    .catch(err => {console.log(err)})

      return Promise.all([getSavedTracks]).then(data => {
      return [...data[0]]
    })
}



const getDate = _ => {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth()+1;
  let yyyy = today.getFullYear();

  if(dd<10) {
      dd = '0'+dd
  }

  if(mm<10) {
      mm = '0'+mm
  }

  let date = `${dd}/${mm}/${yyyy}`

  return date
}


const getDuration = ms => {
  let minutes = (Math.trunc(ms/60000)).toString()
  let seconds = (Math.trunc((ms/60000 - minutes) * 60)).toString()
  // console.log('mins', minutes, 'secs', seconds, 'dur', ms/60000)
  return `${minutes}:${seconds.length > 1 ? seconds : 0+seconds}`
}

module.exports = {
  getSongs,
  getDate,
  getDuration
}
