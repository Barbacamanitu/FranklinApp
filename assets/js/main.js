function openInfowindow(latlng, cartodb_id) {
    console.log(latlng);
    console.log(cartodb_id);
    layers.cartoParcel.trigger('featureClick', null, latlng, null, { cartodb_id: cartodb_id}, 1);
}

function zoomToParcel(item)
{
	var geoJSON = JSON.parse(item.centroid);
	var latlng = [geoJSON.coordinates[1],geoJSON.coordinates[0]];
	openInfowindow(latlng,item.cartodb_id);
    map.setView(latlng,17);
}

function showMoreInfo(data)
{
    var infoWindow = window.open("/report/index.html");
}

function handleSidebarVisibility()
{
    if ($("#sidebarToggleIcon").hasClass("fa-map-o"))
    {
        //Show sidebar
        $("#map").hide();
        $("#sidebar").show();
        $("#sidebarToggleText").text('View map');
    }
    else
    {
        //Show map
        $("#map").show();
        $("#sidebar").hide();
        $("#sidebarToggleText").text('View Controls');
    }
}

var isMobile;
function handleResize()
{
    if ($(window).width() <= 767)
    {
        isMobile = true;
        handleSidebarVisibility();
    }
    else
    {
        isMobile = false;
        $("#map").show();
        $("#sidebar").show();
    }
}

$("#sidebarToggleButton").click(function () {
    //Change button glyph
    $("#sidebarToggleIcon").toggleClass("fa fa-check-square-o fa fa-map-o");
    handleSidebarVisibility();
});

$(function(){
    handleResize();
    $(".popup-container").click(function(){

        console.log("asdf");
    });
});

$(window).resize(function() {
  $(".tt-dropdown-menu").css("max-height", $("#container").height()-$(".navbar").height()-20);
  handleResize();
});
