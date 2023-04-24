$(function(){
    $("#base_page").load("banner_nav.html");
});

function setUpperVersionLabel(info){
    var upperVersionLabel = document.getElementById("title_version_label");
    upperVersionLabel.innerHTML = "v" + info.version;
}
