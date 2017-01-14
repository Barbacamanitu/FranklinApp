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
    if ($("#sidebarToggleIcon").hasClass("fa-check-square-o"))
    {
        $("#map").hide();
        $("#sidebar").show();
    }
    else
    {
        $("#map").show();
        $("#sidebar").hide();
    }
}

function handleResize()
{
    if ($(window).width() <= 767)
    {
        handleSidebarVisibility();
    }
    else
    {
        $("#map").show();
        $("#sidebar").show();
    }
}

$("#sidebarToggleIcon").click(function () {
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