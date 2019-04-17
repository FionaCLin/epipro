export function next_fun(){

    var divElem = document.getElementById('sampDiv');
    
    trends.embed.renderExploreWidgetTo(divElem,"TIMESERIES", {"comparisonItem":[{"keyword":"dbs bank","geo":"","time":"today 12-m"}],"category":0,"property":""}, {"exploreQuery":"q=dbs%20bank&date=today 12-m","guestPath":"https://trends.google.com:443/trends/embed/"});
      
}