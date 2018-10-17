var player = document.getElementById("player"),
  timeWatched = 0,
  percentWatched = 0,
  duration = 0,
  twentyFive = false,
  isPlaying = false,
  userSeeked = false,
  currentTime = 0,
  currentStartTime = 0,
  previousTime = 0,
  segmentOverlap = 0,
  replayingSectionWatched = false,
  watchedArray = [],
  thresholdToHitRewatched = 0.25;

let map = {};

player.addEventListener("loadedmetadata", () => {
  duration = player.duration;
});

player.addEventListener("play", () => {
  isPlaying = true;
});

player.addEventListener("pause", () => {
  isPlaying = false;
  if (!userSeeked) {
    watchedArray.push({ start: currentStartTime, end: previousTime });
    timeWatched = 0;
    watchedArray.forEach(function(item) {
      timeWatched += item.start > 0 ? item.end - item.start : item.end;
    });
  }

  if (watchedArray.length >= 2) {
    if (hasBeenRewatched(watchedArray, duration, thresholdToHitRewatched)) {
      console.log("25% rewatched");
      watchedArray = [];
    } else {
      console.log("Haven't rewatched 25% yet");
    }
  }
});

player.addEventListener("timeupdate", () => {
  previousTime = currentTime;
  currentTime = Math.floor(player.currentTime);
});

player.addEventListener("seeked", () => {
  if (isPlaying) {
    userSeeked = true;
  }
});

function hasBeenRewatched(playedArr, totalDuration, rewatchedThreshold) {
  var rewatchedTimeThreshold = totalDuration * rewatchedThreshold;

  if (watchedArray.length >= 2) {
    if (rewatchedSeconds(watchedArray) >= rewatchedTimeThreshold) {
      return true;
    }
    return false;
  }
}

function findOverlap(s1, s2) {
  if (s2.start < s1.end) {
    let ret = {
      overlap: {
        start: s2.start,
        end: s1.end < s2.end ? s1.end : s2.end,
        rw: true
      }
    };
    if (s2.start > s1.start) {
      ret.left = { start: s1.start, end: s2.start, rw: s1.rw };
    }
    if (s2.end > s1.end) {
      ret.right = { start: s1.end, end: s2.end, rw: s2.rw };
    } else if (s1.end > s2.end) {
      ret.right = { start: s2.end, end: s1.end, rw: s1.rw };
    }
    return ret;
  }
  return null;
}

function rewatchedSeconds(watchedSegments) {
  watchedSegments.sort((a, b) => {
    if (a.start - b.start === 0) {
      return b.end - a.end;
    } else {
      return a.start - b.start;
    }
  });
  let i = 0;
  do {
    //console.log("checking for overlap between ", watchedSegments[i], watchedSegments[i+1]);
    let overlap = findOverlap(watchedSegments[i], watchedSegments[i + 1]);
    if (overlap) {
      //console.dir(overlap);
      watchedSegments.splice(i, 2); // remove the two segments which overlap, i and i+1
      if (overlap.left) {
        watchedSegments.splice(i, 0, overlap.left);
        i++; //?
      }
      watchedSegments.splice(i, 0, overlap.overlap);
      if (overlap.right) {
        let j = i;
        // find where to put the overlap segment
        while (
          j < watchedSegments.length &&
          overlap.right.start > watchedSegments[j].start
        ) {
          j++;
        }
        watchedSegments.splice(j, 0, overlap.right);
        // don't skip over the right segment, could overlap with others
      }
    } else {
      //console.log("no overlap");
      i++;
    }
    //console.log("watchedSegments:");
    //console.dir(watchedSegments);
  } while (i < watchedSegments.length - 1);
  let rws = 0;
  for (let j = 0; j < watchedSegments.length; j++) {
    if (watchedSegments[j].rw) {
      rws += watchedSegments[j].end - watchedSegments[j].start;
    }
  }
  return rws;
}
