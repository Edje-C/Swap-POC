const getSongsFree = (spotifyApi, length, customLength, selectedFriends) => {
  let trackCount = Math.floor((length || customLength)/(selectedFriends.length+1))
  let topTracks, artistTopTracks

  topTracks = spotifyApi.getMyTopTracks({
      limit: 50
    })
    .then(data => {
      //get's random top songs
      let topSongsArr = []
      let nums = []

      //assures every song is different
      while(topSongsArr.length < Math.floor(trackCount/3)){
        let num = Math.floor(Math.random()*(data.total-1)) + 1;
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

    artistTopTracks = spotifyApi.getMyTopArtists({
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
        //waits for all songs to return
        return Promise.all([songs]).then(values => values)
      })
      .catch(err => {console.log('Something went wrong!', err)});

    //returns all songs
    return Promise.all([topTracks, artistTopTracks]).then(data => [...data[0], ...data[1][0]])
}


const getSongsPremium = (spotifyApi, length, customLength, selectedFriends) => {
    let trackCount = Math.floor((length || customLength)/(selectedFriends.length+1))
    let savedSongs = []
    let offset = 50

    const scope = () => {
      let data = {
        total: 532
      }
      let thisAmount =  Math.floor(trackCount*.7)
      let maxPossibleIterations = Math.ceil(data.total/50)
      let maxAdds = Math.ceil(Math.floor(trackCount*.7)/maxPossibleIterations)
      console.log('thisAmount', thisAmount)
      if(maxAdds > 1){
        for(let i=0; i<maxAdds; i++) {
          savedSongs.push({pre: maxAdds})
        }
        //I think this is bad code, you're really tired
        for(let i=0; i<maxPossibleIterations-1; i++) {
          if(maxPossibleIterations-i<thisAmount-savedSongs.length && (i<maxPossibleIterations-1 && maxAdds < thisAmount-savedSongs.length)){
            savedSongs.push({pre: maxAdds})
          } else {
          }
        }
      } else {
        savedSongs.push({pre: 1})
      }

      // savedSongs.push(Math.ceil(Math.floor(trackCount*.7)/maxPossibleIterations))
      // for(let i=1; i<Math.ceil(data.total/50); i++){
      //   console.log(i)
      //   if(Math.floor(trackCount*.7) - savedSongs.length > maxPossibleIterations-i) {
      //     for(let i=0; i<Math.ceil(Math.floor(trackCount*.7)/maxPossibleIterations); i++){
      //       savedSongs.push(Math.ceil(Math.floor(trackCount*.7)/maxPossibleIterations))
      //     }
      //     console.log('ciel', i, Math.ceil(Math.floor(trackCount*.7)/maxPossibleIterations), savedSongs.length)
      //   }
      // }
      console.log('savedAongs', savedSongs)
    }


    scope()


    // spotifyApi.getMySavedTracks({
    //     limit: 50
    //   })
    //   .then(data => {
    //     let maxPossibleIterations = Math.floor(data.total/50)
    //     console.log('num of iterations', maxPossibleIterations)
    //     console.log(data)
    //     //if I need more songs than loops to access all saved songs
    //     if(data.total > maxPossibleIterations) {
    //       //add the max amount of songs
    //       for(let i=0; i<Math.ceil(trackCount/maxPossibleIterations); i++){
    //         savedSongs.push({track: Math.ceil(trackCount/maxPossibleIterations)});
    //         spotifyApi.getMySavedTracks({
    //             limit: 50,
    //             offset: offset * i
    //           })
    //           .then(data => {console.log(data)})
    //       }
    //
    //       console.log('trackCount:', trackCount, '\nsavedSongsLength:', savedSongs.length, '\nmaxPossibleIterations:', maxPossibleIterations, '\ni:', 0)
    //       for(let i=1; i<maxPossibleIterations; i++) {
    //         //if the max amount of songs is more than the songs that can be added
    //         if(Math.ceil(trackCount/maxPossibleIterations) > trackCount-savedSongs.length) {
    //           for(let i=0; trackCount-savedSongs.length > 0; i++){
    //             console.log(i, Math.ceil(trackCount/maxPossibleIterations), trackCount-savedSongs.length)
    //             savedSongs.push({track: i});
    //             spotifyApi.getMySavedTracks({
    //                 limit: 50,
    //                 offset: offset * i
    //               })
    //               .then(data => {console.log(data)})
    //           }
    //           console.log('breaking')
    //           break
    //         }
    //
    //         if(savedSongs.length+maxPossibleIterations-i+1 <= trackCount) {
    //           for(let i=0; i<Math.ceil(trackCount/maxPossibleIterations); i++){
    //             savedSongs.push({track: Math.ceil(trackCount/maxPossibleIterations)});
    //             spotifyApi.getMySavedTracks({
    //                 limit: 50,
    //                 offset: offset * i
    //               })
    //               .then(data => {console.log(data)})
    //           }
    //           console.log('ceil', Math.ceil(trackCount/maxPossibleIterations))
    //         } else {
    //           console.log('doing the last thing')
    //           savedSongs.push({track: 1})
    //           spotifyApi.getMySavedTracks({
    //               limit: 50,
    //               offset: offset * i
    //             })
    //             .then(data => {console.log(data)})
    //
    //         }
    //
    //         console.log('trackCount:', trackCount, '\nsavedSongsLength:', savedSongs.length, '\nmaxPossibleIterations:', maxPossibleIterations, '\ni:', i)
    //       }
    //       console.log('ehfikd', savedSongs)
    //     }
    //     return data
    //   })

    // Promise.all([savedSongs]).then(data => data)
}

module.exports = {
  getSongsFree,
  getSongsPremium
}
