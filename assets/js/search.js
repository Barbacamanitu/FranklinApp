

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


var pReq;
var pTimer;
function inputChange()
{
    var input = searchBox.val();
    clearTimeout(pTimer);
    pReq && pReq.abort();
    pTimer = setTimeout(function(){
        pReq = search(input);
    },200);
}

function updateView()
{
    var template = '<li class="search-item"><h4 data-field="name"></h4><p data-field="address"></p></li>';
    resultsDiv.empty();
    searchData.forEach(function(element)
    {
        var el = $(template);
        el.find('[data-field="name"]').text(toTitleCase(element.ownername));
        el.find('[data-field="address"]').text(element.fulladdress);
        resultsDiv.append(el);
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



     return $.getJSON(
     endpoint,
     { q: myQuery },
     function (data) {
         searchData = data.rows;
         updateView();
     });
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}



function openPopup(item)
{
   var coords = JSON.parse(item.centroid).coordinates.reverse();
   var lPop = L.popup();
   lPop.setLatLng(coords);
   var html = '<div class="popup-container"> 	<div class="popup-header"> 		<span class="popup-header-title">Owner</span> 		<h3 id="owner-name"></h3> 	</div> 	<div class="popup-parcel-details"></div> 	<div class="report-link-container"> 		<a href="#" id="report-link">More information</a> 	</div> </div>';
   var el = $(html);
   var details = el.find('.popup-parcel-details');
   el.find('#report-link').attr('href','report/index.html?id=' + item.cartodb_id);

   var owner = el.find("#owner-name");
   if (item.ownername)
   {
       owner.text(toTitleCase(item.ownername));
   }
   else
   {
       owner.text("Unknown Owner");
   }

   for (var property in allowedFields)
   {
       if (allowedFields.hasOwnProperty(property))
       {
           if (item[property] && item[property].replace(/\s*/,"").length > 0)
           {
               //If property is allowed and included in the item object, create element with details
               var title = $("<h4></h4>");
               var desc = $("<p></p>");
               title.text(allowedFields[property]);
               desc.text(item[property]);
               details.append(title);
               details.append(desc);
           }

       }
   }

   lPop.setContent(el[0].outerHTML);
   lPop.openOn(map);
   map.setView(coords,16,{animate: true});
   map.invalidateSize();



}

function resultClick(resultId)
{
    var item = searchData[resultId];
    if (isMobile)
    {
        $("#sidebarToggleButton").trigger('click');
        openPopup(item);
    }
    else
    {
        openPopup(item);
    }
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
}
);

function popClick(e)
{
   var event = e || window.event; event.stopPropagation();
}
