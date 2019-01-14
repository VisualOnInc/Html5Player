The log server adopts the php script to process the POST request. It need to run a HTTP server with the PHP module:

Use any tool to setup the HTTP server on your PC or a remote server.
  1. Download and install a HTTP server and PHP:
    1.1. You can install a tool without PHP such as apache (please refer to http://httpd.apache.org/) and install extra php module (please refer to http://php.net/manual/en/install.php).
    1.2. You can install the server with PHP module such as xampp.
  2. Put the unzipped package(HTML5) to the corresponding folder (for apache, the folder is your-install-directory/htdocs).
  3. Deploy php script.
    3.1. Move the upload.php from Tools folder in the unzipped package(HTML5) to a directory you prefer (e.g. your-install-directory/htdocs/HTML5/SamplePlayeLog).
  4. Open the player.
    4.1. If use public server, please use http://serverip(or dns) /HTML5/SamplePlayer/sampleplayer/index.html to open the player.
    4.2. If use local server, please use http://localhost(or localip) /HTML5/SamplePlayer/sampleplayer/index.html to open the player.
  5. Setup log server address from player UI (e.g. http://localhost(or localip) /HTML5/SamplePlayerLog/upload.php).

Note:
For evaluation of VisualOn HTML5 player on IE-11, Chrome and Firefox browsers it may be necessary to enable accessibility
across domains (CROS) by installing add-ons, extensions or changing the browser security settings.
Refer to "Chapter 2 Installation and uninstallation" in "VisualOn_HTML5_Player_User_Guide.pdf" for the detail information.
