README
# HTML5 Video Player

Description:
Create a basic HTML5 video player that can track how much of a video has been watched.

Browser: Google Chrome
OS: Ubuntu

So the way I went about this problem was that I first started off setting the video up with all the controls that were required. It was pretty simple I just used a video tag in my html and added a controls property to it get the functionality like the pause/play , playbar, and video duration. After that I needed to figure out a way to calculate how to tell when 25% of the video has been rewatched. So I figured I would figure out how to track the sections are being watch. Luckily, the video element has some useful properties that helped me add event listeners to help me track the start and end times of every time I pressed play, paused, or seeked and pushed them into an array. I then used this information and just tested it out to see if I could get the console to log when 25% of the video was watched only after watching the entire video. I wrote a function that waited till the video ended then after you seeked back to the beginning and played passed the 25% mark then it would log. But having to watch the entire video first before checking to see if the next section was re-watched is annoying and I want it to be when I watch any part of the video. This part was tricky as I was unsure how I was going to go about this problem. I ended up adding a new file and writing some fake data to test out some functions that would help allow me to calculate whether a section is re-watched or not. I ended up writing 3 functions hasBeenRewatched(), overlap(), and overlapSegmentSeen(). HasBeenRewatched() takes in 3 arguments playedArr (my array of objects full of start and end times) , totalDuration(duration of the video in seconds) , rewatchedThreshold (the threshold that we need to pass to count as re-watched ). It then calculates the percentage that we want to compare or time segment too and puts that value in a array. Then I loop through and compare the elements in my array to each other. This is when I use the overlap function to check if there are any sections in our array that overlap and returns back our overlap or re-watched section. Then I my other function  overlapSegmentSeen to check to see if there are any duplicate overlap segments and then if there is don’t include them in and if they  are not then push them to my empty object called map. Then back in my original function hasBeenRewatched we check to see if the section passes or matched our time threshold and if it does return true meaning we re-watched the correct amount of video and false if it doesn’t. I added a few test in my separate file to test out how the functions worked and once they passed my tests I implemented these functions into my code to then log the real message. After implementing these back into my original code I realized there was an issue,  in this sample data const playedArr = [{start:0, end:240}, {start:0, end: 55}, {start:30, end:35}, {start: 50, end: 60} ] 0:55 overlaps with 0:240. But then it checks 30:35 which overlaps with 0:240 but also with 0:55, so it shouldn't be added to the rewatchedSeconds. This took me awhile to figure out and I reached out to some fellow engineers to help me solve this and we came up with an algorithm that accounts for this. We got rid of the overlap(), and overlapSegmentSeen() and replaced them with findOverlap() and rewatchedSeconds(). RewatchedSeconds() takes our array of time segments and sorts them in order of start time. Then there is a do while loop that calls function findOverlap(). FindOverlap() finds our overlap segment and then takes it and splits it into 3 sections , left, overlap, and right. Then we find which segments overlaps and add a boolean value true to it . After that we set the left and right sections and put it in our ret object. Then we go back to our rewatchedSeconds() to get our rewatchedSeconds that I can then use back in our hasBeenRewatched() to determine whether we have rewatched 25% of the video, if we have return true and if not return false. (there are some notes in the code that gives a little more explanation on how the algorithem works)  After this back in out event listen every time we pause if returned true the we log 25% rewatched in the console and if not it logs that we haven't.	

Lessons learned:

I haven’t worked with HTML5 video player before so it was interesting to see how the analyticd could be collected though all the video players properties. I had to use a data structure to help me figure out how to have each element in me playedArr to compare to itself and check if it was re-watched or not.  It was cool to be able to think in the code in that sense of I have one element that needs to check everything else but itself then do the same thing for the others but don't check anything that has already been checked. Then taking this thinking and apply it to my logic was quite fun. Also when I was trying to check to see if a section overlaped another it took me some time to figure how the logic was going to work out.

Things to Point out:

There were quite a few algorithms to consider in this problem so I had to do a lot of testing  to be able to figure out how to get all the edge cases in the prompt to work together properly. I had to account for when people seek in the video. We didnt want to include the time segments for the for when you seek but collect the time segment after the video started playing. Which was a little tricky but eventually I was figure out how I wanted add the time segments to the array.

Bonus questions:

Modularity: how difficult is it to put more than one video on the same page?

If I wrap this whole thing in a function that takes in a videoID and name and sets up all event listeners. This will make it be scoped to 1 video at a time no matter what. Meaning I could write a constructor function that would allow you to return an instance of the player .

Reusability: how difficult is it to track a different rewatched percentage?

I thought it would be best to manage the state in the global context, and all business logic could be evaluated in the event listeners. Some of the code in the event listeners you could refractor to functions, but I don't think it's a big deal unless I had too.

Consistency: How would the player/tracker behave with videos of different lengths?

I calculated everything using math and metadata based on the video, it should be able to handle any HTML 5 video assuming that all proper metadata is accessible

Tracking: Do you have an idea of the time/space complexity of your approach?

I thought about it from a logical standpoint. The complexity of this approach was more geared around how video works on the web as a whole. I researched the HTML 5 Video spec and found/knew what event listeners I could rely on to give my calculations. My sample project was developed to meet the constraints of the assignment.
