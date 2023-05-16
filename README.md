Openlayers-Earthquake-Finder
Overview:

This website allows the user to search for the earthquakes that happened in a range of area around a location within a specified range of time of his choice.

How it works in details:

Firstly the user should choose his desired location through a search box, then the user would write the buffer radius of area he wants to search in KM, and finally he would choose the start and end time of his search By clicking on (Get me the earthquakes) button after filling all the required inputs, a circle would appear that reflects his search area based on his inputs and then the earthquakes would appear. Under the map, a legend would appear that shows the user his desired location and the different magnitudes of earthquakes that appeared based on his inputs. The earthquakes are divided into three classifications based on their magnitude (under 3.5, between 3.5 and 5, larger than 5) and they all differ from each other in the color and size of icon. On clicking on any point of earthquakes on the map, a pop up would appear that carries all the important information about the earthquake.

Additional features:

There’s an option of using whether dark or light theme upon user’s preferences, that changes the site as well as the map itself.

Work flow of the code:

We depended on the usage of modules to be able to divide the work between several collaborators, and with that we succeeded on achieving a clear code that any outsider would find it easy to understand.

The APIs used:

We used two APIs:

1- Geocoding OSM API:

It allowed us to search for the locations all over the world using OSM’s data
2- Earthquake catalog API:

It allowed us to search for the earthquakes all over the world using USGS’s data
