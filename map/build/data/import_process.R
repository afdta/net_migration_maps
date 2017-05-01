library("metromonitor")
library("jsonlite")

top100 <- metropops(vintage="2013")

billdata <- read.csv("~/Projects/Brookings/bill-frey/map/build/data/FreyTablesMapFigures1R.csv", stringsAsFactors=FALSE)

#billdata <- billdata[!is.na(billdata$fips), 1:5]

bill100 <- limit100(billdata[1:5], geoID="fips", vintage="2013")

j <- toJSON(bill100[1:5], na="null")

writeLines(j, "~/Projects/Brookings/bill-frey/map/data/frey_migration_map.json")
