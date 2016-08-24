### Proposed improvements to the existing design

- De-duplicate data between commands
- Currently data is filtered for uniqueness when it is read out of
local storage, but it would be more efficient to de-dup it when it is
put in
- Add an option for user-defined regions based on pattern matching of
the place.
  
### Region definition

I chose to implement regions based on a pattern match of feature
`place`. This has the advantage of being meaningful because the user
can associate real places with the data. However, it has the disadvantages
of being somewhat inflexible (because the patterns are hard coded and
cannot be overridden in the current design) and fuzzy (because place
names don't follow a strict format).

Based on my reading of the USGS web site that describes the API, I found
that there is a spec that defines geological regions in a way that is
similar to political boundaries. Unfortunately, I did not find a way
to derive these regions from the data, so I fell back on pattern matching.

Another design choice I considered was using geometric data. This has
the advantage of being more precise than pattern matching on place names.
However, it has the disadvantage of being less meaningful. The user
would not be able to associate, for example, bounding box coordinates
with real places. There would be some real merit to this approach if
the coordinates were also mapped to political or geographic regions,
or if I were to implement a configuration system for user-defined mappings.

### Web service implementation

If I were to implement this program as a web service, there are a number
of requirements questions I would have.

In the current design, there is no daemon process that polls for updates
to the data source. However, for a web service it would make a lot of
sense to have such a process.

How live should the data be? There is an tradeoff between staleness of
data and resources utilization when deciding polling frequency.

How long should I hold onto the data? With a web service that is always
running and getting updates, the data set will grow much faster than
it would with a command that is run infrequently. It may be important
to consider truncating or compressing the data.

Will there be other questions the web service should answer from the data
set? This could impact whether I would keep all of the raw data or
compress it down to just the fields necessary to answer the total magnitude
query.

What kind of response time is expected? This will impact decisions about
how much to optimize, what kind of storage system to use, whether to
cache data in memory, etc.

What is an acceptable response time for the 99-, 95-, etc. percentile?
If a large data set is maintained, it may be impractical to cache all
of the data in memory. However, certain access patterns may be more
frequent, so we could optimize by caching frequently accessed results
while keeping infrequently accessed data in slower, cheaper storage.

How critical is the availability of the data? What is the impact of the
web service being unavailable or having incomplete data? This would
help me decide which redundancy and failsafe mechanisms to implement.