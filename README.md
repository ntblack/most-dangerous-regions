# Most dangerous regions

A command-line utility that lists the most dangerous regions on earth
based on how much earthquake energy they experience.

## Dependencies

- [node](https://nodejs.org/en/download/current/) 6.4.0 or greater
- [nvm](https://github.com/creationix/nvm/blob/master/README.markdown) (recommended when installing node)

## Installation

Run `./install.sh` to download dependencies and install the program
(requires `bash` and `curl`).

Or you can manually set up by downloading and installing node
and then running `npm install -g .` from the project folder.

## How to run the program

From the command line, run `most-dangerous-regions`. By default it will
consider the past thirty days. You may use the `--days <days>` flag to
change this default behavior. 

For example,`most-dangerous-regions --days 60` will look back sixty days.

The data comes from the U.S. Geological Survey's [endpoint for the past 30 days](http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson)
 
Data is read from this endpoint when you execute the command. Only data
that is read at those times is available to the command in local storage.
This means that you will not see data from more than 30 days ago unless
you had run `most-dangerous-regions` previously. For example, if you had
run the command yesterday and run it again today, you would have 31 days
worth of data available.