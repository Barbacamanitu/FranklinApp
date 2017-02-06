function handleSidebarVisibility()
{
    if ($("#sidebarToggleIcon").hasClass("fa-map-o"))
    {
        //Show sidebar
        $("#map").hide();
        $("#sidebar").show();
        $("#sidebarToggleText").text('Map');
    }
    else
    {
        //Show map
        $("#map").show();
        $("#sidebar").hide();
        $("#sidebarToggleText").text('Controls');
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
    });


    $(document).on("click", ".popup-container", function(e) {
      
    });
});

$(window).resize(function() {
  $(".tt-dropdown-menu").css("max-height", $("#container").height()-$(".navbar").height()-20);
  handleResize();
});
