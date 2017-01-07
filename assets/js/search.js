

//function setupSearchBox()
//{
//    $('#searchbox').typeahead(
//    {
//        source: asyncCartoName,
//		afterSelect: itemSelected,
//		matcher: function(item){return itemMatcher(item,this.query);},
//		displayText: function(item){ return itemDisplayer(item,this.query); },
//		highlighter: itemHighlighter
//	});
//}

var allowedFields = {
    "fulladdress" : "Address:",
    "parcelnumber" : "Parcel #:",
    "zipcode": "Zip:"
};



var searchBox;
var resultsDiv;
var searchData = [];
searchData.push({name: "myname", address: "theaddress"});
searchData.push({name: "xx", address: "43434"});


function inputChange()
{
    var input = searchBox.val();
    search(input);
}

function updateView()
{
    var template = '<li class="search-item"><h4 data-field="name"></h4><p data-field="address"></p></li>';
    resultsDiv.empty();
    searchData.forEach(function(element)
    {
        var el = $(template);
        el.find('[data-field="name"]').text(element.ownername);
        el.find('[data-field="address"]').text(element.fulladdress);
        resultsDiv.append(el);;

    });
}

function setupSearchBox()
{
    searchBox = $('#searchbox');
    resultsDiv = $('#results_list');
    searchBox.on("input",inputChange);
}

function search(name)
{
    var sql = new cartodb.SQL({ user: 'cartomike' });
     var endpoint = "https://cartomike.carto.com/api/v2/sql/";
     var ownerQ = "OWNERNAME ILIKE '%"+name+"%'"
    // ownerQ = ownerQ.split("{NAME}").join(name);
     var myQuery = "SELECT *,ST_AsGeoJSON(ST_Centroid(the_geom)) as centroid FROM parcels_carto WHERE " + ownerQ + " ORDER BY OWNERNAME LIMIT 250";


    
     $.getJSON(
     endpoint,
     { q: myQuery },
     function (data) {    
         searchData = data.rows;
         updateView();
     });
}

var mPopup;
var popHtml = '<div class="popup-container"> <div class="popup-header"> <h3 id="owner-header"></h3> </div> <div class="popup-parcel-details"> </div> <a href="#" id="reportLink">Report</a> </div>';
function createPopup()
{
    mPopup = L.popup();
    mPopup.setContent($("#myPop")).setLatLng(map.getCenter());
    map.closePopup();
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function openPopup(item)
{
    console.log(item);
    var coords = JSON.parse(item.centroid).coordinates.reverse();
    mPopup.setLatLng(coords);
    map.setView(coords,16,{animate: false});
    //Update data

    var el = $(".popup-parcel-details");
    var owner = $("#owner-header");
    if (item.ownername)
    {
        owner.text(toTitleCase(item.ownername));
    }
    else
    {
        owner.text("");
    }

    el.empty();
    console.log(el);

    for (var property in allowedFields)
    {
        if (allowedFields.hasOwnProperty(property))
        {
            if (item[property] && item[property].length > 0)
            {
                //If property is allowed and included in the item object, create element with details
                var title = $("<h4></h4>");
                var desc = $("<p></p>");
                title.text(allowedFields[property]);
                desc.text(item[property]);
                el.append(title);
                el.append(desc);
            }

        }
    }
  
    //Set report link
    var url = "report/index.html?parcelnumber=" + item.parcelnumber;
    var repEl = $("#reportLink");
    repEl.attr('href',url);
    mPopup.setContent($("#myPop").html());
    map.openPopup(mPopup);

}

function resultClick(resultId)
{
    //zoomToParcel(searchData[resultId]);
    var item = searchData[resultId];
    openPopup(item);
    map.setZoom(16);
}



$("#results_list").on("click", 'li',function(event) {
   var item = event.target;  
   if ((item.tagName != "LI") && (item.parentElement.tagName == "LI"))
   {
       item = item.parentElement;
   }

   var id = $(item).index();
   resultClick(id);
   

});



$(function(){
    setupSearchBox();
    createPopup();
}
);