//// This is where I tested all my functions

/// First attempt
const playedArr = [
  { start: 0, end: 240 },
  { start: 0, end: 60 },
  { start: 30, end: 180 },
  { start: 0, end: 60 }
];
var segmentOverlap = 0;
//let map = {};

function hasBeenRewatched(playedArr, totalDuration, rewatchedThreshold) {
  var rewatchedTimeThreshold = totalDuration * rewatchedThreshold;
  var rewatchedSeconds = 0;
  for (let i = 0; i < playedArr.length; i++) {
    for (let j = i + 1; j < playedArr.length; j++) {
      var timeSegment = overlap(
        playedArr[i].start,
        playedArr[i].end,
        playedArr[j].start,
        playedArr[j].end
      );
      if (!overlapSegmentSeen(timeSegment.start, timeSegment.end)) {
        segmentOverlap = timeSegment.end - timeSegment.start;
      }

      if (segmentOverlap < 0) {
        segmentOverlap = 0;
      }
      rewatchedSeconds += segmentOverlap;
    }
  }
  //console.log(timeSegment);
  if (rewatchedSeconds >= rewatchedTimeThreshold) {
    return true;
  }
  return false;
}

function overlap(s1, e1, s2, e2) {
  var start = s1;
  var end = e1;
  if (s1 < s2) {
    start = s2;
  }
  if (e2 < e1) {
    end = e2;
  }
  return { start: start, end: end };
}

function overlapSegmentSeen(start, end) {
  if (map[start]) {
    if (map[start] === end) {
      console.log(map[start], "is a duplicate");
      return true;
    }
  } else {
    map[start] = end;
    return false;
  }
}

//console.log(hasBeenRewatched(playedArr, 240, 0.25));
overlap(0, 60, 0, 240);
overlap(0, 240, 0, 60);
overlap(0, 30, 15, 60);
overlap(30, 60, 0, 240);
overlap(0, 60, 70, 240);


/// Second attempt

function findOverlap(s1, s2) {
  if (s2.start < s1.end) {
    let ret = {
      overlap: {start: s2.start, end: s1.end < s2.end ? s1.end : s2.end, rw: true},
    };
    if (s2.start > s1.start) {
      ret.left = {start: s1.start, end: s2.start, rw: s1.rw};
    }
    if (s2.end > s1.end) {
      ret.right = {start: s1.end, end: s2.end, rw: s2.rw};
    } else if (s1.end > s2.end) {
      ret.right = {start: s2.end, end: s1.end, rw: s1.rw};
    }
    return ret;
  }
  return null;
}

function rewatchedSeconds(watchedSegments) {
  watchedSegments.sort((a,b) => {
    if (a.start - b.start === 0) {
      return b.end - a.end;
    } else {
      return a.start - b.start;
    }
  });
  let i = 0;
  do {
    console.log("checking for overlap between ", watchedSegments[i], watchedSegments[i+1]);
    let overlap = findOverlap(watchedSegments[i], watchedSegments[i+1]);
    if (overlap) {
      console.dir(overlap);
      watchedSegments.splice(i, 2); // remove the two segments which overlap, i and i+1
      if (overlap.left) {
        watchedSegments.splice(i, 0, overlap.left);
        i++; //?
      }
      watchedSegments.splice(i, 0, overlap.overlap);
      if (overlap.right) {
        let j = i;
        // find where to put the overlap segment
        while (j < watchedSegments.length && overlap.right.start > watchedSegments[j].start) {
          j++;
        }
        watchedSegments.splice(j, 0, overlap.right);
        // don't skip over the right segment, could overlap with others
      }
    } else {
      console.log("no overlap");
      i++;
    }
    console.log("watchedSegments:");
    console.dir(watchedSegments);
  } while (i < watchedSegments.length - 1);
  let rws = 0;
  for (let j = 0; j < watchedSegments.length; j++) {
    if (watchedSegments[j].rw) {
      rws += (watchedSegments[j].end - watchedSegments[j].start);
    }
  }
  return rws;
}

//const testData = [{start:0, end:240, rw: false}, {start:5, end: 55, rw: false}, {start:30, end:60, rw: false
//}, {start: 50, end: 60, rw: false}, {start:230, end:250, rw: false}, {start:50, end:245, rw: false}];

// const testData = [{start:0, end:240, rw: false}, {start:5, end: 15, rw: false}, {start:45, end:60, rw: false
// }, {start: 50, end: 60, rw: false}, {start:230, end:250, rw: false}, {start:235, end:245, rw: false}];

//const testData = [{start:0, end:240, rw: false}, {start:5, end: 15, rw: false}, {start:10, end:20, rw:false}{start:45, end:60, rw: false
//}, {start: 50, end: 60, rw: false}, {start:230, end:250, rw: false}, {start:235, end:245, rw: false}];
const testData = [{start:0, end:10, rw: false}, {start:5, end: 15, rw: false}, {start:5, end:60, rw: false
}, {start: 50, end: 65, rw: false}, {start:60, end:250, rw: false}, {start:60, end:80, rw: false}];
console.log(rewatchedSeconds(testData));
