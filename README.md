# University 2023 ranking visualization

## Description
This web application allows users to explore and compare universities around the world. It provides an interactive world map where users can click on regions to view its top 20 universities. Users can also select different criterias to generate bar plots for comparison.

## Features
- Interactive world map for exploring top ranking universities by region.

![Dashboard view](/img/figure1.png)

- Detailed information about universities including world rank, student count, gender ratio, and more.

- Comparison of universities based on criteria such as the number of students, international students, and gender ratio with a dropdown menu for selecting comparison criteria

![Dashboard view](/img/figure2.png)


## Dependencies
- d3.js: A JavaScript library for data visualization.
- topojson : An extension of GeoJSON that encodes topology.
- pandas : A Python library for data manipulation and analysis.
- fuzzywuzzy : A Python library for fuzzy string matching.


## Data
This web visualization is based on the Global University Rankings Dataset 2023 from kaggle (https://www.kaggle.com/datasets/joyshil0599/global-university-rankings-dataset-2023). 

The dataset was merged ussing the fuzzywuzzy library with the country to continent dataset from kaggle (https://www.kaggle.com/datasets/statchaitya/country-to-continent?resource=download) in the preprocessing.ipynb notebook to obtain the region of each university.

The covered regions in our visualization are namely :   
['Northern Europe', 'Northern America', 'Western Europe',
       'South-Eastern Asia', 'Eastern Asia', 'Australia and New Zealand',
       'Western Asia', 'Southern Africa', 'Southern Europe',
       'South America', 'Eastern Europe', 'Southern Asia',
       'Western Africa', 'Northern Africa', 'Eastern Africa', 'Caribbean',
       'Central America', 'Central Asia', 'Melanesia'].

**Features of interest :**    
- Rank: The ranking position of the university in the 2023 global rankings.

- Location: The country of the university.

- Number of students: The total number of students enrolled in the university.

- Number of students per staff: The ratio of the total number of students to the total number of academic staff members, providing an indication of the student-to-faculty ratio.

- International students: The percentage of international students studying at the university.

- Gender Ratio: The gender distribution among the university's student body, presenting the ratio of female students to male students.


## Running the project 
This project can be run locally. To do so, follow these steps:
- Clone the repository or download and extract the project as a zip file
- Open a new command prompt setting the working directory to the folder.
- Initiate a server with python by entering:
`python -m http.server`
- Open a browser and enter the localhost adress displayed in the command prompt.
The world_university_rank json data file can be generated using the preprocessing notebook but it is already included in the repository.

## Author and context
Myriam for "Visualisation de données" course, conducted by Professor Isaac Pante (University of Lausanne,Spring 2023).

## Credits
- This project inspired the work on the display idea of the world map :     
https://github.com/MShabi/Weapon-id-database-visualized.git (MShabi) 
- The code for the interactive map and bar plots was adapted from examples provided by D3.js documentation.
- Source: [D3.js Documentation](https://d3js.org/)
- License: [BSD 3-Clause License](https://opensource.org/licenses/BSD-3-Clause)


