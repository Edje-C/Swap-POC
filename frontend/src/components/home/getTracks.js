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
      let all = [...data[0], ...data[1][0]]
    })
}


const getSongsPremium = (spotifyApi, length, customLength, selectedFriends) => {
    let trackCount = Math.floor((length || customLength)/(selectedFriends.length+1))
    let savedSongs = []


    let getSavedTracks = spotifyApi.getMySavedTracks({
        limit: 50
      })
      .then(data => {
        console.log('DATA', data)
          if(data.total >= Math.floor(trackCount*.7)){
            let savedSongsCount =  Math.floor(trackCount*.7)
            let maxPossibleIterations = Math.ceil(data.total/50)
            let maxAdds = Math.ceil(Math.floor(trackCount*.7)/maxPossibleIterations)
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
            return Promise.all([p]).then(data => savedSongs)
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
          return Promise.all([p]).then(data => savedSongs)
        }
      }
    })
    .catch(err => {console.log(err)})

    let getTopAndRecs = spotifyApi.getMyTopTracks({
        limit: 50
      })
      .then(data => {
        //get's random top songs
        let topSongsArr = []
        let nums = []
        let topAmount = Math.ceil((trackCount - Math.floor(trackCount*.7))/2)
        let recAmount = Math.floor((trackCount - Math.floor(trackCount*.7))/2)

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

    return Promise.all([getSavedTracks, getTopAndRecs]).then(data => {
      let all = [...data[0], ...data[1]]
    })
}

module.exports = {
  getSongsFree,
  getSongsPremium
}
