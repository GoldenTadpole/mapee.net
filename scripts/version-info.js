async function loadXml(xmlFile){
    const text = await getText(xmlFile);

    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(text, "text/xml");

    var versionObj = xmlDoc.getElementsByTagName("version");
    var version = versionObj[0].childNodes[0].nodeValue;

    var urlObj = xmlDoc.getElementsByTagName("url");
    var url = urlObj[0].childNodes[0].nodeValue;

    var fileSizeObj = xmlDoc.getElementsByTagName("file-size");
    var fileSize = parseInt(fileSizeObj[0].childNodes[0].nodeValue);

    var buttonTextObj = xmlDoc.getElementsByTagName("download-button-upper-text");
    var buttonText = buttonTextObj[0].childNodes[0].nodeValue;

    var releaseDateObj = xmlDoc.getElementsByTagName("release-date");
    var releaseDate = releaseDateObj[0].childNodes[0].nodeValue;
    const releaseDateSplit = releaseDate.split("-");

    var info = {
        version: version,
        url: url,
        fileSize: fileSize,
        buttonText: buttonText,
        releaseDate: new Date(parseInt(releaseDateSplit[0]), parseInt(releaseDateSplit[1]), parseInt(releaseDateSplit[2]))
    }
    
    return info;
}

async function getText(url) {
    const response = await fetch(url);
    const data = await response.text();
    return data;
}