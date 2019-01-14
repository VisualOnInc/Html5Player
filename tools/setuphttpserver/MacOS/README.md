There are two ways to run Sampleplayer:
a.Use a http server tool to setup a http server at local or at a public server
1.Download and install a http server tool(such as apache, please refer to:http://httpd.apache.org/) 
2.Put the unziped package(HTML5) to the corresponding folder(for apache, the folder is your-install-directory/htdocs) 
2.If use public server, please use http://serverip(or dns)/HTML5/SamplePlayer/sampleplayer/index.html to open the player
3.If at local, please use http://localhost(or localip)/HTML5/SamplePlayer/sampleplayer/index.html to open the player


b.Use python to setup a simple http server at local 
1.MAC already has python installed. If you want to install a different version of python,you can download from this site: https://www.python.org/
2.After installation, please make sure that the python install directory is added to the environent $PATH
3.To setup a local http server:
  3.1 open a terminal
  3.2 cd "this directory"
  3.3 if use python2, please run ./setupLocalServerP2.sh, if use python3, please run ./setupLocalServerP3.sh
  3.4 open browser, input http://localhost:8080/SamplePlayer/sampleplayer/index.html to open the player

  
Note:
For evaluation of VisualOn HTML5 player on IE-11, Chrome and Firefox browsers it may be necessary to enable accessibility 
across domains (CROS) by installing add-ons, extensions or changing the browser security settings. Please refer to 
"Chapter 2 Installation and uninstallation" in  "VisualOn_HTML5_Player_User_Guide.pdf" for more detail information.
